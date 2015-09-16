var packList = require('../controller/packList.controller');

module.exports = function (app) {
    app.route('/getPacks')
        .post(packList.getPacks);
}