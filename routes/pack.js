var pack = require('../controller/pack.controller');

module.exports = function (app) {
    app.route('/getData')
        .post(pack.getData);
    app.route('/addEditPack')
        .post(pack.addEditPack);
}
