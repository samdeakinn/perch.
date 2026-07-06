import Link from 'next/link';
import SavingsCalculator from '@/components/SavingsCalculator';

export const metadata = { title: 'savings calculator', description: 'estimate how much auto-renewal inertia is costing you.' };

export default function CalculatorPage() {
  return (
    <section className="page-header">
      <div className="wrap" style={{ textAlign: 'center' }}>
        <div className="eyebrow" style={{ justifyContent: 'center' }}>your number</div>
        <h1 style={{ textAlign: 'center', margin: '0 auto 8px' }}>how much is <em>inertia</em> costing you?</h1>
        <p className="section-sub section-sub-center">pick your categories. see your estimated yearly overpayment and what perch. could save.</p>
        <SavingsCalculator />
      </div>
    </section>
  );
}
