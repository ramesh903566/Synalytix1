import json
import urllib.request
import time

api_key = "AQ.Ab8RN6JivtYO0rQ-qHuQnXhfwD3IKBSmvbap3Waz6L2SFwVc6g"
base_url = "https://stitch.googleapis.com/v1/projects/7874251174576577922/screens"

req = urllib.request.Request(base_url)
req.add_header("X-Goog-Api-Key", api_key)

try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        screens = data.get('screens', [])
        for screen in screens:
            title = screen.get('title', 'Unknown Title')
            url = screen.get('htmlCode', {}).get('downloadUrl', 'No URL')
            name = screen.get('name')
            print(f"Title: {title}")
            print(f"ID: {name}")
            print(f"URL: {url}")
            print("---")
except Exception as e:
    print(f"Error fetching screens: {e}")
