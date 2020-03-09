const graphql = require("graphql");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { UserType, ClientType, AuthType } = require("../types");
const User = require("../models/User");
const Client = require("../models/Client");
const GoogleStrategy = require("passport-google-oauth20");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInputObjectType
} = graphql;

const rootQuery = new GraphQLObjectType({
  name: "rootQuery",
  fields: {
    hello: {
      type: GraphQLString,
      resolve(_, args) {
        return "Hello Bitch!";
      }
    },

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
    }
  }
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    // register mutation
    register: {
      type: AuthType,
      args: {
        fullname: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(_, args) {
        await new User({
          fullname: args.fullname,
          email: args.email,
          password: bcrypt.hashSync(args.password, 12)
        })
          .save(user => {
            return { user, error: null };
          })
          .catch(e => {
            return {
              user: null,
              error: "Ooops, something is wrong. Try again."
            };
          });
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
        const userFound = await User.findOne({ email: args.email });
        const passMatches = await bcrypt.compare(args.password, user.password);
        if (userFound && passMatches) {
          return { user: userFound, error: null };
        }
        return { user: null, error: "Incorrect email/password" };
      }
    },

    googleLogin: {
      type: AuthType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: new GraphQLNonNull(GraphQLString) },
        avatar: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(_, args) {
        const user = await User.findOne({ googleID: args.id });
        if (user) return { user, error: null };
        const newUser = await new User({
          username: args.username,
          isGoogle: true,
          googleID: args.id,
          avatar: args.avatar
        }).save();
        return { user: newUser, error: null };
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: rootQuery,
  mutation
});
