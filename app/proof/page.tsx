import Testimonials from '@/components/Testimonials';

export const metadata = { title: 'proof', description: 'what people say before they have paid us anything.' };

export default function Page() {
  return (
    <section className="page-header">
      <div className="wrap">
        <div className="eyebrow">proof</div>
        <h1>no paid reviews. <em>just forwarded emails.</em></h1>
        <p className="section-sub" style={{ margin: '16px 0 24px' }}>here is what people said after forwarding a batch of renewals during early access.</p>
        <Testimonials />
      </div>
    </section>
  );
}
