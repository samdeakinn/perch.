import { NextRequest, NextResponse } from 'next/server';
import { getStatus } from '@/lib/waitlist';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');
  if (!email) return NextResponse.json({ ok: false, error: 'email required' }, { status: 400 });
  return NextResponse.json(await getStatus(email));
}
