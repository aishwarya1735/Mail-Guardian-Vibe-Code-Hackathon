# **App Name**: Mail Guardian

## Core Features:

- Email Input: Allow users to input their Google email address for scanning.
- Security Scan: Scan the provided email address against known data breaches and phishing databases using an LLM tool.
- Security Score: Calculate and display a security health score based on scan results.
- Actionable Tips: Provide tailored, actionable tips for users to improve their email security based on identified risks. An LLM will generate these tips based on email configuration and recent breach activity for accounts associated with this user domain, if available. The LLM tool will select the tips most relevant to the user based on their inputs and identified risks.
- Data Breach Incident Reporting: Check email for leaked passwords using the 'Have I Been Pwned' API, providing the users with incident and sensitive information. Also providing users the option of deleting or changing the exposed/leaked password if desired.

## Style Guidelines:

- Background color: Dark gray (#222222) for a modern, secure feel.
- Primary color: Bright green (#90EE90) to indicate a good security level.
- Accent color: Amber (#FFBF00) for warnings, and red (#FF0000) for critical issues.
- Body and headline font: 'Inter', a grotesque-style sans-serif with a modern, machined, objective, neutral look.
- Use security-themed icons to visually represent different security aspects and tips.
- Clear and intuitive layout with a focus on displaying the security score prominently.
- Subtle animations to indicate scanning progress and results.