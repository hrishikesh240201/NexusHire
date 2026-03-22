from django.urls import path
from .views import (
    get_all_candidates, 
    get_open_jobs, 
    apply_to_job, 
    send_email_action
)
from . import views
urlpatterns = [
    # Student Endpoints
    path('jobs/', get_open_jobs, name='get_open_jobs'),
    path('apply/<int:job_id>/', apply_to_job, name='apply_to_job'),
    path('jobs/create/', views.create_job_posting),
    path('login/', views.recruiter_login),
    # Recruiter Endpoints
    path('candidates/', get_all_candidates, name='get_all_candidates'),
    path('send-email-action/', send_email_action, name='send_email_action'),
    path('update-status/', views.update_candidate_status),
    path('jobs/feed.xml', views.jobs_xml_feed),
]