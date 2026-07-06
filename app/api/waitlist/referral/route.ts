import { NextRequest, NextResponse } from 'next/server';
import { addReferral, getWaitlist } from '@/lib/waitlist';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { email } = await req.json().catch(() => ({}));
  if (!email) return NextResponse.json({ ok: false, error: 'email required' }, { status: 400 });
  const list = await getWaitlist();
  if (!list.some((e) => e.email === email)) return NextResponse.json({ ok: false, error: 'not found' }, { status: 404 });
  await addReferral(email);
  return NextResponse.json({ ok: true });
}
