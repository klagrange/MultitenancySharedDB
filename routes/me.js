const express = require('express');
const router = express.Router();
const allowOnlyPermissions = require('../middlewares/allowOnlyPermissions.js');
const UserSass = require('../models/UserSass');
const {
  findUserById
} = require('../atomicQueries');
const {
  createStatusCodeError
} = require('../utils');

router.get('/', async (req, res, next) => {
  const { requesterUserId } = res.locals;

  await UserSass.query()
    .where('id', requesterUserId)
    .eager('[role.permissions, organization]')
    .first()

    .then((user) => res.send(user))
    .catch((e) => {
      next(createStatusCodeError(500))
    })
})


module.exports = router;
