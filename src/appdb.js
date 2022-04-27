const {MongoClient}=require('mongodb');
const mongoose = require("mongoose");

const mongoAtlasUri =
"mongodb+srv://chen:123@cluster0.xjbqx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

try {
  // Connect to the MongoDB cluster
  mongoose.connect(
    mongoAtlasUri,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("Mongoose is connected"),
  );
  const dbConnection = mongoose.connection;
  dbConnection.on("error", (err) => {
      console.error(err)
    });
  dbConnection.once("open", () => console.log("Connected to DB!"));
} catch (e) {
  console.log("could not connect");
}

async function listDatabases(){
    const databasesList = await mongoose.listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => {
        console.log('- ${db.name}');
    })                   
}