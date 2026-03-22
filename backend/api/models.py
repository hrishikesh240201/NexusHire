from django.db import models

class JobPosting(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    company = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    salary_range = models.CharField(max_length=50, blank=True)
    posted_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

class Candidate(models.Model):
    STATUS_CHOICES = [
        ('APPLIED', 'Applied'),
        ('SCREENING', 'Screening'),
        ('INTERVIEW', 'Interview'),
        ('OFFER', 'Offer'),
        ('REJECTED', 'Rejected'),
    ]

    job = models.ForeignKey(JobPosting, on_delete=models.CASCADE, related_name='candidates')
    full_name = models.CharField(max_length=100)
    email = models.EmailField()
    resume_file = models.FileField(upload_to='resumes/')
    
    # --- NEW: Explicit Links for 5-Parameter Analysis ---
    # We ask the student for these links directly during application
    github_link = models.URLField(blank=True, null=True, help_text="Link for Technical Score")
    leetcode_link = models.URLField(blank=True, null=True, help_text="Link for Problem Solving Score")
    linkedin_link = models.URLField(blank=True, null=True, help_text="Link for Professional Readiness")
    portfolio_link = models.URLField(blank=True, null=True, help_text="Link for Portfolio/Projects")

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='APPLIED')
    applied_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name

class AIAnalysis(models.Model):
    candidate = models.OneToOneField(Candidate, on_delete=models.CASCADE, related_name='ai_analysis')
    
    # --- THE 5 PILLARS OF CAREER READINESS ---
    
    # 1. Soft Skills (Resume Formatting & Language Sentiment)
    soft_skills_score = models.IntegerField(default=0)
    
    # 2. Technical Skills (GitHub Projects & Complexity)
    technical_score = models.IntegerField(default=0)
    
    # 3. Practical Knowledge (Internships & Experience Duration)
    practical_score = models.IntegerField(default=0)
    
    # 4. Problem Solving (LeetCode Stats / Hackathons)
    problem_solving_score = models.IntegerField(default=0)
    
    # 5. Professional Readiness (LinkedIn & Portfolio Presence)
    professional_score = models.IntegerField(default=0)
    
    # Final Aggregated Score (Weighted Average of the above 5)
    crs_score = models.IntegerField(default=0)
    
    # Metadata
    ai_summary = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Extra Stats to display on Dashboard (Evidence)
    github_verified = models.BooleanField(default=False)
    leetcode_solved = models.IntegerField(default=0) # Total problems solved

    def __str__(self):
        return f"Analysis for {self.candidate.full_name}"