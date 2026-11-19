# Handoff Report: M2 CMS Wiring Strategy

## Observation
- Central state: `src/context/PortfolioContext.tsx` holds `PortfolioData` and `resolveAssetUrl`.
- Well-wired: `Navbar.tsx`, `Footer.tsx`, `ChatButton.tsx`, `TestimonialScroll.tsx`, `Certifications.tsx`, `Contact.tsx`. These components correctly use `usePortfolio()` to access CMS data and `resolveAssetUrl` to handle assets.
- Hardcoded/Needs Wiring:
    - `About.tsx`: Data (education, experience, skills, strengths, etc.) is hardcoded.
    - `ATSApp.tsx`: UI labels and content are hardcoded.
    - Blog components (`Networkapp.tsx`, `DDO.tsx`, etc.): Many are likely hardcoded or partially wired.

## Logic Chain
1. The CMS architecture relies on `PortfolioContext.tsx` providing `NormalizedPortfolioData` and `resolveAssetUrl` to components.
2. Components that bypass this (e.g., `About.tsx`) break the CMS editing goal (R1, R2).
3. Wiring involves:
    a. `const { data, resolveAssetUrl } = usePortfolio();`
    b. Accessing the specific section in `data` (e.g., `data.aboutPage`, `data.atsPage`).
    c. Passing CMS fields into component props or using them directly.
    d. Wrapping asset paths in `resolveAssetUrl()`.

## Caveats
- I did not inspect every single blog component, but the pattern is consistent across `src/components/`.

## Conclusion
The CMS architecture is robust. The primary task for M2 is to refactor components currently using hardcoded data to use `PortfolioContext`.

### Recommended Wiring Strategy

| Component | Target Data Field | Wiring Action |
| :--- | :--- | :--- |
| `About.tsx` | `data.aboutPage` | Replace hardcoded arrays/objects with `data.aboutPage.education`, `data.aboutPage.experience`, `data.aboutPage.skills`, etc. |
| `ATSApp.tsx` | `data.atsPage` | Replace hardcoded UI strings with `data.atsPage` fields. |
| Blog/* | `data.standalonePages` | Each blog component needs specific `...PageData` fields from `standalonePages`. |

- **Asset Resolution**: Always wrap asset paths in `resolveAssetUrl(path)`.
- **Default Values**: Ensure `PortfolioContext` provides reasonable defaults if CMS data is missing (as seen in `Navbar`/`Footer`).

## Verification Method
- Code review: Check if `usePortfolio` is used and if all hardcoded strings/assets have been moved to `portfolioData.json`.
- UI Test: Verify changes in `/admin` reflect on the live page.
- Test suite: Add integration tests in `src/__tests__/m4AdminCms.test.tsx` (or similar) to verify CMS-to-UI data flow.
