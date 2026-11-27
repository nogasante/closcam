# CloScam design rules

These rules govern every screen. They come from practice, not from a mood board.

## Sources

- Adam Wathan and Steve Schoger, Refactoring UI. Hierarchy is made by de-emphasising, not by adding more labels. Spacing does the work that borders pretend to do. Use fewer colours, and spend them on meaning. Secondary text is quieter, not a new heading.
- Laws of UX. Hick's law: more visible choices slow the decision. Cognitive load: show only what this step needs. Progressive disclosure: the brief, the flag log, and the score wait behind a tap until the person asks.
- Material Design 3 and the Apple Human Interface Guidelines. One primary action in the thumb zone. Navigation chrome stays out of the content. Incoming calls are a full-screen state, not a form. System patterns (a chat header, a heads-up notification, round answer and decline) beat invented panels.
- Reference screens, studied for structure rather than copied: WhatsApp chats (header, wallpaper, bubbles, composer), Android Messages heads-up notifications, the phone dialer incoming-call screen, Duolingo's one-task lesson, TryHackMe room pages (a task, then the work, progress that does not shout). Public notes on TryHackMe's dark UI use a navy field and one green accent, not a stack of outlined cards.

## Rules

1. One primary action per screen. A second action is a text link or an icon, not another filled button of the same weight.
2. At most two type sizes inside a card: a title, and the rest. No eyebrow label plus a title plus a tag plus a status line.
3. Show only what the current step needs. A chat shows the thread. The decision appears when the thread is done. The debrief appears after the decision.
4. Hide the brief, the flag log, the balance, and the score behind one info control. Do not repeat them in the header, a banner, and a side strip.
5. Generous whitespace. Related items sit close. Unrelated items get a full step of space (24px or more). Do not separate siblings with boxes.
6. No stacked bordered boxes. A border or a shadow is for one object (the phone, a card on the map). Lists inside that object have no extra frames.
7. Secondary text uses lower contrast, not a new label. "online" under a name is enough. Do not add the word "Status".
8. Colour is scarce. Gold is the one action. Green is a correct beat or progress. Red is money leaving, a code given, or decline. Everything else is navy and muted text.
9. On a phone, the room is the app. No site header and no full-width warning bar. A single word, Simulation, is enough.
10. Motion explains a change: a message arrives, a notification drops, a card lifts a few pixels. It does not bounce, and it stops when reduced motion is on.

## Chosen style

Glass, applied with a limit. Three studies live at `/styles`. Soft hardware sinks the type into the same colour as the surface. Flat is clear and the least impressive. Glass keeps large type, one gold action, and a translucent layer, which is the Apple brief. The chat itself stays a solid dark thread so the messages stay readable. Frosted glass is for the nav and the page, not for every bubble.

## How a screen fails the audit

If you can remove a label and the screen is clearer, the label goes. If two controls do the same thing, one goes. If a fact appears twice, one copy goes.
