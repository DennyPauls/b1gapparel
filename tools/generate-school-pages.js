// Generates /schools/[school]/index.html, /schools/[school]/[sport]/index.html and sitemap.xml.
// Run from the repo root:  node tools/generate-school-pages.js
// Output is plain static HTML (no build step on Vercel). All page copy lives in this file.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const HOST = 'https://www.lettermenrack.com'; // Vercel primary host; apex 308-redirects here
const LASTMOD = new Date().toISOString().slice(0, 10);

const SPORTS = [
  { slug: 'football',   name: 'Football',   items: 'jerseys, hoodies and game-day tees' },
  { slug: 'basketball', name: 'Basketball', items: 'jerseys, hoodies and warm-up tees' },
  { slug: 'baseball',   name: 'Baseball',   items: 'caps, jerseys and tees' },
  { slug: 'softball',   name: 'Softball',   items: 'tees, caps and jerseys' },
  { slug: 'hockey',     name: 'Hockey',     items: 'jerseys, hoodies and knit hats' },
  { slug: 'soccer',     name: 'Soccer',     items: 'scarves, tees and jerseys' },
  { slug: 'volleyball', name: 'Volleyball', items: 'tees, hoodies and caps' },
  { slug: 'wrestling',  name: 'Wrestling',  items: 'tees, hoodies and caps' },
];

// Generic gear sentences per sport; 3 variants, chosen by school index so neighbours differ.
// {c} = color phrase ("scarlet and cream"), {n} = nickname.
const GEAR = {
  football: [
    'Most shoppers start with a {n} jersey or a {c} hoodie for cooler kickoffs, then add a hat or a scarf.',
    'Game-day looks usually mean a jersey or tee in {c}, with a heavier layer for late-season kickoffs.',
    'A {c} hoodie and a good hat cover most of the season, with a jersey for anyone who likes to match the team.',
  ],
  basketball: [
    'Think {c} jerseys and warm-up style tees, plus hoodies and hats for cold-weather arena nights.',
    'Basketball fans typically look for {n} jerseys, shooting shirts and a cozy hoodie for winter games.',
    'A {c} hoodie is the winter staple here, with jerseys and caps rounding out a game-night outfit.',
  ],
  baseball: [
    'Caps come first for most baseball shoppers, followed by jerseys, lightweight tees and quarter-zips for early-season games.',
    'Baseball season calls for {c} caps, jerseys and tees, with a pullover for the cooler spring dates.',
    'A {n} cap is the easy entry point, and tees and light layers cover the rest of the spring schedule.',
  ],
  softball: [
    'Softball fans usually shop for {n} tees, caps and jerseys, plus a hoodie for cool evening games.',
    'Expect {c} tees, visors and hats, along with jerseys and light layers for spring doubleheaders.',
    'Tees and caps in {c} are the go-to, with a hoodie for breezy days at the ballpark.',
  ],
  hockey: [
    'Hockey shoppers lean toward jerseys, warm hoodies and knit hats in {c}, since rinks run cold.',
    'For hockey, that means {n} jerseys, fleece and beanies, because arena seats stay chilly.',
    'Layers matter at the rink, so hoodies and knit hats in {c} are as popular as jerseys.',
  ],
  soccer: [
    'Soccer fans tend to want {c} scarves, tees and jerseys, along with hats and hoodies for fall matches.',
    'Soccer gear here usually means jerseys, scarves and casual tees in {c}, with a hoodie for evening matches.',
    'A {n} scarf and a comfortable tee cover most matchdays, with a light layer for cool evenings.',
  ],
  volleyball: [
    'Volleyball shoppers usually look for {n} tees, hoodies and hats, plus jerseys for fans who like to match the team.',
    'Volleyball fans often pick up {c} tees, warm-up style hoodies and caps for indoor matches.',
    'Comfortable tees and hoodies in {c} are the usual picks for a night in the gym.',
  ],
  wrestling: [
    'Wrestling fans usually favor {n} tees, hoodies and hats, with {c} pieces they can wear all season.',
    'Expect {c} tees, pullovers and caps built for chilly gym seating, plus everyday {n} basics.',
    'Tees, hoodies and caps in {c} cover most dual-meet weekends.',
  ],
};

