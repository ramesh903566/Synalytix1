import os
import glob

html_files = glob.glob("/Users/bunny/Development/Synalytix1/app/*.html")

script_tag = """
<!-- Swup SPA Integration -->
<script src="https://unpkg.com/swup@4"></script>
<script src="https://unpkg.com/@swup/scripts-plugin@2"></script>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    if (window.swup) return; // prevent double init
    window.swup = new Swup({
      plugins: [new SwupScriptsPlugin()]
    });
  });
</script>
</body>
"""

for file_path in html_files:
    with open(file_path, "r") as f:
        content = f.read()
    
    if "unpkg.com/swup@4" not in content:
        content = content.replace("</body>", script_tag)
        with open(file_path, "w") as f:
            f.write(content)
        print(f"Patched {os.path.basename(file_path)} with Swup")
