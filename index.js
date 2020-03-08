const express = require("express");
const app = express();
const { ApolloServer } = require("apollo-server");
const { DB_credits } = require("./config/credits");
const schema = require("./schema/schema");
const passport = require("passport");
const mongoose = require("mongoose");
const passportAuth = require("./config/passport-auth");

app.use(passport.initialize());

// Atlas DB
const DB = `mongodb+srv://${DB_credits.username}:${DB_credits.password}@gql-testdb-n027j.mongodb.net/test?retryWrites=true&w=majority`;

// Local DB
// const DB = `mongodb://localhost:27017/gql`;

const PORT = process.env.PORT || 4001;

(async () => {
  // express router for server and authentication routes
  await app.listen(PORT, () => console.log(`Listening on ${PORT}`));

  //runs Apollo server for API
  const server = new ApolloServer({
    schema,
    introspection: true,
    playground: {
      settings: {
        "editor.theme": "dark"
      }
    }
  });
  await server.listen(4000).then(() => {
    console.log(`🚀 Listening on 4000`);
  });

  await mongoose
    .connect(DB, {
      useCreateIndex: true,
      useUnifiedTopology: true,
      useNewUrlParser: true
    })
    .then(console.log("Connected To Mongo Db DataBase"))
    .catch(e => console.log(e));
})();

// ================================
// ROUTES =======================\\\
// ================================

app.get("/", (req, res) => {
  res.send("Hello all possible worlds"); // insert React app here
});

// route for google OAuth
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile"]
  })
);

// redirecting from google
app.get(
  "/auth/google/redirection",
  passport.authenticate("google"),
  (req, res) => {
    res.redirect("http://localhost:4000");
  }
);
