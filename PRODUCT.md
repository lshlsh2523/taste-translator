# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Korean consumers in their 20s making their first move from mass-market fashion into luxury. They can describe the look they want in plain, everyday language but don't know the industry vocabulary for it, so their searches (on retailer sites, search engines) fail to surface what they mean.

## Product Purpose

The user types a free-text description of a vibe/aesthetic they're after. The product translates that description into:

1. Taste vocabulary cards naming the aesthetic.
2. The corresponding luxury industry term with its origin (e.g. satchel, hobo, slouch).
3. Actual MCM products that match, pulled from a fixed catalogue — never invented.

Success ends at a shareable result card with a link to the real product page. The product succeeds when a user who couldn't search for what they wanted walks away with the correct term and a real product to look at.

## Positioning

An LLM maps free-text taste descriptions onto luxury industry vocabulary, but product recommendations are selected only from a fixed, hand-tagged MCM catalogue — never generated. Testing showed unconstrained LLMs invent products that don't exist; this product says "no match" instead, and offers an adjacent taste card. The edge is the constraint on the model, not the model itself. A copycat that lets the LLM freely generate product suggestions reproduces the failure mode this product was built to avoid.

## Operating Context

- Input is free-text (Korean), describing a vibe/aesthetic rather than a product category or brand term.
- Output is a result card: taste vocabulary, industry term + origin, and matched product(s) with a link to the real product page.
- Results are meant to be shareable.
- "No matching product" is a legitimate, expected result state — not an error state — and should be designed for directly rather than treated as an edge case bolted on later.

## Capabilities and Constraints

- UI copy is entirely in Korean. Type scale and line-height must be tuned for Hangul, not adapted from Latin defaults.
- Product data comes from a fixed JSON catalogue of ~657 MCM items. Confirmed fields today: department, category, subcategory, name, SKU, colour count, product URL, image URL.
- Price, material, size, and description fields are not yet collected in the catalogue itself. Layouts must render correctly with these fields absent — omit the row entirely, never show placeholder text. Each result links out to the product's real MCM page, where the user can see this detail directly.
- Product images are remote URLs and may 404; every image slot needs a designed fallback state.
- LLM output is constrained to the fixed catalogue; when no catalogue item matches, the product must show a "no match" state plus an adjacent taste card, never a fabricated product.

## Evidence on Hand

- The full ~657-item MCM catalogue is in the repository (`data/mcm_full_catalog_pilot.csv`) and is what the matching pipeline runs against — no fabricated or placeholder products. The product is live and deployed, running the real two-stage Gemini pipeline against this catalogue end to end.

## Product Principles

1. Never invent what isn't in the catalogue — a confident "no match" beats a plausible fabrication.
2. Design for missing data as the normal case, not the exception (missing fields, 404 images, no-match results).
3. Bridge vocabulary, don't gatekeep it — the product's job is to hand the user the correct term and a real product, not to perform luxury-industry authority over them.
4. Korean-first typography and layout; nothing adapted after the fact from a Latin default.
5. Every result should be shareable on its own — the result card is a first-class artifact, not just an in-app state.

## Accessibility & Inclusion

No product-specific accessibility requirement has been established yet beyond Korean-language, Hangul-tuned typography.
