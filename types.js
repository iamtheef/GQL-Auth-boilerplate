const mongoose = require("mongoose");
const graphql = require("graphql");
const { User } = require("./models/User");
const { Client } = require("./models/Client");
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLList,
  GraphQLString,
  GraphQLInputObjectType
} = graphql;

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    email: { type: GraphQLString },

    clients: {
      type: new GraphQLList(ClientType),
      resolve(_, args) {
        return Client.find({ name: _.name });
      }
    }
  })
});

const ClientType = new GraphQLObjectType({
  name: "Client",
  fields: () => ({
    id: { type: GraphQLID },
    fname: { type: GraphQLString },
    lname: { type: GraphQLString },
    email: { type: GraphQLString },
    tel: { type: GraphQLString }
  })
});

const AuthType = new GraphQLObjectType({
  name: "Auth",
  fields: () => ({
    user: { type: UserType },
    error: { type: GraphQLString }
  })
});

module.exports = { UserType, ClientType, AuthType };
