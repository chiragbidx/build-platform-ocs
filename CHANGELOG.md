# Changelog

## 2024-06-07

- Investigated build error related to missing export of `ClientInputType`.
- Confirmed `lib/validation/clients.ts` exports both `ClientInputSchema` and `ClientInputType` as required.
- Confirmed imports in `app/dashboard/clients/actions.ts` are correct.
- No code changes were necessary; bug was resolved by validating export/import contracts.