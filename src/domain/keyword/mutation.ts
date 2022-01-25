// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const MUTATION_EVENT = gql`
  mutation CreateKeyword($input: CreateKeywordMutationInput!) {
    createKeyword(input: $input)
      @rest(
        type: "Event"
        path: "/keyword/"
        method: "POST"
        bodyKey: "input"
      ) {
      ...keywordFields
    }
  }
`;
