# Changelog

## 2024-06-07

- Reverted `drizzle-orm` to ^0.45.1 and `drizzle-kit` to ^0.31.9 in package.json for compatibility with existing code.
- Updated server/client logic to follow ^0.45.1 query and returning() mode.
- Next: Run `npm install` to complete the rollback and lock the correct versions.