
var search = require('../controller/search.controller');

module.exports = function (app) {
    app.route('/contentTypeDetails/:pctId')
        .get(search.getContentTypeDetails);
    app.route('/showContentList')
        .post(search.getPackSearchResult);
    app.route('/saveSearchCriteria')
        .post(search.saveSearchCriteria);
    app.route('/saveSearchContents')
        .post(search.saveSearchContents);
    app.route('/publishContents')
        .post(search.publishContents);
    app.route('/savedContents')
        .post(search.getSavedContents);
    app.route('/arrangeContents')
        .post(search.saveArrangedContents);
    app.route('/resetSearchCriteriaContents')
        .post(search.resetSearchCriteriaContents);
}