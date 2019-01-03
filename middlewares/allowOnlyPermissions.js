const { isEmpty } = require('lodash');
const { createStatusCodeError } = require('../utils');

function allowOnlyPermissions(ressourcePermissions) {
  return function isAllowed (req, res, next) {
    const requesterPermissions = new Set(res.locals.requesterPermissions);
    const allowedPermissions = new Set(ressourcePermissions);
    const intersection = [...requesterPermissions]
      .filter(requesterPermission => allowedPermissions.has(requesterPermission));

    // if the requester does not possess the permission to hit an endpoint.
    if (isEmpty(intersection)) {
      return next(createStatusCodeError(403));
    }

    return next();
  }
}

module.exports = allowOnlyPermissions;