const CLOSERS = [
  'Tap the button below to search {s} {sp} listings on Fanatics.',
  'The Shop button opens Fanatics in a new tab with a {s} {sp} search ready to go.',
  'Want more than one sport? Head back to the {s} page for the rest.',
  'Sizes, pricing and checkout are handled by Fanatics once you click through.',
];

const SCHOOLS = [
  {
    slug: 'nebraska', name: 'Nebraska', nickname: 'Cornhuskers', conf: 'Big Ten',
    accent: '#E41C38', onAccent: '#FBF7ED', colors: 'scarlet and cream',
    hubMeta: 'Nebraska Cornhuskers gear for football, volleyball, wrestling and more. Scarlet-and-cream jerseys, hoodies and hats, with shop links to Fanatics.',
    hubIntro: [
      'Nebraska fans have a way of turning an entire state scarlet on game day, and the gear shows up well beyond Lincoln.',
      'This page collects Cornhuskers jerseys, hoodies, hats and accessories in one place, with Big Red gear for every season, not just football.',
      'Volleyball, wrestling and baseball crowds shop here too, so each sport below has its own page.',
      'Lettermen Rack covers dozens of schools, which makes it easy to shop for a Husker and the rival in the family in the same visit.',
      'The Shop button hands you off to Fanatics, where sizes, prices and checkout live.',
    ],
    hooks: {
      football: 'Nebraska football turns Lincoln into a sea of scarlet on Saturdays, and Huskers fans wear the colors well beyond game day.',
      basketball: 'Cornhuskers basketball brings scarlet indoors for the winter, and fans dress for the season with hoodies as much as jerseys.',
      baseball: 'Huskers baseball gives Nebraska fans a reason to break out the scarlet again once the weather turns.',
      softball: 'Nebraska softball has a loyal following in Lincoln, and fans often pick up matching tees and caps for spring games.',
      hockey: 'Nebraska does not field a varsity Division I hockey team, so hockey shoppers here usually want Huskers hoodies and knit hats with a rink-ready feel.',
      soccer: 'Huskers soccer is a smaller but dedicated corner of Big Red fandom, with fans shopping for casual scarlet-and-cream pieces.',
      volleyball: 'Nebraska volleyball is one of the most passionate fan experiences in the state, and plenty of scarlet tees and hoodies get worn to the arena.',
      wrestling: 'Huskers wrestling draws a devoted crowd in Lincoln, and fans stock up on scarlet tees and hoodies for dual season.',
    },
  },
  {
    slug: 'ohio-state', name: 'Ohio State', nickname: 'Buckeyes', conf: 'Big Ten',
    accent: '#BB0000', onAccent: '#FBF7ED', colors: 'scarlet and gray',
    hubMeta: 'Ohio State Buckeyes gear in scarlet and gray: jerseys, hoodies, hats and more for football, basketball, wrestling and hockey fans. Shop via Fanatics.',
    hubIntro: [
      'Scarlet and gray is one of the easiest color combinations to spot in a crowd, and Buckeyes fans wear it year-round, not just when the Horseshoe fills up in Columbus.',
      'Browse Ohio State jerseys, hoodies, hats and accessories below, then jump into a sport page if you are shopping for a specific team.',
      'Football gets most of the attention, but wrestling, hockey and basketball fans have their own gear preferences too.',
      'We link out to Fanatics for the actual listings, sizes and checkout.',
    ],
    hooks: {
      football: 'Buckeyes football is the center of gravity in Columbus, and scarlet-and-gray jerseys and tees get worn from the Horseshoe to the parking lot.',
      basketball: 'Ohio State basketball fans dress up for winter in Columbus, mixing scarlet jerseys with heavier gray layers.',
      baseball: 'Buckeyes baseball fans tend to reach for scarlet caps when spring games start in Columbus.',
      softball: 'Ohio State softball gives Buckeyes fans another reason to keep the scarlet out through spring.',
      hockey: 'Ohio State hockey brings Buckeye scarlet to the rink, where hoodies and knit hats matter as much as jerseys.',
      soccer: 'Buckeyes soccer fans in Columbus lean toward scarves and casual scarlet-and-gray tees for fall matches.',
      volleyball: 'Ohio State volleyball has a dedicated following, with fans in scarlet tees and hoodies at matches.',
      wrestling: 'Buckeyes wrestling is a major draw in Columbus, and fans favor scarlet tees and hoodies in the colder months.',
    },
  },
  {
    slug: 'michigan', name: 'Michigan', nickname: 'Wolverines', conf: 'Big Ten',
    accent: '#FFCB05', onAccent: '#161310', colors: 'maize and blue',
    hubMeta: 'Michigan Wolverines gear in maize and blue: jerseys, hoodies and hats for football, hockey, basketball and more. Browse by sport, shop via Fanatics.',
    hubIntro: [
      'Maize and blue has a look all its own, and Wolverines fans tend to shop for it in every season, from fall Saturdays in Ann Arbor to winter hockey nights.',
      'This page gathers Michigan gear in one spot and sends you to the right Fanatics listings by sport.',
      'If you are buying for a Michigan household with a Buckeye or Spartan cousin, the rest of the schools are on the Lettermen Rack homepage.',
      'Pick a sport below or use the Shop button to search everything at once.',
    ],
    hooks: {
      football: 'Michigan football fills Ann Arbor with maize and blue every fall, and Wolverines fans gear up with jerseys, tees and hoodies well before kickoff.',
      basketball: 'Wolverines basketball turns winter in Ann Arbor maize and blue, with fans pairing jerseys and heavier hoodies.',
      baseball: 'Michigan baseball fans bring maize-and-blue caps out for spring games in Ann Arbor.',
      softball: 'Wolverines softball has a following of its own in Ann Arbor, and fans often pick up maize tees and caps for spring.',
      hockey: 'Michigan hockey is a winter tradition in Ann Arbor, so hoodies, fleece and maize-and-blue jerseys are especially popular.',
      soccer: 'Wolverines soccer fans usually go for casual maize-and-blue tees and hoodies for cool fall matches.',
      volleyball: 'Michigan volleyball shoppers tend to look for maize tees and blue hoodies to wear indoors and out.',
      wrestling: 'Wolverines wrestling fans are a dedicated group, and they lean toward maize-and-blue tees and hoodies through dual-meet season.',
    },
  },
  {
    slug: 'penn-state', name: 'Penn State', nickname: 'Nittany Lions', conf: 'Big Ten',
    accent: '#1E3A6D', onAccent: '#FBF7ED', colors: 'blue and white',
    hubMeta: 'Penn State Nittany Lions gear in blue and white, from White Out tees to hockey hoodies. Browse by sport and shop the listings on Fanatics.',
    hubIntro: [
      'Blue and white is a classic pairing, and Nittany Lions fans lean into it, especially for the White Out at Beaver Stadium when the whole crowd dresses alike.',
      'Here you will find Penn State jerseys, hoodies, tees and hats, along with pages for the sports that draw the most shoppers, including football, volleyball, wrestling and hockey.',
      'Lettermen Rack works across many schools, so it is simple to pick up something for a Penn State fan and a friend at another school in one trip.',
      'Shop buttons open Fanatics in a new tab.',
    ],
    hooks: {
      football: 'Penn State football is famous for the White Out, so plenty of Nittany Lions fans hunt for white tees and blue jerseys before the season starts.',
      basketball: 'Nittany Lions basketball fans in State College favor blue hoodies and jerseys for winter games.',
      baseball: 'Penn State baseball fans shop for blue-and-white caps and tees for the spring schedule.',
      softball: 'Penn State softball fans in central Pennsylvania usually pick up blue tees and caps for spring games.',
      hockey: 'Penn State hockey has become a big winter draw in State College, and blue-and-white jerseys and hoodies are popular for the rink.',
      soccer: 'Nittany Lions soccer fans often want casual blue-and-white tees and scarves for fall matches.',
      volleyball: 'Penn State volleyball is a powerhouse in the sport, and Nittany Lions fans dress the part with blue tees and hoodies.',
      wrestling: 'Penn State wrestling has built a national reputation, and Nittany Lions fans favor blue tees and hoodies for dual meets.',
    },
  },
  {
    slug: 'iowa', name: 'Iowa', nickname: 'Hawkeyes', conf: 'Big Ten',
    accent: '#FFCD00', onAccent: '#161310', colors: 'black and gold',
    hubMeta: 'Iowa Hawkeyes gear in black and gold: jerseys, hoodies and hats for football, basketball and wrestling fans. Browse by sport, shop via Fanatics.',
    hubIntro: [
      'Black and gold is instantly recognizable, and Hawkeyes fans wear it across Iowa and well beyond.',
      'Find Iowa jerseys, hoodies, hats and accessories here, with separate pages for football, basketball and wrestling, the sports Hawkeye fans most often shop for.',
      'The wrestling following in particular is loyal, and it shows up in the gear people look for.',
      'If you are comparing options across schools, Lettermen Rack lists dozens on the homepage.',
      'Checkout happens on Fanatics.',
    ],
    hooks: {
      football: 'Hawkeyes football fans in Iowa City lean on black-and-gold jerseys, tees and hoodies for autumn Saturdays.',
      basketball: 'Iowa basketball has a passionate fan base, including a big following for women\'s hoops, and black-and-gold jerseys and hoodies are what fans look for.',
      baseball: 'Iowa baseball fans typically shop for black-and-gold caps and tees for the spring schedule.',
      softball: 'Hawkeyes softball fans pick up black-and-gold tees and hats to wear at spring games.',
      hockey: 'Iowa does not have a varsity hockey team, so hockey shoppers here usually want black-and-gold hoodies and knit hats with a rink-ready feel.',
      soccer: 'Hawkeyes soccer fans lean toward casual black-and-gold tees and scarves in the fall.',
      volleyball: 'Iowa volleyball fans look for black-and-gold tees and hoodies for indoor matches.',
      wrestling: 'Iowa wrestling is legendary in the sport, and Hawkeyes fans are known for showing up in black and gold for every dual.',
    },
  },
  {
    slug: 'wisconsin', name: 'Wisconsin', nickname: 'Badgers', conf: 'Big Ten',
    accent: '#C5050C', onAccent: '#FBF7ED', colors: 'cardinal and white',
    hubMeta: 'Wisconsin Badgers gear in cardinal and white: jerseys, hoodies and hats for football, hockey, volleyball and more. Shop by sport via Fanatics.',
    hubIntro: [
      'Cardinal and white shows up all over Madison on game days, and Badgers fans shop for it year-round.',
      'This page pulls together Wisconsin jerseys, hoodies, hats and accessories, with sport pages for football, basketball, hockey and volleyball among the most popular.',
      'Cold Wisconsin winters make hoodies and fleece a big part of what people look for.',
      'Lettermen Rack covers many schools, so you can shop Badgers gear next to a rival\'s if you are buying for a divided household.',
      'The Shop button opens Fanatics in a new tab.',
    ],
    hooks: {
      football: 'Wisconsin football fans in Madison pair cardinal jerseys with heavy hoodies for cold late-season Saturdays.',
      basketball: 'Badgers basketball fans fill winter in Madison with cardinal-and-white hoodies and jerseys.',
      baseball: 'Baseball-style gear is a popular way to wear Badgers cardinal, and caps and vintage-look tees lead the way.',
      softball: 'Softball-style gear is popular with Wisconsin fans too, especially tees and hats in cardinal and white.',
      hockey: 'Badgers hockey is a big winter draw in Madison, so cardinal jerseys, hoodies and knit hats are popular for the rink.',
      soccer: 'Wisconsin soccer fans lean toward casual cardinal tees and scarves for fall matches.',
      volleyball: 'Badgers volleyball has a devoted following, and fans wear cardinal tees and hoodies to matches.',
      wrestling: 'Wisconsin wrestling fans in Madison favor cardinal tees and hoodies for dual meets.',
    },
  },
  {
    slug: 'illinois', name: 'Illinois', nickname: 'Fighting Illini', conf: 'Big Ten',
    accent: '#E84A27', onAccent: '#FBF7ED', colors: 'orange and blue',
    hubMeta: 'Illinois Fighting Illini gear in orange and blue: jerseys, hoodies and hats for football, basketball and more. Browse by sport, shop via Fanatics.',
    hubIntro: [
      'Orange and blue makes Fighting Illini gear easy to spot from the stands in Champaign.',
      'Browse Illinois jerseys, hoodies, hats and accessories in one place, with sport pages for football, basketball, baseball and more.',
      'Fans often shop for a mix of everyday orange-and-blue pieces and game-day looks, so we keep the search broad and let Fanatics handle sizing and checkout.',
      'If you are buying for someone who roots for a rival, Lettermen Rack covers plenty of other schools too.',
    ],
    hooks: {
      football: 'Fighting Illini football fans in Champaign-Urbana wear orange and blue on Saturdays, from jerseys to hoodies.',
      basketball: 'Illinois basketball fans in Champaign are known for going all-in on orange, and jerseys and hoodies are the usual picks.',
      baseball: 'Illini baseball fans shop for orange-and-blue caps and tees for the spring schedule.',
      softball: 'Fighting Illini softball fans pick up orange tees and hats for spring games in Champaign.',
      hockey: 'Illinois does not sponsor varsity hockey, so hockey shoppers here typically want orange-and-blue hoodies and knit hats with a rink-ready look.',
      soccer: 'Illini soccer fans tend to shop for casual orange-and-blue tees and scarves in the fall.',
      volleyball: 'Illinois volleyball fans look for orange tees and blue hoodies for matches.',
      wrestling: 'Illini wrestling has a dedicated following in Champaign, and fans favor orange tees and hoodies through dual season.',
    },
  },
  {
    slug: 'minnesota', name: 'Minnesota', nickname: 'Golden Gophers', conf: 'Big Ten',
    accent: '#FFCC33', onAccent: '#161310', colors: 'maroon and gold',
    hubMeta: 'Minnesota Golden Gophers gear in maroon and gold, from football jerseys to hockey hoodies. Browse by sport and shop the listings on Fanatics.',
    hubIntro: [
      'Maroon and gold, plus a fan base that calls its home the State of Hockey, means Golden Gophers gear has a strong winter side as well as a football one.',
      'Look here for Minnesota jerseys, hoodies, hats and accessories, then head to a sport page if you are shopping for football, basketball, hockey or wrestling.',
      'Rivalry trophies like Paul Bunyan\'s Axe and the Little Brown Jug give Gophers fans plenty of reasons to dress up for Big Ten weekends.',
      'Lettermen Rack covers many schools, so a Gopher and a Badger under the same roof can both get what they need.',
      'Checkout happens on Fanatics.',
    ],
    hooks: {
      football: 'Golden Gophers football fans in Minneapolis wear maroon and gold for Big Ten Saturdays, and rivalry games like the Axe game add extra reasons to gear up.',
      basketball: 'Minnesota basketball fans favor maroon jerseys and heavier gold hoodies for winter games.',
      baseball: 'Gophers baseball fans pick up maroon-and-gold caps and tees for spring in Minneapolis.',
      softball: 'Minnesota softball fans shop for maroon tees and caps for the spring schedule.',
      hockey: 'Minnesota hockey is the heart of the State of Hockey, so Gophers jerseys, hoodies and knit hats are winter staples.',
      soccer: 'Gophers soccer fans go for casual maroon-and-gold tees and scarves in the fall.',
      volleyball: 'Minnesota volleyball has a dedicated following, with fans wearing maroon tees and hoodies to matches.',
      wrestling: 'Gophers wrestling fans in Minneapolis look for maroon tees and hoodies for dual meets.',
    },
  },
  {
    slug: 'northwestern', name: 'Northwestern', nickname: 'Wildcats', conf: 'Big Ten',
    accent: '#4E2A84', onAccent: '#FBF7ED', colors: 'purple and white',
    hubMeta: 'Northwestern Wildcats gear in purple: jerseys, hoodies and hats for football, basketball, softball and more. Browse by sport, shop via Fanatics.',
    hubIntro: [
      'Purple is one of the more distinctive school colors in the Big Ten, and Wildcats fans carry it from Evanston well beyond the Chicago area.',
      'This page collects Northwestern jerseys, hoodies, hats and accessories, with sport pages for football, basketball, softball and more.',
      'Students and alumni alike tend to shop for everyday purple pieces, not just game-day gear.',
      'Lettermen Rack works across many schools, so it is easy to compare options for other fan bases too.',
      'The Shop button sends you to Fanatics.',
    ],
    hooks: {
      football: 'Northwestern football fans in Evanston pair purple jerseys with hoodies for cool fall Saturdays.',
      basketball: 'Wildcats basketball fans favor purple jerseys and hoodies for winter games in Evanston.',
      baseball: 'Northwestern baseball fans shop for purple caps and tees for the spring schedule.',
      softball: 'Wildcats softball has a proud tradition, and fans pick up purple tees and caps for spring.',
      hockey: 'Northwestern does not sponsor varsity hockey, so hockey shoppers here typically want purple hoodies and knit hats with a rink-ready look.',
      soccer: 'Wildcats soccer fans in Evanston go for casual purple tees and scarves in the fall.',
      volleyball: 'Northwestern volleyball fans look for purple tees and hoodies for matches.',
      wrestling: 'Wildcats wrestling fans favor purple tees and hoodies for dual meets.',
    },
  },
  {
    slug: 'michigan-state', name: 'Michigan State', nickname: 'Spartans', conf: 'Big Ten',
    accent: '#18453B', onAccent: '#FBF7ED', colors: 'green and white',
    hubMeta: 'Michigan State Spartans gear in green and white: jerseys, hoodies and hats for football, basketball and hockey. Browse by sport, shop via Fanatics.',
    hubIntro: [
      'Spartans fans wear green and white with a lot of pride, and it shows up all over East Lansing and across Michigan.',
      'Here you will find Michigan State jerseys, hoodies, hats and accessories, with sport pages for football, basketball, hockey and more.',
      'Basketball season and hockey nights are big for the Spartan faithful, so hoodies and hats are especially popular.',
      'Since Michigan State and Michigan share a state and a rivalry, Lettermen Rack makes it easy to shop both for a divided household.',
      'Fanatics handles sizing and checkout.',
    ],
    hooks: {
      football: 'Spartans football fans in East Lansing pack green and white into Spartan Stadium, and jerseys and hoodies are the usual game-day picks.',
      basketball: 'Michigan State basketball is a winter tradition in East Lansing, and green jerseys and hoodies are what most fans want.',
      baseball: 'Spartans baseball fans shop for green-and-white caps and tees for spring games.',
      softball: 'Michigan State softball fans pick up green tees and hats for the spring schedule.',
      hockey: 'Spartans hockey is a big winter draw in East Lansing, so green-and-white jerseys, hoodies and knit hats are popular.',
      soccer: 'Michigan State soccer fans go for casual green-and-white tees and scarves in the fall.',
      volleyball: 'Spartans volleyball fans look for green tees and hoodies for indoor matches.',
      wrestling: 'Michigan State wrestling fans in East Lansing favor green tees and hoodies for dual meets.',
    },
  },
];

