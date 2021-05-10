const express = require('express');
const router = express.Router();

const AccountLib = require('../lib/accountlib');

const ConfigLib = require('../lib/configlib');

const GroupLib = require('../lib/grouplib');

//  /api/group/test
router.get('/test', (req, res) => {
  res.send("Group API is working");
});

router.get('/', async (req, res) => {
  try {
    const groups = await GroupLib.getExistingGroup();
    const groupType = await ConfigLib.GetGroupType();

    res.send({ groups, groupType });
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const group = await GroupLib.getGroupById(req.params.id);
    const groupType = await ConfigLib.GetGroupType();
    
    res.send({ group, groupType });
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

// called when one math is finished
// called by user to form group
router.put('/generate', async (req, res) => {
  try {
    await GroupLib.formGroup();
    const groups = await GroupLib.getExistingGroup();
    const groupType = await ConfigLib.GetGroupType();

    res.send({ groups, groupType });

  } catch (err) {
    res.status(400).send({ error: err });
  }
});



// update group mode in config db
// req.body = {grouptype: "competitive"}
router.put('/', async (req, res) => {
  try {
    await ConfigLib.SetGroupType(req.body.grouptype);
    res.send({ message: 'group type was updated' });
  }
  catch {
    res.status(400).send({ error: err });
  }
});

module.exports = router;