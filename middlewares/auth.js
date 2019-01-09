const { isEmpty } = require('lodash');

const UserSass = require('../models/UserSass');
const { createStatusCodeError } = require('../utils');

async function auth(req, res, next) {
  const { token } = req.headers;

  if (isEmpty(token)) {
    return next(createStatusCodeError(401));
  }

  const user = await UserSass.query().where('token', token).first();

  if (!user) {
    return next(createStatusCodeError(401));
  }

  const userEager = await UserSass.query()
    .where('id', user.id)
    .eager('role.permissions')
    .first();

  const permissions = userEager.role.permissions.map(item => item.code);
  const requesterOrganizationId = userEager.organization_id;

  res.locals.requesterPermissions = permissions;
  res.locals.requesterOrganizationId = requesterOrganizationId;
  res.locals.requesterUserId = userEager.id;

  // console.log("============================================================");
  // console.log(permissions);
  // console.log("============================================================");

  return next();
}

module.exports = auth;
