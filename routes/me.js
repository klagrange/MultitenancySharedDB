const express = require('express');

const router = express.Router();
const {
  findUsers,
} = require('../atomicQueries');

router.get('/', async (req, res) => {
  const { requesterUserId } = res.locals;

  const users = await findUsers(req.query.eagerOrg, req.query.eagerOrg, userId = requesterUserId, orgId = undefined, login = undefined);

  res.send(users[0]);
});


module.exports = router;
