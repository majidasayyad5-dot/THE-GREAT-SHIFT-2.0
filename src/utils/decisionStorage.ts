import { HumanDecisionRecord, RecommendationDecisionStatus } from '../types/bi';

export const HUMAN_DECISIONS_STORAGE_KEY = 'great_shift_human_decisions_v2';

/**
 * Loads all real user decisions from storage.
 * Strictly returns actual recorded decisions only — never creates fake history.
 */
export function getStoredDecisions(): HumanDecisionRecord[] {
  try {
    const raw = localStorage.getItem(HUMAN_DECISIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (e) {
    console.error('Error loading human decisions from storage:', e);
    return [];
  }
}

/**
 * Saves a new decision record to the persistent store.
 * Immediately notifies subscribers via CustomEvent.
 */
export function saveDecision(
  recordInput: Omit<HumanDecisionRecord, 'id' | 'timestamp' | 'date'>
): HumanDecisionRecord {
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const newRecord: HumanDecisionRecord = {
    ...recordInput,
    id: `dec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    date: dateFormatted,
    timestamp: now.toISOString(),
  };

  try {
    const current = getStoredDecisions();
    // Add new decision at the beginning of the history
    const updated = [newRecord, ...current];
    localStorage.setItem(HUMAN_DECISIONS_STORAGE_KEY, JSON.stringify(updated));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('human_decisions_updated', {
          detail: { record: newRecord },
        })
      );
    }
  } catch (e) {
    console.error('Failed to save human decision:', e);
  }

  return newRecord;
}

/**
 * Computes the current decision status for a given recommendation ID.
 * Returns 'New' if no decision has been recorded yet.
 */
export function getRecommendationStatus(
  recommendationId: string,
  decisionsList?: HumanDecisionRecord[]
): RecommendationDecisionStatus {
  const list = decisionsList || getStoredDecisions();
  const latest = list.find((d) => d.recommendationId === recommendationId);
  if (!latest) return 'New';

  switch (latest.decisionAction) {
    case 'review':
      return 'Under Review';
    case 'accept':
      return 'Accepted';
    case 'modify':
      return 'Modified';
    case 'reject':
      return 'Rejected';
    default:
      return latest.decision || 'New';
  }
}

/**
 * Returns a dictionary of recommendation ID to current decision status.
 */
export function getAllRecommendationStatuses(
  decisionsList?: HumanDecisionRecord[]
): Record<string, RecommendationDecisionStatus> {
  const list = decisionsList || getStoredDecisions();
  const statuses: Record<string, RecommendationDecisionStatus> = {};

  for (const decision of list) {
    if (!statuses[decision.recommendationId]) {
      statuses[decision.recommendationId] = getRecommendationStatus(
        decision.recommendationId,
        list
      );
    }
  }

  return statuses;
}

/**
 * Resets decision history (e.g. for workspace reset in Settings)
 */
export function clearAllDecisions(): void {
  try {
    localStorage.removeItem(HUMAN_DECISIONS_STORAGE_KEY);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('human_decisions_updated', {
          detail: { cleared: true },
        })
      );
    }
  } catch (e) {
    console.error('Failed to clear human decisions:', e);
  }
}
