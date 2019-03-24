const { gql } = require("apollo-server-express");

exports.typeDefs = gql`
  type Recipe {
    name: String!
    category: String!
    description: String!
    instructions: String!
    createDate: String
    likes: Int
    username: String
  }
  type User {
    username: String!
    password: String!
    email: String!
    joinDate: String
    favorites: [Recipe]
  }

  type Query {
    getAllRecipes: [Recipe]
  }
  type Mutation {
    addRecipe(
      name: String!
      category: String!
      description: String!
      instructions: String!
      username: String
    ): Recipe
  }
`;
