const express = require('express');
const bodyParser = require('body-parser');
const { Model, ValidationError } = require('objection');
const Knex = require('knex');
const knexConfig = require('./knexfile');
const UserSass = require('./models/UserSass');
const Role = require('./models/Role');
const Organization = require('./models/Organization');
const auth = require('./middlewares/auth');

const userRouter = require('./routes/user');
const roleRouter = require('./routes/role');

/**
 *
 *  knex/objection.js wiring
 *
 */
const knex = Knex(knexConfig);
Model.knex(knex);

/**
 *
 *  Validators
 *
 */
async function validateUserPayload(userPayload) {
  try {
    const user = await UserSass.fromJson(userPayload)

    if (!await roleIsPartOfOrg(user.role_id, user.organization_id)) {
      throw (Error);
    }

    return user;
  } catch (e) {
    if (e instanceof ValidationError) {
      throw (ValidationError);
    } else {
      throw (e);
    }
  }
}

function requesterIsFromSameOrganization(requesterInfo, organizationId) {
  const { requesterOrgId } = requesterInfo;
  return requesterOrgId === organizationId;
}

async function addUser(requesterInfo, userPayload, permissions = new Set(['A', 'B'])) {
  const { requesterPermissions } = requesterInfo;

  const requesterPermission = getSetsIntersection(requesterPermissions, permissions);

  // common validations
  const user = await validateUserPayload(userPayload);

  // const { requesterUserId, requesterOrgId  } = requesterInfo;
  // const a = requesterIsFromSameOrganization(requesterInfo, userPayload.organization_id);
  console.log(a);

  return user;
}

const user = {
  name: 'Keith',
  organization_id: 17,
  role_id: 63,
};

const requesterInfo = {
  requesterUserId: 2,
  requesterOrgId: 3,
  requesterPermissions: new Set(['A'])
};

// addUser(requesterInfo, user)
//   .then(console.log)
//   .catch((e) => {
//     console.log('ASASDASD');
//     console.log(e);
//   });


// const requesterPermissions = new Set([1, 2, 3, 4, 5]);
// const ressourcePermissions = new Set([1, 2]);
// const a = getSetsIntersection(requesterPermissions, ressourcePermissions);
// console.log(a);

// roleIsPartOfOrg(10000, 1).then(console.log);

// findUserAll()
//   .then(console.log)

// findUserById(1)
//   .then(console.log)

// const user = {
//   name: 'Keith',
//   organization_id: 1,
//   role_id: 100000
// };
//
// validateUserPayload(user)
//   .then(console.log)

/**
 *
 *  app
 *
 */
const port = process.env.PORT || 8001;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(auth);

app.use('/users', userRouter);
// app.use('/organizations', organizationRouter);
app.use('/roles', roleRouter);
// app.use('/goals', goalRouter);

app.listen(port, () => {
  console.log('listening on port: ', port);
});

/**
 *
 * application level middleware - captures thrown errors and
 * returns appropriate msg with status code.
 *
 */
app.use((err, req, res, next) => {
  if (err) {
    console.log(err);
    if (err.data || err.message) {
      res.status(err.statusCode || err.status || 500).send(err.data || err.message || {});
    } else {
      res.sendStatus(err.statusCode || 500);
    }
  } else {
    next();
  }
});
