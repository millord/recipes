const express = require("express");
const mongoose = require("mongoose");
const Recipe = require("./models/Recipe");
const cors = require("cors");
const User = require("./models/User");
const bodyParser = require("body-parser");
require("dotenv").config({ path: "./variables.env" });

// Bring in  GraphQL-Express middleware

const { graphiqlExpress, graphqlExpress } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");

const { typeDefs } = require("./schema");
const { resolvers } = require("./resolvers");

// Create schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

// Connect to the database
mongoose
  .connect(process.env.MONGO_URI, { autoIndex: false })
  .then(() => console.log("DB Connected"))
  .catch(err => console.error(err));

// Initialized the application
const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true
};

app.use(cors(corsOptions));

// Create GraphiQL application
app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

// Connect Schemas to Graphql
app.use(
  "/graphql",
  bodyParser.json(),
  graphqlExpress({
    schema,
    context: {
      Recipe,
      User
    }
  })
);

const PORT = process.env.PORT || 4444;

app.listen(PORT, () => {
  console.log(`Server listening on  PORT ${PORT}`);
});
