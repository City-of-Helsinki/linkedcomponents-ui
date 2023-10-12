import { FeedbackInput } from '../../../generated/graphql';
import { omitSensitiveDataFromFeedbackPayload } from '../utils';

describe('omitSensitiveDataFromFeedbackPayload', () => {
  it('should omit sensitive data from payload', () => {
    const payload: FeedbackInput = {
      body: 'Body',
      email: 'test@email.com',
      name: 'Name',
      subject: 'Subject',
    };

    const filteredPayload = omitSensitiveDataFromFeedbackPayload(
      payload
    ) as FeedbackInput;
    expect(filteredPayload).toEqual({
      body: 'Body',
      subject: 'Subject',
    });
    expect(filteredPayload.email).toBeUndefined();
    expect(filteredPayload.name).toBeUndefined();
  });
});
