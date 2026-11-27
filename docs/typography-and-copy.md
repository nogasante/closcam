# Typography and copy

These rules govern every screen. They come from the sources below, then from what Linear, Stripe, Apple, Duolingo, and TryHackMe actually ship: short headings, verb labels, and almost no helper text.

## Sources

- Refactoring UI (Wathan and Schoger). Hierarchy comes from weight and colour, not from a new size. A handful of sizes is enough. Line length stays in a readable measure.
- Apple Human Interface Guidelines, Typography and Writing. Say the action. Use the product’s voice, not a lecture. Labels are short enough to scan.
- Material 3 type scale. Roles, not a new size per sentence: display, headline, title, body, label.
- Matthew Butterick, Practical Typography. Body line length about 45 to 75 characters. Line height grows as the size shrinks. Tighten letter-spacing on large type. Open it slightly on small caps, which this app does not use.
- Nielsen Norman Group, How users read on the web, and their microcopy notes. People scan. Front-load the word that matters. A control’s label should say what it does.
- GOV.UK content design and writing for interfaces. Plain words. One idea. Cut any sentence that does not help the next action.
- Mailchimp Content Style Guide. Buttons are verb plus object. Sentence case. Tone stays calm when the stakes are high.

## Type scale

Five sizes. Three weights: 400, 700, 800.

| Role | Size | Weight | Line height | Letter-spacing |
| --- | --- | --- | --- | --- |
| Display | 2.5rem | 800 | 1.1 | -0.03em |
| Title | 1.75rem | 800 | 1.2 | -0.02em |
| Heading | 1.25rem | 700 | 1.3 | -0.015em |
| Body | 1rem | 400 | 1.5 | 0 |
| Small | 0.875rem | 400 | 1.45 | 0 |

Do not add a sixth size to make a label feel special. Use small plus a quieter colour.

Numbers, scores, and times use tabular figures (`font-variant-numeric: tabular-nums`).

## Measure

Body text wraps by 65 characters (inside the 45 to 75 range). Headings wrap by about 20 characters. A full-bleed phone thread is the exception: the message is the content, and the screen is the measure.

## Copy

- Sentence case everywhere, including buttons and headings.
- A button label is a verb plus an object: "Start training", "Send report", "Open checklist".
- No helper text unless the line prevents a mistake (a real PIN, a real payment, a code that must not be forwarded).
- One idea on a screen. The next action is the idea.
- A heading is about five words. The product tagline on the landing page is the one longer line.
- Debrief points are short bullets. Do not replay the whole thread under them.
- Do not repeat a fact in a heading, a paragraph, and a label.
- No em dashes.

## How a line fails

If the person can act without the line, delete it.
