# Product Search Tool (GPT-4.1-mini)

A console-based product search tool that uses OpenAI's GPT-4.1-mini function calling to filter products based on your natural language preferences.

## Features
- Accepts user preferences in natural language (e.g., "I need a smartphone under $800 with a great camera and long battery life").
- Uses OpenAI API (GPT-4.1-mini) with function calling to filter a hardcoded product dataset.
- Returns a clear, structured list of matching products.

## Setup

1. **Clone the repository** and navigate to the `10` folder:
   ```sh
   cd 10
   ```

2. **Install dependencies** (requires Node.js 18+):
   ```sh
   npm install
   ```

3. **Set up your OpenAI API key:**
   - Copy `.env_template` to `.env`:
     ```sh
     cp .env_template .env
     ```
   - Edit `.env` and add your OpenAI API key:
     ```env
     OPENAI_API_KEY=sk-...
     ```
   - **Never commit your API key to version control!**

## How to Run

```sh
npm start
```

You will be prompted to enter your product preferences in natural language. The app will display a list of matching products.

## How It Works
- Loads the product dataset from `products.json`.
- Accepts your search request in plain English.
- Sends your request and the dataset to OpenAI's GPT-4.1-mini using function calling.
- The model returns a filtered list of products matching your criteria.
- The app displays the results in a clear, structured format.

## Notes
- **Model:** Uses `gpt-4.1-mini` for cost-effective, fast, and accurate function calling.
- **Security:** Your OpenAI API key is required but must **never** be committed to the repository.
- **No manual filtering:** All filtering is performed by the OpenAI model using function calling.
- **API Usage:** You are responsible for your OpenAI API usage and costs.

## Example Usage
```
Welcome to the Product Search Tool (powered by GPT-4.1-mini)
Enter your product preferences (e.g., "I need a smartphone under $800 with a great camera and long battery life"):
> I want headphones under $100 that are in stock

Filtered Products:
1. Wireless Headphones - $99.99, Rating: 4.5, In Stock
```

## Sample Outputs
See `sample_outputs.md` for more example runs. 