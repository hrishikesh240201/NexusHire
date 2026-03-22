from rest_framework import serializers
from .models import Candidate, AIAnalysis, JobPosting  

class AIAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIAnalysis
        fields = '__all__'

class CandidateSerializer(serializers.ModelSerializer):
    # Include the AI analysis as a nested object
    ai_analysis = AIAnalysisSerializer(read_only=True)
    
    class Meta:
        model = Candidate
        fields = '__all__'

class JobPostingSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPosting
        fields = '__all__'