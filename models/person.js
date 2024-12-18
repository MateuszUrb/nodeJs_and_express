const mongoose = require("mongoose")

mongoose.set("strictQuery", false)

const url = process.env.MONGODB_URI

console.log(`connection to ${url}`)

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected")
  })
  .catch((error) => {
    console.error(`error connecting to MongoDB: ${error.message}`)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d+$/.test(v)
      },
      message: (props) => `${props.value} is not a valid phone nubmer`,
    },
    required: [true, "Person phone nubmer required"],
  },
})

personSchema.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
  },
})

module.exports = mongoose.model("Person", personSchema)
