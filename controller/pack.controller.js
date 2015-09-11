var mysql = require('../config/db').pool;
var async = require("async");


exports.getData = function (req, res, next) {
    try {
            if (req.session && req.session.pack_UserName) {
                mysql.getConnection('CMS', function (err, connection_ikon_cms) {
                    async.parallel({
                         ContentTypes: function (callback) {
                            var query = connection_ikon_cms.query('select cd.*, ct.mct_parent_cnt_type_id, ' +
                                '(SELECT cd_name FROM catalogue_detail as cd1 join catalogue_master as cm1 ON  cm1.cm_id = cd1.cd_cm_id WHERE ct.mct_parent_cnt_type_id = cd1.cd_id) AS parent_name ' +
                                'from icn_store As st ' +
                                'inner join multiselect_metadata_detail as mlm on (mlm.cmd_group_id = st.st_content_type) ' +
                                'inner join catalogue_detail As cd on mlm.cmd_entity_detail = cd.cd_id ' +
                                'JOIN icn_manage_content_type as ct ON ct.mct_cnt_type_id = cd.cd_id ' +
                                'WHERE st.st_id = ? ', [req.session.pack_StoreId], function (err, ContentTypes) {
                                callback(err, ContentTypes)
                            });
                        }, 
                        PackTypes: function (callback) {
                            var query = connection_ikon_cms.query('SELECT * FROM catalogue_detail cd inner join catalogue_master cm on(cm.cm_id = cd.cd_cm_id) where cm_name in("Pack Type")',function (err, ContentTypes) {
                                callback(err, ContentTypes)
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
                        connection_ikon_cms.query("SELECT pk_id as id FROM `icn_packs` WHERE lower(pk_name) = ?",[req.body.pack_name.toLowerCase()],function (err, result) {
                            if(result.length > 0){
                                callback(err,true);
                            }else{
                                callback(null);
                            }
                        });
                    },
                    MaxPackId: function (callback) {
                            var query = connection_ikon_cms.query("SELECT MAX(pk_id) as id FROM `icn_packs`", function (err, result) {
                                     v_pk_id = result[0].id != null ? parseInt(result[0].id + 1) : 1;
                                     callback(err,v_pk_id);
                                });
                        }
                       },
                         function (err, results) {
                            //console.log(results.OperatorDetails)
                                if (results.PackExists) {
                                    connection_ikon_cms.release();
                                    res.send({"success" : false,"message" : "Pack Name must be unique."});
                                } else {
                                            var data = {
                                                pk_id : results.MaxPackId,
                                                pk_name : req.body.pack_name,
                                                pk_desc : req.body.pack_desc,
                                                pk_cnt_display_opt : req.body.pack_type,
                                                pk_is_active : 1,
                                                pk_created_on: new Date(),
                                                pk_created_by: req.session.Plan_UserName,
                                                pk_modified_on: new Date(),
                                                pk_modified_by: req.session.Plan_UserName
                                            }

                                            var query = connection_ikon_cms.query("INSERT INTO `icn_packs` SET ? ",data, function (err, result) {
                                                    if(err){
                                                         connection_ikon_cms.release();
                                                         res.status(500).json(err.message);
                                                    }else{

                                                                var count = req.body.pack_content_type.length;
                                                                v_pack_content_types = req.body.pack_content_type;
                                                                var cnt = 0;
                                                                loop(0);
                                                                function loop(cnt) {
                                                                    var i = cnt;
                                                                    var query = connection_ikon_cms.query("SELECT MAX(pct_id) as pct_id FROM `icn_pack_content_type`", function (err, result) {
                                                                        if(err){
                                                                             connection_ikon_cms.release();
                                                                             res.status(500).json(err.message);
                                                                        }else{
                                                                            //Get MAx pct id for Pack Content Type rows
                                                                            v_pct_id = result[0].cmd_id != null ? parseInt(result[0].pct_id + 1) : 1;
                                                                            var data = {
                                                                                pct_id : v_pct_id,
                                                                                pct_pk_id : results.MaxPackId,
                                                                                pct_cnt_type : v_pack_content_types[i],
                                                                                pct_is_active : 1
                                                                            }
                                                                            //Insert into multiselect
                                                                            var query = connection_ikon_cms.query('INSERT INTO `icn_pack_content_type` SET ?', data, function (err, result) {
                                                                                if(err){
                                                                                   connection_ikon_cms.release();
                                                                                   res.status(500).json(err.message);
                                                                                }else{
                                                                                    cnt = cnt + 1;
                                                                                    if(cnt == count){
                                                                                        connection_ikon_cms.release();
                                                                                        res.send({"success" : true, "message":"Pack successfully added."});
                                                                                    }else{
                                                                                        loop(cnt);
                                                                                    } //else
                                                                                }//else
                                                                            }); //query insert into multiselect..
                                                                        }
                                                                    });
                                                                } //loop;

                                                    } //here..
                                                });
                                          
                                }
                          });
                });//conn.
                
	        }else{

	        }
		}catch(err){


	  }
};