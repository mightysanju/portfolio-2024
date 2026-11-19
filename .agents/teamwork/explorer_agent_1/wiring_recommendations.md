# CMS Wiring Strategy Recommendation

This report outlines the recommended CMS wiring strategy for the M2 scope, ensuring site-wide editability via `PortfolioContext.tsx`.

## Summary
Several components are already correctly wired. The remaining components (`About.tsx`, `ATSApp.tsx`, and blog pages) are hardcoded and require refactoring to use the `usePortfolio()` hook and `resolveAssetUrl()` for all external assets.

## Component-Specific Recommendations

| Component | Status | Data Fields to Use | Wiring Strategy |
| :--- | :--- | :--- | :--- |
| `About.tsx` | Hardcoded | `data.aboutPage` | Replace hardcoded data with `usePortfolio()` hook. Map fields like `education`, `experience`, `skills` (technical, ml, soft), `strengths`, etc. |
| `ATSApp.tsx` | Hardcoded | `data.atsPage` | Replace hardcoded text with `data.atsPage` fields. |
| `src/components/blog/*` | Hardcoded | `data.standalonePages.*` | Replace hardcoded content for each blog page with the corresponding `data.standalonePages` entry (e.g., `networkapp`, `ddo`, `atsBlog`, etc.). |

## General Guidelines for CMS Wiring
1.  **Consume Data**: Use `const { data, resolveAssetUrl } = usePortfolio();`.
2.  **Use Schema Fields**: Always use the defined `PortfolioData` interface fields in `PortfolioContext.tsx`.
3.  **Resolve Assets**: Use `resolveAssetUrl()` for *every* image or file URL (e.g., `profileImage`, `attachments`, `image`). Never use `data:` or hardcoded image URLs directly.
4.  **Component Refactoring**:
    -   Identify hardcoded text strings and move them to `portfolioData.json` under the appropriate `SectionsMeta` or `PageData` structure.
    -   Pass the CMS-provided data to child components if necessary.
5.  **Schema Updates**: If a field is missing in `portfolioData.json`, update the `PortfolioData` interface and the baseline JSON.
