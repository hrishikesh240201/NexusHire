from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
import os
import traceback
from django.core.mail import send_mail
from .models import Candidate, AIAnalysis, JobPosting
from .serializers import CandidateSerializer, JobPostingSerializer
from django.http import HttpResponse
from django.contrib.auth import authenticate, login

# --- NEW IMPORTS: The Offline AI Engine ---
from .resume_parser import ResumeParser
from .ai_engine import CandidateEvaluationEngine

# --- 1. MAIN PIPELINE ---

def run_5_parameter_analysis(candidate):
    """
    Orchestrates the new offline, spatial-parsing 5-pillar analysis.
    """
    try:
        # 1. Get the absolute path of the saved PDF on the local server
        saved_pdf_path = candidate.resume_file.path
        
        # 2. Parse the PDF spatially into logical blocks (fixes the column/formatting issue)
        parser = ResumeParser(saved_pdf_path)
        segmented_blocks = parser.parse()
        
        # 3. Fetch the Job Description for TF-IDF matching
        # (Assuming your JobPosting model has a 'description' field)
        job_desc = candidate.job.description if hasattr(candidate.job, 'description') else ""
        
        # 4. Evaluate the candidate completely offline using Scikit-Learn and TextBlob
        engine = CandidateEvaluationEngine(segmented_blocks, job_description=job_desc)
        scores = engine.calculate_crs()

        # 5. Save the intelligent scores to the Database
        AIAnalysis.objects.update_or_create(
            candidate=candidate,
            defaults={
                'technical_score': scores.get('technical', 0),
                'problem_solving_score': scores.get('problem_solving', 0),
                'soft_skills_score': scores.get('soft_skills', 0),
                'practical_score': scores.get('practical', 0),
                'professional_score': scores.get('professional', 0),
                'crs_score': scores.get('crs_final', 0),
                'ai_summary': "Evaluated via Offline Spatial Parsing & Triangulation Engine."
            }
        )
    except Exception as e:
        print(f"Error during offline AI analysis: {e}")
        traceback.print_exc()
        # Fallback in case of a corrupted PDF
        AIAnalysis.objects.update_or_create(
            candidate=candidate,
            defaults={
                'crs_score': 0,
                'ai_summary': f"Analysis failed to process document: {str(e)}"
            }
        )

# --- 2. VIEWS ---

@api_view(['POST'])
def apply_to_job(request, job_id):
    try:
        job = JobPosting.objects.get(id=job_id)
        data = request.data
        
        # Create Candidate with all fields
        candidate = Candidate.objects.create(
            job=job,
            full_name=data.get('full_name'),
            email=data.get('email'),
            resume_file=data.get('resume'),
            github_link=data.get('github_link'),
            leetcode_link=data.get('leetcode_link'),
            linkedin_link=data.get('linkedin_link'),
            portfolio_link=data.get('portfolio_link'),
            status='APPLIED'
        )

        # Trigger the new offline Analysis immediately
        run_5_parameter_analysis(candidate)
        
        return Response(CandidateSerializer(candidate).data, status=201)
    except Exception as e:
        traceback.print_exc()
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
def get_open_jobs(request):
    jobs = JobPosting.objects.filter(is_active=True)
    serializer = JobPostingSerializer(jobs, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_all_candidates(request):
    candidates = Candidate.objects.all()
    serializer = CandidateSerializer(candidates, many=True)
    # Sort by CRS Score descending
    sorted_data = sorted(serializer.data, key=lambda x: (x.get('ai_analysis') or {}).get('crs_score', 0), reverse=True)
    return Response(sorted_data)

@api_view(['POST'])
def send_email_action(request):
    try:
        candidate_id = request.data.get('candidate_id')
        action_type = request.data.get('action_type')
        subject = request.data.get('subject', 'Update')
        message = request.data.get('message', '')
        
        candidate = Candidate.objects.get(id=candidate_id)
        
        # Uncomment this for real email if you configure SMTP settings
        # send_mail(subject, message, os.getenv('EMAIL_HOST_USER'), [candidate.email])
        
        if action_type == 'interview': candidate.status = 'INTERVIEW'
        elif action_type == 'rejection': candidate.status = 'REJECTED'
        candidate.save()
        
        return Response({"success": True}, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
    
    
@api_view(['POST'])
def update_candidate_status(request):
    """Updates the pipeline status when a card is dragged and dropped."""
    try:
        candidate_id = request.data.get('candidate_id')
        new_status = request.data.get('status')
        
        candidate = Candidate.objects.get(id=candidate_id)
        candidate.status = new_status
        candidate.save()
        
        return Response({"success": True, "status": new_status}, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
    
@api_view(['GET'])
def jobs_xml_feed(request):
    """
    Generates an industry-standard XML syndication feed for external job boards 
    (like Indeed, Naukri, or Google Jobs) to scrape.
    """
    jobs = JobPosting.objects.filter(is_active=True)
    
    # Standard XML Header for Job Syndication
    xml_data = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml_data += '<source>\n'
    xml_data += '    <publisher>NexusHire Enterprise ATS</publisher>\n'
    xml_data += '    <publisherurl>http://localhost:5173</publisherurl>\n'
    
    for job in jobs:
        # We use CDATA tags to ensure special characters don't break the XML
        xml_data += '    <job>\n'
        xml_data += f'        <title><![CDATA[{job.title}]]></title>\n'
        xml_data += f'        <company><![CDATA[{job.company}]]></company>\n'
        xml_data += f'        <location><![CDATA[{job.location}]]></location>\n'
        
        # Safely fetch fields that might be named differently in your models
        description = getattr(job, 'description', 'No description provided.')
        salary = getattr(job, 'salary_range', 'Not specified')
        
        xml_data += f'        <description><![CDATA[{description}]]></description>\n'
        xml_data += f'        <salary><![CDATA[{salary}]]></salary>\n'
        xml_data += f'        <applyurl><![CDATA[http://localhost:5173/jobs]]></applyurl>\n'
        xml_data += '    </job>\n'
        
    xml_data += '</source>'
    
    # Return as application/xml so the browser renders it beautifully
    return HttpResponse(xml_data, content_type='application/xml')


@api_view(['POST'])
def create_job_posting(request):
    """Allows recruiters to post a new job directly from the dashboard."""
    try:
        data = request.data
        job = JobPosting.objects.create(
            title=data.get('title'),
            company=data.get('company', 'NexusHire'), # Default company name
            location=data.get('location'),
            description=data.get('description'),
            salary_range=data.get('salary_range'),
            is_active=True
        )
        return Response({"message": "Job posted successfully!", "id": job.id}, status=201)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({"error": str(e)}, status=500)
    
    
@api_view(['POST'])
def recruiter_login(request):
    """Authenticates the recruiter and starts a secure session."""
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(request, username=username, password=password)
    
    if user is not None:
        login(request, user)
        return Response({
            "success": True, 
            "message": "Authentication successful",
            "username": user.username
        }, status=200)
    else:
        return Response({
            "success": False, 
            "error": "Invalid username or password"
        }, status=401)