const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log(`connection to ${url}`);

mongoose
  .connect(url)
  .then((result) => {
    console.log(`connected`);
  })
  .catch((error) => {
    console.error(`error connecting to MongoDB: ${error.message}`);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
