module.exports = (log=true) =>
  (err, req, res, next) => {
    if (err) {
      if (log) {
        console.log('\n-------------------------------------------------------')
        console.log(err);
      }

      if (err.data || err.message) {
        res.status(err.statusCode || err.status || 500).send(err.data || err.message || {});
      } else {
        res.sendStatus(err.statusCode || 500);
      }
    } else {
      next();
    }
  }



