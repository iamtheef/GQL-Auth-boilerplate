const graphql = require("graphql");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql;

const rootQuery = new GraphQLObjectType({
  name: "rootQuery",
  fields: {
    hello: {
      type: GraphQLString,
      args: {},
      resolve(parent, args) {
        return "Hello Bitch!";
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: rootQuery
});
