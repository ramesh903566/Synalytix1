import json
import urllib.request
import time
import os
import re

api_key = "AQ.Ab8RN6JivtYO0rQ-qHuQnXhfwD3IKBSmvbap3Waz6L2SFwVc6g"
base_url = "https://stitch.googleapis.com/v1/projects/7874251174576577922/screens"

req = urllib.request.Request(base_url)
req.add_header("X-Goog-Api-Key", api_key)

output_dir = "/Users/bunny/Development/Synalytix1/app/"
os.makedirs(output_dir, exist_ok=True)

try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        screens = data.get('screens', [])
        for screen in screens:
            title = screen.get('title', 'Unknown Title')
            url = screen.get('htmlCode', {}).get('downloadUrl', 'No URL')
            
            if url != 'No URL' and title != 'Unknown Title':
                # Sanitize filename
                filename = re.sub(r'[^\w\s-]', '', title).strip().lower()
                filename = re.sub(r'[\s-]+', '_', filename) + '.html'
                filepath = os.path.join(output_dir, filename)
                
                print(f"Downloading {title} to {filename}...")
                try:
                    urllib.request.urlretrieve(url, filepath)
                except Exception as e:
                    print(f"Failed to download {title}: {e}")
                time.sleep(0.5)
except Exception as e:
    print(f"Error fetching screens: {e}")
