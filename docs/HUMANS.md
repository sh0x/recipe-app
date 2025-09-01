# HUMANS.md

This project is built by both humans and AI assistants (see `AGENTS.md`).  
Humans remain the final reviewers and decision-makers.  
This guide explains how to work effectively with AI contributors.

---

## 🎯 Purpose

- Ensure AI contributions are safe, consistent, and aligned with project goals.
- Provide humans with clear review steps and guardrails.
- Define collaboration etiquette between humans and agents.

---

## ✅ What Humans Should Do

- **Review every PR** before merging. Check for:
  - Code quality (readability, maintainability, no `any` abuse).
  - Adherence to standards (see `AGENTS.md`).
  - No secrets or sensitive data.
  - No unnecessary dependency changes.
  - Correct tests and documentation updates.
- **Ask clarifying questions** if an AI PR feels ambiguous.
- **Request changes** instead of merging quick fixes blindly.
- **Guide agents** by updating `PLANNING.md` or `TASKS.md` so they know priorities.

---

## ❌ What Humans Should Avoid

- Don’t merge unreviewed AI PRs directly into `main`.
- Don’t let AI assistants refactor large chunks of code without clear intent.
- Don’t rely on AI for secret management, security decisions, or production ops without validation.
- Don’t approve PRs just because “CI is green.” Always check code semantics.

---

## 🛠 Workflow for Human Reviewers

1. **Read the PR description** — make sure it references a task/plan.
2. **Check diffs**:
   - Is the scope small and focused?
   - Are changes documented?
   - Is code idiomatic TypeScript/Next.js/Prisma?
   - Are styles using Tailwind + theme tokens?
   - Does DB schema change come with a migration?
3. **Run locally**:
   ```bash
   pnpm install
   pnpm dev


Confirm feature works in the dev container.
4. Check tests:

pnpm test

Or run manually if feature isn’t test-covered yet.
5. Approve or request changes:

Approve if clean.

Request changes if unclear, too broad, or violates standards.

🤝 Human + Agent Collaboration

Use PLANNING.md for roadmap and TASKS.md for granular items.

Assign tasks to agents by opening issues or editing TASKS.md.

Merge small, iterative PRs — avoid giant diffs.

Leave notes in PRs if a change needs human follow-up.

🔒 Security Reminder

Humans are the safety net.
Agents can produce valid-looking but insecure or inefficient code.
Always double-check:

Auth/authz flows.

DB migrations.

External API usage.

Dependency additions.

👥 Culture

Treat agents like junior contributors: they’re fast but need oversight.

Celebrate wins when agents unlock speed or reduce grunt work.

Humans set direction; agents assist execution.


