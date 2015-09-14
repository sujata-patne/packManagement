
var search = require('../controller/search.controller');

module.exports = function (app) {
    app.route('/contentTypeDetails')
        .get(search.getContentTypeDetails);

    app.route('/saveSearchData')
        .post(search.saveSearchData);
}