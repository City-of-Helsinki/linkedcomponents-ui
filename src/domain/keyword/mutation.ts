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

  mutation UpdateKeyword($input: UpdateKeywordMutationInput!) {
    updateKeyword(input: $input)
      @rest(
        type: "Keyword"
        path: "/keyword/{args.input.id}/"
        method: "PUT"
        bodyKey: "input"
      ) {
      ...keywordFields
    }
  }
`;
