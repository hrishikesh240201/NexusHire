import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from textblob import TextBlob
import textstat

# Import the GitHub engine we just created
from .github_engine import calculate_github_consistency

class CandidateEvaluationEngine:
    def __init__(self, parsed_resume, job_description):
        """
        Initializes the engine with the spatially parsed PDF blocks and the Job Description.
        """
        self.resume = parsed_resume
        self.jd = job_description
        
        # Extracted blocks from the spatial parser
        self.header = str(self.resume.get('header', ''))
        self.summary = str(self.resume.get('summary', ''))
        self.experience = str(self.resume.get('experience', ''))
        self.projects = str(self.resume.get('projects', ''))
        self.skills = str(self.resume.get('skills', ''))
        
        self.full_text = f"{self.header} {self.summary} {self.experience} {self.projects} {self.skills}"

    # ---------------------------------------------------------
    # PILLAR 1: Architecture Triangulation (Max 25 Points)
    # ---------------------------------------------------------
    def score_problem_solving(self):
        if not self.projects.strip(): return 0
        
        text = self.projects.lower()
        score = 0
        
        layers = [
            ['react', 'vue', 'angular', 'frontend', 'html', 'css'],
            ['django', 'node', 'express', 'spring', 'flask', 'backend'],
            ['postgresql', 'mongodb', 'mysql', 'sql', 'database'],
            ['aws', 'docker', 'kubernetes', 'gcp', 'azure', 'cloud']
        ]
        integrations = ['rest api', 'graphql', 'webhook', 'oauth', 'jwt', 'microservices']
        metrics_pattern = r'(\d{1,3}%|\d+\s*(ms|gb|tb|mb)|latency|requests?/sec|throughput)'
        
        # Weight 1: Layers (10 pts)
        layers_found = sum(1 for layer in layers if any(tech in text for tech in layer))
        score += (layers_found * 2.5) 
        
        # Weight 2: Integrations (7.5 pts)
        ints_found = sum(1 for inc in integrations if inc in text)
        score += min(ints_found * 3.75, 7.5)
        
        # Weight 3: Metrics (7.5 pts)
        metrics_found = len(re.findall(metrics_pattern, text))
        score += min(metrics_found * 3.75, 7.5)
        
        return min(round(score), 25)

    # ---------------------------------------------------------
    # PILLAR 2: Technical Match TF-IDF (Max 20 Points)
    # ---------------------------------------------------------
    def score_technical_match(self):
        if not self.jd or not self.skills: return 0
        
        try:
            # Combine skills and experience for the candidate's corpus
            candidate_corpus = f"{self.skills} {self.experience}"
            documents = [self.jd, candidate_corpus]
            
            # Use Scikit-Learn to vectorize and find cosine similarity
            tfidf = TfidfVectorizer(stop_words='english')
            tfidf_matrix = tfidf.fit_transform(documents)
            similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            
            # Convert similarity (0.0 to 1.0) to a 20-point scale
            return min(round(similarity * 20), 20)
        except:
            return 0

    # ---------------------------------------------------------
    # PILLAR 3: Practical Experience (Max 15 Points)
    # ---------------------------------------------------------
    def score_experience(self):
        if not self.experience.strip(): return 0
        
        text = self.experience.lower()
        score = 0
        
        # Calculate Tenure
        tenure_pattern = r'(\d+)\s*(year|yr|month|mo)s?'
        durations = re.findall(tenure_pattern, text)
        months = sum((int(v) * 12 if 'y' in u else int(v)) for v, u in durations)
        score += min((months / 12) * 2, 7) # Max 7 points for years
        
        # Calculate Impact Metrics
        impact_pattern = r'(\d{2,}%)|(\$\d+[kKmM]?)|(reduced by \d+)'
        metrics = len(re.findall(impact_pattern, text))
        score += min(metrics * 2, 8) # Max 8 points for proof of impact
        
        return min(round(score), 15)

    # ---------------------------------------------------------
    # PILLAR 4: GitHub Consistency (Max 15 Points)
    # ---------------------------------------------------------
    def score_github(self):
        github_url = self.resume.get('github_link', None)
        if not github_url:
            # Attempt a raw regex fallback if the parser missed the explicit key
            match = re.search(r'(https?://(?:www\.)?github\.com/[^\s]+)', self.full_text)
            if match: github_url = match.group(1)
            
        if not github_url: return 0
        
        # Call the external file! (Score is natively capped at 20 in that file, so we scale to 15)
        github_data = calculate_github_consistency(github_url)
        raw_score = github_data.get('score', 0)
        
        # Scale 20-point system down to 15
        scaled_score = (raw_score / 20) * 15
        return min(round(scaled_score), 15)

    # ---------------------------------------------------------
    # PILLAR 5: Soft Skills & NLP (Max 15 Points)
    # ---------------------------------------------------------
    def score_soft_skills(self):
        if not self.summary.strip(): return 5 # Neutral baseline
        
        score = 0
        
        # 1. Sentiment Polarity (Confidence & Action-oriented language)
        analysis = TextBlob(self.summary)
        polarity = analysis.sentiment.polarity
        if polarity > 0.1: score += 7.5 # Positive/Confident tone
        elif polarity >= 0: score += 4  # Neutral
        
        # 2. Flesch-Kincaid Readability (Is it professional writing?)
        readability = textstat.flesch_reading_ease(self.summary)
        # 30-70 is generally college/professional level
        if 30 <= readability <= 70:
            score += 7.5
        elif readability > 70:
            score += 4 # A bit too simple
        
        return min(round(score), 15)

    # ---------------------------------------------------------
    # PILLAR 6: Professionalism & Formatting (Max 10 Points)
    # ---------------------------------------------------------
    def score_professionalism(self):
        score = 0
        
        # 1. Essential Contact Info (Max 4 points)
        if re.search(r'[\w\.-]+@[\w\.-]+\.\w+', self.header): score += 2 # Email exists
        if re.search(r'linkedin\.com/in/', self.header.lower()): score += 2 # LinkedIn exists
        
        # 2. Document Length / Word Count (Max 3 points)
        word_count = len(self.full_text.split())
        if 300 <= word_count <= 800:
            score += 3 # Goldilocks zone (1-2 pages)
        elif 150 <= word_count < 300:
            score += 1 # Too brief
        # > 800 is likely too long/rambling, 0 points.
        
        # 3. Structural Integrity (Max 3 points)
        # Did the spatial parser successfully find the standard sections?
        sections_found = sum(1 for section in [self.experience, self.education, self.projects] if section.strip())
        if sections_found >= 2:
            score += 3
            
        return min(round(score), 10)

    # =========================================================
    # MASTER AGGREGATOR
    # =========================================================
    def generate_full_analysis(self):
        """
        Executes all pillars and returns the final payload for the React Dashboard.
        """
        p1 = self.score_problem_solving()
        p2 = self.score_technical_match()
        p3 = self.score_experience()
        p4 = self.score_github()
        p5 = self.score_soft_skills()
        p6 = self.score_professionalism()
        
        total_crs = p1 + p2 + p3 + p4 + p5 + p6
        
        return {
            "crs_score": total_crs,
            "breakdown": {
                "problem_solving": p1,      # / 25
                "technical_match": p2,      # / 20
                "practical_experience": p3, # / 15
                "github_consistency": p4,   # / 15
                "soft_skills": p5,          # / 15
                "professionalism": p6       # / 10
            },
            "summary_flag": "Excellent Fit" if total_crs >= 75 else "Requires Human Review",
        }