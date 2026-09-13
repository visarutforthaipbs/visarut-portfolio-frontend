# Portfolio Website Audit - 2026-09-13

## Fix verification - 2026-09-13

The findings below describe the pre-fix state. The requested fixes have now been implemented locally:

- Both routes load the full catalog, including multiple API pages, before filtering and sorting. The portfolio route paginates the filtered collection. Server-rendered collections revalidate every five minutes.
- Clear-all resets organization filters, with a visible localized organization label. Matching uses selected text fields and Latin word boundaries instead of arbitrary JSON keys/URLs.
- Share URLs point to project detail routes. Existing cached/initial cards remain available on refresh errors, with a retry control; successful empty results do not resurrect old cards.
- Restored homepage navigation and visible mobile identity. Added three real selected projects with available descriptions and contextual inquiry links that prefill the contact subject. Corrected the surname spelling.
- Mobile filter drawer manages focus entry, Tab wrapping, Escape restoration, background inertness and scroll locking. Contact dialog handles focus and keyboard trapping; drawer-to-contact handoff was checked.
- App lint excludes independent skill tooling. NEXT_BUILD_DIR permits isolated production validation without overwriting a running preview's output.

Ran: node scripts/test-portfolio-catalog.mjs (passed: multi-page collection, empty results, failed-page rejection, cancellation, organization aliases and URL exclusion); npx tsc --noEmit (passed); npm run lint (zero errors, 29 warnings); NEXT_BUILD_DIR=.next-validation npm run build (passed, all 28 static pages generated); git diff --check (passed).

Browser checks passed: Migrant Mother found from /portfolio page 1; organization reset restores 52 results; homepage contains both previously omitted projects; mobile identity and selected projects render; filter focus wraps both ways and returns to trigger on Escape; drawer-to-contact focus enters the contact dialog; inquiry URL prefills Migrant Mother in the subject. Screenshots and accessibility trees were inspected through the browser tool. Share destination was verified in source, without sending an external share. Production build uses a separate ignored output directory because a concurrent Next server was using .next.

Claude independently reviewed task 16c2cf62f196450e8f8a6f35f4d2fdb9. Addressed its pagination clamp, cancellation, ACF matching and contact-focus concerns. Deliberately retain all-or-error collection loading so partial pages are not mislabeled as a complete catalog; failures preserve previously available data.

Skipped: deployment, real email delivery, Lighthouse/axe, and separate skill metadata/responsive scripts (source metadata inspection and direct browser checks were used). Image-optimization warnings remain; no performance score is claimed. Selected projects are an editable editorial choice using existing records, not a claim that these are the user's ranked favorites.

## Target and scope

Current working tree of visarut-portfolio-frontend, served locally at http://127.0.0.1:3000, using the public WordPress API. Existing uncommitted design changes were preserved. This is an audit, not a production certification or implementation.

Skills: agent-team, senior-ui-ux-orchestrator, ux-audit-skill. The UX skill guided evidence labels and ranking.

## Prioritized findings

