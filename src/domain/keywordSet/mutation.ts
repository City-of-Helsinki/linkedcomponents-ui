// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag';

export const MUTATION_KEYWORD = gql`
  mutation CreateKeywordSet($input: CreateKeywordSetMutationInput!) {
    createKeywordSet(input: $input)
      @rest(
        type: "Event"
        path: "/keyword_set/"
        method: "POST"
        bodyKey: "input"
      ) {
      ...keywordSetFields
    }
  }
`;
