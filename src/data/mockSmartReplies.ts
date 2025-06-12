import { faker } from '@faker-js/faker';
import type { SmartReply } from '../types';

const mockSmartReplies: SmartReply[] = [
  { id: faker.string.uuid(), text: 'Sounds good, thank you!' },
  { id: faker.string.uuid(), text: 'Yes, that works for me.' },
  { id: faker.string.uuid(), text: 'No, thank you.' },
  { id: faker.string.uuid(), text: 'Can you provide more information?' },
  { id: faker.string.uuid(), text: 'I am available to talk now.' },
  { id: faker.string.uuid(), text: 'Please call me back later.' },
  { id: faker.string.uuid(), text: 'Let me check and get back to you.' },
  { id: faker.string.uuid(), text: 'Okay 👍' },
];

export default mockSmartReplies; 