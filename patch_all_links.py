import os
import glob
import re

html_files = glob.glob("/Users/bunny/Development/Synalytix1/app/*.html")

sidebar_links = {
    "dashboard": "main_dashboard.html",
    "apps": "apps_management.html",
    "auto_awesome": "studio_composer.html", # Studio
    "bar_chart": "analytics_deep_dive.html", # Analytics
    "psychology": "placement_readiness.html", # Insights
    "settings": "#"
}

def patch_sidebar(content):
    # Find all <a> tags that contain the material symbols and replace their href
    for icon, link in sidebar_links.items():
        # A regex that looks for an <a> tag containing href="#" and the specific icon
        # This is a bit tricky, let's use a simpler approach: 
        # We can look for <span ...>icon</span> and find the enclosing <a> tag.
        pattern = r'(<a[^>]*href=")([^"]*)("[^>]*>\s*<span[^>]*>[^<]*' + icon + r'</span>)'
        content = re.sub(pattern, r'\g<1>' + link + r'\3', content, flags=re.IGNORECASE)
        # Some icons might be set via data-icon attribute
        pattern2 = r'(<a[^>]*href=")([^"]*)("[^>]*>\s*<span[^>]*data-icon="' + icon + r'"[^>]*>)'
        content = re.sub(pattern2, r'\g<1>' + link + r'\3', content, flags=re.IGNORECASE)
    return content

for file_path in html_files:
    with open(file_path, "r") as f:
        content = f.read()
    
    content = patch_sidebar(content)
    
    # If this is main_dashboard.html, we also patch the stat cards
    if file_path.endswith("main_dashboard.html"):
        # Wrap Github card
        content = re.sub(r'(<div[^>]*class="[^"]*rounded-xl[^"]*".*?GitHub.*?</div>\s*</div>)', r'<a href="github_detail_light_visibility.html" class="block transition-transform hover:scale-[1.02]">\1</a>', content, flags=re.DOTALL)
        # Wrap LinkedIn card
        content = re.sub(r'(<div[^>]*class="[^"]*rounded-xl[^"]*".*?LinkedIn.*?</div>\s*</div>)', r'<a href="linkedin_detail_technical_glassmorphism.html" class="block transition-transform hover:scale-[1.02]">\1</a>', content, flags=re.DOTALL)
        # Wrap Twitter/X card
        content = re.sub(r'(<div[^>]*class="[^"]*rounded-xl[^"]*".*?(?:Twitter|X).*?</div>\s*</div>)', r'<a href="x_detail_light_visibility.html" class="block transition-transform hover:scale-[1.02]">\1</a>', content, flags=re.DOTALL)
        # Wrap Instagram card
        content = re.sub(r'(<div[^>]*class="[^"]*rounded-xl[^"]*".*?Instagram.*?</div>\s*</div>)', r'<a href="instagram_detail_light_visibility.html" class="block transition-transform hover:scale-[1.02]">\1</a>', content, flags=re.DOTALL)
        # Wrap LeetCode card
        content = re.sub(r'(<div[^>]*class="[^"]*rounded-xl[^"]*".*?LeetCode.*?</div>\s*</div>)', r'<a href="leetcode_detail_light_visibility.html" class="block transition-transform hover:scale-[1.02]">\1</a>', content, flags=re.DOTALL)

    with open(file_path, "w") as f:
        f.write(content)

print("Links patched across all pages.")
