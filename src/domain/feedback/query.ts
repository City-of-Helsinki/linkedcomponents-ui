import gql from 'graphql-tag';

export const QUERY_FEEDBACK = gql`
  fragment feedbackFields on Feedback {
    id
    name
    email
    subject
    body
  }
`;
