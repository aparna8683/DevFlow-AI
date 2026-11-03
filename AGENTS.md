# DevFlow AI - Project Instructions

## Project Goal
Build a collaborative AI software engineering team that helps developers triage, investigate, reproduce, and resolve software bugs.

## Architecture
- Switch: Agent coordination and communication.
- Mattermost: Shared communication rooms.
- OpenCode: Coding agent execution.
- Ollama: Local language model.
- GitHub: Source code and version control.

## Agent Responsibilities

### Triage Agent
- Read incoming bug reports.
- Identify severity and priority.
- Ask for missing information.
- Summarize the issue for the debugging agent.

### Debugging Agent
- Inspect relevant source code.
- Reproduce the reported bug.
- Suggest a minimal fix.
- Run relevant tests.

### Review Agent
- Review proposed changes.
- Check test results.
- Identify possible regressions.

## Human Approval
- Never merge or apply significant changes without human approval.
- Explain proposed changes before implementation.

## Engineering Rules
- Prefer small, focused changes.
- Never expose API keys or secrets.
- Never delete user data.
- Report errors honestly.
- Add tests for bug fixes.