// ---------- helpers ----------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fill = (tpl, vars) => tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k]);
const hyph = (colors) => colors.replace(/ and /g, '-and-');

function affiliateLink(school, nickname, sport, category) {
  const query = [school, nickname, sport, category].filter(Boolean).join(' ');
  const destination = `https://www.fanatics.com/?query=${query}&_ref=p-SRP:m-SEARCH`;
  return `https://fanatics.93n6tx.net/c/7628239/586570/9663?u=${encodeURIComponent(destination)}&partnerpropertyid=8735497&MediaPartnerPropertyId=8735497`;
}

const NAV = `<nav class="dark">
  <div class="wrap">
    <a class="brand" href="/"><span class="brand-mark">LR</span>LETTERMEN&nbsp;RACK</a>
    <div class="navlinks">
      <a href="/#picker">Pick Your Gear</a>
      <a href="/#schools">Schools</a>
    </div>
  </div>
</nav>

<div class="disclosure-bar dark">
  <div class="wrap">
    <p>Lettermen Rack contains affiliate links. We may earn a commission on qualifying purchases at no extra cost to you. <a href="/privacy.html">Learn more</a></p>
  </div>
</div>`;

const FOOTER = `<footer class="dark">
  <div class="wrap">
    <div>
      <div class="fbrand" style="margin-bottom:10px;">LETTERMEN RACK</div>
      <div style="display:flex; gap:18px; margin-bottom:14px;">
        <a href="/privacy.html" style="font-size:12px; color:rgba(251,247,238,0.6); text-decoration:none;">Privacy Policy</a>
        <a href="/terms.html" style="font-size:12px; color:rgba(251,247,238,0.6); text-decoration:none;">Terms of Use</a>
        <a href="/contact.html" style="font-size:12px; color:rgba(251,247,238,0.6); text-decoration:none;">Contact</a>
      </div>
    </div>
    <div class="fine">Lettermen Rack is an independent fan site and is not affiliated with, endorsed by, or sponsored by any school, conference, or athletic association. As an affiliate, Lettermen Rack may earn a commission on qualifying purchases made through links on this site, at no extra cost to you.</div>
  </div>
</footer>`;

