# CloScam design direction

Name of the direction: Junction.

CloScam should feel like a serious training product, the way a good operations tool feels, not like a generated landing page. The references below were read for structure, type, spacing, and motion. Nothing here copies their branding.

## References

- TryHackMe, via the learning-path case study by Arash Lowni (https://arashlowni.com/case-studies/tryhackme.html). Learners dropped at the second and third task when a room did not show progress. The useful pattern is a room with a visible task state, not a mascot and not a celebration screen.
- Linear's public interface, including the redesign notes (https://linear.app/now/how-we-redesigned-the-linear-ui) and the Method page (https://linear.app/method), plus measurements published by independent reviews of linear.app (https://designlang.app/design-system/linear and https://www.livery.site/k/linear-app, observed 2026). Dense type, a 4 and 8 pixel spacing rhythm, hairline borders, sentence case, and motion around 100 to 160 milliseconds with an ease-out curve. A serif appears once, as an editorial exception, not as a theme.
- Vercel (https://vercel.com). Near-black surfaces, one accent, the interface itself is the object. No illustrated hero doing the explaining.
- Stripe (https://stripe.com). Visuals are specific to the action. Large brand gradients stay in the brand, not in every card.
- Bruno Simon (https://bruno-simon.com). The 3D scene is a place with rules. You use it. It is not a backdrop behind a slogan.
- React Three Fiber (https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) and drei (https://drei.pmnd.rs). Lights, camera, and a few deliberate materials do more than extra polygons. Helpers are not a visual style.

## Principles we will follow

1. One palette. Warm near-black, warm paper text, one amber accent (the street lamp and the kiosk bulb), and a flat warning red used only when money leaves or a code is given. No purple, no blue neon, no gradient meshes, no glass panels.
2. One type system. IBM Plex Sans for the interface, IBM Plex Serif for the lesson sentence only, IBM Plex Mono for amounts, numbers, and fake domains. All three are SIL Open Font License 1.1.
3. An 8 pixel grid. Spacing steps are 8, 16, 24, 32, 48. Corners on UI are 6 or 8 pixels. The phone bezel is the only large radius, because it is hardware.
4. Motion is a change of state. 160 to 240 milliseconds, cubic-bezier(0.2, 0, 0, 1). Messages move 6 pixels, not a bounce. `prefers-reduced-motion` removes the delay and the transform.
5. 3D is the junction you stand at: a phone on a plinth, a stall with a counter and a sign, and a booth with a back wall and a handset. One lamp explains the amber. Fixed camera, no orbit showcase, no floating labels, no downloaded model pack. The geometry is original. A flat elevation of the same three objects is the low-graphics view, and it is a real view, not an error state.
6. The room is the phone. Progress is the thread still on screen, then the notes under it. We do not flip to a new page to tell you what happened.
7. Copy is specific. Ranks are New, Spotter, Careful, Sharp, Closer. No slogans about potential, empowerment, or unlocking.

## What we will not do

Purple or blue neon gradients, glassmorphism, blobs, sparkles, emoji as icons, robot or brain imagery, dumped low-poly kits, bouncy springs, a centered marketing hero, and filler copy.
