import { NextRequest, NextResponse } from 'next/server';
import { addWaitlist, rateLimit, referralCode } from '@/lib/waitlist';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  if (!(await rateLimit(ip))) return NextResponse.json({ ok: false, error: 'too many requests — slow down' }, { status: 429 });

  const body = await req.json().catch(() => ({}));
  const { name, email, segment, estimated_exposure } = body;
  if (!name || !email) return NextResponse.json({ ok: false, error: 'name and email required' }, { status: 400 });

  const entry = {
    name,
    email,
    segment: segment || 'household',
    estimated_exposure: estimated_exposure ?? null,
    ref: referralCode(email),
    at: new Date().toISOString(),
  };
  const res = await addWaitlist(entry);
  return NextResponse.json({ ok: true, ...res });
}
