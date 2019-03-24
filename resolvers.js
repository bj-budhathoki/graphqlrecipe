const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;
  return jwt.sign({ username, email }, secret, { expiresIn });
};

exports.resolvers = {
  Query: {
    getAllRecipes: async (root, args, ctx) => {
      const allRecipe = await ctx.Recipe.find({});
      return allRecipe;
    }
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
    },

    signinUser: async (root, { username, password }, { User }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error("User not found");
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error("Invalid password");
      }
      return { token: createToken(user, process.env.SECRET, "1hr") };
    },

    signupUser: async (root, { username, email, password }, { User }) => {
      const user = await User.findOne({ username });
      if (user) {
        throw new Error("User aleady exists");
      }
      const newUser = await new User({
        username,
        email,
        password
      });
      await bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save();
        });
      });
      return { token: createToken(newUser, process.env.SECRET, "1hr") };
    }
  }
};
