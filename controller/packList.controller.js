var mysql = require('../config/db').pool;
var async = require("async");
var packManager = require('../models/packModel');

exports.getPacks = function (req, res, next) {
    try {   
            if (req.session && req.session.pack_UserName) {
                mysql.getConnection('CMS', function (err, connection_ikon_cms) {
                	  async.parallel({
	                         Packs: function (callback) {
	                            packManager.getAllPacksForList( connection_ikon_cms, req.session.pack_StoreId, function(err,Packs){
	                                callback(err, Packs);
	                            });
	                          }
	                        },
	                        function (err, results) {
                              if (err) {
                                connection_ikon_cms.release();
                                res.status(500).json(err.message);
                                console.log(err.message)
                              } else {
                                connection_ikon_cms.release();
                                res.send(results);
                              }
	                        }
                     	 )

                });

            }else{

            }
         }catch(err){

         }
}         