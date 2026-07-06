import { createHash } from 'crypto';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export type WaitlistEntry = {
  name: string;
  email: string;
  segment?: string;
  estimated_exposure?: number | null;
  ref: string;
  at: string;
};

export type Referral = { referee: string; at: string };

export function referralCode(email: string): string {
  return createHash('md5').update(email + 'perch2026').digest('hex').slice(0, 8);
}

// KV is available when env vars are set (Vercel). Otherwise we degrade gracefully:
// read from an in-process seed (the migrated signups) and log writes.
// On Vercel without KV, new signups will not persist across cold starts — surface that clearly.
let kvModule: any = null;
try {
  kvModule = require('@vercel/kv');
} catch {
  kvModule = null;
}

const hasKv = () =>
  kvModule &&
  (process.env.KV_REST_API_URL || process.env.VERCEL_KV_REST_API_URL);

// seed: the 12 signups migrated from data/waitlist.jsonl (local file, read once at module load)
function loadSeed(): WaitlistEntry[] {
  try {
    const file = join(process.cwd(), 'data', 'waitlist.jsonl');
    if (!existsSync(file)) return [];
    return readFileSync(file, 'utf-8')
      .trim()
      .split('\n')
      .filter(Boolean)
      .map((l) => JSON.parse(l))
      .map((e: any) => ({
        name: e.name,
        email: e.email,
        segment: e.segment,
        estimated_exposure: e.estimated_exposure ?? null,
        ref: e.ref || referralCode(e.email),
        at: e.at,
      }));
  } catch {
    return [];
  }
}

const SEED = loadSeed();

export async function getWaitlist(): Promise<WaitlistEntry[]> {
  if (hasKv()) {
    try {
      const raw = await kvModule.kv.lrange('waitlist', 0, -1);
      if (raw && raw.length) return raw as WaitlistEntry[];
    } catch {}
  }
  return SEED;
}

export async function addWaitlist(entry: WaitlistEntry): Promise<{ existing: boolean }> {
  const list = await getWaitlist();
  if (list.some((e) => e.email === entry.email)) return { existing: true };
  if (hasKv()) {
    try {
      await kvModule.kv.rpush('waitlist', entry);
    } catch {
      // KV write failed — degrade; entry not persisted
      console.warn('[perch] KV write failed; entry not persisted:', entry.email);
    }
  } else {
    // No KV configured (local dev or unprovisioned Vercel). Log so it is visible.
    console.log('[perch] waitlist signup (no KV configured, not persisted):', entry.email);
  }
  return { existing: false };
}

export async function getReferrals(): Promise<Referral[]> {
  if (hasKv()) {
    try {
      const raw = await kvModule.kv.lrange('referrals', 0, -1);
      if (raw && raw.length) return raw as Referral[];
    } catch {}
  }
  return [];
}

export async function addReferral(referee: string): Promise<void> {
  if (hasKv()) {
    try {
      await kvModule.kv.rpush('referrals', { referee, at: new Date().toISOString() });
    } catch {
      console.warn('[perch] KV referral write failed:', referee);
    }
  }
}

export async function getStatus(email: string) {
  const list = await getWaitlist();
  const idx = list.findIndex((e) => e.email === email);
  if (idx === -1) return { ok: true, found: false };
  const entry = list[idx];
  const refs = await getReferrals();
  const referralCount = refs.filter((r) => r.referee === email).length;
  const position = idx + 1;
  const total = list.length;
  const estimatedAccess =
    position <= Math.ceil(total * 0.2)
      ? 'within the next 2 weeks'
      : position <= Math.ceil(total * 0.5)
      ? 'within the next month'
      : 'within the next 6–8 weeks';
  return {
    ok: true,
    found: true,
    position,
    total,
    estimatedAccess,
    referralCode: entry.ref,
    referralCount,
    name: entry.name,
    segment: entry.segment,
  };
}

export async function getStats() {
  const list = await getWaitlist();
  const refs = await getReferrals();
  const total = list.length;
  const households = list.filter((e) => e.segment === 'household').length;
  const businesses = list.filter((e) => e.segment === 'business').length;
  const totalRefs = refs.length;
  const today = new Date().toISOString().slice(0, 10);
  const todaySignups = list.filter((e) => e.at && e.at.slice(0, 10) === today).length;
  const avg = total > 0 ? Math.round((totalRefs / total) * 10) / 10 : 0;
  return { total, households, businesses, totalRefs, todaySignups, avgReferralsPerPerson: avg };
}

// simple sliding-window rate limit using KV (or in-memory fallback)
const rateMap = new Map<string, { start: number; count: number }>();
export async function rateLimit(ip: string): Promise<boolean> {
  const now = Date.now();
  const key = `rl:${ip}`;
  if (hasKv()) {
    try {
      const cur = (await kvModule.kv.incr(key)) as number;
      if (cur === 1) await kvModule.kv.expire(key, 60);
      return cur <= 10;
    } catch {}
  }
  const entry = rateMap.get(ip);
  if (!entry || now - entry.start > 60000) {
    rateMap.set(ip, { start: now, count: 1 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}
