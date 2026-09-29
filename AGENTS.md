# LoxaMail project instructions

- Read `LOXAMAIL_MASTER_SPEC.md` before every LoxaMail development task.
- Inspect the relevant current implementation and dependencies before changing them.
- Do not invent product, pricing, supplier, billing, tax, UI, or infrastructure requirements.
- Do not change the approved architecture without first explaining the proposal.
- For Next.js work, read the relevant guide under `node_modules/next/dist/docs/` before editing code. Next.js conventions may differ from prior versions.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
