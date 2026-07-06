import Link from 'next/link';
import SavingsCalculator from '@/components/SavingsCalculator';
import CommunityCounter from '@/components/CommunityCounter';
import PenaltyMap from '@/components/PenaltyMap';
import Testimonials from '@/components/Testimonials';

export default function Home() {
  return (
    <>
      <section className="hero" id="heroSection">
        <div className="wrap">
          <div className="eyebrow" style={{ justifyContent: 'center' }}>built for the uk</div>
          <div className="hero-ring-fallback" />
          <h1 style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto' }}>stop paying for things <em>you forgot you agreed to.</em></h1>
          <p>perch. is an ai inbox for everything that quietly auto-renews — insurance, broadband, domains, subscriptions, contracts. forward an email or upload a document. get a date, an amount, and a verdict.</p>
          <form className="hero-form" action="/waitlist" method="get">
            <input type="email" name="email" placeholder="you@email.com" required />
            <button type="submit" className="btn-primary">join the waitlist &rarr;</button>
          </form>
          <div className="hero-micro">no bank linking. no auto-cancel bots. just visibility.</div>
        </div>
      </section>

      <section className="lp-section grav-fade" id="cost">
        <div className="wrap" style={{ textAlign: 'center' }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>the cost of doing nothing</div>
          <h2 style={{ textAlign: 'center', margin: '0 auto 8px' }}>auto-renewal is not a convenience. it is a £4bn tax on not paying attention.</h2>
          <p className="section-sub section-sub-center">every provider is incentivised to make renewal silent. here is what that adds up to for uk households.</p>
          <div className="big-stat">£4bn</div>
          <div className="stat-row-flex">
            <div className="stat-block">
              <div className="stat-block-num">£560m</div>
              <div className="stat-block-label">lost to car insurance auto-renewal each year</div>
            </div>
            <div className="stat-block">
              <div className="stat-block-num">47%</div>
              <div className="stat-block-label">of uk drivers do not check their renewal before it hits</div>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-section grav-fade" id="calculator">
        <div className="wrap" style={{ textAlign: 'center' }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>your number</div>
          <h2 style={{ textAlign: 'center', margin: '0 auto 8px' }}>how much is inertia costing <em>you</em>?</h2>
          <p className="section-sub section-sub-center">pick your categories. the orrery reconfigures to your renewals and estimates what you could save.</p>
          <SavingsCalculator />
        </div>
      </section>

      <section className="lp-section grav-fade" id="how">
        <div className="wrap">
          <div className="eyebrow" style={{ justifyContent: 'center' }}>how it works</div>
          <h2 style={{ textAlign: 'center', margin: '0 auto 8px' }}>one email forward, one clear verdict. that is the whole loop.</h2>
          <p className="section-sub section-sub-center">perch. does not need your bank, your passwords, or your attention every day. just the emails you would ignore anyway.</p>
          <div style={{ maxWidth: 'var(--max-narrow)', margin: '40px auto 0' }}>
            {[
              ['01', 'forward the renewal email, pdf, or screenshot. one forward, or batch a dozen in one go.'],
              ['02', 'our ai reads the provider, amount, renewal date, and price change — even from scanned documents.'],
              ['03', 'you get a verdict: renew, cancel, or renegotiate — with a clear reason and the deadline.'],
              ['04', 'every monday morning, a 90-second summary of everything renewing this week.'],
            ].map(([n, t]) => (
              <div className="step-row" key={n}>
                <span className="step-num">{n}</span>
                <span className="step-text">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-section grav-fade" id="track">
        <div className="wrap">
          <div className="eyebrow" style={{ justifyContent: 'center' }}>what perch. tracks</div>
          <h2 style={{ textAlign: 'center', margin: '0 auto 8px' }}>every category that quietly costs you money.</h2>
          <p className="section-sub section-sub-center">broad categories, precise extraction. if it renews automatically, perch. can track it.</p>
          <div className="track-grid-2col">
            {[
              ['🛡️', 'insurance', 'car, home, pet, life, landlord — every policy that auto-renews with a loyalty penalty baked in.', '£308 avg yearly overpayment'],
              ['🎬', 'subscriptions', 'streaming, saas, gym, co-working, apps — the small charges that add up to big annual totals.', '£180 avg yearly forgotten subs'],
              ['🌐', 'broadband & utilities', 'out-of-contract pricing that doubles your bill the moment your fixed term ends without you noticing.', '£120 avg yearly loyalty penalty'],
              ['🔗', 'domains & hosting', 'the silent lapses that cost ten times more to fix than to renew on time — if you can get them back at all.', '£40+ per domain if it lapses'],
            ].map(([icon, title, body, stat]) => (
              <div className="card" key={title as string}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
                <h3>{title}</h3>
                <p>{body}</p>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--accent)', marginTop: 12 }}>{stat}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-section grav-fade" id="community">
        <div className="wrap" style={{ textAlign: 'center' }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>the flock</div>
          <h2 style={{ textAlign: 'center', margin: '0 auto 8px' }}>you are not the only one forgetting.</h2>
          <p className="section-sub section-sub-center">a live count of renewals already being tracked by early perch. users.</p>
          <CommunityCounter />
        </div>
      </section>

      <section className="lp-section grav-fade" id="penalty-map">
        <div className="wrap" style={{ textAlign: 'center' }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>the map</div>
          <h2 style={{ textAlign: 'center', margin: '0 auto 8px' }}>the uk loyalty penalty, mapped.</h2>
          <p className="section-sub section-sub-center">auto-renewal overcharge by region. the closer you look, the worse it gets.</p>
          <PenaltyMap />
        </div>
      </section>

      <section className="lp-section grav-fade" id="proof">
        <div className="wrap">
          <div className="eyebrow" style={{ justifyContent: 'center' }}>proof</div>
          <h2 style={{ textAlign: 'center', margin: '0 auto 8px' }}>what people are saying before they have even paid us.</h2>
          <p className="section-sub section-sub-center">no paid reviews. no nps score. just people who forwarded some emails.</p>
          <Testimonials />
        </div>
      </section>

      <section className="lp-section grav-fade" id="pricing">
        <div className="wrap">
          <div className="eyebrow" style={{ justifyContent: 'center' }}>pricing</div>
          <h2 style={{ textAlign: 'center', margin: '0 auto 8px' }}>three tiers. no kickbacks.</h2>
          <p className="section-sub section-sub-center">free to start, cheap to stay, premium if you need the firehose. all plans include extraction, verdicts, and the weekly digest.</p>
          <div className="pricing-row">
            {[
              { name: 'starter', price: '£0', feats: ['up to 5 renewals tracked', 'email & document extraction', 'weekly digest (read only)', 'renew / cancel / renegotiate verdicts'] },
              { name: 'standard', price: '£8.99', feats: ['unlimited renewals tracked', 'email & document extraction', 'full weekly digest', 'price history tracking', 'savings dashboard', 'calendar view'], featured: true },
              { name: 'premium', price: '£19.99', feats: ['everything in standard', '3 forwarding inboxes', 'vendor & saas contract tracking', 'team digest forwarding', 'market benchmarking', 'csv / pdf export', 'priority support'] },
            ].map((p) => (
              <div className={`pricing-card${p.featured ? ' featured' : ''}`} key={p.name}>
                <h3>{p.name}</h3>
                <div className="pricing-price">{p.price}{p.price !== '£0' && <span>/month</span>}</div>
                <ul>
                  {p.feats.map((f) => <li key={f}>{f}</li>)}
                </ul>
                <Link href="/waitlist" className="btn-secondary">get early access &rarr;</Link>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--dust)', marginTop: 20 }}>no surprises. cancel any time. annual billing saves ~20–30% depending on tier.</p>
        </div>
      </section>

      <section className="lp-section grav-fade" id="faq">
        <div className="wrap">
          <div className="eyebrow" style={{ justifyContent: 'center' }}>questions</div>
          <h2 style={{ textAlign: 'center', margin: '0 auto 8px' }}>questions we get asked.</h2>
          <p className="section-sub section-sub-center">here is what people ask when they first hear about perch. and how we answer.</p>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            {[
              ['how is this different from a budgeting app?', 'budgeting apps categorise past spending. they tell you what you already spent. perch. looks forward — it tells you what is about to renew and whether you should act. entirely different time horizon, entirely different job.'],
              ['do you auto-cancel things on my behalf?', 'never. you always make the call. we surface the deadline and the recommended action, but we never touch an account, cancel a policy, or send anything on your behalf. that is not a limitation — it is the point.'],
              ['what happens to the emails and documents i send you?', 'we extract the renewal details immediately and store nothing beyond what is needed to track your items. no training models on your data, no sharing with third parties. you can delete any item at any time.'],
              ['what if i do not get renewal emails?', 'that happens more often than you would think. if you do not have the email, you can upload a pdf statement, a screenshot, or even a photo of a letter. we will extract the same details from whatever you give us.'],
              ['can i try it before paying?', 'during early access, all features are free. you will get full extraction, verdicts, and the weekly digest for as long as you are in the beta. we will give plenty of notice before billing starts, and you can leave at any time.'],
            ].map(([q, a]) => (
              <div className="faq-item" key={q}>
                <div className="faq-q">{q}<span className="icon">+</span></div>
                <div className="faq-a">{a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="wrap">
          <h2 style={{ textAlign: 'center', margin: '0 auto' }}>stop overpaying. <em>start seeing.</em></h2>
          <p className="section-sub section-sub-center">join hundreds of households and businesses already tracking their renewals. early access is free — your first digest is on us.</p>
          <form className="hero-form" action="/waitlist" method="get">
            <input type="email" name="email" placeholder="you@email.com" required />
            <button type="submit" className="btn-primary">get early access &rarr;</button>
          </form>
          <div className="hero-micro">no bank linking. no auto-cancel bots. just visibility.</div>
        </div>
      </section>
    </>
  );
}
