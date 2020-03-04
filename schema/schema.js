const graphql = require("graphql");
const { UserType, ClientType } = require("../types");
const User = require("../models/User");
const Client = require("../models/Client");
const bcrypt = require("bcryptjs");
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
      resolve(parent, args) {
        return "Hello Bitch!";
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    register: {
      type: UserType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args) {
        const existingUser = await User.find({ email: args.email });
        if (existingUser) {
          throw Error({ email: "User already exists" });
        }

        const user = new User({
          username: args.username,
          password: bcrypt.hashSync(args.password, 12),
          email: args.email
        });
        return user.save();
      }
    },
    login: {
      type: UserType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args) {
        const user = await User.findOne({ email: args.email });
        const match = await bcrypt.compare(args.password, user.password);
        if (user && match) {
          return user;
        }
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: rootQuery,
  mutation
});
