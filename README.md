# Lettermen Rack

A fan-focused affiliate site that helps college sports fans find officially licensed apparel. Visitors pick a school, a sport, and a category, and get pointed to the matching product — no digging through dozens of individual team stores.

**Live site:** lettermenrack.com (domain pointed via Vercel, DNS managed in GoDaddy)

## What this is

- Static HTML/CSS/JS site, no framework, no build step
- Hosted on Vercel, auto-deploys on every push to `main`
- Affiliate model: links out to Fanatics (via the Impact.com affiliate network) for actual purchases — this site holds no inventory and processes no transactions itself

## Files

| File | Purpose |
|---|---|
| `index.html` | Main site — hero, search-based school/sport/category picker, how-it-works, school directory, waitlist signup |
| `privacy.html` | Privacy policy |
| `terms.html` | Terms of use |
| `contact.html` | Contact page (denny@theblackshirts.com) |

## The picker

`index.html` contains a `schools` array (~80 schools across SEC, Big Ten, ACC, Big 12, Mountain West, American, Sun Belt, Ivy League, and independents) with name, conference/nickname, and primary color. The school step uses a live search input rather than a static button grid, since the list is too large to show all at once — matches render as you type, with the first 10 shown by default.

Sports and categories are small, fixed lists in the same script block.

## Adding more schools

Add an entry to the `schools` array in `index.html`:
```js
{ name:"School Name", conf:"Conference · Nickname", color:"#HEXCODE" },
```

## Status

- Site is live and functional
- "Find Gear" currently routes to the waitlist signup — real Fanatics affiliate product links aren't wired in yet (pending Fanatics/Impact approval)
- Fanatics affiliate application is in review via Impact.com; the site's ownership-verification meta tag will need updating in `index.html`'s `<head>` once Impact issues a new token for lettermenrack.com

## Naming note

This project was originally built and briefly live as "B1G Apparel" on b1gapparel.com. That name was dropped because "B1G" is a federally registered Big Ten Conference trademark covering apparel — using it as the site's own brand name risked a rejected Fanatics application (or worse). "Lettermen Rack" and the broadened multi-conference scope avoid that issue: the name doesn't borrow any specific school or conference's protected branding.
