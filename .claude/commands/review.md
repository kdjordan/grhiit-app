---
description: Pre-commit security and code cleanliness review
---

Perform a pre-commit code review focused on:

**Security Issues:**
- Authentication/authorization vulnerabilities
- Input validation gaps
- SQL injection, XSS, or other injection risks
- Exposed secrets, API keys, or credentials
- Insecure dependencies or outdated packages
- Improper error handling that leaks info

**Code Cleanliness:**
- Dead code (unused functions, imports, variables)
- Orphaned variables (declared but never used)
- Commented-out code blocks
- Unused dependencies in package.json or requirements.txt
- Duplicate code that should be refactored

Provide:
1. List of issues found (file:line format)
2. Severity rating (Critical/High/Medium/Low)
3. Specific fix recommendations

If clean: confirm "No issues found - ready to commit"