# Feedbot Design System Context

## System Overview

Feedbot is a **brand perception intelligence platform**, not a generic sentiment analysis SaaS.

It combines:

- A custom-trained NLP model (FastAPI backend, PostgreSQL storage)
- Client-side and server-side model usage
- A Next.js frontend with three distinct cognitive surfaces:
  1. Landing / Narrative (marketing & explanation)
  2. Analyze / Experimentation (model querying)
  3. Dashboard / Interpretation (decision support)

The UI must feel **credible, analytical, and research-oriented**, similar to tools used by analysts, researchers, and decision-makers.

---

## Core Design Philosophy (Non-Negotiable)

1. **Signal over decoration**

   - Every UI element must justify its existence.
   - No visual noise, no gratuitous animations.

2. **Information hierarchy first**

   - Typography, spacing, and layout communicate meaning before color.
   - Users should predict where information appears.

3. **Visible cognition**

   - The system should show how it thinks, not just what it outputs.
   - Uncertainty, assumptions, and confidence must be explicit.

4. **Mode-aware design**
   - Different pages support different mental modes.
   - Visual language is consistent, but behavior and emphasis change.

---

## Cognitive Modes & UI Behavior

### 1. Narrative Mode (Landing Page)

Purpose:

- Orient users
- Build trust
- Explain the system’s value

UI Characteristics:

- Large serif headlines
- Generous whitespace
- Editorial layout (white-paper inspired)
- Minimal interaction

Tone:

- Authoritative
- Calm
- Explanatory

Avoid:

- Excessive metrics
- Complex controls
- Dense tables

---

### 2. Experimentation Mode (Analyze Page)

Purpose:

- Let users query the model
- Encourage careful experimentation
- Support repeatable inference

UI Characteristics:

- Clear input → process → output flow
- Explicit input labeling
- Visible inference state (loading, running, complete)
- Model metadata always visible (version, domain, confidence)

Tone:

- Technical
- Neutral
- Transparent

Avoid:

- Chat-like conversational UI
- Hidden assumptions
- Overly friendly copy

---

### 3. Interpretation Mode (Dashboard)

Purpose:

- Help users understand trends
- Support decisions
- Reduce cognitive load

UI Characteristics:

- Dense but readable layout
- Consistent card grammar
- Stable metric placement
- Trend context over raw numbers

Tone:

- Analytical
- Objective
- Conservative

Avoid:

- Flashy visuals
- Decorative gradients
- Overuse of color

---

## Typography System

Typography is the backbone of the design system.

- Display / Headings:

  - Serif (e.g., Playfair Display, Merriweather)
  - Used only for page titles and major section headers

- Body / UI Text:

  - Sans-serif (e.g., Inter, IBM Plex Sans)
  - Used for all readable content and metrics

- Monospace:
  - Used for model IDs, timestamps, confidence values, system metrics

Hierarchy (approximate):

- H1: 48–64px (Narrative titles)
- H2: 28–36px (Section headers)
- H3: 18–22px (Card titles)
- Body: 14–16px
- Caption / Meta: 12–13px

---

## Color System

Color is semantic, not decorative.

- Base palette: neutral grays and off-whites
- Accent color (single): muted indigo or blue
- Semantic colors:
  - Positive: green/teal
  - Negative: red
  - Neutral/mixed: amber

Rules:

- Never use color without meaning
- Do not encode critical information using color alone
- Landing pages may use slightly higher saturation than dashboards

---

## Component Grammar

All components must feel like part of the same system.

Core components:

- Card (base unit)
  - Variants: Hero, Insight, Experiment, Status
- Metric Row
- Section Header
- Annotation / Footnote
- Confidence Indicator
- Model Card (mandatory in experimentation mode)

Rules:

- Consistent padding (≈24px)
- Rounded corners (8–12px)
- Subtle shadows only
- Alignment > decoration

---

## Interaction Principles

- Prefer clarity over delight
- Deliberate friction is acceptable in experimentation
- Loading states should communicate “thinking”, not just waiting
- Animations must serve orientation, not aesthetics

Avoid:

- Bouncy transitions
- Infinite motion
- Attention-stealing effects

---

## Language & Microcopy

Write like a research assistant, not a chatbot.

Good:

- “Inference running…”
- “Low confidence due to limited context”
- “Based on 2,847 samples”

Bad:

- “Here’s what we found!”
- “AI magic ✨”
- Overly conversational tone

---

## What This System Is NOT

- Not a social app
- Not a chat-first AI product
- Not a flashy startup dashboard
- Not a PDF-style academic clone

It is an **intelligence interface**.

---

## References (Mental Models, Not Visual Copying)

- Research tools (Jupyter, TensorBoard)
- Intelligence dashboards (Palantir-style systems)
- Editorial data design (Financial Times, The Economist)
- Analytics platforms (Grafana, Amplitude — structure only)

---

## Agent Behavior Rules

When generating UI, components, or code:

- Always ask: “Which cognitive mode is this for?”
- Default to conservative, information-dense layouts
- Never introduce design elements without purpose
- Maintain consistency across pages

If unsure, choose:

> Less visual flair, more clarity.

End of context.
