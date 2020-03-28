const express =require('express')
const expressGraphQl = require("express-graphql")
const mongoose = require('mongoose')


const {GraphQLID,
    GraphQLString,
GraphQLList,
GraphQLObjectType,
GraphQlSchema,
GraphQLNonNull,
GraphQLSchema
} = require("graphql")

var app = express()


mongoose.connect("mongodb+srv://mega:Mega12345@graphql-dcigo.mongodb.net/test?retryWrites=true&w=majority"


).then(
    ()=> {
        console.log("Connected succesfully")
    }
)

 const PersonModel = mongoose.model("person", {
     lastName : String,
     firstName : String
 })

 const PersonType = new GraphQLObjectType({
     name : "Person",
     fields : {
        id : {type : GraphQLID},
        firstName :{ type :  GraphQLString},
        lastName :{ type :  GraphQLString}
     }
 })

// graphql schema
// what your endpoints will return
const schema = new GraphQLSchema({
    query :  new GraphQLObjectType({
        name : "Query",
        fields : {
            people: {
                type : GraphQLList(PersonType),
                resolve : (root, args, context, info) =>{
                    // console.log(PersonModel.find())
                    return PersonModel.find().exec();
                }
            },

            person : {
                type : PersonType,
                args : {
                    id : {type : GraphQLNonNull(GraphQLID)}
                },
                resolve : (root, args, context, info) =>{
                    return PersonModel.findById(args.id).exec()
                }
            }
        }
    }),

    mutation : new GraphQLObjectType({
        name : "Mutation",
        fields: {
            person: {
                type : PersonType, 
                args : {
                    firstName : {type : GraphQLNonNull(GraphQLString)},
                    lastName : {type : GraphQLNonNull(GraphQLString)}
                },
                resolve : (root, args, contet, info) =>{
                    var newPerson = new PersonModel(args);
                    return newPerson.save()
                }
            }
        }
    })
})



// Connect to graphql with express 
app.use("/graphql", expressGraphQl({
    schema : schema,
   
   graphiql : true 
}))

app.listen(3000, () => {
    console.log("listening on port 3000")
})  