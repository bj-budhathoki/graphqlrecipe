exports.resolvers = {
  Query: {
    getAllRecipes: () => {}
  },
  Mutation: {
    addRecipe: async (root, args, ctx) => {
      const newRecipe = await new ctx.Recipe({
        name: args.name,
        description: args.description,
        category: args.category,
        instructions: args.instructions,
        username: args.username
      }).save();
      return newRecipe;
    }
  }
};
