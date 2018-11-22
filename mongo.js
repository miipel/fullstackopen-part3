const mongoose = require('mongoose');

// const url =

mongoose.connect(url, { useNewUrlParser: true });

const Person = mongoose.model('Person', {
  name: String,
  number: String
});

process.argv.length === 4
  ? new Person({
      name: process.argv[2],
      number: process.argv[3]
    })
      .save()
      .then(res => {
        console.log(
          'lisätään henkilö ' +
            process.argv[2] +
            ' numero ' +
            process.argv[3] +
            ' luetteloon'
        );
        mongoose.connection.close();
      })
  : process.argv.length === 2
  ? Person.find({}).then(result => {
      console.log('puhelinluettelo:')
      result.forEach(person => {
        console.log(person.name, person.number);
      });
      mongoose.connection.close();
    })
  : mongoose.connection.close();
