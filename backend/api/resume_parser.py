import pdfplumber
import re

class ResumeParser:
    def __init__(self, pdf_path):
        self.pdf_path = pdf_path
        # Initialize the dictionary that our Scoring Engine expects
        self.parsed_blocks = {
            'header': '',      # Contact info, names, links at the top
            'summary': '',     # Objectives, Profile, About Me
            'experience': '',  # Work history, internships
            'education': '',   # Degrees, college, school
            'skills': '',      # Technical skills, languages
            'projects': ''     # Academic or personal projects
        }
        
        # Regex patterns to detect section headers (ignoring case)
        self.header_patterns = {
            'summary': r'^(profile|summary|objective|about me|professional summary)$',
            'experience': r'^(experience|work experience|employment history|work history)$',
            'education': r'^(education|academic background|qualifications)$',
            'skills': r'^(skills|technical skills|technologies|core competencies)$',
            'projects': r'^(projects|personal projects|academic projects)$'
        }

    def parse(self):
        """Extracts text preserving layout and segments it."""
        raw_text = ""
        try:
            with pdfplumber.open(self.pdf_path) as pdf:
                for page in pdf.pages:
                    # layout=True is the magic trick for 2-column resumes
                    text = page.extract_text(layout=True) 
                    if text:
                        raw_text += text + "\n"
        except Exception as e:
            print(f"Error reading PDF: {e}")
            return self.parsed_blocks

        return self._segment_text(raw_text)

    def _segment_text(self, text):
        """Divides the raw text into logical dictionary blocks based on headers."""
        current_section = 'header' # Everything goes here until we hit a recognized header
        
        # Split into lines and clean up whitespace
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        
        for line in lines:
            line_lower = line.lower()
            
            # Check if the current line perfectly matches a section header
            matched_section = None
            for section, pattern in self.header_patterns.items():
                # We use regex match to ensure it's a standalone header, not just a word in a sentence
                if re.match(pattern, line_lower):
                    matched_section = section
                    break
            
            if matched_section:
                # Switch the active bucket
                current_section = matched_section
            else:
                # Dump the text into the currently active bucket
                self.parsed_blocks[current_section] += line + " \n"
                
        return self.parsed_blocks