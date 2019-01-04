const bodyParser = require('body-parser');
const auth = require('../middlewares/auth');
const error = require('../middlewares/error');
const userRouter = require('../routes/user');
const roleRouter = require('../routes/role');
const meRouter = require('../routes/me');

module.exports = (app, logErrors=true) => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(auth)
    app.use('/me', meRouter);
    app.use('/users', userRouter);
    app.use('/roles', roleRouter);
    app.use(error(logErrors));
}
