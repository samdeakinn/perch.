import { NextResponse } from 'next/server';
import { getStats } from '@/lib/waitlist';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ ok: true, ...(await getStats()) });
}
