#!/usr/bin/env python3
"""
Service Analyzer Console Application

This application generates comprehensive markdown reports about digital services
from multiple perspectives (business, technical, user-focused).

Author: AI Assistant
Date: 2024
"""

import os
import sys
import argparse
import json
from typing import Optional, Dict, Any
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class ServiceAnalyzer:
    """Main class for analyzing services and generating reports."""
    
    def __init__(self):
        """Initialize the ServiceAnalyzer with OpenAI client."""
        self.client = self._initialize_openai_client()
        self.known_services = self._load_known_services()
    
    def _initialize_openai_client(self) -> OpenAI:
        """Initialize OpenAI client with API key from environment."""
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            print("Error: OPENAI_API_KEY environment variable not found.")
            print("Please set your OpenAI API key in the .env file or as an environment variable.")
            sys.exit(1)
        
        return OpenAI(api_key=api_key)
    
    def _load_known_services(self) -> Dict[str, str]:
        """Load known services with their descriptions."""
        return {
            "spotify": "Spotify is a digital music service that gives you access to millions of songs, podcasts, and videos from artists all over the world. Founded in 2006 in Sweden, it offers streaming services with both free and premium subscription options.",
            "notion": "Notion is an all-in-one workspace that combines note-taking, knowledge management, project management, and database functionality. Founded in 2016, it allows users to create and customize their own productivity systems.",
            "netflix": "Netflix is a streaming entertainment service with TV series, documentaries and feature films across a wide variety of genres and languages. Founded in 1997, it revolutionized the entertainment industry by moving from DVD-by-mail to streaming.",
            "slack": "Slack is a business communication platform that brings teams together wherever they are. Founded in 2009, it offers persistent chat rooms organized by topic, private groups, and direct messaging.",
            "discord": "Discord is a VoIP and instant messaging social platform designed for creating communities. Founded in 2015, it allows users to communicate with voice calls, video calls, text messaging, and media sharing.",
            "github": "GitHub is a platform for version control and collaboration using Git. Founded in 2008, it allows developers to work together on projects from anywhere, offering repository hosting, code review, and project management features."
        }
    
    def _create_analysis_prompt(self, service_info: str, is_known_service: bool) -> str:
        """Create a comprehensive prompt for service analysis."""
        
        base_prompt = f"""
        You are a professional business analyst tasked with creating a comprehensive report about a digital service or product. 
        
        {'Service Information:' if not is_known_service else 'Service Name and Basic Info:'}
        {service_info}
        
        Please generate a detailed, markdown-formatted report that includes the following sections:
        
        # Service Analysis Report
        
        ## Brief History
        Provide founding year, key milestones, major developments, and evolution of the service.
        
        ## Target Audience
        Identify and describe the primary user segments and demographics.
        
        ## Core Features
        List and explain the top 2-4 key functionalities that define the service.
        
        ## Unique Selling Points
        Highlight the key differentiators that set this service apart from competitors.
        
        ## Business Model
        Explain how the service generates revenue (subscription, advertising, freemium, etc.).
        
        ## Tech Stack Insights
        Provide insights about the technologies, platforms, or technical approaches used.
        
        ## Perceived Strengths
        Identify the standout features, advantages, and positive aspects users typically mention.
        
        ## Perceived Weaknesses
        Discuss commonly cited drawbacks, limitations, or areas for improvement.
        
        ## Market Position
        Briefly describe the service's position in its market and competitive landscape.
        
        Requirements:
        - Use proper markdown formatting
        - Be comprehensive but concise
        - Base analysis on factual information
        - Provide balanced perspective
        - Use professional tone
        - Include specific examples where relevant
        """
        
        if is_known_service:
            base_prompt += "\n\nNote: This is a well-known service, so please provide detailed and accurate information based on public knowledge."
        else:
            base_prompt += "\n\nNote: Analyze the provided service description and infer details where reasonable, clearly indicating when information is inferred."
        
        return base_prompt
    
    def analyze_service(self, input_text: str) -> str:
        """Analyze a service and generate a comprehensive report."""
        
        # Check if input is a known service
        is_known_service = input_text.lower().strip() in self.known_services
        
        if is_known_service:
            service_name = input_text.lower().strip()
            service_info = f"{input_text} - {self.known_services[service_name]}"
            print(f"✓ Recognized service: {input_text}")
        else:
            service_info = input_text
            print("✓ Processing custom service description...")
        
        # Create analysis prompt
        prompt = self._create_analysis_prompt(service_info, is_known_service)
        
        try:
            print("🔄 Generating analysis report...")
            
            response = self.client.chat.completions.create(
                model="gpt-4.1-mini",
                messages=[
                    {"role": "system", "content": "You are a professional business analyst specializing in digital services and technology products. Provide detailed, accurate, and well-structured analysis reports."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=3000,
                temperature=0.7
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            return f"Error generating report: {str(e)}\n\nPlease check your OpenAI API key and internet connection."
    
    def save_report(self, report: str, filename: str = None) -> str:
        """Save the report to a file."""
        if not filename:
            filename = "service_analysis_report.md"
        
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(report)
            return filename
        except Exception as e:
            print(f"Error saving report: {str(e)}")
            return None

def main():
    """Main function to run the console application."""
    
    parser = argparse.ArgumentParser(
        description="Generate comprehensive analysis reports for digital services",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python service_analyzer.py --service "Spotify"
  python service_analyzer.py --text "A social media platform for professionals"
  python service_analyzer.py --service "Notion" --output report.md
  python service_analyzer.py --interactive
        """
    )
    
    parser.add_argument(
        '--service', '-s',
        type=str,
        help='Name of a known service (e.g., Spotify, Notion, Netflix)'
    )
    
    parser.add_argument(
        '--text', '-t',
        type=str,
        help='Custom service description text'
    )
    
    parser.add_argument(
        '--output', '-o',
        type=str,
        help='Output filename (default: service_analysis_report.md)'
    )
    
    parser.add_argument(
        '--interactive', '-i',
        action='store_true',
        help='Run in interactive mode'
    )
    
    args = parser.parse_args()
    
    # Initialize analyzer
    try:
        analyzer = ServiceAnalyzer()
    except Exception as e:
        print(f"Failed to initialize analyzer: {str(e)}")
        sys.exit(1)
    
    # Determine input method
    if args.interactive:
        print("🎯 Service Analyzer - Interactive Mode")
        print("=" * 50)
        print("Enter 'quit' or 'exit' to stop")
        print()
        
        while True:
            print("Choose input method:")
            print("1. Known service name")
            print("2. Custom service description")
            print("3. Quit")
            
            choice = input("\nYour choice (1-3): ").strip()
            
            if choice in ['3', 'quit', 'exit']:
                print("Goodbye! 👋")
                break
            elif choice == '1':
                service_name = input("Enter service name: ").strip()
                if service_name:
                    input_text = service_name
                else:
                    print("Invalid input. Please try again.")
                    continue
            elif choice == '2':
                service_desc = input("Enter service description: ").strip()
                if service_desc:
                    input_text = service_desc
                else:
                    print("Invalid input. Please try again.")
                    continue
            else:
                print("Invalid choice. Please select 1, 2, or 3.")
                continue
            
            # Generate report
            report = analyzer.analyze_service(input_text)
            
            print("\n" + "=" * 80)
            print("ANALYSIS REPORT")
            print("=" * 80)
            print(report)
            print("=" * 80)
            
            # Ask to save
            save_choice = input("\nSave report to file? (y/n): ").strip().lower()
            if save_choice in ['y', 'yes']:
                filename = input("Enter filename (press Enter for default): ").strip()
                if not filename:
                    filename = None
                saved_file = analyzer.save_report(report, filename)
                if saved_file:
                    print(f"✓ Report saved to: {saved_file}")
            
            print("\n" + "-" * 50)
    
    elif args.service:
        input_text = args.service
    elif args.text:
        input_text = args.text
    else:
        print("Error: Please provide either --service, --text, or use --interactive mode")
        parser.print_help()
        sys.exit(1)
    
    if not args.interactive:
        # Generate report
        report = analyzer.analyze_service(input_text)
        
        # Display report
        print("\n" + "=" * 80)
        print("ANALYSIS REPORT")
        print("=" * 80)
        print(report)
        print("=" * 80)
        
        # Save report if requested
        if args.output:
            saved_file = analyzer.save_report(report, args.output)
            if saved_file:
                print(f"\n✓ Report saved to: {saved_file}")

if __name__ == "__main__":
    main() 