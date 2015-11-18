/**
 * Created by sujata.patne on 7/7/2015.
 */
module.exports = function(app){
    require('../routes/index')(app);
    require('../routes/pack')(app);
    require('../routes/search')(app);
    require('../routes/packList')(app);
    require('../routes/showContents')(app);
    require('../routes/arrangeContents')(app);
    // require('../cron/autoPublish');

    app.use('/*', function(req,res,next){
        res.status(404).json({"error":"No such service present"});
    })

    app.use('*', function(req,res,next){
        res.status(404).send('<html><body><h1>404 Page Not Found</h1></body></html>');
    })
}
