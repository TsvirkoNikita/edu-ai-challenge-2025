# Audio Transcription & Analysis Tool

A console application that transcribes audio files using OpenAI's Whisper API, generates summaries using GPT-4o-mini, and provides detailed analytics about the audio content.

## Features

- 🎙️ **Audio Transcription**: Uses OpenAI's Whisper-1 model for accurate speech-to-text conversion
- 📝 **Smart Summarization**: Generates concise summaries using GPT-4o-mini
- 📊 **Analytics Dashboard**: Provides detailed statistics including:
  - Total word count
  - Speaking speed (Words Per Minute)
  - Duration analysis
  - AI-powered topic extraction with meaningful topic names and mention counts
- 💾 **Automatic File Management**: Creates separate timestamped files for each transcription
- 🎯 **Multi-format Support**: Works with various audio formats (MP3, WAV, M4A, etc.)

## Requirements

- Node.js (version 14 or higher)
- OpenAI API key
- Audio file to transcribe

## Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd 11
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up your OpenAI API key:**
   
   **Option 1: Using .env file (Recommended):**
   ```bash
   # Copy the example file
   cp env.example .env
   
   # Edit .env file and add your actual API key
   # OPENAI_API_KEY=your_actual_api_key_here
   ```
   
   **Option 2: Using environment variables:**
   ```bash
   # Windows (Command Prompt)
   set OPENAI_API_KEY=your_api_key_here
   
   # Windows (PowerShell)
   $env:OPENAI_API_KEY="your_api_key_here"
   
   # macOS/Linux
   export OPENAI_API_KEY=your_api_key_here
   ```

## Usage

### Basic Usage

Run the application with an audio file:

```bash
node app.js path/to/your/audio_file.mp3
```

### Examples

```bash
# Process a local audio file
node app.js sample_audio.mp3

# Process an audio file in a different directory
node app.js "../audio_files/meeting_recording.wav"

# Process with full path
node app.js "C:\Users\Username\Documents\audio.m4a"
```

### Supported Audio Formats

The application supports various audio formats including:
- MP3
- WAV
- M4A
- FLAC
- OGG
- WebM

## Output Files

The application creates timestamped files in the `outputs` directory:

- **`[filename]_transcription_[timestamp].md`**: Full transcription with metadata
- **`[filename]_summary_[timestamp].md`**: AI-generated summary
- **`[filename]_analysis_[timestamp].json`**: Detailed analytics in JSON format

### Sample Analytics Output

```json
{
  "word_count": 938,
  "speaking_speed_wpm": 126,
  "duration_seconds": 448,
  "frequently_mentioned_topics": [
    { "topic": "Chest Pain Description and Characteristics", "mentions": 11 },
    { "topic": "Associated Symptoms (e.g., shortness of breath, dizziness)", "mentions": 7 },
    { "topic": "Concerns about Heart Attack", "mentions": 5 }
  ]
}
```

## Console Output

The application provides real-time feedback and displays results directly in the console:

```
🎯 Audio Transcription & Analysis Tool
=====================================

🎵 Processing audio file: sample_audio.mp3
🎙️  Starting audio transcription...
✅ Transcription completed successfully!
📝 Generating summary...
✅ Summary generated successfully!
📊 Calculating analytics...
💾 Saving results...

==================================================
📊 AUDIO ANALYSIS RESULTS
==================================================
📝 Total Words: 1280
⚡ Speaking Speed: 132 WPM
⏱️  Duration: 582 seconds

🏷️  Top Mentioned Topics:
   1. Chest Pain Description and Characteristics (11 mentions)
   2. Associated Symptoms (e.g., shortness of breath, dizziness) (7 mentions)
   3. Concerns about Heart Attack (5 mentions)
==================================================

📁 Files saved:
   📄 Transcription: outputs/sample_audio_transcription_2024-01-15_14-30-25.md
   📋 Summary: outputs/sample_audio_summary_2024-01-15_14-30-25.md
   📊 Analysis: outputs/sample_audio_analysis_2024-01-15_14-30-25.json

✅ Processing completed successfully!
```

## Error Handling

The application includes comprehensive error handling for common issues:

- **Missing API Key**: Clear instructions for setting up the OpenAI API key
- **File Not Found**: Validates audio file existence before processing
- **API Errors**: Handles OpenAI API rate limits and connection issues
- **Invalid Audio**: Provides feedback for unsupported or corrupted audio files

## API Usage

This application uses:
- **OpenAI Whisper-1**: For audio transcription
- **OpenAI GPT-4o-mini**: For text summarization

## File Structure

```
11/
├── app.js              # Main application file
├── package.json        # Node.js dependencies
├── README.md          # This file
├── env.example        # Example environment variables file
├── .env               # Your environment variables (create from env.example)
├── outputs/           # Generated output files (created automatically)
│   ├── *_transcription_*.md
│   ├── *_summary_*.md
│   └── *_analysis_*.json
├── transcription.md   # Sample transcription
├── summary.md         # Sample summary
└── analysis.json      # Sample analysis
```

## Troubleshooting

### Common Issues

1. **"OPENAI_API_KEY not set" error:**
   - Ensure you've set the environment variable correctly
   - Restart your terminal after setting the variable

2. **"Audio file not found" error:**
   - Check the file path is correct
   - Use quotes around paths with spaces

3. **API rate limit errors:**
   - Wait a moment and try again
   - Check your OpenAI API usage limits

4. **Module not found errors:**
   - Run `npm install` to install dependencies
   - Ensure you're in the correct directory

### Getting Help

- Check that your audio file is in a supported format
- Verify your OpenAI API key has sufficient credits
- Ensure stable internet connection for API calls

## License

MIT License - feel free to use and modify as needed. 