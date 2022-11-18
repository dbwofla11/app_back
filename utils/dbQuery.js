const db = require('../config/db/db')

module.exports = {
    execute : (queryString) => {
        return db.promise().query(queryString);
    }
}