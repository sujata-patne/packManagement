var pack = require('../controller/pack.controller');

module.exports = function (app) {
    app.route('/getData')
        .post(pack.getData);
    app.route('/getContentTypesByPack')
        .post(pack.getContentTypesByPack);
    app.route('/blockUnBlockContentType')
        .post(pack.blockUnBlockContentType);
    app.route('/addPack')
        .post(pack.addPack);
    app.route('/editPack')
        .post(pack.editPack);
}
