const mongoose = require("mongoose");

const PASSWORD = process.argv[2];
const PERSON_NAME = process.argv[3];
const PERSON_NUMBER = process.argv[4];

const URL = `mongodb+srv://98urbanmateusz:${PASSWORD}@cluster0.xlllu.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`;

if (process.argv.length < 3) {
  console.log("give password as agrument");
  process.exit(1);
}

const noteSchema = new mongoose.Schema({
  name: String,
  number: String,
});

mongoose.set("strictQuery", false);
mongoose.connect(URL);

const Person = mongoose.model("Person", noteSchema);

const person = new Person({
  name: PERSON_NAME,
  number: PERSON_NUMBER,
});

if (process.argv.length === 3) {
  (async () => {
    try {
      const persons = await Person.find({});
      console.log(`phonebook:`);
      persons.forEach((person) => {
        console.log(`${person.name} ${person.number}`);
      });
    } catch (error) {
      console.error(error);
    } finally {
      mongoose.connection.close();
    }
  })();
} else {
  person.save().then((result) => {
    console.log(`added ${PERSON_NAME} number ${PERSON_NUMBER} to phonebook`);
    mongoose.connection.close();
  });
}
