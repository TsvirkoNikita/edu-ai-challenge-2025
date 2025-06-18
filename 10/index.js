import fs from 'fs';
import path from 'path';
import readlineSync from 'readline-sync';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

// Load environment variables
dotenv.config({ path: path.resolve('./.env') });

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('Error: OPENAI_API_KEY not set. Please copy .env_template to .env and add your key.');
  process.exit(1);
}

const openai = new OpenAI({ apiKey });

// Load products dataset
const productsPath = path.resolve('./products.json');
let products;
try {
  const data = fs.readFileSync(productsPath, 'utf-8');
  products = JSON.parse(data);
} catch (err) {
  console.error('Error loading products.json:', err.message);
  process.exit(1);
}

// Define the function schema for OpenAI function calling
const tools = [
  {
    type: 'function',
    function: {
      name: 'filter_products',
      description: 'Return products matching user criteria. STRICT RULE: Never return products with in_stock=false when user asks for "in stock" items. Never return products outside price range when user specifies limits. Return empty array if no products satisfy ALL requirements.',
      parameters: {
        type: 'object',
        properties: {
          reasoning: {
            type: 'string',
            description: 'Explain your filtering logic and why certain products were included or excluded'
          },
          filtered_products: {
            type: 'array',
            description: 'Products that pass ALL filters. Empty if none qualify.',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                category: { type: 'string' },
                price: { type: 'number' },
                rating: { type: 'number' },
                in_stock: { type: 'boolean' }
              },
              required: ['name', 'category', 'price', 'rating', 'in_stock']
            }
          }
        },
        required: ['reasoning', 'filtered_products']
      }
    }
  }
];

async function main() {
  console.log('Welcome to the Product Search Tool (powered by GPT-4.1-mini)');
  const userInput = readlineSync.question('Enter your product preferences (e.g., "I need a smartphone under $800 with a great camera and long battery life"):\n');

  // System prompt to instruct the model
  const systemPrompt = `You are a product filter. Your ONLY job is to return products that match EVERY single criterion the user specifies.

CRITICAL RULES:
1. "in stock" means in_stock MUST be true - if in_stock is false, DO NOT include the product
2. "cheap" means prioritize lower prices
3. Price limits like "under $X" mean price MUST be less than X
4. Category requirements mean ONLY products from that category
5. Rating requirements mean rating MUST meet the threshold

IMPORTANT: If a product fails ANY criterion, exclude it completely. If NO products pass ALL criteria, return an empty array.

For the specific query "I want a cheap smartphone that is in stock":
- Look for products where category contains "smartphone" OR name contains "smartphone"  
- The product MUST have in_stock = true
- If no smartphones have in_stock = true, return empty array

Do not return products that are out of stock when the user asks for "in stock" products.`;

  // Prepare messages
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `User request: ${userInput}` },
    {
      role: 'user',
      content: `Available products dataset:\n${JSON.stringify(products, null, 2)}`
    }
  ];

  try {
    // First call: force the model to call the function
    const response = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages,
      tools,
      tool_choice: { type: 'function', function: { name: 'filter_products' } }
    });

    const responseMessage = response.choices[0].message;
    if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
      for (const toolCall of responseMessage.tool_calls) {
        if (toolCall.function.name === 'filter_products') {
          let filtered, reasoning;
          try {
            const args = JSON.parse(toolCall.function.arguments);
            filtered = args.filtered_products;
            reasoning = args.reasoning;
          } catch (e) {
            console.error('Error parsing function arguments:', e.message);
            process.exit(1);
          }
          

          
          if (!filtered || filtered.length === 0) {
            console.log('\nNo products found matching your preferences.');
          } else {
            console.log('\nFiltered Products:');
            filtered.forEach((p, i) => {
              console.log(`${i + 1}. ${p.name} - $${p.price}, Rating: ${p.rating}, ${p.in_stock ? 'In Stock' : 'Out of Stock'}`);
            });
          }
          return;
        }
      }
    } else {
      console.log('No function call was made by the model.');
    }
  } catch (err) {
    console.error('OpenAI API error:', err.message);
  }
}

main(); 