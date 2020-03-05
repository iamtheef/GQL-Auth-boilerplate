const { ApolloServer } = require("apollo-server");
const schema = require("./schema/schema");
const credits = require("./credits");
const mongoose = require("mongoose");

(async () => {
  const DB = `mongodb+srv://${credits.username}:${credits.password}@gql-testdb-n027j.mongodb.net/test?retryWrites=true&w=majority`;
  const PORT = process.env.PORT || 4001;

  // await app.listen(port, () => console.log(`Listening on ${port}`));
  const server = new ApolloServer({
    schema,
    introspection: true,
    playground: {
      settings: {
        "editor.theme": "grey"
      }
    }
  });
  await server.listen(PORT).then(() => {
    console.log(`🚀 Listening on ${PORT}`);
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
