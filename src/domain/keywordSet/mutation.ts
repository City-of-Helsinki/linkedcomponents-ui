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

  mutation DeleteKeywordSet($id: ID!) {
    deleteKeywordSet(id: $id)
      @rest(
        type: "NoContent"
        path: "/keyword_set/{args.id}/"
        method: "DELETE"
      ) {
      noContent
    }
  }

  mutation UpdateKeywordSet($input: UpdateKeywordSetMutationInput!) {
    updateKeywordSet(input: $input)
      @rest(
        type: "KeywordSet"
        path: "/keyword_set/{args.input.id}/"
        method: "PUT"
        bodyKey: "input"
      ) {
      ...keywordSetFields
    }
  }
`;
