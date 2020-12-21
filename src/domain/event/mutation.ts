import gql from 'graphql-tag';

export const MUTATION_EVENT = gql`
  mutation CreateEvent($input: CreateEventMutationInput!) {
    createEvent(input: $input)
      @rest(type: "Event", path: "/event/", method: "POST", bodyKey: "input") {
      ...eventFields
    }
  }

  mutation CreateEvents($input: [CreateEventMutationInput!]!) {
    createEvents(input: $input)
      @rest(type: "Event", path: "/event/", method: "POST", bodyKey: "input") {
      ...eventFields
    }
  }
`;
