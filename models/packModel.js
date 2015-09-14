exports.getContentTypes = function(dbConnection,storeId,callback){
		 var query = dbConnection.query('select cd.*, ct.mct_parent_cnt_type_id, ' +
                                '(SELECT cd_name FROM catalogue_detail as cd1 join catalogue_master as cm1 ON  cm1.cm_id = cd1.cd_cm_id WHERE ct.mct_parent_cnt_type_id = cd1.cd_id) AS parent_name ' +
                                'from icn_store As st ' +
                                'inner join multiselect_metadata_detail as mlm on (mlm.cmd_group_id = st.st_content_type) ' +
                                'inner join catalogue_detail As cd on mlm.cmd_entity_detail = cd.cd_id ' +
                                'JOIN icn_manage_content_type as ct ON ct.mct_cnt_type_id = cd.cd_id ' +
                                'WHERE st.st_id = ? ', [storeId], function (err, ContentTypes) {
        callback(err, ContentTypes);
    });
}

exports.getPackTypes = function(dbConnection,callback){

	var query = dbConnection.query('SELECT * FROM catalogue_detail cd '+
											'inner join catalogue_master cm on(cm.cm_id = cd.cd_cm_id) '+
											'where cm_name in( "Pack Type" )',
				function (err, packTypes) {
               		callback(err, packTypes);
    			}
    );
}

exports.getPackByName = function(dbConnection,packName,callback){
		dbConnection.query("SELECT pk_id as id FROM `icn_packs` WHERE lower(pk_name) = ?",
			[packName],function (err, result) {
	            if(result.length > 0){
	                callback(err,true);
	            }else{
	                callback(err,false);
	            }
        });
}

exports.getPacksForStore = function(dbConnection,storeId,callback){
		dbConnection.query("SELECT * FROM `icn_packs` WHERE pk_st_id = ?",storeId,function (err, response) {
	            callback(err, response);
        });
}

exports.savePack = function(dbConnection,data,callback){
	var query = dbConnection.query("INSERT INTO `icn_packs` SET ? ",data, function (err, response) {
		callback(err,response);
	});
}

exports.getLastInsertedPackId = function( dbConnection, callback ) {
	var query = dbConnection.query("SELECT MAX(pk_id) as id FROM `icn_packs`", function ( err, response ) {
        packId = response[0].id != null ? parseInt(response[0].id + 1) : 1;
        callback( err,packId );
    });
}
exports.getLastInsertedPackContentType = function( dbConnection, callback) {
	var query = dbConnection.query("SELECT MAX(pct_id) as pct_id FROM `icn_pack_content_type`", function ( err, response ) {
		callback( err, response );
	});
}
exports.saveIconPackContentType = function(dbConnection,data,callback){
	var query = dbConnection.query("INSERT INTO `icn_pack_content_type` SET ? ", data, function (err, response) {
		callback(err,response);
	});
}

exports.getContentTypesByPackId = function(dbConnection,packId,callback){
	var query = dbConnection.query("SELECT *,(select cd_name from catalogue_detail cd "+
									" , `icn_packs` as ip where cd.cd_id = ip.pk_cnt_display_opt Limit 1 ) as type "+
									"FROM ikon_cms.`icn_pack_content_type` pct inner join `catalogue_detail` cd on "+
									"(pct.pct_cnt_type = cd.cd_id) inner join icn_packs ip on(ip.pk_id = pct_pk_id) "+
									"where pct.pct_pk_id = ?",packId,
		            function(err,response){
                            callback(err,response);
                    }
    );
}

exports.updateContentTypeStatus = function(dbConnection,packId,contentTypeId,active,callback){
	var query = dbConnection.query("UPDATE `icn_pack_content_type` SET pct_is_active = ? WHERE pct_pk_id = ? AND  pct_cnt_type = ? ",[active,packId,contentTypeId], function (err, response) {
		callback(err,response);
	});
}
