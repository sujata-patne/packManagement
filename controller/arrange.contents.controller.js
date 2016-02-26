/**
 * Created by sujata.patne on 18-09-2015.
 */
var mysql = require('../config/db').pool;
var SearchModel = require('../models/searchModel');

exports.saveArrangedContents = function (req, res, next) {
    try {
        if (req.session && req.session.pack_UserName && req.session.pack_StoreId) {
            mysql.getConnection('CMS', function (err, connection_ikon_cms) {
                 var unique = [];
                var duplicate = [];
                var i = 0;

                if(req.body.packId != undefined && req.body.packId != '' && req.body.packId != null) {
                    updatePackData(connection_ikon_cms, req);
                }

                for (var contentId in req.body.arrangedContentList) {

                    var data = {
                        pc_pct_id: parseInt(req.body.pctId),
                        pc_cm_id: parseInt(contentId),
                        pc_arrange_seq: req.body.arrangedContentList[contentId]
                    }
                     if( unique.length == 0 ) {
                        unique.push( parseInt( req.body.arrangedContentList[contentId] ) );
                    } else if( unique.indexOf(parseInt( req.body.arrangedContentList[contentId] ) ) == -1 ) {
                        unique.push( parseInt( req.body.arrangedContentList[contentId] ) );
                    } else {
                        duplicate.push( parseInt( req.body.arrangedContentList[contentId] ) );
                    }
                    if(duplicate.length == 0){
                        addEditContents(connection_ikon_cms,data,req);
                    }

                }
                 
                connection_ikon_cms.release();
                if(duplicate.length > 0){
                    res.send({
                        "error": true,
                        "status": 400,
                        "message": "Duplicate entries found!."
                    });
                }else{ 
                    res.send({
                        "success": true,
                        "status": 200,
                        "message": "Contents saved successfully!."
                    });
                }
            })
        }else {
            res.redirect('/accountlogin');
        }
    }
    catch (err) {
        res.status(500).json(err.message);
    }
}

exports.savePublishedContents = function (req, res, next) {

    try {
        if (req.session && req.session.pack_UserName && req.session.pack_StoreId) {
            mysql.getConnection('CMS', function (err, connection_ikon_cms) {
                if(req.body.packId != undefined && req.body.packId != '' && req.body.packId != null) {
                    updatePackData(connection_ikon_cms, req);
                }
                var i = 0;
                for (var contentId in req.body.arrangedContentList) {
                    var data = {
                        pc_pct_id: parseInt(req.body.pctId),
                        pc_cm_id: parseInt(contentId),
                        pc_arrange_seq: req.body.arrangedContentList[contentId],
                        pc_ispublished: 1
                    }

                    addEditContents(connection_ikon_cms,data,req);
                }
                connection_ikon_cms.release();
                res.send({
                    "success": true,
                    "status": 200,
                    "message": "Search Contents published successfully!."
                })
            })
        }else {
            res.redirect('/accountlogin');
        }
    }
    catch (err) {  
        res.status(500).json(err.message);
    }
}

function updatePackData( connection_ikon_cms, req ){
    var data = {
        pk_id: req.body.packId,
        pk_modified_on: new Date(),
        pk_modified_by: req.session.pack_UserName
    }
    SearchModel.updatePackData( connection_ikon_cms, data, function(err,response ){
        if(err){
            connection_ikon_cms.release();
            res.status(500).json(err.message);
            return false;
        }
    });
    return true;
}

function addEditContents(connection_ikon_cms,data,req){

    SearchModel.searchContentsExist(connection_ikon_cms, data, function (err, response) {
        if (err) {
            connection_ikon_cms.release();
            res.status(500).json(err.message);
        }else {
            data['pc_modified_on'] =  new Date();
            data['pc_modified_by'] =  req.session.pack_UserName;
            if (response) {
                SearchModel.updateSearchContents(connection_ikon_cms, data, function (err, response) {
                    if (err) {
                        connection_ikon_cms.release();
                        res.status(500).json(err.message);
                    }
                })
            } else {
                data['pc_created_on'] = new Date();
                data['pc_created_by'] = req.session.pack_UserName;
                data['pc_modified_on'] =  new Date();
                data['pc_modified_by'] =  req.session.pack_UserName;
                SearchModel.insertSearchContents(connection_ikon_cms, data, function (err, response) {
                    if (err) {
                        connection_ikon_cms.release();
                        res.status(500).json(err.message);
                    }
                })
            }
        }
    })
}