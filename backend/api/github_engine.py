import requests
import re

def calculate_github_consistency(github_url):
    """
    Evaluates a candidate's GitHub profile based on commit frequency.
    """
    if not github_url:
        return {"score": 0, "details": "No GitHub URL provided"}

    match = re.search(r'github\.com/([^/]+)', github_url)
    if not match:
        return {"score": 0, "details": "Invalid GitHub URL"}
    
    username = match.group(1)
    
    try:
        # NOTE: For your live demo, replace 'YOUR_GITHUB_TOKEN' with an actual Personal Access Token
        # to prevent rate-limiting when the judges ask you to test it multiple times!
        headers = {
            'Accept': 'application/vnd.github.v3+json',
            # 'Authorization': 'token YOUR_GITHUB_TOKEN'  <-- Uncomment this for the live demo
        }
        
        events_url = f"https://api.github.com/users/{username}/events/public?per_page=100"
        response = requests.get(events_url, headers=headers)
        
        if response.status_code != 200:
            return {"score": 0, "details": "API Limit Reached or User Not Found"}
            
        events = response.json()
        push_events = [e for e in events if e['type'] == 'PushEvent']
        
        if not push_events:
            return {"score": 5, "details": "Account exists, but no recent commits."}

        active_dates = set()
        for event in push_events:
            active_dates.add(event['created_at'][:10])
            
        total_pushes = len(push_events)
        unique_active_days = len(active_dates)
        
        score = 5 # Base score
        
        # Volume
        if total_pushes > 50: score += 5
        elif total_pushes > 20: score += 3
        elif total_pushes > 5: score += 1
        
        # Consistency
        if unique_active_days >= 20: score += 10
        elif unique_active_days >= 10: score += 7
        elif unique_active_days >= 5: score += 4
            
        return {
            "score": min(score, 20),
            "details": f"{unique_active_days} active coding days detected."
        }

    except Exception as e:
        return {"score": 0, "details": "GitHub API evaluation failed."}