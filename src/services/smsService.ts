import { mockSmsThreads, mockSmartReplies } from '../data';
import type { SMSThread, SmartReply, SMSMessage } from '../types';

const LATENCY = {
  FETCH: 400,
  FIND: 250,
  ACTION: 300,
};

export const smsService = {
  getSmsThreads: (): Promise<SMSThread[]> => {
    return new Promise(resolve => {
      setTimeout(() => resolve([...mockSmsThreads]), LATENCY.FETCH);
    });
  },

  getSmsThreadByContactId: (contactId: string): Promise<SMSThread | undefined> => {
    return new Promise(resolve => {
      const thread = mockSmsThreads.find(
        thread => thread.contactId === contactId
      );
      setTimeout(() => resolve(thread ? { ...thread } : undefined), LATENCY.FIND);
    });
  },

  getSmartReplies: (): Promise<SmartReply[]> => {
    return new Promise(resolve => {
      setTimeout(() => resolve([...mockSmartReplies]), LATENCY.FIND);
    });
  },

  sendMessage: (
    contactId: string,
    messageBody: string
  ): Promise<SMSThread | undefined> => {
    return new Promise(resolve => {
      const threadIndex = mockSmsThreads.findIndex(
        thread => thread.contactId === contactId
      );

      if (threadIndex !== -1) {
        const newMessage: SMSMessage = {
          id: `msg-${Date.now()}`,
          body: messageBody,
          timestamp: new Date().toISOString(),
          direction: 'outbound',
        };

        mockSmsThreads[threadIndex].messages.push(newMessage);
        mockSmsThreads[threadIndex].lastMessage = messageBody;
        mockSmsThreads[threadIndex].timestamp = newMessage.timestamp;

        setTimeout(
          () => resolve({ ...mockSmsThreads[threadIndex] }),
          LATENCY.ACTION
        );
      } else {
        setTimeout(() => resolve(undefined), LATENCY.ACTION);
      }
    });
  },
}; 