exports.getLastInsertedTemplateId = function( dbConnection, callback ) {
	var query = dbConnection.query("SELECT MAX(ct_id) as id FROM `content_template`", function ( err, response ) {
        templateId = response[0].id != null ? parseInt(response[0].id + 1) : 1;
        callback( err,templateId );
    });
}

exports.getLastInsertedContentFilesId = function( dbConnection, callback ) {
	var query = dbConnection.query("SELECT MAX(cf_id) as id FROM `content_files`", function ( err, response ) {
        templateId = response[0].id != null ? parseInt(response[0].id + 1) : 1;
        callback( err,templateId );
    });
}

exports.getLastInsertedTemplateGroupId = function( dbConnection, callback ) {
	var query = dbConnection.query("SELECT MAX(ct_group_id) as id FROM `content_template`", function ( err, response ) {
        templateId = response[0].id != null ? parseInt(response[0].id + 1) : 1;
        callback( err,templateId );
    });
}

exports.getTemplateGroupIdForAny = function( dbConnection, callback ) {
	var query = dbConnection.query("SELECT MAX(ct_group_id) as id FROM `content_template` WHERE ct_param_value = 'ANY'", function ( err, response ) {
        templateId = response[0].id;
        callback( err,templateId );
    });
}

exports.saveTemplateForUpload = function(dbConnection,data,callback){
	var query = dbConnection.query("INSERT INTO `content_template` SET ? ",data, function (err, response) {
		callback(err,response);
	});
}
exports.saveStoreThumbnailFiles = function(dbConnection,data,callback){
        var query = dbConnection.query("INSERT INTO `content_files_thumbnail` SET ? ",data, function (err, response) {
            callback(err,response);
        });
    }
exports.saveContentFiles = function(dbConnection,data,callback){
	var query = dbConnection.query("INSERT INTO `content_files` SET ? ",data, function (err, response) {
		callback(err,response);
	});
}