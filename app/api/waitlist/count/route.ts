import { NextResponse } from 'next/server';
import { getWaitlist } from '@/lib/waitlist';

export const dynamic = 'force-dynamic';

export async function GET() {
  const list = await getWaitlist();
  return NextResponse.json({ ok: true, count: list.length });
}
