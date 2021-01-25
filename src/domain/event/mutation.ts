import gql from 'graphql-tag';

export const MUTATION_EVENT = gql`
  mutation CreateEvent($input: CreateEventMutationInput!) {
    createEvent(input: $input)
      @rest(type: "Event", path: "/event/", method: "POST", bodyKey: "input") {
      ...eventFields
    }
  }

  mutation DeleteEvent($id: ID!) {
    deleteEvent(id: $id)
      @rest(type: "NoContent", path: "/event/{args.id}/", method: "DELETE") {
      noContent
    }
  }

  mutation UpdateEvent($input: UpdateEventMutationInput!) {
    updateEvent(input: $input)
      @rest(
        type: "Event"
        path: "/event/{args.input.id}/"
        method: "PUT"
        bodyKey: "input"
      ) {
      ...eventFields
    }
  }

  mutation CreateEvents($input: [CreateEventMutationInput!]!) {
    createEvents(input: $input)
      @rest(type: "Event", path: "/event/", method: "POST", bodyKey: "input") {
      ...eventFields
    }
  }

  mutation UpdateEvents($input: [UpdateEventMutationInput!]!) {
    updateEvents(input: $input)
      @rest(type: "Event", path: "/event/", method: "PUT", bodyKey: "input") {
      ...eventFields
    }
  }
`;
