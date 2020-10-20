/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
const { buildSchema } = require('graphql');

module.exports = buildSchema(/* GraphQL */ `
  type Query {
    languages: LanguagesResponse!
  }

  type LanguagesResponse {
    meta: Meta!
    data: [Language]!
  }

  type Meta {
    count: Int!
    next: String
    previous: String
  }

  type Language {
    id: ID
    translationAvailable: Boolean
    name: LocalisedObject
    internalContext: String
    internalId: String
    internalType: String
  }

  type LocalisedObject {
    fi: String
    sv: String
    en: String
  }
`);
