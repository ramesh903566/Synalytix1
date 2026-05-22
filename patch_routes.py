import os
import glob
import re

base_dir = "/Users/bunny/Development/Synalytix1"

html_files = glob.glob(f"{base_dir}/**/*.html", recursive=True)

nav_replacements = {
    "Dashboard": "/dashboard",
    "Apps": "/apps",
    "Studio": "/studio",
    "Analytics": "/analytics",
    "Insights": "/insights",
    "Settings": "/settings"
}

for file_path in html_files:
    # Skip login, register, auth callback
    if "login" in file_path or "register" in file_path or "auth/callback" in file_path:
        continue
    # Skip skill-creator stuff if any
    if ".agents" in file_path or "graphify-out" in file_path:
        continue
        
    with open(file_path, "r") as f:
        content = f.read()

    # Inject router.js if not present
    if "router.js" not in content:
        content = content.replace("</head>", "    <script src=\"/router.js\"></script>\n</head>")

    # The outer sidebar links typically look like:
    # <a ... href="something"> ... <span>Dashboard</span>
    # We can use regex to replace the href for each known label.
    for label, route in nav_replacements.items():
        # Find <a> tag containing the label inside a nav
        pattern = r'(<a[^>]*href=")[^"]*("[^>]*>\s*<span[^>]*>[^<]*</span>\s*<span>' + label + r'</span>\s*</a>)'
        content = re.sub(pattern, r'\g<1>' + route + r'\g<2>', content)
        
        # Another pattern if settings has different structure:
        # <a ... href="#"> ... <span ...>settings</span> ... <span>Settings</span>
        pattern2 = r'(<a[^>]*href=")[^"]*("[^>]*>\s*<span[^>]*>[^<]*</span>\s*<span>' + label + r'</span>\s*</a>)'
        content = re.sub(pattern2, r'\g<1>' + route + r'\g<2>', content)

    # Some apps deep links in main_dashboard:
    content = content.replace("github_detail_light_visibility.html", "/apps/github")
    content = content.replace("linkedin_detail_technical_glassmorphism.html", "/apps/linkedin")
    content = content.replace("leetcode_detail_light_visibility.html", "/apps/leetcode")
    content = content.replace("instagram_detail_light_visibility.html", "/apps/instagram")
    content = content.replace("x_detail_light_visibility.html", "/apps/x")
    content = content.replace("github_analytics.html", "/apps/github/analytics")
    
    with open(file_path, "w") as f:
        f.write(content)
    
    print(f"Patched {file_path}")

print("Done patching all files!")
