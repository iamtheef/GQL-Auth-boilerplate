const graphql = require("graphql");
const { UserType, ClientType, AuthType } = require("../types");
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
      type: AuthType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args) {
        const existingUser = await User.findOne({ email: args.email });

        if (existingUser) {
          return {
            user: null,
            error: "User already exists"
          };
        }

        const user = new User({
          username: args.username,
          password: bcrypt.hashSync(args.password, 12),
          email: args.email
        });
        const newUser = user.save();
        return { user: newUser, error: null };
      }
    },
    login: {
      type: AuthType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args) {
        const user = await User.findOne({ email: args.email });
        const match = await bcrypt.compare(args.password, user.password);
        if (user && match) {
          return { user, error: null };
        }
        return { user: null, error: "Incorrect user password" };
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: rootQuery,
  mutation
});
