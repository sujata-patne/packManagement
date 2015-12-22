var mysql = require('../config/db').pool;
var async = require("async");
var packManager = require('../models/packModel');
var underscore = require("underscore");

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
                        StorePacks: function (callback) {
                            packManager.getPacksForStore( connection_ikon_cms, req.session.pack_StoreId, function(err,StorePacks){
                                callback(err, StorePacks);
                            });
                        }, 
                        PackTypes: function (callback) {
                            packManager.getPackTypes( connection_ikon_cms, function(err,PackTypes){
                                callback(err, PackTypes);
                            });
                        },
                        PackDetails: function (callback) {
                            if(req.body.state == 'edit-pack'){
                                packManager.getContentTypesByPackId( connection_ikon_cms,req.body.packId, function(err,PackDetails){
                                    callback(err, PackDetails);
                                });
                            }else{
                                callback(null);
                            }
                        },
                        PackageTotal: function (callback) {
                            packManager.getPackageTotal( connection_ikon_cms, {PackId:req.body.packId, StoreId:req.session.pack_StoreId}, function(err,PackageTotal){
                                callback(err, PackageTotal);
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
                    });
                   });
            }else{
                
                res.redirect('/accountlogin');
            }
        }catch(err){
                 res.status(500).json(err.message);
      }      
};

exports.blockUnBlockContentType = function (req, res, next) {
      try {   
            if (req.session && req.session.pack_UserName) {

                mysql.getConnection('CMS', function (err, connection_ikon_cms) {
                         async.parallel({
                            updateContentTypeStatus : function(callback){
                                packManager.updateContentTypeStatus( connection_ikon_cms, req.body.packId,req.body.contentTypeId,req.body.active, function(err,response){
                                     callback(err, response);
                                });
                            }

                        },function(err,results){
                                    if(err){
                                        connection_ikon_cms.release();
                                        res.status(500).json(err.message);
                                        console.log(err.message);
                                     }else{
                                        connection_ikon_cms.release();
                                        res.send({ success: true, message: 'Content Type ' + req.body.Status + ' successfully.' });
                                     }
                        });
                });
            }else{
                 res.redirect('/accountlogin');
            }
        }catch(err){
             res.status(500).json(err.message);
        }

};


exports.getContentTypesByPack = function (req, res, next) {
    try {   
        if (req.session && req.session.pack_UserName) {
            mysql.getConnection('CMS', function (err, connection_ikon_cms) {
                async.parallel({
                    PackContentTypes: function (callback) {
                        packManager.getContentTypesByPackId( connection_ikon_cms, req.body.packId, function(err,PackContentTypes){
                            callback(err, PackContentTypes);
                        });
                    },
                    PackageTotal: function (callback) {
                        packManager.getPackageTotal( connection_ikon_cms, {PackId:req.body.packId, StoreId:req.session.pack_StoreId}, function(err,PackageTotal){
                           callback(err, PackageTotal);
                        });
                    }
                },
                function (err, results) {
                    if (err) {
                        connection_ikon_cms.release();
                        res.status(500).json(err.message);
                        console.log(err.message);
                    } else {
                        connection_ikon_cms.release();
                        res.send(results);
                    }
                });
            });
        }else{
            res.redirect('/accountlogin');
        }
        }catch(err){
                 res.status(500).json(err.message);
      }      
};

exports.addPack = function (req, res, next) {
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
                                pk_created_by: req.session.pack_UserName,
                                pk_modified_on: new Date(),
                                pk_modified_by: req.session.pack_UserName
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
                                                pct_is_active : 1,
                                                pct_created_on: new Date(),
                                                pct_created_by: req.session.pack_UserName,
                                                pct_modified_on: new Date(),
                                                pct_modified_by: req.session.pack_UserName
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
                                            }//if
                                        } //if
                                    }); //getLastInsertedPackContentType
                                }//loop
                            }//if result
                        }
                    } 
                );               
            });//conn.
            
        }else{
            res.redirect('/accountlogin');
        }
	} catch(err){
         res.status(500).json(err.message);
	}
}; //addPack


