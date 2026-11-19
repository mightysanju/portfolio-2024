## 2026-11-18T20:13:49Z
You are the **M4 Worker (`teamwork_worker`)** for **Milestone 4 (M4): `/admin` CMS Expansion & Hero Selectors** of `portfolio-2024`.

## Core Task
Implement the modular `/admin` CMS expansion plan in `src/components/admin/` and add tests in `src/__tests__/m4AdminCms.test.tsx`.

## Mandatory Source Material (Read FIRST)
1. `/Users/mighty_sanju/.gemini/antigravity/brain/34b44132-7c13-41e7-a443-9b3f26c87eef/scratch/.agents/teamwork/ORIGINAL_REQUEST.md`
2. `/Users/mighty_sanju/.gemini/antigravity/brain/34b44132-7c13-41e7-a443-9b3f26c87eef/scratch/.agents/teamwork/PROJECT.md`
3. Explorer Reports:
   - Context/Assets: `/Users/mighty_sanju/.gemini/antigravity/brain/e5a8691e-76e5-45b9-a908-a583e9d8/scratch/.agents/teamwork/explorer_m4_context/handoff.md`
   - Admin Panel Modularization: `/Users/mighty_sanju/.gemini/antigravity/brain/48c9e1b2-55e9-43ee-ab30-6cd8d9a6f86c/scratch/.agents/teamwork/explorer_m4_admin/handoff.md`
   - Tests/Routes: `/Users/mighty_sanju/.gemini/antigravity/brain/d51df63e-bf66-42dc-a0cb-0170c65400db/scratch/.agents/teamwork/explorer_m4_tests_routes/handoff.md`

## Constraints & Requirements
- **EXCLUSIVE OWNERSHIP**: Only modify `src/components/admin/` and `src/__tests__/m4AdminCms.test.tsx`. **DO NOT** modify `src/context/PortfolioContext.tsx` or any other file.
- **Architectural Rules**:
  - Split `AdminPanel.tsx` into modules (`AssetField.tsx`, `HeroTab.tsx`, `ProjectsTab.tsx`, etc.) + `adminStyles.ts`.
  - Use `usePortfolio()` members as defined: `queuedUploads` (not `stagedUploads`).
  - Use `resolveAssetUrl(url)` for ALL staged/dynamic assets (`/uploads/...`, `blob:`, `data:`).
  - Use `updateData(prev => ...)` (functional updates) for ALL state changes to ensure sibling-edit safety.
  - Clear asset fields with `""` (never `undefined`).
  - Shipped Systems: Prune deleted project IDs from `shippedSystemProjectIds` on project deletion; `[]` = 0 records.
- **Verification**: Ensure `npm run lint` (0 errors), `npm run typecheck` (0 errors in M4), `npm test` (passes), `npm run build` (passes).
