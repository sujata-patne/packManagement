/**
 * Created by sujata.patne on 18-09-2015.
 */
var showContent = require('../controller/show.contents.controller');

module.exports = function (app) {
    app.route('/showArrangeContents')
        .post(showContent.showArrangeContents);
    app.route('/showPublishContents')
        .post(showContent.showPublishContents);
    app.route('/showResetRules')
        .post(showContent.showResetRules);
    

}