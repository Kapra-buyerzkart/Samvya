import { ManualApprovalStatus, ManualGpsRecord } from './types';

export class ApprovalWorkflowError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApprovalWorkflowError';
  }
}

export function canTransitionApproval(
  currentStatus: ManualApprovalStatus,
  targetStatus: ManualApprovalStatus,
): boolean {
  if (currentStatus === 'pending') {
    return targetStatus === 'approved' || targetStatus === 'rejected';
  }
  // Once approved or rejected, status is final
  return false;
}

export function approveManualRequest(
  record: ManualGpsRecord,
  reviewedBy: string,
  reviewNote?: string,
): ManualGpsRecord {
  if (!canTransitionApproval(record.status, 'approved')) {
    throw new ApprovalWorkflowError(
      `Cannot approve request with current status '${record.status}'. Only 'pending' requests can be approved.`,
    );
  }

  if (!reviewedBy || reviewedBy.trim().length === 0) {
    throw new ApprovalWorkflowError('Supervisor ID is required to approve manual GPS request.');
  }

  const now = Date.now();
  return {
    ...record,
    status: 'approved',
    updatedAt: now,
    audit: {
      ...record.audit,
      reviewedBy,
      reviewedAt: now,
      reviewNote: reviewNote?.trim() ?? null,
    },
  };
}

export function rejectManualRequest(
  record: ManualGpsRecord,
  reviewedBy: string,
  reviewNote: string,
): ManualGpsRecord {
  if (!canTransitionApproval(record.status, 'rejected')) {
    throw new ApprovalWorkflowError(
      `Cannot reject request with current status '${record.status}'. Only 'pending' requests can be rejected.`,
    );
  }

  if (!reviewedBy || reviewedBy.trim().length === 0) {
    throw new ApprovalWorkflowError('Supervisor ID is required to reject manual GPS request.');
  }

  if (!reviewNote || reviewNote.trim().length < 5) {
    throw new ApprovalWorkflowError('A substantive rejection reason (at least 5 characters) is required.');
  }

  const now = Date.now();
  return {
    ...record,
    status: 'rejected',
    updatedAt: now,
    audit: {
      ...record.audit,
      reviewedBy,
      reviewedAt: now,
      reviewNote: reviewNote.trim(),
    },
  };
}
