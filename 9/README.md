# Service Analyzer Console Application

A lightweight console application that generates comprehensive, markdown-formatted analysis reports for digital services and products from multiple perspectives including business, technical, and user-focused viewpoints.

## Features

- 🎯 **Multi-Input Support**: Accepts either known service names (Spotify, Notion, etc.) or custom service descriptions
- 🤖 **AI-Powered Analysis**: Uses OpenAI GPT-4 to generate detailed insights
- 📊 **Comprehensive Reports**: Includes 8+ analysis sections covering all business aspects
- 💾 **Flexible Output**: Display in terminal or save to markdown files
- 🎮 **Interactive Mode**: User-friendly interactive interface
- 🔒 **Secure**: API keys stored in environment variables (not in code)

## Report Sections

Each generated report includes:

- **Brief History**: Founding year, milestones, and evolution
- **Target Audience**: Primary user segments and demographics  
- **Core Features**: Top 2-4 key functionalities
- **Unique Selling Points**: Key differentiators from competitors
- **Business Model**: Revenue generation strategies
- **Tech Stack Insights**: Technologies and technical approaches
- **Perceived Strengths**: Standout features and advantages
- **Perceived Weaknesses**: Common limitations and areas for improvement
- **Market Position**: Competitive landscape analysis

## Prerequisites

- Python 3.7 or higher
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- Internet connection

## Installation

1. **Clone or download the project files**:
   ```bash
   # Download the following files to your project directory:
   # - service_analyzer.py
   # - requirements.txt  
   # - .env.example
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up your OpenAI API key**:
   
   **Option A: Using .env file (Recommended)**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env and add your API key
   # Replace 'your_openai_api_key_here' with your actual key
   ```
   
   **Option B: Using environment variable**
   ```bash
   # Windows (PowerShell)
   $env:OPENAI_API_KEY="your_api_key_here"
   
   # Windows (Command Prompt)
   set OPENAI_API_KEY=your_api_key_here
   
   # macOS/Linux
   export OPENAI_API_KEY="your_api_key_here"
   ```

## Usage

### Basic Commands

**Analyze a known service:**
```bash
python service_analyzer.py --service "Spotify"
python service_analyzer.py --service "Notion"
python service_analyzer.py --service "Netflix"
```

**Analyze custom service description:**
```bash
python service_analyzer.py --text "A collaborative platform for remote teams that combines video conferencing, document sharing, and project management in one unified workspace"
```

**Save report to file:**
```bash
python service_analyzer.py --service "Discord" --output discord_analysis.md
```

**Interactive mode:**
```bash
python service_analyzer.py --interactive
```

### Command Line Options

- `--service, -s`: Name of a known service (Spotify, Notion, Netflix, Slack, Discord, GitHub)
- `--text, -t`: Custom service description text
- `--output, -o`: Output filename (saves as markdown file)
- `--interactive, -i`: Run in interactive mode
- `--help, -h`: Show help message

### Interactive Mode

Interactive mode provides a user-friendly interface:

1. Run: `python service_analyzer.py --interactive`
2. Choose between known service or custom description
3. Enter your input
4. View the generated report
5. Optionally save to file
6. Continue with more analyses or quit

## Supported Known Services

The application recognizes these services by name:
- **Spotify** - Music streaming service
- **Notion** - All-in-one workspace
- **Netflix** - Video streaming platform
- **Slack** - Business communication platform
- **Discord** - Community communication platform
- **GitHub** - Code repository and collaboration platform

For any other service, use the `--text` option with a description.

## Example Output Structure

```markdown
# Service Analysis Report

## Brief History
Founded in 2008, GitHub started as a Git repository hosting service...

## Target Audience
Primary users include software developers, open source contributors...

## Core Features
1. Git repository hosting
2. Code review and collaboration tools
3. Issue tracking and project management
4. Actions for CI/CD automation

[... additional sections ...]
```

## Troubleshooting

### Common Issues

**"OPENAI_API_KEY environment variable not found"**
- Ensure you've set up your API key correctly (see Installation step 3)
- Check that your `.env` file is in the same directory as the script
- Verify the API key is valid and has sufficient credits

**"Error generating report: ..."**
- Check your internet connection
- Verify your OpenAI API key is valid and has credits
- Try again as it might be a temporary API issue

**Import errors**
- Run `pip install -r requirements.txt` to install dependencies
- Ensure you're using Python 3.7 or higher

### Getting Help

1. Check that all files are in the same directory
2. Verify Python version: `python --version`
3. Test API key: Try a simple known service first
4. Check OpenAI status: [status.openai.com](https://status.openai.com)

## Security Notes

- Never commit your `.env` file or API keys to version control
- The `.env` file is already in `.gitignore` for safety
- Use environment variables in production environments
- Monitor your OpenAI API usage and costs

## Cost Considerations

- Uses OpenAI GPT-4o-mini model (cost-effective)
- Average cost per report: ~$0.01-0.05
- Set usage limits in your OpenAI dashboard if needed

## License

This project is provided as-is for educational and personal use.

## Contributing

Feel free to suggest improvements or report issues. Potential enhancements:
- Additional known services
- More analysis sections
- Export formats (PDF, HTML)
- Batch processing
- Configuration file support 