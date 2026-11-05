# DevFlow AI - Agent Workflow

## Objective
Coordinate multiple AI agents to investigate software bugs and recommend safe fixes.

## Workflow

### 1. Bug Intake
Receive a bug report from the user through the collaboration interface.

### 2. Triage
The Triage Agent:
- Analyzes the report.
- Assigns severity.
- Identifies missing information.
- Creates a debugging handoff.

### 3. Investigation
The Debugging Agent:
- Inspects the repository.
- Investigates the root cause.
- Reproduces the issue when possible.
- Proposes a minimal fix.
- Runs relevant tests when authorized.

### 4. Review
The Review Agent:
- Independently checks the proposed fix.
- Evaluates test results.
- Identifies regressions and security risks.
- Recommends approval or changes.

### 5. Human Approval
Present the investigation and proposed changes to a human.

No significant code modification, merge, or deployment proceeds without explicit authorization.

### 6. Final Report
Provide:
- Original bug report
- Severity
- Root cause
- Proposed changes
- Test results
- Review findings
- Human approval status

## Safety Principles
- Never fabricate evidence or test results.
- Protect credentials and sensitive information.
- Preserve existing user data.
- Keep an auditable record of agent decisions.
- Require human approval for consequential actions.
