const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config({ path: "variables.env" });
const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const Recipe = require("./models/Recipe");
const User = require("./models/User");

const { typeDefs } = require("./schema");
const { resolvers } = require("./resolvers");

//connects to databse
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    reconnectTries: 86400
  })
  .then(() => console.log("database connected"))
  .catch(err => console.log(err));

//Initialize application
const app = express();
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true
};
app.use(cors(corsOptions));

//set up jwt authentication middleware
app.use(async (req, res, next) => {
  const token = req.headers["authorization"];

  if (token !== "null") {
    try {
      const currentUser = await jwt.verify(token, process.env.SECRET);
      req.currentUser = currentUser;
    } catch (error) {
      console.log(error);
    }
  }
  next();
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    Recipe,
    User,
    currentUser: req.currentUser
  }),
  playground: {
    endpoint: `http://localhost:4000/graphql`,
    settings: {
      "editor.theme": "dark"
    }
  }
});
server.applyMiddleware({ app });
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
