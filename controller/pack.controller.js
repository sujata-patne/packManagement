var mysql = require('../config/db').pool;
var async = require("async");
var packManager = require('../models/packModel');

exports.getData = function (req, res, next) {
    try {
            if (req.session && req.session.pack_UserName) {
                mysql.getConnection('CMS', function (err, connection_ikon_cms) {
                    async.parallel({
                         ContentTypes: function (callback) {

                            packManager.getContentTypes( connection_ikon_cms, req.session.pack_StoreId, function(err,ContentTypes){
                                callback(err, ContentTypes);
                            });
                        }, 
                        PackTypes: function (callback) {
                            packManager.getPackTypes( connection_ikon_cms, function(err,PackTypes){
                                callback(err, PackTypes);
                            });
                            
                        }
                    },
                     function (err, results) {
                        //console.log(results.OperatorDetails)
                            if (err) {
                                connection_ikon_cms.release();
                                res.status(500).json(err.message);
                                console.log(err.message)
                            } else {
                                connection_ikon_cms.release();
                                res.send(results);
                            }
                      });
                   });
            }else{

            }
        }catch(err){


      }


      
};

exports.addEditPack = function (req, res, next) {
    try {
        if (req.session && req.session.pack_UserName) {
        	mysql.getConnection('CMS', function (err, connection_ikon_cms) {
                async.parallel({
                    //Check Whether Offer Exists :
                    PackExists : function(callback){
                        packManager.getPackByName(connection_ikon_cms,req.body.pack_name.toLowerCase(),function(err,response){
                            callback(err,response);
                        });    
                    },
                    MaxPackId: function (callback) {
                            packManager.getLastInsertedPackId(connection_ikon_cms,function(err,MaxPackId){
                                callback(err,MaxPackId);
                            }); 
                        }
                    },function (err, results) {
                            //console.log(results.OperatorDetails)
                        if (results.PackExists) {
                            connection_ikon_cms.release();
                            res.send({"success" : false,"message" : "Pack Name must be unique."});
                        } else {
                            var data = {
                                pk_id : results.MaxPackId,
                                pk_st_id : req.session.pack_StoreId,
                                pk_name : req.body.pack_name,
                                pk_desc : req.body.pack_desc,
                                pk_cnt_display_opt : req.body.pack_type,
                                pk_is_active : 1,
                                pk_created_on: new Date(),
                                pk_created_by: req.session.Plan_UserName,
                                pk_modified_on: new Date(),
                                pk_modified_by: req.session.Plan_UserName
                            }
                            
                            var result = saveIconPack(connection_ikon_cms,data);
                            if( result == true ){
                                var count = req.body.pack_content_type.length;
                                v_pack_content_types = req.body.pack_content_type;
                                var cnt = 0;
                                loop(0);
                                function loop( cnt ) {
                                    var i = cnt;
                                    getLastInsertedPackContentType( connection_ikon_cms, function( lastInsertedPackTypeId ) {
                                        if( lastInsertedPackTypeId ) {
                                            var contentTypeData = {
                                                pct_id : lastInsertedPackTypeId,
                                                pct_pk_id : results.MaxPackId,
                                                pct_cnt_type : v_pack_content_types[i],
                                                pct_is_active : 1
                                            }
                                            contentTypeResponse = saveIconPackContentType( connection_ikon_cms,contentTypeData );
                                            if(contentTypeResponse == true){
                                                cnt = cnt + 1;
                                                if(cnt == count){
                                                    packManager.getContentTypesByPackId(connection_ikon_cms,contentTypeData.pct_pk_id,function(err,response){
                                                        if(err){
                                                          connection_ikon_cms.release();
                                                          res.status(500).json(err.message);  
                                                        }else{
                                                            connection_ikon_cms.release();
                                                            res.send({"success" : true,"status":200, "message":"Pack successfully added.","pack_grid":response});
                                                        }  
                                                    });
                                                }else{
                                                    loop(cnt);
                                                }
                                            }
                                        } 
                                    }); 
                                }
                            }
                        }
                    } 
                );               
            });//conn.
            
        }else{

        }
	} catch(err){

	}
}; //AddEditPack


function saveIconPack( connection_ikon_cms, data ){
    packManager.savePack( connection_ikon_cms, data, function(err,response ){
        if(err){
             connection_ikon_cms.release();
             res.status(500).json(err.message);
             return false;
         }
    });
    return true;
}
function saveIconPackContentType( connection_ikon_cms, data ){
    packManager.saveIconPackContentType( connection_ikon_cms, data, function(err,response ){
        if(err){
             connection_ikon_cms.release();
             res.status(500).json(err.message);
             return false;
         }
    });
    return true;
}

function getLastInsertedPackContentType( connection_ikon_cms, callback ) {
    packManager.getLastInsertedPackContentType( connection_ikon_cms,function( err, response ) {
        if(err){
            console.log("inside error");
            connection_ikon_cms.release();
            res.status(500).json(err.message);
        }else{
             v_pct_id = response[0].pct_id != null ? parseInt(response[0].pct_id + 1) : 1;
             return callback( v_pct_id );
        }
    });
}
