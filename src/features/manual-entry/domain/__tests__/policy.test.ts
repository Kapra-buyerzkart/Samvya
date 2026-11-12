import {
  evaluateRateLimit,
  getManualGpsPolicy,
  isSameDay,
  saveManualGpsPolicy,
} from '../policy';
import { DEFAULT_MANUAL_POLICY } from '../types';

describe('Manual GPS Policy & Rate Limiting', () => {
  beforeEach(() => {
    saveManualGpsPolicy(DEFAULT_MANUAL_POLICY);
  });

  it('determines same calendar day matching accurately', () => {
    const t1 = new Date('2026-11-12T10:00:00Z').getTime();
    const t2 = new Date('2026-11-12T14:30:00Z').getTime();
    const t3 = new Date('2026-11-13T10:00:00Z').getTime();

    expect(isSameDay(t1, t2)).toBe(true);
    expect(isSameDay(t1, t3)).toBe(false);
  });

  it('allows submissions within daily rate limit', () => {
    const check1 = evaluateRateLimit(0);
    expect(check1.allowed).toBe(true);
    expect(check1.remainingEntriesToday).toBe(2);

    const check2 = evaluateRateLimit(1);
    expect(check2.allowed).toBe(true);
    expect(check2.remainingEntriesToday).toBe(1);
  });

  it('blocks submissions once daily rate limit is reached', () => {
    const checkBlocked = evaluateRateLimit(2);
    expect(checkBlocked.allowed).toBe(false);
    expect(checkBlocked.remainingEntriesToday).toBe(0);
    expect(checkBlocked.reason).toContain('Daily limit reached');
  });

  it('blocks submissions when administrative policy disables manual GPS', () => {
    saveManualGpsPolicy({ enabled: false });
    const checkDisabled = evaluateRateLimit(0, getManualGpsPolicy());
    expect(checkDisabled.allowed).toBe(false);
    expect(checkDisabled.reason).toContain('disabled by administrative policy');
  });
});
