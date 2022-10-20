const db = require('../config/db/db')

module.exports = {
    execute : (queryString, cb) => {
        db.promise().query(queryString)
            .then((rows) => cb(rows))
            .catch((err) => { throw err })
    }
}