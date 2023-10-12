import omit from 'lodash/omit';

import { FeedbackInput } from '../../generated/graphql';

export const omitSensitiveDataFromFeedbackPayload = (
  payload: FeedbackInput
): Partial<FeedbackInput> => omit(payload, ['email', 'name']);
