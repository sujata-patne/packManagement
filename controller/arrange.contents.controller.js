/**
 * Created by sujata.patne on 18-09-2015.
 */
var mysql = require('../config/db').pool;
var SearchModel = require('../models/searchModel');

exports.saveArrangedContents = function (req, res, next) {
    try {
        if (req.session && req.session.pack_UserName && req.session.pack_StoreId) {
            mysql.getConnection('CMS', function (err, connection_ikon_cms) {
                var count = req.body.arrangedContentList[contentId];

                for (var contentId in req.body.arrangedContentList) { 
                    var data = {
                        pc_pct_id: parseInt(req.body.pctId),
                        pc_cm_id: parseInt(contentId),
                        pc_arrange_seq: req.body.arrangedContentList[contentId]
                    }
                    console.log(data)
                    addEditContents(connection_ikon_cms,data);
                }
                connection_ikon_cms.release();
                res.send({
                    "success": true,
                    "status": 200,
                    "message": "Contents saved successfully!."
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

exports.savePublishedContents = function (req, res, next) {
    try {
        if (req.session && req.session.pack_UserName && req.session.pack_StoreId) {
            mysql.getConnection('CMS', function (err, connection_ikon_cms) {
                
                var count = req.body.arrangedContentList[contentId];

                for (var contentId in req.body.arrangedContentList) { 
                    var data = {
                        pc_pct_id: parseInt(req.body.pctId),
                        pc_cm_id: parseInt(contentId),
                        pc_arrange_seq: req.body.arrangedContentList[contentId],
                        pc_ispublished: 1
                    }
                    console.log(data)
                    addEditContents(connection_ikon_cms,data);
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


function addEditContents(connection_ikon_cms,data){

    SearchModel.searchContentsExist(connection_ikon_cms, data, function (err, response) {
        if (err) {
            connection_ikon_cms.release();
            res.status(500).json(err.message);
        }else {
            if (response) {
                SearchModel.updateSearchContents(connection_ikon_cms, data, function (err, response) {
                    if (err) {
                        connection_ikon_cms.release();
                        res.status(500).json(err.message);
                    }
                })
            } else {
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