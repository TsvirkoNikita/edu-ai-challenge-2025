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
      description: 'Filter the provided products array based on user preferences such as category, price, rating, and stock availability. Return only the products that match the user\'s request.',
      parameters: {
        type: 'object',
        properties: {
          filtered_products: {
            type: 'array',
            description: 'The list of products that match the user\'s preferences.',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Product name' },
                category: { type: 'string', description: 'Product category' },
                price: { type: 'number', description: 'Product price' },
                rating: { type: 'number', description: 'Product rating' },
                in_stock: { type: 'boolean', description: 'Whether the product is in stock' }
              },
              required: ['name', 'category', 'price', 'rating', 'in_stock']
            }
          }
        },
        required: ['filtered_products']
      }
    }
  }
];

async function main() {
  console.log('Welcome to the Product Search Tool (powered by GPT-4.1-mini)');
  const userInput = readlineSync.question('Enter your product preferences (e.g., "I need a smartphone under $800 with a great camera and long battery life"):\n');

  // System prompt to instruct the model
  const systemPrompt = `You are an assistant that helps users find products. Use the filter_products function to return only the products from the provided array that match the user's preferences. Do not make up products. Only use the products provided in the array. Return the filtered list in the function call.`;

  // Prepare messages
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userInput },
    {
      role: 'user',
      content: `Here is the product dataset as a JSON array:\n${JSON.stringify(products)}`
    }
  ];

  try {
    // First call: let the model decide if it should call the function
    const response = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages,
      tools,
      tool_choice: 'auto'
    });

    const responseMessage = response.choices[0].message;
    if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
      for (const toolCall of responseMessage.tool_calls) {
        if (toolCall.function.name === 'filter_products') {
          let filtered;
          try {
            const args = JSON.parse(toolCall.function.arguments);
            filtered = args.filtered_products;
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