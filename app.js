const express = require('express');

const app = express();
app.enable('trust proxy');

const {Datastore} = require('@google-cloud/datastore');

// Instantiate a datastore client
const datastore = new Datastore();


const getCustomerByID = (id) => {

  const query = datastore
    .createQuery('Customers')
    .filter('Id', '=',  id)
    .limit(1);

  return datastore.runQuery(query);
};

const getAllCustomers = () => {
  const query = datastore
    .createQuery('Customers');

  return datastore.runQuery(query);
};

app.get('/getCustomer',async (req, res, next) => {
  var customer_ID = Number(req.query.id);
  var entities = {};

  if(typeof(customer_ID) == 'number') {
    [entities] =  await getCustomerByID(customer_ID);
    entities = entities[0];
    try {
      res
        .status(200)
        .set('Content-Type', 'text/plain')
        .send(entities)
        .end();
    } catch (error) {
      next(error);
    }
  }
});

app.get('/getCustomers', async (req, res, next) => {
  const [entities] = await getAllCustomers();

  try {
    res
      .status(200)
      .set('Content-Type', 'text/plain')
      .send(entities)
      .end();
  } catch (error) {
    next(error);
  }
});


const PORT = process.env.PORT || 8080;
app.listen(process.env.PORT || 8080, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_flex_datastore_app]

module.exports = app;
