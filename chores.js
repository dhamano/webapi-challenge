const express = require('express');
const router = express.Router();
let maxID = 0;
let pplID = 0;

let chores = [];
const people = [
  { id: 1, name: 'Bob' },
  { id: 2, name: 'Jane' }
]

router.get('/', (req, res) => {
  const query = req.query.completed;
  let queryArr = [];
  if (query === undefined) {
    res.status(200).json(chores);
  } else {
    queryArr = chores.filter( item => {
      return item.completed.toString() === query;
    })
    res.status(200).json(queryArr);
  }
})

router.get('/user/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let assignedChores = [];
  if ( people.length > 0 && (0 < id && id <= people.length )) {
    assignedChores = chores.filter( item => {
      return item.assignedTo === id;
    })
    res.status(200).json(assignedChores);
  } else {
    res.status(404).json({ error: 'User does not exist' })
  }
})

router.post('/', (req, res) => {
  const choresLength = chores.length;
  const choreNotes = req.body.notes;
  const newChore = req.body.description;
  const personAssigned = req.body.assignedTo;
  if (!newChore || newChore.trim() === '') {
    res.status(404).json({ message: `A chore is required { description: name of chore }` });
  } else if ( !personAssigned || (0 < personAssigned && personAssigned <= people.length)) {
    maxID++;
    chores.push({id: maxID, description: newChore, notes: choreNotes, assignedTo: personAssigned, completed: false });
    if (chores.length > choresLength) {
      res.status(201).json(chores);
    } else {
      res.status(404).json({ message: 'Something went wrong trying to add your chore' })
    }
  } else {
    res.status(404).json({ error: 'The person you are trying to assign to does not exist' })
  }
})

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let exists = false;
  chores.filter( item => {
    if(item.id === id) {
      exists = true;
      chores.splice(id-1, 1);
    } else {
      return item;
    }
  })
  if(exists) {
    res.status(410).json({ message: "chore removed" });
  } else {
    res.status(404).json({ error: 'chore does not exist' })
  }
})

router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const choreLength = chores.length;
  const choreNotes = req.body.notes;
  const newChore = req.body.description;
  const personAssigned = req.body.assignedTo;
  let isCompleted = req.body.completed;
  let doesExist = false;
  if(isCompleted === undefined) {
    isCompleted = false;
  }
  let updateChore = {};
  if (!newChore || newChore.trim() === '') {
    res.status(404).json({ message: `A chore is required { description: name of chore }` });
  } else if ( personAssigned !== undefined || (0<= personAssigned && personAssigned < people.length)) {
    if( id !== undefined && (0 < id && id <= choreLength)){
      chores.map( item => {
        if(item.id === id) {
          chores.splice(id-1, 1, { id, description: newChore, notes: choreNotes, assignedTo: personAssigned, completed: isCompleted });
          updateChore = chores[id-1];
          doesExist = true;
        }
      })
      if(doesExist) {
        if (choreLength === chores.length) {
          res.status(200).json(updateChore);
        } else {
          res.status(500).json({ error: 'Something went wrong, your data could have been corrupted' })
        }
      } else {
        res.status(404).json({ error: 'chore does not exist' });
      }
    } else {
      res.status(404).json({ error: 'chore doe not exist' });
    }
  } else {
    res.status(404).json({ error: 'The person you are trying to assign to does not exist' })
  }
})

module.exports = router;