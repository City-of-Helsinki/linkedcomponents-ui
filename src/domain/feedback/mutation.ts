import gql from 'graphql-tag';

export const MUTATION_FEEDBACK = gql`
  mutation PostFeedback($input: FeedbackInput!) {
    postFeedback(input: $input)
      @rest(
        type: "Feedback"
        path: "/feedback/"
        method: "POST"
        bodyKey: "input"
      ) {
      ...feedbackFields
    }
  }
  mutation PostGuestFeedback($input: FeedbackInput!) {
    postGuestFeedback(input: $input)
      @rest(
        type: "Feedback"
        path: "/guest-feedback/"
        method: "POST"
        bodyKey: "input"
      ) {
      ...feedbackFields
    }
  }
`;
