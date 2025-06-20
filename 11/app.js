const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
require('dotenv').config();

// Initialize OpenAI client (will be created in main function after API key check)
let openai;

class AudioTranscriptionAnalyzer {
  constructor() {
    this.outputDir = 'outputs';
    this.ensureOutputDirectory();
  }

  ensureOutputDirectory() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async transcribeAudio(audioFilePath) {
    try {
      console.log('🎙️  Starting audio transcription...');
      
      if (!fs.existsSync(audioFilePath)) {
        throw new Error(`Audio file not found: ${audioFilePath}`);
      }

      const audioFile = fs.createReadStream(audioFilePath);
      
      const transcription = await openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        response_format: 'verbose_json',
        timestamp_granularities: ['word']
      });

      console.log('✅ Transcription completed successfully!');
      return transcription;
    } catch (error) {
      console.error('❌ Error during transcription:', error.message);
      throw error;
    }
  }

  async summarizeText(text) {
    try {
      console.log('📝 Generating summary...');
      
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that creates concise, well-structured summaries of transcribed audio content. Focus on key points, main topics, and important insights.'
          },
          {
            role: 'user',
            content: `Please provide a comprehensive summary of the following transcribed audio content:\n\n${text}`
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      });

      console.log('✅ Summary generated successfully!');
      return completion.choices[0].message.content;
    } catch (error) {
      console.error('❌ Error during summarization:', error.message);
      throw error;
    }
  }

  extractTopics(text) {
    // Simple topic extraction based on frequent meaningful words
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !this.isStopWord(word));

    const wordCount = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    // Get top topics (words mentioned 2+ times)
    const topics = Object.entries(wordCount)
      .filter(([word, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([topic, mentions]) => ({ topic, mentions }));

    return topics;
  }

  isStopWord(word) {
    const stopWords = [
      'that', 'this', 'with', 'have', 'will', 'been', 'were', 'they',
      'their', 'there', 'what', 'when', 'where', 'which', 'would',
      'could', 'should', 'your', 'from', 'into', 'over', 'after',
      'before', 'through', 'during', 'above', 'below', 'between',
      'really', 'think', 'know', 'just', 'like', 'well', 'right',
      'good', 'great', 'very', 'much', 'more', 'most', 'some',
      'many', 'other', 'such', 'only', 'also', 'then', 'than',
      'even', 'still', 'here', 'take', 'make', 'come', 'give',
      'want', 'need', 'look', 'find', 'work', 'call', 'time'
    ];
    return stopWords.includes(word);
  }

  calculateAnalytics(transcription) {
    const text = transcription.text;
    const duration = transcription.duration; // in seconds
    
    // Word count
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    
    // Speaking speed (WPM)
    const speakingSpeedWpm = Math.round((wordCount / duration) * 60);
    
    // Extract topics
    const frequentlyMentionedTopics = this.extractTopics(text);

    return {
      word_count: wordCount,
      speaking_speed_wpm: speakingSpeedWpm,
      duration_seconds: Math.round(duration),
      frequently_mentioned_topics: frequentlyMentionedTopics
    };
  }

  generateTimestamp() {
    const now = new Date();
    return now.toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' + 
           now.toTimeString().split(' ')[0].replace(/:/g, '-');
  }

  async saveResults(transcription, summary, analytics, audioFileName) {
    const timestamp = this.generateTimestamp();
    const baseFileName = path.parse(audioFileName).name;
    
    // Save transcription
    const transcriptionFile = path.join(this.outputDir, `${baseFileName}_transcription_${timestamp}.md`);
    const transcriptionContent = `# Transcription\n\n**Audio File:** ${audioFileName}\n**Date:** ${new Date().toISOString()}\n**Duration:** ${Math.round(transcription.duration)} seconds\n\n## Content\n\n${transcription.text}`;
    fs.writeFileSync(transcriptionFile, transcriptionContent);
    
    // Save summary
    const summaryFile = path.join(this.outputDir, `${baseFileName}_summary_${timestamp}.md`);
    const summaryContent = `# Summary\n\n**Audio File:** ${audioFileName}\n**Date:** ${new Date().toISOString()}\n\n## Summary\n\n${summary}`;
    fs.writeFileSync(summaryFile, summaryContent);
    
    // Save analytics
    const analyticsFile = path.join(this.outputDir, `${baseFileName}_analysis_${timestamp}.json`);
    fs.writeFileSync(analyticsFile, JSON.stringify(analytics, null, 2));

    return {
      transcriptionFile,
      summaryFile,
      analyticsFile
    };
  }

  displayResults(analytics) {
    console.log('\n' + '='.repeat(50));
    console.log('📊 AUDIO ANALYSIS RESULTS');
    console.log('='.repeat(50));
    console.log(`📝 Total Words: ${analytics.word_count}`);
    console.log(`⚡ Speaking Speed: ${analytics.speaking_speed_wpm} WPM`);
    console.log(`⏱️  Duration: ${analytics.duration_seconds} seconds`);
    console.log('\n🏷️  Top Mentioned Topics:');
    
    if (analytics.frequently_mentioned_topics.length > 0) {
      analytics.frequently_mentioned_topics.slice(0, 5).forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.topic} (${item.mentions} mentions)`);
      });
    } else {
      console.log('   No frequent topics detected');
    }
    console.log('='.repeat(50));
  }

  async processAudio(audioFilePath) {
    try {
      const audioFileName = path.basename(audioFilePath);
      console.log(`🎵 Processing audio file: ${audioFileName}`);
      
      // Step 1: Transcribe audio
      const transcription = await this.transcribeAudio(audioFilePath);
      
      // Step 2: Generate summary
      const summary = await this.summarizeText(transcription.text);
      
      // Step 3: Calculate analytics
      console.log('📊 Calculating analytics...');
      const analytics = this.calculateAnalytics(transcription);
      
      // Step 4: Save results
      console.log('💾 Saving results...');
      const savedFiles = await this.saveResults(transcription, summary, analytics, audioFileName);
      
      // Step 5: Display results
      this.displayResults(analytics);
      
      console.log('\n📁 Files saved:');
      console.log(`   📄 Transcription: ${savedFiles.transcriptionFile}`);
      console.log(`   📋 Summary: ${savedFiles.summaryFile}`);
      console.log(`   📊 Analysis: ${savedFiles.analyticsFile}`);
      
      return {
        transcription,
        summary,
        analytics,
        savedFiles
      };
    } catch (error) {
      console.error('❌ Error processing audio:', error.message);
      throw error;
    }
  }
}

// Main execution
async function main() {
  console.log('🎯 Audio Transcription & Analysis Tool');
  console.log('=====================================\n');

  // Check for OpenAI API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Error: OPENAI_API_KEY not found.');
    console.log('Please set your OpenAI API key in one of these ways:');
    console.log('  1. Create a .env file with: OPENAI_API_KEY=your_api_key_here');
    console.log('  2. Set environment variable:');
    console.log('     Windows CMD: set OPENAI_API_KEY=your_api_key_here');
    console.log('     Windows PS:  $env:OPENAI_API_KEY="your_api_key_here"');
    console.log('     macOS/Linux: export OPENAI_API_KEY=your_api_key_here');
    process.exit(1);
  }

  // Initialize OpenAI client after API key check
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Get audio file path from command line arguments
  const audioFilePath = process.argv[2];
  
  if (!audioFilePath) {
    console.error('❌ Error: Please provide an audio file path.');
    console.log('Usage: node app.js <path_to_audio_file>');
    console.log('Example: node app.js sample_audio.mp3');
    process.exit(1);
  }

  const analyzer = new AudioTranscriptionAnalyzer();
  
  try {
    await analyzer.processAudio(audioFilePath);
    console.log('\n✅ Processing completed successfully!');
  } catch (error) {
    console.error('❌ Application failed:', error.message);
    process.exit(1);
  }
}

// Run the application
if (require.main === module) {
  main();
}

module.exports = AudioTranscriptionAnalyzer; 