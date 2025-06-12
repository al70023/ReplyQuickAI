export interface CallLog {
  id: string;
  callerNumber: string;
  dialedNumber: string;
  timestamp: string;
  duration: string;
  summary: string;
  isQualified: boolean;
  transcript: string[];
  recordingUrl: string;
}

export interface SMSMessage {
  id: string;
  body: string;
  timestamp: string;
  direction: 'inbound' | 'outbound';
}

export interface SMSThread {
  contactId: string;
  contactNumber: string;
  contactName: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  messages: SMSMessage[];
  twilioNumber?: string;
  callToTextContext?: string;
}

export interface Contact {
  id: string;
  name: string;
  number: string;
}

export interface SmartReply {
  id: string;
  text: string;
} 