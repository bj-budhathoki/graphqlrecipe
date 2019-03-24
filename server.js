const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config({ path: "variables.env" });
const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");
const Recipe = require("./models/Recipe");
const User = require("./models/User");

const { typeDefs } = require("./schema");
const { resolvers } = require("./resolvers");

//connects to databse
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, reconnectTries: 86400 })
  .then(() => console.log("database connected"))
  .catch(err => console.log(err));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: { Recipe, User },
  playground: {
    endpoint: `http://localhost:4000/graphql`,
    settings: {
      "editor.theme": "dark"
    }
  }
});

//Initialize application
const app = express();
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true
};
app.use(cors(corsOptions));

server.applyMiddleware({ app });
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