exports.editPack = function (req, res, next) {
    try {
        if (req.session && req.session.pack_UserName) {
            mysql.getConnection('CMS', function (err, connection_ikon_cms) {
                async.parallel({
                    //Check Whether Offer Exists :
                    PackExists : function(callback){
                        packManager.getPackByNameForUpdate(connection_ikon_cms,req.body.pack_name.toLowerCase(),req.body.packId,function(err,response){
                            callback(err,response);
                        });    
                    },
                    MaxPackId: function (callback) {
                        packManager.getLastInsertedPackId(connection_ikon_cms,function(err,MaxPackId){
                            callback(err,MaxPackId);
                        }); 
                    },
                    existingContentTypes: function (callback) {
                            packManager.existingContentTypes(connection_ikon_cms,req.body.packId,function(err,existingContentTypes){
                                callback(err,existingContentTypes);
                            }); 
                        }
                    },function (err, results) {
                        if (results.PackExists) {
                            connection_ikon_cms.release();
                            res.send({"success" : false,"message" : "Pack Name must be unique."});
                        } else {
                            var data = {
                                pk_name : req.body.pack_name,
                                pk_desc : req.body.pack_desc,
                                pk_cnt_display_opt : req.body.pack_type,
                                pk_is_active : 1,
                                pk_modified_on: new Date(),
                                pk_modified_by: req.session.pack_UserName
                            }
                            
                            var result = updateIconPack(connection_ikon_cms,data,req.body.packId);
                            if( result == true ){
                                //var existingContentTypes = results.existingContentTypes[0].pct_cnt_type_ids;
                                if(results.existingContentTypes[0].pct_cnt_type_ids !== null){
                                    var existingContentTypes = results.existingContentTypes[0].pct_cnt_type_ids.split(',')
                                     .map(function (element) {
                                     return parseInt(element)
                                     });
                                 }else{
                                    var existingContentTypes = [];
                                 }
                                

                                var contentTypes = req.body.pack_content_type;
                                var addContentTypes = contentTypes.filter( function( el ) {
                                                            return existingContentTypes.indexOf( el ) < 0;
                                                        });
                                 var deleteContentTypes = existingContentTypes.filter( function( el ) {
                                                            return contentTypes.indexOf( el ) < 0;
                                                        });
 

                                if(deleteContentTypes.length > 0){
                                    var is_deleted = deletePackContentTypes( connection_ikon_cms,req.body.packId, deleteContentTypes );
                                }else{
                                    var is_deleted = true;
                                }
                                if(is_deleted == true && addContentTypes.length > 0){
                                    var count = addContentTypes.length;
                                    v_pack_content_types = addContentTypes;
                                    var cnt = 0;
                                    loop(0);
                                    function loop( cnt ) {
                                        var i = cnt;
                                        getLastInsertedPackContentType( connection_ikon_cms, function( lastInsertedPackTypeId ) {
                                            if( lastInsertedPackTypeId ) {
                                                var contentTypeData = {
                                                    pct_id : lastInsertedPackTypeId,
                                                    pct_pk_id : req.body.packId,
                                                    pct_cnt_type : v_pack_content_types[i],
                                                    pct_is_active : 1,
                                                    pct_created_on: new Date(),
                                                    pct_created_by: req.session.pack_UserName,
                                                    pct_modified_on: new Date(),
                                                    pct_modified_by: req.session.pack_UserName
                                                }
                                                var contentTypeData;
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
                                                                res.send({"success" : true,"status":200, "message":"Pack successfully updated.","pack_grid":response});
                                                            }  
                                                        });
                                                    }else{
                                                        loop(cnt);
                                                    }
                                                }
                                            } 
                                        }); 
                                    }
                                }//delete..
                                else{
                                    packManager.getContentTypesByPackId(connection_ikon_cms,req.body.packId,function(err,response){
                                        if(err){
                                          connection_ikon_cms.release();
                                          res.status(500).json(err.message);  
                                        }else{
                                            connection_ikon_cms.release();
                                            res.send({"success" : true,"status":200, "message":"Pack successfully updated.","pack_grid":response});
                                        }  
                                    });
                                }
                            }
                        }
                    } 
                );               
            });//conn.
            
        }else{
            res.redirect('/accountlogin');
        }
    } catch(err){
         res.status(500).json(err.message);
    }
}; //editPack





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
function updateIconPack( connection_ikon_cms, data,packId ){
    packManager.updatePack( connection_ikon_cms, data, packId, function(err,response ){
        if(err){
             connection_ikon_cms.release();
             res.status(500).json(err.message);
             return false;
         }else{
            packManager.updatePackageModified(connection_ikon_cms,packId,function(err,response){
                if(err){
                     connection_ikon_cms.release();
                     res.status(500).json(err.message);
                     return false;
                }
            })
         }
    });
    return true;
}

function deletePackContentTypes( connection_ikon_cms,packId,deleteContentTypes ){
    packManager.deletePackContentTypes( connection_ikon_cms,packId,deleteContentTypes, function(err,response ){
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
            connection_ikon_cms.release();
            res.status(500).json(err.message);
        }else{
             v_pct_id = response[0].pct_id != null ? parseInt(response[0].pct_id + 1) : 1;
             return callback( v_pct_id );
        }
    });
}
