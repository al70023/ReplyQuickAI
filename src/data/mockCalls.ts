import { faker } from '@faker-js/faker';
import type { CallLog } from '../types';

const mockCalls: CallLog[] = [];

for (let i = 0; i < 25; i++) {
  const transcriptLength = faker.number.int({ min: 5, max: 20 });
  const transcript = Array.from({ length: transcriptLength }, () =>
    faker.lorem.sentence()
  );

  const call: CallLog = {
    id: faker.string.uuid(),
    callerNumber: faker.phone.number(),
    dialedNumber: faker.phone.number(),
    timestamp: faker.date.recent().toISOString(),
    duration: `${faker.number.int({ min: 1, max: 59 })}m ${faker.number.int({
      min: 0,
      max: 59,
    })}s`,
    summary: faker.lorem.paragraph(),
    isQualified: faker.datatype.boolean(),
    transcript: transcript,
    recordingUrl: faker.internet.url(),
  };

  mockCalls.push(call);
}

export default mockCalls; 