| Priority | Finding | Evidence | Recommended change | Verification |
| --- | --- | --- | --- | --- |
| P1 | Catalog search, organization filtering and sorting operate on only the current 18-item page. Existing work can appear missing. | DOM: searching for Migrant Mother on /portfolio page 1 returned zero, although it was present on the homepage. Source: src/app/portfolio/PortfolioClient.tsx:34 and :48. | Apply search/filter/sort before pagination, using a complete dataset or server queries; reset page when filters change. | Search for a page-2 project from page 1; verify oldest/newest across the entire catalog. |
| P2 | Homepage presents only 50 of 52 published projects, with no pagination or load-more control. Counts and searches exclude two projects. | DOM: homepage count 50. Public API: X-WP-Total: 52. Source: src/app/HomeClient.tsx:60. | Fetch the complete catalog or add pagination backed by total counts. | All 52 published records must be discoverable through homepage search. |
| P2 | Clear all filters does not clear the organization filter, and organization-only filtering has no active-filter indicator. | DOM: selected Greenpeace, selected Photography, then Clear all; eight results remained and the reset control disappeared. Source: HomeClient.tsx:218 passes neither hasAdditionalFilters nor onClearAdditionalFilters to MarketplaceSearchBar; MarketplaceSearchBar.tsx:156. | Wire selectedOrg into the active-filter state and clear callback. Display the selected organization outside the mobile drawer. | Clear all returns the full catalog, including after closing the mobile drawer. |
| P2 | Sharing a preview on /portfolio produces the catalog URL rather than the project URL. | DOM: opened CRC project; address remained /portfolio. Source: MarketplaceQuickViewModal.tsx:233 shares window.location.href; PortfolioClient.tsx:179 only updates component state. Claude independently identified this. | Construct the share URL from /portfolio/{slug}. | Open the shared URL in a fresh tab and verify the intended project and metadata. Actual share submission was not needed for this audit. |
| P2 | Mobile homepage hides the producer identity and description inside the Filter drawer; homepage also has no regular About/Blog/catalog navigation. | Screenshot and accessibility tree at mobile breakpoint: initial screen starts with search/filters/cards; identity appears after opening Filter. Source: HomeClient.tsx:191 hides header; MarketplaceSidebar.tsx:296 hides desktop profile. | Keep a compact identity/service header and visible navigation on mobile, while preserving the catalog-first layout. | A first-time visitor can identify the producer and reach About/Blog without discovering the filter drawer. |
| P2 | Mobile filter drawer does not move keyboard focus into the dialog or trap it. | DOM: focus remained on the Filter trigger after opening. Source: MarketplaceSidebar.tsx:284 handles Escape only; dialog at :302 has no focus management or background inertness. | Use an accessible dialog primitive or implement initial focus, trapping, restoration and background isolation. | Keyboard focus enters drawer, stays there with Tab/Shift+Tab, and returns to trigger on close. Full keyboard traversal was not run. |
| P2 | Homepage replaces usable server-rendered project cards with an error block if the client refresh fails. | Source: HomeClient.tsx:62 retains featured fallback but :234 conditionally replaces the grid on error. Confirmed by Claude's static review; failure was not injected. | Preserve cached/initial cards and show an inline retry banner. | Simulate failed client refresh while initial cards exist; cards remain usable. |
| P3 | Portfolio introduction spells the surname differently from the rest of the site. | DOM and source: PortfolioClient.tsx:122 uses a different Thai surname than siteConfig and the profile. | Correct the introduction to the verified site identity. | Compare visible identity across Home, Portfolio, About and metadata. |

## Design improvements (Manual judgment)

- Preserve the image-led catalog, but add three selected projects that show the range of services. AIPass suggested curation; a static row is sufficient, and a carousel is not required.
- Add a concise role/deliverable summary to project previews, supported by actual project data. Category, client and date alone do not explain the producer's contribution.
- Make project detail calls to action contextual, such as contacting the producer about similar work. Do not invent results, customer endorsements or service guarantees.

## Checks and limitations

Ran: local Next.js development server, desktop/mobile screenshot and accessibility-tree inspection, homepage filter/reset interactions, /portfolio search and preview URL inspection, read-only public API count check, source review, npm run lint.

Lint exited 1 with 2 errors and 32 warnings. The two errors are require-style imports in .agents/skills/webapp-ui-skill/scripts/check_state_coverage.ts, not a reproduced app runtime failure. Warnings include image optimization and unused variables. Scope helper tooling separately or lint it with appropriate rules.

Skipped: production build, Lighthouse, axe, full keyboard traversal, contact-form delivery, exhaustive detail-page/media tests, production parity verification. Public website retrieval through the web tool failed, so runtime findings apply to this local working tree. No performance score or production-wide accessibility claim is made. Browser viewport override was used to trigger mobile rendering; browser-reported CSS dimensions differed from the requested override, so no exact-width or overflow claim is made.

## Team evidence and review decisions

- Codex: browser checks, API count, source verification and final prioritization.
- Claude: task 3e10e8d1aeb049dba5b7827d4865fa8d completed. Accepted sharing and error/fallback findings after inspecting source and reproducing relevant URL behavior. Its repeated-modal-history scenario was not reproducible from the demonstrated normal flow and is excluded from confirmed findings. Its assertion that empty categories necessarily show unrelated cards is overstated because another client category filter applies; excluded in that form.
- AIPass: task 07f271e7950944e787759532b8a7ab9b completed; free credit and fresh temporary session confirmed. Received only supplied non-sensitive portfolio observations. Curation/navigation/context ideas are recommendations, not test evidence. Its suggestion that the footer provides secondary internal navigation is inaccurate; the observed footer has social links only.
- Qwen GPU: task 83a752040b7e4581b866f9dbece478dd failed because SSH timed out. No review is attributed to it. Its review coverage was handled by Codex and AIPass.
- Claude's initial request to run in the project directory was denied by configured allowed_workspaces. The review proceeded in the default isolated directory with explicitly supplied source excerpts; no allowlist was changed.

No application source was changed. Next step: fix catalog search and reset behavior, then sharing and mobile identity/navigation, before visual polish.
