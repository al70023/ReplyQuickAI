import { mockCalls } from '../data';
import type { CallLog } from '../types';

// Simulate API latency
const LATENCY = 500;

export const callService = {
  getCallLogs: (): Promise<CallLog[]> => {
    return new Promise(resolve => {
      setTimeout(() => resolve([...mockCalls]), LATENCY);
    });
  },

  updateQualificationStatus: (
    callId: string,
    isQualified: boolean
  ): Promise<CallLog | undefined> => {
    return new Promise(resolve => {
      const callIndex = mockCalls.findIndex(call => call.id === callId);
      if (callIndex !== -1) {
        mockCalls[callIndex].isQualified = isQualified;
        setTimeout(() => resolve({ ...mockCalls[callIndex] }), LATENCY);
      } else {
        setTimeout(() => resolve(undefined), LATENCY);
      }
    });
  },
}; 