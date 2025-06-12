import { faker } from '@faker-js/faker';
import type { SMSThread, SMSMessage } from '../types';

const mockSmsThreads: SMSThread[] = [];

for (let i = 0; i < 12; i++) {
  const messages: SMSMessage[] = [];
  const messageCount = faker.number.int({ min: 5, max: 10 });
  let lastMessageTimestamp = faker.date.recent();

  for (let j = 0; j < messageCount; j++) {
    const direction = faker.helpers.arrayElement(['inbound', 'outbound']);
    // Ensure messages are chronological
    const timestamp = new Date(lastMessageTimestamp.getTime() + j * 1000 * 60 * 2); // 2 minutes apart
    const message: SMSMessage = {
      id: faker.string.uuid(),
      body: faker.lorem.sentence(),
      timestamp: timestamp.toISOString(),
      direction: direction,
    };
    messages.push(message);
  }

  const contactName = faker.person.fullName();
  const lastMessage = messages[messages.length - 1];

  const thread: SMSThread = {
    contactId: faker.string.uuid(),
    contactName: contactName,
    contactNumber: faker.phone.number(),
    lastMessage: lastMessage.body,
    timestamp: lastMessage.timestamp,
    unreadCount: faker.number.int({ min: 0, max: 3 }),
    messages: messages,
    twilioNumber: faker.phone.number(),
    callToTextContext: faker.helpers.arrayElement([
      `Follow-up from our call about ${faker.commerce.productName()}.`,
      undefined,
    ]),
  };

  mockSmsThreads.push(thread);
}

export default mockSmsThreads.sort(
  (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
); 