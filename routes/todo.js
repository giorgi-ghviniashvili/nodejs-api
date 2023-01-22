const express = require('express');

// todoRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /listings.
const todoRoutes = express.Router();

// This will help us connect to the database
const dbo = require('../db/conn');

const COLLECTION_NAME = 'todos';

// This section will help you get a list of all the todos.
todoRoutes.route('/todos').get(async (_req, res) => {
  const dbConnect = dbo.getDb();

  dbConnect
    .collection(COLLECTION_NAME)
    .find({})
    .limit(50)
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send('Error fetching todos!');
      } else {
        res.json(result);
      }
    });
});

// This section will help you create a new record.
todoRoutes.route('/todos').post(function (req, res) {
  const dbConnect = dbo.getDb();
  const matchDocument = {
    title: req.body.title,
    description: req.body.description,
  };

  dbConnect
    .collection(COLLECTION_NAME)
    .insertOne(matchDocument, function (err, result) {
      if (err) {
        res.status(400).send('Error inserting todo item!');
      } else {
        console.log(`Added a new todo with id ${result.insertedId}`);
        res.status(200).send({
          ...matchDocument,
          id: result.insertedId
        });
      }
    });
});

// This section will help you update a record by id.
todoRoutes.route('/todo').post(function (req, res) {
  const dbConnect = dbo.getDb();
  const query = { _id: req.body.id };
  const updates = {};
  if (req.body.title) {
    updates.title = req.body.title;
  }
  if (req.body.description) {
    updates.description = req.body.description;
  }

  dbConnect
    .collection(COLLECTION_NAME)
    .updateOne(query, updates, function (err, _result) {
      if (err) {
        res
          .status(400)
          .send(`Error updating todo with id ${query.id}!`);
      } else {
        console.log('1 document updated');
      }
    });
});

// This section will help you delete a record.
todoRoutes.route('/todos/:id').delete((req, res) => {
  const dbConnect = dbo.getDb();
  const query = { _id: req.body.id };

  dbConnect
    .collection(COLLECTION_NAME)
    .deleteOne(query, function (err, _result) {
      if (err) {
        res
          .status(400)
          .send(`Error deleting with id ${query.listing_id}!`);
      } else {
        console.log('1 document deleted');
      }
    });
});

module.exports = todoRoutes;