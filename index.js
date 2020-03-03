const express = require("express");
const app = express();
const graphHTTP = require("express-graphql");
const schema = require("./schema/schema");
const credits = require("./credits");
const mongoose = require("mongoose");

app.get("/", (req, res) => res.send("Hello all possible worlds!"));
app.use(
  "/graphql",
  graphHTTP({
    schema,
    graphiql: true
  })
);

(async () => {
  const port = process.env.PORT || 3000;
  await app.listen(port, () => console.log(`Listening on ${port}`));
  const db = `mongodb+srv://${credits.username}:${credits.password}@gql-testdb-n027j.mongodb.net/test?retryWrites=true&w=majority`;
  await mongoose
    .connect(db, {
      useCreateIndex: true,
      useUnifiedTopology: true,
      useNewUrlParser: true
    })
    .then(console.log("Connected To Mongo Db DataBase"))
    .catch(e => console.log(e));
})();
