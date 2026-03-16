# Changelog

## 2024-06-07

- Corrected `drizzle-orm` version in package.json to ^0.46.0 (latest available release).
- Previous attempt with ^0.46.6 caused npm ETARGET, as that version is not published.
- Registered schema in db client for .query helpers and reference resolution.
- Next: Run `npm install` to apply lockfile updates and install the latest valid version.