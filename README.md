# LoxaMail

LoxaMail is a business technology services platform and brand of ONLYZER. The project is being initialized from a clean foundation.

## Source of truth

Read [LOXAMAIL_MASTER_SPEC.md](LOXAMAIL_MASTER_SPEC.md) before making project changes. It records the approved architecture and decisions, along with open items marked TBD.

## Development

Requirements: Node.js supported by the installed Next.js release, npm, and (when database work begins) a new local MariaDB database.

```sh
npm install
npm run dev
```

The initial application does not configure or connect to a database. Do not reuse any prior LoxaMail database.

Useful checks:

```sh
npm run build
npm run lint
npm run typecheck
npm test
```

See `docs/` for topic-specific project notes.
