import CommunityCounter from '@/components/CommunityCounter';

export const metadata = { title: 'community', description: 'live count of renewals tracked by early perch. users.' };

export default function CommunityPage() {
  return (
    <section className="page-header">
      <div className="wrap" style={{ textAlign: 'center' }}>
        <div className="eyebrow" style={{ justifyContent: 'center' }}>the flock</div>
        <h1 style={{ textAlign: 'center', margin: '0 auto 8px' }}>you are not <em>the only one</em> forgetting.</h1>
        <p className="section-sub section-sub-center">a live count of renewals already being tracked by early perch. users.</p>
        <CommunityCounter />
      </div>
    </section>
  );
}
