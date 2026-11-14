# Design options · gailfroelicher (staging /gail)

All options are **off by default**. Each one is a flag in `flags.js` and a CSS class on `<html>`.

- **Turn one on for everyone:** set the flag to `true` in `flags.js`.
- **Preview without changing code:** add `?opt=` to any URL, for example `/gail/?opt=cursor,texture`.
  - `?opt=all` turns everything on except the boardroom story.
  - `?opt=none` resets.
- **Review switcher:** `?review` shows a small panel with checkboxes in the corner.
- Preview choices are remembered for the browser session.
- Under `prefers-reduced-motion`, every motion option stays still.

## Options (switchable)

| # | Option | Flag | CSS class | Where it appears |
|---|---|---|---|---|
| 10 | Soft circle that follows the cursor with a slight lag | `cursor` | `opt-cursor` | All pages, desktop with mouse only |
| 11 | "Sit back": text block leans forward slightly, then settles back | `sitBack` | `opt-sitback` | Home: quote "I don't tell you what to do"; Case study: closing statement |
| 12 | Network of people, connections draw in on scroll and end at the quiet $20M sentence | `network` | `opt-network` | Home: case section; Case study: "The result" |
| 13 | Subtle paper or linen texture | `texture` | `opt-texture` | Page background, all pages |
| 14 | One object photo in the hero instead of type only (placeholder image `img/object-placeholder.svg`) | `heroObject` | `opt-heroobject` | Home hero, desktop only |
| 15 | The K of the wordmark moves almost imperceptibly on load | `kMotion` | `opt-k` | Header wordmark, all pages |
| 16 | Mobile: one idea per screen with scroll snapping, plus reading-time markers ("90 seconds") | `mobileSnap` | `opt-snap` | All pages, below 900px |
| 17 | Faint words ("Board meeting", "Forecast") drift in the hero and settle toward the headline. Moved from "always on" to an option after review | `heroWords` | `opt-words` | Home hero |

## Content flag

| Content | Flag | CSS class | Where it appears |
|---|---|---|---|
| Fortune 50 boardroom story | `boardroomStory` | `opt-boardroom` | Home, after "Presence". **Keep false until Gail approves it.** Preview with `?opt=boardroomStory`. |

## Always on (part of the design)

1. **Hero:** the headline fades in on load. The drifting words are now option 17.
2. **Breathing:** the hero background shifts almost invisibly at six breaths a minute. The CSS is `@keyframes breathe`.
3. **Notice. Pause. Choose.:** three words light up one after another on scroll, joined by hairlines. It appears on Home and How I work, in the Presence section. It replaces the earlier pulse line.
4. **The turn:** "What I need." changes to "What matters to you?". It appears in the Home case section and on the Case study page.
5. **Nine-month line:** on How I work the section is pinned while you scroll. The line draws month by month, a dot travels along it and one phase shows at a time. In months 7 to 8 a dashed line shows where old habits would pull, and the real line holds. On Home it is the shorter version. Teal to orange.
6. **Seat dots:** they fill in one after another, and one stays hollow. They appear in the waitlist section on Home and How I work.
7. **Application:** one question per screen with a thin progress line. It lives at `/gail/apply/`.
8. **Editorial details:** Roman numerals, small caps, hairline rules, and margin notes with short quotes from Gail.
9. **Hover and fade-in:** hover states are slow, and content fades in after a short pause.

## Form

`/gail/apply/` submits to **Netlify Forms** (form name `waitlist`, honeypot `website`). It then redirects to `/gail/thank-you/`.

- On localhost the form skips the submission and goes straight to the thank-you page.
- Before launch:
  - Check that form detection is on in Netlify.
  - Set up the email notification to Gail.
