const express = require('express');
const router = express.Router();

const AccountLib = require('../lib/accountlib');

// @api       /api/accounts/test
// @desc      Test if account api is running
router.get('/test', (req, res) => {
  res.send("Account API is working");
});

// @api       /api/accounts/matchmode/[mode]
// @desc      Get accounts according to matchmode
router.get('/matchmode/:mode', async (req, res) => {
  try {
    const accounts = await AccountLib.getAllAccounts(req.params.mode);
    res.send({ accounts });
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

// @api       /api/accounts/[id]
// @desc      Get accounts with specific id
router.get('/:id', async (req, res) => {
  try {
    const account = await AccountLib.getAccountByID(req.params.id);
    res.send({ account });
  } catch (err) {
    res.status(404).send({ message: 'account not found!' });
  }
});

// @api       /api/accounts
// @desc      Create a account
// @postdata  matchmode, username, password
router.post('/', async (req, res) => {
  try {
      const newAccount = await AccountLib.createAccount(req.body);
      res.send({newAccount});
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

// @api       /api/accounts/import
// @desc      import data
// @postdata  matchmode, array
router.post('/import', async (req, res) => {
  try {
      await AccountLib.importAccount(req.body);
      res.send("imported");
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

// @api       /api/accounts/[id]
// @desc      Delete an account
router.post('/deleteall', async (req, res) => {
  try {
    await AccountLib.deleteSomeAccounts(req.body);
    res.send({ message: 'The accounts was removed' });
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

// @api       /api/accounts/[id]
// @desc      Update an account
// @postdata  username, password
router.put('/:id', async (req, res) => {
  try {
    const newAccount = await AccountLib.updateById(req.params.id, req.body);
    res.send({newAccount});
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

// @api       /api/accounts/[id]
// @desc      Delete an account
router.delete('/:id', async (req, res) => {
  try {
    await AccountLib.removeById(req.params.id);
    res.send({ message: 'The account was removed' });
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

module.exports = router;