import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import phonebookService from "./services/PhonebookService";
import Person from "./components/Person";
import Notification from "./components/Notification";

const App = () => {

  const success = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  const fail = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  const [persons, setPersons] = useState([]); 
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [message, setMessage] = useState(null);
  const [style, setStyle] = useState(success);

  useEffect(() => {
    phonebookService
    .getAll()
    .then(initial => {
      setPersons(initial);
    })
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  }

  const addPerson = (event) => {
    event.preventDefault();
    const personToAdd = {
      name: newName,
      number: newNumber,
      id: persons.length + 1
    };
    let numberAlreadyExists = false
    let id = -1
    persons.forEach(person => {
      if (person.number === newNumber) {
        numberAlreadyExists = true
      } else if (person.name === newName) {
        id = person.id
      }
    });
    if (numberAlreadyExists) {
      setStyle(fail)
      setMessage('This number already exists in the phonebook')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } else if (id !== -1) {
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
        updateNumber(id)
      }
    } else {
      phonebookService
        .create(personToAdd)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setStyle(success);
          setMessage(`Added ${newName}`);
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(error => {
          console.log(error.response.data.error)
          setStyle(fail)
          setMessage(`${error.response.data.error}`)
        })
    }
    setNewName('');
    setNewNumber('');
  }

  const updateNumber = (id) => {
    const person = persons.find(p => p.id === id);
    const changedPerson = {...person, number: newNumber};

    phonebookService
      .update(id, changedPerson)
      .then(returnedPerson => {
        setPersons(persons.map(p => p.id !== id ? p : returnedPerson));
        setStyle(success);
          setMessage(`${newName} number changed`);
          setTimeout(() => {
            setMessage(null)
          }, 5000)
      })
  }

  const removePerson = (id, name) => {
    const person = persons.find(p => p.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      phonebookService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
        .catch(error => {
          setStyle(fail);
          setMessage(`Information of ${name} has already been removed from server`);
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
    }
  }

  const peopleToShow = filter !== '' ? persons.filter(person => person.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1) : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} style={style}/>
      <Filter value={filter} onChange={handleFilterChange}/>
      <h3>Add a new</h3>
      <PersonForm onSubmit={addPerson} name={newName} nameChange={handleNameChange} number={newNumber} numberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      {peopleToShow.map(person => {
        return <Person key={person.id} person={person} onClick={() => removePerson(person.id, person.name)}/>
      })}
    </div>
  );
}

export default App;
