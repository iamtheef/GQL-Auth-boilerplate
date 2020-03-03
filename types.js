const mongoose = require("mongoose");
const graphql = require("graphql");
const { User } = require("./models/User");
const { Client } = require("./models/Client");
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList,
  GraphQLString
} = graphql;

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    clients: {
      type: new GraphQLList(ClientType),
      resolve(parent, args) {
        return Client.find({ name: parent.name });
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

module.exports = { UserType, ClientType };