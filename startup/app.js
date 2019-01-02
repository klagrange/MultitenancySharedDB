const bodyParser = require('body-parser');
const auth = require('../middlewares/auth');
const error = require('../middlewares/error');
const userRouter = require('../routes/user');
const roleRouter = require('../routes/role');

module.exports = (app) => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(auth);
    app.use('/users', userRouter);
    app.use('/roles', roleRouter);
    app.use(error);
}