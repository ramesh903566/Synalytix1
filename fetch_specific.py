import os
import shutil
import json
import urllib.request
import time
import re

# 1. Clean up app directory
app_dir = "/Users/bunny/Development/Synalytix1/app/"
if os.path.exists(app_dir):
    shutil.rmtree(app_dir)
os.makedirs(app_dir, exist_ok=True)

# 2. Target titles
target_titles = [
    "Apps Management - High Visibility",
    "Account Settings",
    "Studio Composer",
    "Analytics Deep Dive",
    "Placement Readiness - Light Visibility",
    "Midnight Chrome & Glass",
    "Technical Glassmorphism",
    "Main Dashboard",
    "Instagram Detail - Light Visibility",
    "LinkedIn Detail - Light Visibility",
    "LeetCode Detail - Light Visibility",
    "X Detail - Light Visibility",
    "GitHub Detail - Light Visibility"
]

def normalize_title(t):
    return re.sub(r'\d+$', '', t).strip().lower()

normalized_targets = [normalize_title(t) for t in target_titles]

api_key = "AQ.Ab8RN6JivtYO0rQ-qHuQnXhfwD3IKBSmvbap3Waz6L2SFwVc6g"
base_url = "https://stitch.googleapis.com/v1/projects/7874251174576577922/screens"

req = urllib.request.Request(base_url)
req.add_header("X-Goog-Api-Key", api_key)

downloaded_files = []

try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        screens = data.get('screens', [])
        
        for screen in screens:
            title = screen.get('title', 'Unknown Title')
            norm_title = normalize_title(title)
            
            # Check if this screen is in our target list
            if norm_title in normalized_targets:
                url = screen.get('htmlCode', {}).get('downloadUrl', 'No URL')
                if url != 'No URL':
                    # Sanitize filename
                    filename = re.sub(r'[^\w\s-]', '', title).strip().lower()
                    filename = re.sub(r'[\s-]+', '_', filename) + '.html'
                    filepath = os.path.join(app_dir, filename)
                    
                    # Avoid downloading exact duplicates if title appears twice
                    if not os.path.exists(filepath):
                        print(f"Downloading matched screen: {title} -> {filename}")
                        urllib.request.urlretrieve(url, filepath)
                        downloaded_files.append(filename)
                        time.sleep(0.5)
except Exception as e:
    print(f"Error fetching screens: {e}")

print("Downloaded files:", downloaded_files)
