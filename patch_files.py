import os

files = [
    'linkedin_detail_light_visibility.html', 
    'github_detail_light_visibility.html', 
    'x_detail_light_visibility.html', 
    'instagram_detail_light_visibility.html', 
    'leetcode_detail_light_visibility.html',
    'main_dashboard.html'
]
base_dir = '/Users/bunny/Development/Synalytix1/app/'

swup_css = """
        /* Swup transitions */
        .transition-fade {
            transition: 0.4s;
            opacity: 1;
        }
        html.is-animating .transition-fade {
            opacity: 0;
            transform: translateY(10px);
        }
    </style>
"""

swup_script = """
</div>
<script src="https://unpkg.com/swup@4"></script>
<script src="https://unpkg.com/@swup/scripts-plugin@3"></script>
<script>
    const swup = new Swup({
        plugins: [new SwupScriptsPlugin()]
    });
</script>
</body>
"""

dashboard_link = """<div class="px-space-5 mb-space-8 mt-4">
<a href="./main_dashboard.html" class="flex items-center gap-2 text-slate-600 hover:text-[#0F172A] mb-4 hover:underline">
    <span class="material-symbols-outlined text-[18px]">arrow_back</span>
    <span class="font-bold text-sm">Dashboard</span>
</a>"""

for file_name in files:
    path = os.path.join(base_dir, file_name)
    if not os.path.exists(path):
        continue
    
    with open(path, 'r') as f:
        content = f.read()
    
    # 1. Add Swup CSS
    content = content.replace('</style>', swup_css)
    
    # 2. Add Swup div wrapper right after body
    body_str = 'body class="font-body text-body antialiased flex h-screen overflow-hidden">'
    if body_str in content:
        content = content.replace(body_str, body_str + '\n<div id="swup" class="transition-fade flex w-full h-full">')
    
    # For main_dashboard, it might have a different body class
    body_str_dashboard = 'body class="font-body text-body bg-surface text-on-surface antialiased overflow-x-hidden">'
    if body_str_dashboard in content:
        content = content.replace(body_str_dashboard, body_str_dashboard + '\n<div id="swup" class="transition-fade">')
        
    body_str_dashboard_alt = 'body class="font-body text-body bg-slate-50 text-slate-900 antialiased overflow-x-hidden">'
    if body_str_dashboard_alt in content:
        content = content.replace(body_str_dashboard_alt, body_str_dashboard_alt + '\n<div id="swup" class="transition-fade">')
    
    # 3. Add Dashboard link in sidebar (only for detail pages)
    if file_name != 'main_dashboard.html':
        target_header = '<div class="px-space-5 mb-space-8">'
        if target_header in content:
            content = content.replace(target_header, dashboard_link)
        
        # 4. Update the mobile header back button
        target_mobile_header = '<span class="font-display text-h2 text-[#0F172A] tracking-tighter">Synalytix</span>'
        mobile_link = '<a href="./main_dashboard.html" class="font-display text-h2 text-[#0F172A] tracking-tighter flex items-center gap-2"><span class="material-symbols-outlined">arrow_back</span> Synalytix</a>'
        if target_mobile_header in content:
            content = content.replace(target_mobile_header, mobile_link)
        
    # 5. Add Swup script at the end
    content = content.replace('</body>', swup_script)
    
    # 6. Specific to main_dashboard: link stat cards to the new detail pages
    if file_name == 'main_dashboard.html':
        content = content.replace('href="./app/linkedin.html"', 'href="./linkedin_detail_light_visibility.html"')
        content = content.replace('href="./app/github.html"', 'href="./github_detail_light_visibility.html"')
        content = content.replace('href="./app/x.html"', 'href="./x_detail_light_visibility.html"')
        content = content.replace('href="./app/instagram.html"', 'href="./instagram_detail_light_visibility.html"')
        content = content.replace('href="./app/leetcode.html"', 'href="./leetcode_detail_light_visibility.html"')
        # Also in case they use '#'
        content = content.replace('href="#"', 'href="#"') # We can manually patch main_dashboard later if needed

    with open(path, 'w') as f:
        f.write(content)
    
    print(f"Patched {file_name}")