function head({ title, description, canonical }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/site.css">
<script src="/js/affiliate.js"></script>
</head>
<body>

${NAV}
`;
}

function ctaStyle(s) { return `--team-accent:${s.accent}; --team-on-accent:${s.onAccent};`; }

// ---------- page builders ----------
function hubPage(s) {
  const url = `${HOST}/schools/${s.slug}`;
  const title = `${s.name} ${s.nickname} Gear & Apparel | Lettermen Rack`;
  const cta = affiliateLink(s.name, s.nickname, '', '');
  const sportLinks = SPORTS.map((sp) =>
    `      <a class="sport-link" href="/schools/${s.slug}/${sp.slug}">${sp.name}<span class="arrow">&rarr;</span></a>`).join('\n');
  const intro = s.hubIntro.map(esc).join(' ');
  return {
    url, title, description: s.hubMeta,
    html: `${head({ title, description: s.hubMeta, canonical: url })}
<header class="hub-hero">
  <div class="wrap">
    <div class="breadcrumb"><a href="/">Home</a><span>/</span>${esc(s.name)} Gear</div>
    <div class="eyebrow">${esc(s.conf)}</div>
    <h1>${esc(s.name)} ${esc(s.nickname)} Gear</h1>
    <p>${intro}</p>
    <div class="cta-row">
      <a class="btn btn-primary" href="${cta}" target="_blank" rel="noopener sponsored" style="${ctaStyle(s)}">Shop ${esc(s.name)} Gear</a>
      <span class="cta-note">Opens Fanatics in a new tab &mdash; affiliate link.</span>
    </div>
  </div>
</header>

<section class="section">
  <div class="wrap">
    <div class="section-head">
      <h2>Shop ${esc(s.name)} Gear by Sport</h2>
    </div>
    <div class="sport-grid">
${sportLinks}
    </div>
  </div>
</section>

${FOOTER}

</body>
</html>
`,
  };
}

function sportPage(s, si, sp, pi) {
  const url = `${HOST}/schools/${s.slug}/${sp.slug}`;
  const title = `${s.name} ${sp.name} Gear | Lettermen Rack`;
  const description = `${s.name} ${sp.name.toLowerCase()} gear: ${hyph(s.colors)} ${sp.items} for ${s.nickname} fans. Shop the listings on Fanatics through Lettermen Rack.`;
  const vars = { c: s.colors, n: s.nickname, s: s.name, sp: sp.name.toLowerCase() };
  const gear = fill(GEAR[sp.slug][si % 3], vars);
  const closer = fill(CLOSERS[(si * 3 + pi) % 4], vars);
  const intro = [s.hooks[sp.slug], gear, closer].map(esc).join(' ');
  const cta = affiliateLink(s.name, s.nickname, sp.name, '');
  return {
    url, title, description,
    html: `${head({ title, description, canonical: url })}
<header class="hub-hero">
  <div class="wrap">
    <div class="breadcrumb"><a href="/">Home</a><span>/</span><a href="/schools/${s.slug}">${esc(s.name)}</a><span>/</span>${sp.name}</div>
    <div class="eyebrow">${esc(s.conf)}</div>
    <h1>${esc(s.name)} ${esc(s.nickname)} ${sp.name} Gear</h1>
    <p>${intro}</p>
    <div class="cta-row">
      <a class="btn btn-primary" href="${cta}" target="_blank" rel="noopener sponsored" style="${ctaStyle(s)}">Shop ${esc(s.name)} ${sp.name} Gear</a>
      <span class="cta-note">Opens Fanatics in a new tab &mdash; affiliate link.</span>
    </div>
  </div>
</header>

<section class="section">
  <div class="wrap">
    <a href="/schools/${s.slug}">&larr; Back to all ${esc(s.name)} gear</a>
  </div>
</section>

${FOOTER}

</body>
</html>
`,
  };
}

// ---------- run ----------
const write = (rel, content) => {
  const file = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
};

const problems = [];
const seenTitles = new Set();
const seenDescs = new Set();
const seenIntros = new Set();
const urls = [`${HOST}/`, `${HOST}/privacy.html`, `${HOST}/terms.html`, `${HOST}/contact.html`];

function check(page, label, introText) {
  if (page.title.length > 60) problems.push(`${label}: title ${page.title.length} chars: ${page.title}`);
  if (page.description.length > 155) problems.push(`${label}: description ${page.description.length} chars`);
  if (seenTitles.has(page.title)) problems.push(`${label}: duplicate title`);
  if (seenDescs.has(page.description)) problems.push(`${label}: duplicate description`);
  if (introText && seenIntros.has(introText)) problems.push(`${label}: duplicate intro`);
  seenTitles.add(page.title); seenDescs.add(page.description); if (introText) seenIntros.add(introText);
}

SCHOOLS.forEach((s, si) => {
  const hub = hubPage(s);
  check(hub, `hub ${s.slug}`, s.hubIntro.join(' '));
  write(`schools/${s.slug}/index.html`, hub.html);
  urls.push(hub.url);
  SPORTS.forEach((sp, pi) => {
    const pg = sportPage(s, si, sp, pi);
    check(pg, `${s.slug}/${sp.slug}`, pg.html.match(/<\/h1>\s*<p>(.*?)<\/p>/)[1]);
    write(`schools/${s.slug}/${sp.slug}/index.html`, pg.html);
    urls.push(pg.url);
  });
});

write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc><lastmod>${LASTMOD}</lastmod></url>`).join('\n')}
</urlset>
`);

if (problems.length) { console.error('PROBLEMS:\n' + problems.join('\n')); process.exit(1); }
console.log(`OK: ${SCHOOLS.length} hubs + ${SCHOOLS.length * SPORTS.length} sport pages; sitemap has ${urls.length} URLs (host ${HOST}).`);
