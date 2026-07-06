import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// simple in-memory pageview counter (resets per cold start on serverless — honest about its limits)
let pageViews = 0;
export async function GET() {
  pageViews++;
  return NextResponse.json({ ok: true, views: pageViews });
}
