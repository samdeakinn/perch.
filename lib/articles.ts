export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: number;
  body: string;
};

export const articles: Article[] = [
  {
    slug: 'july-renewal-season',
    title: 'why july is the worst month for auto-renewals',
    excerpt: 'july is peak renewal season for everything from car insurance to gym memberships. here is why and what to watch for.',
    date: '4 Jul 2026', readTime: 4,
    body: 'july is the cruelest month for your wallet — not because of anything you buy, but because of everything that renews without asking.\n\nmost annual policies cluster around the financial half-year. insurers, gyms, and saas tools that signed you up in january or the previous july all come due at once.\n\n## what to watch\n\nthe average uk household has six to nine auto-renewing items. in july, that number spikes. car insurance, home insurance, pet insurance, broadband contracts ending, and the gym membership you swore you would use.\n\n## the fix\n\nforward the renewal emails the moment they arrive. perch. reads the date, the amount, and the price change — then tells you renew, cancel, or renegotiate before the deadline passes.',
  },
  {
    slug: 'gym-contract-traps',
    title: 'gym contract traps: minimum terms, notice periods, and the £300 ghost membership',
    excerpt: 'uk gyms see 40–60% of revenue from members who visit less than once a month. here is how the contracts are designed to keep you paying.',
    date: '3 Jul 2026', readTime: 4,
    body: 'the average uk gym membership costs £32 a month. the average uk gym member visits fewer than four times a month — and a third visit less than once a month.\n\nthat is the business model. gyms rely on the ghost member: the person who pays but never shows.\n\n## the contract trap\n\nmost gym contracts have a minimum term (3, 6, or 12 months) and a notice period (1–3 months) that only kicks in after the minimum ends. cancel too early and you owe the remainder. cancel too late and you have auto-renewed for another year.\n\n## the numbers\n\n£32/month × 12 = £384/year. if you have not been since march, that is £160 you will not get back — and another £224 coming if you do not cancel before the renewal date.\n\nperch. flags the renewal date and the notice deadline. you make the call.',
  },
  {
    slug: 'mobile-upgrade-costs',
    title: 'the free mobile upgrade that costs you £900',
    excerpt: 'a free upgrade is one of the most successful marketing frames in british telecoms. it is a contract renewal dressed as a gift — and it costs you hundreds.',
    date: '3 Jul 2026', readTime: 3,
    body: 'when your network calls about a "free upgrade," what they mean is: your contract is ending, and they would like to put you on a new one at the same inflated price you have been paying for a phone you have already paid off.\n\nthe handset is yours now. the airtime should cost roughly half what it did. instead, the upgrade bundles a new handset you may not need into another 24 months at full price.\n\n£45/month × 24 = £1,080. a sim-only plan with the same data: £12/month × 24 = £288. the difference — £792 — is what "free" costs you.',
  },
  {
    slug: 'streaming-service-creep',
    title: '£78/month for content you do not watch: the streaming subscription creep',
    excerpt: 'six services later, you are paying £936/year. the model is built on you forgetting how many you have. here is how to audit and save.',
    date: '3 Jul 2026', readTime: 3,
    body: 'the average uk household pays for four streaming services and actively uses two. the other two sit there, charging £10–£15 a month, every month, forever.\n\nnetflix, prime, disney+, now tv, apple tv+, paramount+ — each one alone looks reasonable. together, £78/month is £936/year for content you scroll past.\n\nthe fix is not cancellation across the board. it is rotation: keep one or two active, rotate the rest monthly. perch. tracks the renewal dates so you rotate deliberately, not by accident.',
  },
  {
    slug: 'pet-insurance-loyalty',
    title: 'pet insurance: the loyalty penalty nobody talks about',
    excerpt: 'average renewal hikes of 18–34%, with older pets facing 40%+ increases. and because of pre-existing conditions, most owners cannot switch.',
    date: '3 Jul 2026', readTime: 4,
    body: 'pet insurance is where loyalty hurts most. your dog or cat gets older every year, and the premium climbs with the risk — 18% to 34% on average, and over 40% for senior pets.\n\nand here is the trap: the moment your pet develops a condition, no other insurer will cover it. you are locked in. the provider knows it. the price walks up every renewal because they can.\n\nperch. cannot change the rules, but it can flag the hike the moment the renewal email arrives — so you at least know what is happening before the direct debit takes the money.',
  },
  {
    slug: 'travel-insurance-auto-renewal',
    title: 'why annual travel insurance is usually the wrong call',
    excerpt: 'the average brit takes 2.4 trips a year. single-trip policies cost half what annual policies do. but annual auto-renews, so most people keep paying.',
    date: '3 Jul 2026', readTime: 3,
    body: 'annual travel insurance sounds sensible — one policy, twelve months, no thinking. but the average brit takes 2.4 trips a year, and single-trip cover for those trips costs roughly half what an annual policy does.\n\nthe reason most people keep the annual one is simple: it auto-renews, and nobody cancels what they do not notice. £80–£120 a year for cover you used twice.',
  },
  {
    slug: 'landlord-insurance-chaos',
    title: 'managing renewals across 5 properties: the landlord quiet nightmare',
    excerpt: '15–25 renewal events per year, each on a different date, with uncapped loyalty penalties. here is how perch. helps landlords track everything.',
    date: '3 Jul 2026', readTime: 4,
    body: 'a landlord with five properties has between 15 and 25 renewal events a year: buildings insurance, contents, landlord liability, boiler cover, gas safety contracts, broadband, and the occasional leasehold ground rent. each on a different date. each with its own loyalty penalty.\n\none missed buildings insurance renewal on a void property can leave you uninsured for months. one unnoticed boiler cover hike is £80–£150 down the drain.\n\nperch. was built partly for this: forward every email, get one weekly digest, see every renewal ranked by urgency.',
  },
  {
    slug: 'insurance-loyalty-penalty',
    title: 'the uk insurance loyalty penalty: what changed and what did not',
    excerpt: 'the fca banned price walking in 2022, but millions are still overpaying. here is what happened and what has not changed.',
    date: '2 Jul 2026', readTime: 4,
    body: 'in 2022 the fca banned price walking — the practice where insurers hiked premiums every year for loyal customers while offering cheap deals to new ones. it was meant to end the loyalty penalty.\n\nit did not, entirely. what it ended was the automatic hike. insurers can still charge you more than a new customer — they just have to offer you a price no worse than the equivalent new customer. the catch: equivalent is doing a lot of work, and the new customer price is itself often higher than the headline comparison sites suggest.\n\nthe result: the average renewing customer still pays more than they should, just less flagrantly. the fix is still the same — check before you renew.',
  },
  {
    slug: 'car-insurance-auto-renewal',
    title: 'the £560m car insurance auto-renewal tax',
    excerpt: '47% of uk drivers do not check before renewing. the average overpayment is £82 a year. here is where that money goes.',
    date: '30 Jun 2026', readTime: 3,
    body: '47% of uk drivers let their car insurance auto-renew without checking. the average overpayment for those who do check and switch is £82 a year. multiply that by the millions who do not, and you get roughly £560 million — a quiet tax on inertia.\n\nthe money goes to the insurer margin. the renewal letter is designed to look like a courtesy. it is not. the new customer price is almost always lower, and your loyalty buys you nothing but the convenience of not having to think.',
  },
  {
    slug: 'broadband-out-of-contract',
    title: 'out-of-contract pricing: broadband quietest leak',
    excerpt: 'your broadband doubled and you did not notice. out-of-contract pricing is costing uk households hundreds a year.',
    date: '28 Jun 2026', readTime: 4,
    body: 'when your broadband fixed term ends, you do not get cut off. you stay connected — at the out-of-contract price, which is often double what you signed up for.\n\nthe provider has no incentive to tell you. the letters, if they come, are quiet. the price climbs every april with inflation-plus hikes baked into the small print.\n\nthe average out-of-contract household pays £240–£360 a year more than they would on a new deal. the fix is simple: know the end date, and switch or renegotiate before it passes. perch. tracks the end date so you do not have to.',
  },
  {
    slug: 'forgotten-subscriptions',
    title: 'the £1.6bn subscription trap',
    excerpt: 'unwanted subscriptions cost uk consumers £1.6 billion a year. not because they are expensive — because they are forgotten.',
    date: '25 Jun 2026', readTime: 3,
    body: '£1.6 billion. that is what unwanted subscriptions cost uk consumers every year. the trap is not the price of any one service — it is the forgetting.\n\nyou sign up for a free trial, you mean to cancel, you do not, it converts, you stop reading that line on your statement, and three years later it is still there.\n\nthe average household has two to four forgotten subscriptions averaging £12 a month. that is £288–£576 a year for nothing. perch. surfaces them the moment a renewal notice arrives.',
  },
  {
    slug: 'domain-renewal-lapses',
    title: 'domain renewal lapses: the most preventable financial loss',
    excerpt: 'a forgotten domain renewal can cost ten times the original price to fix. here is why it happens and how to stop it.',
    date: '23 Jun 2026', readTime: 3,
    body: 'a domain costs £10–£15 a year to renew. letting it lapse can cost ten times that to recover — if you can recover it at all. the moment it drops, it is picked up by auction bots, and you buy it back or you rebrand.\n\nit is the most preventable loss in the small-business ledger, and it happens because registrars send one reminder to an inbox nobody checks anymore.\n\nperch. forwards that reminder to a tracked inbox and puts the renewal date on your monday digest. £15 a year, never missed.',
  },
];
