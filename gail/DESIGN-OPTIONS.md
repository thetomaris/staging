# Design options · gailfroelicher (staging /gail)

All options are **off by default**. Each one is a flag in `flags.js` and a CSS class on `<html>`.

- **Turn one on for everyone:** set the flag to `true` in `flags.js`.
- **Preview without changing code:** add `?opt=` to any URL, for example `/gail/?opt=cursor,texture`.
  - `?opt=all` turns everything on except the boardroom story.
  - `?opt=none` resets.
- **Review switcher:** `?review` shows a small panel with checkboxes in the corner. Close it with the × or with `?review=0`.
- Preview choices are remembered for the browser session.
- Under `prefers-reduced-motion`, every motion option stays still.

## Options (switchable)

| # | Option | Flag | CSS class | Where it appears |
|---|---|---|---|---|
| 10 | Soft circle that follows the cursor with a slight lag | `cursor` | `opt-cursor` | All pages, desktop with mouse only |
| 11 | "Sit back": text block leans forward slightly, then settles back | `sitBack` | `opt-sitback` | Home: statement "I don't tell you what to do"; Case study: closing statement |
| 12 | Network of people, connections draw in on scroll and end at the quiet $20M sentence | `network` | `opt-network` | Case study: "The result" (removed from Home: the case is about the mindset shift, not networking) |
| 13 | Subtle paper or linen texture | `texture` | `opt-texture` | Page background, all pages |
| 14 | One object photo in the hero instead of type only (placeholder image `img/object-placeholder.svg`) | `heroObject` | `opt-heroobject` | Home hero, desktop only |
| 15 | The K of the wordmark moves almost imperceptibly on load | `kMotion` | `opt-k` | Header wordmark, all pages |
| 16 | Mobile: one idea per screen with scroll snapping, plus reading-time markers ("90 seconds") | `mobileSnap` | `opt-snap` | All pages, below 900px |
| 17 | Faint words ("Board meeting", "Forecast") drift in the hero and settle toward the headline. Moved from "always on" to an option after review | `heroWords` | `opt-words` | Home hero |

## Content flag

| Content | Flag | CSS class | Where it appears |
|---|---|---|---|
| Fortune 50 boardroom story | `boardroomStory` | `opt-boardroom` | Home, after "In the room". **Keep false until Gail approves it.** Preview with `?opt=boardroomStory`. |

## Always on (part of the design)

1. **Hero:** the headline fades in on load. The drifting words are now option 17.
2. **Breathing:** the hero background shifts almost invisibly at six breaths a minute. The CSS is `@keyframes breathe`.
3. **Notice. Pause. Choose.:** three words light up one after another on scroll, joined by hairlines. Under "Pause." a thin bracket opens from the middle: the space before you react (draft, Tom to review). It appears on Home and How I work, in the "In the room" section. It replaces the earlier pulse line.
4. **The turn:** "What I need." changes to "What matters to you?". It appears in the Home case section and on the Case study page.
5. **Nine-month line:** on How I work the section is pinned while you scroll. The line draws month by month, a dot travels along it and one phase shows at a time. In months 7 to 8 a dashed line shows where old habits would pull, and the real line holds. On Home it is the shorter version. Teal to orange.
6. **Seat dots:** they fill in one after another, and one stays hollow. They appear in the waitlist section on Home and How I work.
7. **Application:** two screens: first the situation, then the first conversation, the last 360 and contact details. Thin progress line. It lives at `/gail/apply/`. No sponsor question (almost every engagement is company sponsored).
8. **Editorial details:** Roman numerals, small caps, hairline rules, and short margin notes. No quotes attributed to Gail on her own site; client quotes are welcome.
9. **Hover and fade-in:** hover states are slow, and content fades in after a short pause.

## Form

`/gail/apply/` submits to **Netlify Forms** (form name `waitlist`, honeypot `website`). It then redirects to `/gail/thank-you/`.

- On localhost the form skips the submission and goes straight to the thank-you page.
- Form detection is on in Netlify (project mcpstaging).
- Before launch: set up the email notification to Gail (Forms, Form notifications, Email, form `waitlist`).

## Booking link

Gail's Calendly: https://calendly.com/kineticinsights/intro (event "Executive Introduction", 30 minutes, Zoom).

- The questionnaire comes first. Only after submitting does the thank-you page show the booking calendar (section `#book`).
- The calendar is prefilled with name and email from the questionnaire. The answers go along as `a1`; they only show in Calendly if Gail's event has a first custom question.
- Calendly paid plan (about $10 a month): reminders, and a redirect back to the website after booking.
- Redirect target once the plan is on: `/gail/booked/` (on staging: https://staging.mycoachpath.com/gail/booked/). Calendly: Executive Introduction, Notifications and automations, Confirmation page, Redirect to an external site.

### Calendly event description (for Gail to paste)

> Thank you for putting your name on my list. Choose a date and a time that work for you. In 30 minutes we look at where you are and whether we are a fit. A Zoom link will be sent to your email.
