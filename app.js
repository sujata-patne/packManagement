
var PORT = process.env.PORT || '3070';
var db = require('./config/db');
var app = require('./config/express')(db);

require('./config/routes')(app);
app.listen(PORT);
console.log("Listening on port "+PORT);

