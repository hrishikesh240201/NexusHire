from django.contrib import admin
from .models import JobPosting, Candidate, AIAnalysis

@admin.register(JobPosting)
class JobPostingAdmin(admin.ModelAdmin):
    # Updated 'created_at' -> 'posted_at'
    list_display = ('title', 'company', 'location', 'posted_at', 'is_active')
    search_fields = ('title', 'company')
    list_filter = ('is_active', 'posted_at')

@admin.register(Candidate)
class CandidateAdmin(admin.ModelAdmin):
    # Updated 'created_at' -> 'applied_at'
    # Added new link fields to the detail view automatically
    list_display = ('full_name', 'email', 'job', 'status', 'applied_at')
    list_filter = ('status', 'job')
    search_fields = ('full_name', 'email')

@admin.register(AIAnalysis)
class AIAnalysisAdmin(admin.ModelAdmin):
    # Showing the new 5-Parameter scores in the admin list
    list_display = ('candidate', 'crs_score', 'technical_score', 'soft_skills_score', 'problem_solving_score')
    search_fields = ('candidate__full_name',)