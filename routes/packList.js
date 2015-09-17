var packList = require('../controller/packList.controller');

module.exports = function (app) {
    app.route('/getPacks')
        .post(packList.getPacks);
    app.route('/getPacksStartsWith')
        .post(packList.getPacksStartsWith);
}