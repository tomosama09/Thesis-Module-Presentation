import re

with open('/Users/restuutomo/Documents/Restu U/Module Website/V2/index.html', 'r') as f:
    content = f.read()

# 1. We need to restore the Framework Cards
frameworks = """
            <div class="framework-card">
                <div class="framework-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                </div>
                <div class="framework-card-need">Structured vocabulary support</div>
                <h3>Bilingual Support</h3>
                <p>Indonesian scaffolding for abstract terms. English stays primary; the L1 clarifies meaning without replacing it.</p>
                <cite class="framework-cite">Cummins, 2008</cite>
            </div>
            <div class="framework-card">
                <div class="framework-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                </div>
                <div class="framework-card-need">Scaffolded communicative activities</div>
                <h3>CLT & Task-Based Learning</h3>
                <p>English as meaning-making, not drills. Every sub-unit ends in a concrete, communicative outcome — timeline, role-play, plan, or presentation.</p>
                <cite class="framework-cite">Brandl, 2021; Ellis, 2003</cite>
            </div>
        </div>
"""

# The file currently has the backward design pipeline inserted instead of the other two framework cards.
# We need to find where <div class="backward-design-pipeline"> is currently located (inside framework-grid)
# and replace it with the correct framework cards.
current_backward = re.search(r'<div class="backward-design-pipeline">.*?</svg>\s*</div>\s*</div>\s*</div>\s*</div>\s*</div>', content, re.DOTALL)
if current_backward:
    pipeline_html = current_backward.group(0)
    # Replace it with the correct frameworks
    content = content.replace(pipeline_html, frameworks)

    # Now we need to remove the unit-grid and place the pipeline_html there.
    unit_grid_match = re.search(r'<span class="unit-subs">4 sub-units · 5 activities each</span>\s*</div>\s*<div class="unit-card scroll-reveal">.*?<span class="unit-subs">4 sub-units · 5 activities each</span>\s*</div>\s*</div>', content, re.DOTALL)
    
    if unit_grid_match:
        content = content.replace(unit_grid_match.group(0), pipeline_html)

    with open('/Users/restuutomo/Documents/Restu U/Module Website/V2/index.html', 'w') as f:
        f.write(content)
        print("Success")
else:
    print("Could not find pipeline")

