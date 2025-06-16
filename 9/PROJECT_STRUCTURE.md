# Project Structure

This document provides an overview of the Service Analyzer console application structure and components.

## Files Overview

```
Service-Analyzer/
├── service_analyzer.py       # Main application file
├── requirements.txt          # Python dependencies
├── env_template.txt         # Environment variable template
├── README.md               # Comprehensive setup and usage guide
├── sample_outputs.md       # Example outputs and demonstrations
└── PROJECT_STRUCTURE.md    # This file - project overview
```

## Core Components

### 1. `service_analyzer.py` (Main Application)

**Key Classes:**
- `ServiceAnalyzer`: Main class handling service analysis and report generation

**Key Methods:**
- `_initialize_openai_client()`: Sets up OpenAI API client
- `_load_known_services()`: Defines supported services
- `_create_analysis_prompt()`: Generates AI prompts
- `analyze_service()`: Core analysis logic
- `save_report()`: File output functionality

**Features Implemented:**
- ✅ Command-line argument parsing
- ✅ Interactive mode
- ✅ Known service recognition
- ✅ Custom text analysis
- ✅ Markdown report generation
- ✅ File output capabilities
- ✅ Error handling and validation

### 2. `requirements.txt` (Dependencies)

**Dependencies:**
- `openai==1.54.3`: OpenAI API client library
- `python-dotenv==1.0.0`: Environment variable management

### 3. `env_template.txt` (Configuration Template)

Template for setting up the required `OPENAI_API_KEY` environment variable.

## Application Architecture

### Input Processing
1. **Command Line Arguments**: Uses `argparse` for professional CLI handling
2. **Known Services**: Pre-defined service descriptions for popular platforms
3. **Custom Text**: Accepts any service description for analysis

### AI Integration
1. **OpenAI API**: Uses GPT-4o-mini model for cost-effective analysis
2. **Structured Prompts**: Carefully crafted prompts ensure consistent output
3. **Error Handling**: Graceful handling of API errors and network issues

### Output Generation
1. **Markdown Formatting**: Professional report formatting
2. **Console Display**: Formatted terminal output with visual separators
3. **File Export**: Optional markdown file saving

## Report Structure

Each generated report includes these sections:
1. **Brief History**: Founding, milestones, evolution
2. **Target Audience**: User segments and demographics
3. **Core Features**: Key functionalities (2-4 main features)
4. **Unique Selling Points**: Competitive differentiators
5. **Business Model**: Revenue generation strategies
6. **Tech Stack Insights**: Technical architecture details
7. **Perceived Strengths**: Advantages and standout features
8. **Perceived Weaknesses**: Limitations and improvement areas
9. **Market Position**: Competitive landscape analysis

## Usage Modes

### 1. Direct Command Mode
```bash
python service_analyzer.py --service "Spotify"
python service_analyzer.py --text "Custom service description"
```

### 2. Interactive Mode
```bash
python service_analyzer.py --interactive
```
- User-friendly menu system
- Step-by-step guidance
- Optional file saving

### 3. File Output Mode
```bash
python service_analyzer.py --service "Discord" --output report.md
```

## Supported Services

Pre-configured services with detailed descriptions:
- **Spotify**: Music streaming platform
- **Notion**: All-in-one workspace
- **Netflix**: Video streaming service
- **Slack**: Business communication platform
- **Discord**: Community communication platform
- **GitHub**: Code repository and collaboration

## Security Features

- ✅ API keys stored in environment variables
- ✅ No hardcoded credentials in source code
- ✅ Environment template for secure setup
- ✅ Graceful error handling for missing credentials

## Error Handling

- **Missing API Key**: Clear instructions for setup
- **Network Issues**: User-friendly error messages
- **Invalid Input**: Input validation and helpful prompts
- **API Errors**: Graceful degradation with error details

## Performance Considerations

- **Model Selection**: Uses cost-effective GPT-4o-mini
- **Token Optimization**: Efficient prompt design
- **Response Caching**: Could be added for repeated queries
- **Rate Limiting**: Handled by OpenAI client library

## Future Enhancement Opportunities

- **Additional Services**: Expand known services database
- **Output Formats**: PDF, HTML, JSON export options
- **Batch Processing**: Analyze multiple services at once
- **Configuration Files**: Custom analysis parameters
- **Plugin System**: Extensible analysis modules
- **Caching**: Store and reuse analysis results
- **Templates**: Customizable report templates

## Development Notes

- **Python Version**: Compatible with Python 3.7+
- **Dependencies**: Minimal external dependencies
- **Cross-Platform**: Works on Windows, macOS, Linux
- **Modularity**: Well-structured, maintainable code
- **Documentation**: Comprehensive inline documentation 