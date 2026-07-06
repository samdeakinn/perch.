import PenaltyMap from '@/components/PenaltyMap';

export const metadata = { title: 'loyalty penalty map', description: 'uk auto-renewal overcharge by region.' };

export default function PenaltyMapPage() {
  return (
    <section className="page-header">
      <div className="wrap" style={{ textAlign: 'center' }}>
        <div className="eyebrow" style={{ justifyContent: 'center' }}>the map</div>
        <h1 style={{ textAlign: 'center', margin: '0 auto 8px' }}>the uk loyalty <em>penalty</em>, mapped.</h1>
        <p className="section-sub section-sub-center">auto-renewal overcharge by region. hover a node for the category breakdown.</p>
        <PenaltyMap />
      </div>
    </section>
  );
}
