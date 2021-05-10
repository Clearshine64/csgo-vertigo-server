const express = require('express');
const router = express.Router();

const ClientLib = require('../lib/clientlib');

// @api       /api/clients/test
// @desc      Test if clients api is running
router.get('/test', (req, res) => {
  res.send("Client API is working");
});

// @api       /api/clients/matchmode/[mode]
// @desc      Get clients according to matchmode
router.get('/matchmode/:mode', async (req, res) => {
  try {
    const clients = await ClientLib.getAllClients(req.params.mode);
    res.send({ clients });
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

// @api       /api/accounts/[id]
// @desc      Get accounts with specific id
router.get('/:id', async (req, res) => {
  try {
    const client = await ClientLib.getClientByID(req.params.id);
    res.send({ client });
  } catch (err) {
    res.status(404).send({ message: 'account not found!' });
  }
});


// @api       /api/clients
// @desc      Create a client
// @postdata  matchmode, clientip, capacity
router.post('/', async (req, res) => {
  try {
    const newClient = await ClientLib.createClient(req.body);
    res.send({ newClient });
  } catch (err) {
    res.status(400).send({ error: err });
  }
});


// @api       /api/clients/[id]
// @desc      Update an client
// @postdata  clientip, capacity
router.put('/:id', async (req, res) => {
  try {
    const newClient = await ClientLib.updateById(req.params.id, req.body);
    res.send({ newClient });
  } catch (err){
    res.status(400).send({ error: err });
  }
});

// @api       /api/clients/[id]
// @desc      Delete an client
router.delete('/:id', async (req, res) => {
  try {
    await ClientLib.removeById(req.params.id);
    res.send({ message: 'The client was removed' });
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

module.exports = router;