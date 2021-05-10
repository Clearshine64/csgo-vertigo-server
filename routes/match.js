const express = require('express');
const MatchLib = require('../lib/matchlib');
const router = express.Router();

const SteamLib = require('../lib/steamlib');

//test for match API
router.get('/test', (req, res) => {
  res.send("Match API is working");
});

// @api       /api/match/matchmode/[mode]
// @desc      Get Global Match info such as maps and condition
router.get('/matchmode/:mode', async (req, res) => {
  try {
    const match = await SteamLib.getAllMatches(req.params.mode);
    res.send( {match} );
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

// @api       /api/match/play/[mode]
// @desc      start mathmode and set
router.put('/play/:mode', async (req, res) => {
  try {
    if(req.body.flag == false)
    {
      await SteamLib.StopMatch(req.params.mode);
    }
    // set gamestarting flag
    await MatchLib.setGamestartingFlag(req.params.mode, req.body.flag);
    res.send("Matcheflag is set");
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

// @api       /api/match/play/[mode]
// @desc      get matchmode's starting flag
router.get('/play/:mode', async (req, res) => {
  try {
    // set gamestarting flag
    let flag = await MatchLib.getGamestartingFlag(req.params.mode);

    res.send(flag);
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

// @api       /api/match/matchmode/[mode]
// @desc      get matchmode's starting flag
router.put('/matchmode/:mode', async (req, res) => {
  try {
    const match = await MatchLib.updateById(req.params.mode, req.body);
    res.send({ match });
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

module.exports = router;