const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Give password as an argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://danekbel:${password}@cluster0.fgqwpox.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB')
    if (process.argv.length === 3) {
      // If only password is provided, display all entries in the phonebook
      displayPhonebook()
    } else if (process.argv.length === 5) {
      // If three arguments are provided, add a new entry to the phonebook
      const name = process.argv[3]
      const number = process.argv[4]
      addEntry(name, number)
    } else {
      console.log('Invalid arguments')
      process.exit(1)
    }
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message)
    process.exit(1)
  })

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', phonebookSchema)

function displayPhonebook() {
  Person.find({})
    .then((entries) => {
      console.log('Phonebook:')
      entries.forEach((entry) => {
        console.log(entry.name, entry.number)
      })
      mongoose.connection.close()
    })
    .catch((error) => {
      console.error('Error retrieving phonebook entries:', error.message)
      mongoose.connection.close()
    })
}

function addEntry(name, number) {
  const entry = new Person({
    name: name,
    number: number,
  })

  entry.save()
    .then(() => {
      console.log(`Added ${name} number ${number} to phonebook`)
      mongoose.connection.close()
    })
    .catch((error) => {
      console.error('Error adding entry to phonebook:', error.message)
      mongoose.connection.close()
    })
}
