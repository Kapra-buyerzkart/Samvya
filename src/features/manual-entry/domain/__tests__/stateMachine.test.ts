import {
  ApprovalWorkflowError,
  approveManualRequest,
  canTransitionApproval,
  rejectManualRequest,
} from '../stateMachine';
import { ManualGpsRecord } from '../types';

describe('Manual GPS Approval Workflow & State Machine', () => {
  const sampleRecord: ManualGpsRecord = {
    id: 1,
    clientId: 'req-1',
    userId: 'emp-101',
    latitude: 28.6139,
    longitude: 77.209,
    reason: 'Underground client datacenter lack of GPS satellite visibility.',
    photoUri: null,
    photoQuality: null,
    status: 'pending',
    source: 'manual',
    audit: {
      who: 'emp-101',
      when: 1000000,
      device: {
        os: 'ios',
        osVersion: '18.0',
        appVersion: '1.0.0',
      },
      reason: 'Underground client datacenter lack of GPS satellite visibility.',
      originalDeviceFix: {
        latitude: 28.613,
        longitude: 77.208,
        accuracy: 120,
        timestamp: 999900,
      },
      reviewedBy: null,
      reviewedAt: null,
      reviewNote: null,
    },
    createdAt: 1000000,
    updatedAt: 1000000,
  };

  it('allows transition from pending to approved or rejected', () => {
    expect(canTransitionApproval('pending', 'approved')).toBe(true);
    expect(canTransitionApproval('pending', 'rejected')).toBe(true);
    expect(canTransitionApproval('pending', 'pending')).toBe(false);
  });

  it('disallows transitions from terminal states (approved/rejected)', () => {
    expect(canTransitionApproval('approved', 'pending')).toBe(false);
    expect(canTransitionApproval('approved', 'rejected')).toBe(false);
    expect(canTransitionApproval('rejected', 'approved')).toBe(false);
    expect(canTransitionApproval('rejected', 'pending')).toBe(false);
  });

  it('approves a pending request with supervisor audit info', () => {
    const approved = approveManualRequest(
      sampleRecord,
      'sup-manager-42',
      'Verified with on-site facility log.',
    );

    expect(approved.status).toBe('approved');
    expect(approved.audit.reviewedBy).toBe('sup-manager-42');
    expect(approved.audit.reviewedAt).toBeGreaterThan(0);
    expect(approved.audit.reviewNote).toBe('Verified with on-site facility log.');
  });

  it('rejects a pending request with mandatory reason', () => {
    const rejected = rejectManualRequest(
      sampleRecord,
      'sup-manager-42',
      'No scheduled appointment at this site.',
    );

    expect(rejected.status).toBe('rejected');
    expect(rejected.audit.reviewedBy).toBe('sup-manager-42');
    expect(rejected.audit.reviewedAt).toBeGreaterThan(0);
    expect(rejected.audit.reviewNote).toBe('No scheduled appointment at this site.');
  });

  it('throws when attempting to approve without supervisor ID', () => {
    expect(() => approveManualRequest(sampleRecord, '')).toThrow(
      ApprovalWorkflowError,
    );
  });

  it('throws when attempting to reject without substantive note', () => {
    expect(() => rejectManualRequest(sampleRecord, 'sup-1', 'bad')).toThrow(
      'A substantive rejection reason',
    );
  });

  it('throws when attempting to re-approve an already approved request', () => {
    const approved = approveManualRequest(sampleRecord, 'sup-1');
    expect(() => approveManualRequest(approved, 'sup-2')).toThrow(
      ApprovalWorkflowError,
    );
  });
});
