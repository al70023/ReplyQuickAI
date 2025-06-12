import { create } from 'zustand';
import { CallLog, SMSThread, SMSMessage } from '../types';
import { mockCalls, mockSmsThreads } from '../data';

interface AppState {
  callLogs: CallLog[];
  smsThreads: SMSThread[];
  toggleQualification: (callId: string) => void;
  addSmsMessage: (contactId: string, messageBody: string) => void;
}

const useStore = create<AppState>((set) => ({
  // State
  callLogs: mockCalls,
  smsThreads: mockSmsThreads,

  // Actions
  toggleQualification: (callId) =>
    set((state) => ({
      callLogs: state.callLogs.map((log) =>
        log.id === callId ? { ...log, isQualified: !log.isQualified } : log
      ),
    })),

  addSmsMessage: (contactId, messageBody) =>
    set((state) => {
      const newMessage: SMSMessage = {
        id: `msg-${Date.now()}`,
        body: messageBody,
        timestamp: new Date().toISOString(),
        direction: 'outbound',
      };

      return {
        smsThreads: state.smsThreads.map((thread) =>
          thread.contactId === contactId
            ? { 
                ...thread,
                messages: [...thread.messages, newMessage],
                lastMessage: messageBody,
                timestamp: newMessage.timestamp,
              }
            : thread
        ),
      };
    }),
}));

export default useStore; 