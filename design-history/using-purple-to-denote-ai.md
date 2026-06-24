---
title: "Using purple to denote AI-generated content"
date: 2026-06-03
authors:
  - name: Lydia Teebay & Nick Hagan
tags:
  - case summary
  - AI transparency
  - design patterns
description: Why and how we chose purple to highlight AI involvement

---

# Using purple to denote AI-generated content

## Why we did this work

The case summary tool surfaces two distinct types of information side by side: data retrieved directly from the case management system (charges, dates, defendant names), and content synthesised or interpreted by AI (narrative summaries, materials analysis, evidential assessments).

Advocates and reviewing lawyers use this tool to prepare for and conduct prosecutions. The decisions they make are high-stakes. We needed users to be able to tell, at a glance, which content they were reading — not because AI content is untrustworthy, but because it warrants a different kind of engagement. A charge listed in the case record is authoritative; a narrative summary constructed from that record is a useful starting point that still requires professional judgement.

There was no existing GOV.UK Design System pattern for distinguishing AI output from authoritative data. We needed to design one.

If we got this wrong in either direction — making AI content look indistinguishable from the record, or making it look so alarming that users ignored it — we would undermine the tool's value.

---

## How we approached it

We worked through four prototype iterations, tightening the visual language each time.

The GOV.UK colour palette gave us some constraints to work with. Yellow already carries a "warning" meaning across GOV.UK tags and notifications. Blue signals "information" or "selected state". Using either for AI content risked inheriting those existing associations in ways we didn't want.

Purple stood out as the right choice precisely because it carries no pre-existing meaning in the GOV.UK Design System. It is distinctive enough to be noticed, and neutral enough not to imply urgency or alarm. The Home Office has used purple in some AI-adjacent internal tooling, which gave us some confidence it had precedent in government digital contexts.

We also needed to decide on a container shape for the AI signal. We tried three approaches in parallel during v3:

1. A summary card with a solid purple header bar and white text — bold but it overpowered the content it was supposed to frame
2. A summary card with a purple top border only — cleaner, but easy to miss and hard to distinguish from the standard card
3. A content panel with a purple left border and a light lavender background tint (`#f6f1f8`) — present without being dominant

Option 3 became the settled pattern.

---

## What we tested and learned

### v1 — A starting point with no visual signal

The first version used a phase banner with an "AI" tag and an inset text disclaimer at the top of the page. The summary cards themselves had no visual distinction — AI-generated content and official case data looked identical.

The limitation was obvious in review: the disclaimer appeared once, at page load, while the AI content was spread throughout. A user who scrolled past the top of the page had no ongoing signal about what they were reading. The code for this version even included a comment on the AI tag: *"make a diff colour"* — an acknowledgement that the design wasn't finished.

### v2 — Yellow tag and first use of purple

We introduced two things in v2. First, user segmentation: an onboarding screen where users identified their role (advocate or reviewing lawyer) and their timing context (in court now, trial in two weeks, early review). Second, we upgraded the disclaimer to a cookie-banner-style interstitial — a "mindful friction" moment with an "I understand" button before users could access the case summary.

Within the content, we replaced the phase banner approach with a yellow "AI generated" tag placed in the title of summary cards containing AI output. This was more contextual, but the yellow tag created an unintended problem: it read as a caution signal, suggesting AI content was potentially dangerous rather than simply different. Users might reasonably interpret "AI generated" next to content as a reason to be sceptical, rather than as a neutral label.

The v2 case header also introduced the first explicit use of purple: a dashed purple outline on the "Strong (AI assessment)" case strength tag. This was exploratory — purple used as a border accent rather than a fill — but it marked the point at which we started thinking of purple as the AI colour.

### v3 — Purple as an intentional design language

In v3 we made the decision deliberately. The AI panel style settled on a left border in purple (`#732282`) with a lavender background tint, and an inline label reading "(AI constructed)" in purple text. We introduced a CSS class — `.app-ai-data-point` — to apply the pattern consistently.

We also started separating AI content more structurally. The charges page gained an "AI assessed charges" tab alongside the standard charges tab, making it possible to move between the official record and the AI interpretation without them bleeding into each other.

The cookie-banner interstitial was dropped from this version. The rationale was that in-card labelling did the job better: the signal was persistent and contextual, rather than a one-time gate that users would click through and forget.

### v4 — A codified system

By v4, the purple pattern was formalised in the component SCSS. Named classes (`app-material-item__ai`, `app-material-item__ai-label`, `app-materials-pane__detail-ai`) replaced inline styles, making the pattern reusable and easier to maintain.

The offence narrative card settled on a purple top border (`border-top: 4px solid #732282`) combined with the lavender background, with a yellow "AI summary" tag in the card header. We chose a top border for this card, rather than a left border, because it needed to sit at the same visual weight as the other summary cards on the page without becoming a visually disconnected aside.

The materials section introduced conditional colour for AI analysis outcomes: purple and lavender when AI had flagged a potential issue (missing material); green and mint when the AI analysis found everything present. This extended the AI pattern into an analytical function, not just a labelling one.

We also clarified the scope of the pattern: purple applies only to content that AI has synthesised, constructed, or interpreted. Data retrieved directly from the case record — charge titles, timeline events, defendant names, dates — remains in standard GOV.UK styling. The colour is a signal about the nature of the content, not about the tool itself.

Finally, we moved the disclaimer text inside each AI card, as a footer line: *"This has been summarised by AI from case information. It is not an official legal record."* This keeps the caveat close to the content it describes, rather than separated from it at the top of the page.

---

## The final design patterns

### Purple AI content panel

Used for any content that AI has synthesised, constructed, or interpreted from the case record — including narrative summaries, points to prove case stories, and materials analysis.

- Top border or left border: `4px solid #732282`
- Background: `#f6f1f8` (light lavender tint)
- Label: "AI summary" as a yellow GOV.UK tag, or "(AI constructed)" as inline purple text
- Footer disclaimer inside the panel: "This has been summarised by AI from case information. It is not an official legal record."

CSS classes: `.app-ai-data-point`, `.app-material-item__ai`, `.app-material-item__ai-label`

### Conditional AI analysis colour

Used where AI has assessed a situation and returned a verdict — currently in the materials section.

- Issue flagged: purple border (`#732282`) + lavender background (`#f6f1f8`)
- All clear: green border (`#00703c`) + mint background (`#f3fff5`)

### When not to use purple

Do not apply the purple pattern to factual data retrieved from the case management system. Charges, timeline events, defendant details, and dates are authoritative records and should use standard GOV.UK component styling.

---

## What we will do next

**Vocabulary consistency.** The current prototypes use three different labels — "AI generated", "AI constructed", and "AI summary" — across versions. Before building this into a production component, we need to settle on a single term. "AI summary" is the most recent and most specific; we plan to standardise on this.

**Accessibility checks.** We need to verify that purple (`#732282`) on white and on the lavender tint (`#f6f1f8`) both meet WCAG 2.2 AA contrast requirements, particularly for body text-weight labels.

**User research.** We have not yet tested whether purple reads as an AI signal to users, or whether it carries any unintended associations. This needs to be validated with advocates and reviewing lawyers before the pattern is treated as settled.

**Component codification.** The pattern currently lives in version-specific SCSS and inline styles. If it continues to prove useful, it should be extracted into a shared CPS component, documented with usage guidance, and made available across the AI prototypes programme.
