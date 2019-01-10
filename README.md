# Start application
```sh
$ # start db
$ ./db_ctl.sh dev:start

$ # start app
$ node server.js
```

# Application flow
 * A user sends a request.
 * A request always contains at bare minimum a token.
 * The authentication middlewear reads the request and:
        - determines who the user is thanks to the token.
         - retrieves the permissions for that user.
         - passes on those information to the following middlewares.
 * Every route is permission-protected; i.e. the requester must have the necessary permission to hit a route.
 * Only a bambu super admin can hit every route.
 * Every tables are linked directly or indirectly to the USER_SASS table.
 * Data isolation is maintained using objection.js query builder hook.

# Permission matrix
| Route | Code | Description |
| ------ | ------ | ----- |
| GET /me | unprotected | Can view me information.
| GET /users | CJWA2387096055108 | Can view all users.
| GET /users | PPKS5796742488276 | Can view all users from same organization only.
| POST /users | PFRY4798513053955 | Can add a user.
| POST /users | CEIG1009075525306 | Can add a user in same organization only.
| DELETE /users | OMZL0480317045830 | Can delete user from any organization.
| DELETE /users | SAUU7318408312338 | Can delete user from own organization only.
| GET /organizations | GYQV7860011968348 | Can view organizations.
| DELETE /organizations | XQXY1977826757764 | Can remove an organization.
| GET /permissions | JNLW0698833451904 | Can view permissions.
| GET /permissions | USUL3556272119368 | Can view permissions only from same organization.
| GET /roles | QJTE9212783101092 | Can view roles.
| GET /roles | CEGK7839937191571 | Can view roles from own organization only.
| POST /roles | FDGU5035766817354 | Can add a role in any organization.
| POST /roles | MJFB0635032850662 | Can add a role in own organization only.
| DELETE /roles | TAVT8651666899880 | Can delete a role from any organization.
| DELETE /roles | BMMV8632489659857 | Can delete a role from own organization only.
| GET /roles/:id/permission | OZWQ5047634703973 | Can add permission to existing role.
| GET /roles/:id/permission | XMNZ4595820797783 | Can add permission to existing role only if the role is from own organization only.
| DELETE /roles/:id/permission | HZBT5391786394074 | Can remove a permission to existing role.
| DELETE /roles/:id/permission | TOQJ0598359864173 | Can remove a permission to an existing role only if the role is from own organization only.


