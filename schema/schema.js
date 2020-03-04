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
  GraphQLNonNull,
  GraphQLBoolean
} = graphql;

const rootQuery = new GraphQLObjectType({
  name: "rootQuery",
  fields: {
    hello: {
      type: GraphQLString,
      resolve(_, args) {
        return "Hello Bitch!";
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    // isUserRegistered
    isUserRegistered: {
      type: GraphQLBoolean,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(_, args) {
        if (await User.findOne({ email: args.email })) return true;
        return false;
      }
    },

    // register mutation
    register: {
      type: AuthType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(_, args) {
        const user = new User({
          username: args.username,
          password: bcrypt.hashSync(args.password, 12),
          email: args.email
        });
        const newUser = user.save();
        return { user: newUser, error: null };
      }
    },

    //login mutation
    login: {
      type: AuthType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(_, args) {
        const user = await User.findOne({ email: args.email });
        const match = await bcrypt.compare(args.password, user.password);
        if (user && match) {
          return { user, error: null };
        }
        return { user: null, error: "Incorrect email/password" };
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: rootQuery,
  mutation
});
