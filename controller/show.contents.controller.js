/**
 * Created by sujata.patne on 18-09-2015.
 */
var mysql = require('../config/db').pool;
var SearchModel = require('../models/searchModel');
var packManager = require('../models/packModel');
var async = require('async');

exports.showArrangeContents = function (req, res, next) {
    try {
        if (req.session && req.session.pack_UserName && req.session.pack_StoreId) {
            mysql.getConnection('CMS', function (err, connection_ikon_cms) {
                async.series([
                    function (callback) {
                        if(req.body.packId != undefined && req.body.packId != '' && req.body.packId != null) {
                            updatePackData(connection_ikon_cms, req);
                        }
                        callback(null, null);
                    },
                    function (callback) {
                        if(req.body.unselectedContentsList.length > 0){
                            deleteUnwantedContents(connection_ikon_cms, req.body.pctId, req.body.unselectedContentsList);
                        }
                        callback(null, null);
                    },
                    function (callback) {
                        var cnt = 0;
                        uniqueArray = req.body.selectedContentList.filter(function(elem, pos) {
                            return req.body.selectedContentList.indexOf(elem) == pos;
                        })

                        async.each( req.body.selectedContentList, function( selectedContent, callback ) {
                            var data = {
                                pc_pct_id: parseInt(req.body.pctId),
                                pc_cm_id: selectedContent,
                            }
                            addEditContents( connection_ikon_cms,data,req,++cnt );

                            callback(null, null);
                        });
                        callback(null, null);
                    }
                ],function( err, results ){
                    setTimeout( function() {
                        if (err) {
                            connection_ikon_cms.release();
                            res.status(500).json(err.message);
                            console.log(err.message)
                        } else {
                            connection_ikon_cms.release();
                            res.send({
                                "success": true,
                                "status": 200,
                                "message": "Search Contents saved successfully!."
                            });
                        }
                    }, 500 );

                });
            })
        }else {
            res.redirect('/accountlogin');
        }
    }
    catch (err) {
        res.status(500).json(err.message);
    }
}

exports.showPublishContents = function (req, res, next) {
    try {
        if (req.session && req.session.pack_UserName && req.session.pack_StoreId) {
            mysql.getConnection('CMS', function (err, connection_ikon_cms) {
                var count = req.body.selectedContentList;
                async.series([
                    function (callback) {
                        if(req.body.packId != undefined && req.body.packId != '' && req.body.packId != null) {
                            updatePackData(connection_ikon_cms, req);
                        }
                        callback(null, null);
                    },
                    function (callback) {
                        if(req.body.unselectedContentsList.length > 0){
                            deleteUnwantedContents(connection_ikon_cms, req.body.pctId, req.body.unselectedContentsList);
                        }
                        callback(null, null);
                    },
                    function (callback) {
                        var cnt = 0;
                        uniqueArray = req.body.selectedContentList.filter(function(elem, pos) {
                            return req.body.selectedContentList.indexOf(elem) == pos;
                        })

                        async.each(uniqueArray , function( selectedContent, callback ) {
                            var data = {
                                pc_pct_id: parseInt(req.body.pctId),
                                pc_cm_id: selectedContent,
                                pc_ispublished: 1,

                            }
                            addEditContents( connection_ikon_cms,data,req,++cnt )

                            callback(null, null);
                        })
                        callback(null, null);
                    }
                ],function( err, results ){
                    setTimeout( function() {
                        if (err) {
                            connection_ikon_cms.release();
                            res.status(500).json(err.message);
                            console.log(err.message)
                        } else {
                            connection_ikon_cms.release();
                            res.send({
                                "success": true,
                                "status": 200,
                                "message": "Search Contents published successfully!."
                            });
                        }
                    }, 500 );

                });
            })
        }else {
            res.redirect('/accountlogin');
        }
    }
    catch (err) {
        res.status(500).json(err.message);
    }
}

exports.showResetRules = function (req, res, next) {
    try {
        if (req.session && req.session.pack_UserName && req.session.pack_StoreId) {
            mysql.getConnection('CMS', function (err, connection_ikon_cms) {
                SearchModel.searchCriteriaExist(connection_ikon_cms, req.body.pctId, function (err, response) {
                    if (err) {
                        connection_ikon_cms.release();
                        res.status(500).json(err.message);
                    }else{
                        if(response){
                            /*delete existing search criteria and contents*/
                            SearchModel.deleteSearchCriteria(connection_ikon_cms, req.body.pctId, function (err, response) {
                                if (err) {
                                    connection_ikon_cms.release();
                                    res.status(500).json(err.message);
                                }else{
                                    SearchModel.deleteSearchedContent(connection_ikon_cms, req.body.pctId, function (err, response) {
                                        if (err) {
                                            connection_ikon_cms.release();
                                            res.status(500).json(err.message);
                                        }
                                    })
                                }
                            })
                        }
                        connection_ikon_cms.release();
                        res.send({
                            "success": true,
                            "status": 200,
                            "message": "Reset Rules successfully."
                        });
                    }
                });
            })
        }else {
            res.redirect('/accountlogin');
        }
    }
    catch (err) {
        res.status(500).json(err.message);
    }
}

function deleteUnwantedContents(connection_ikon_cms,pctId,data){

    SearchModel.getPulishedContentIds( connection_ikon_cms, pctId, data, function (err, result ) {

        var contentIds = result[0].contentIds;

        deleteIds = [];
        publishedIds = [];
        async.each(data, function(deletedContentId, callback ) {
            if(  contentIds !== null ) {
                if( contentIds.indexOf( deletedContentId ) == -1 ) {
                    deleteIds.push( parseInt( deletedContentId ) );
                }else {
                    publishedIds.push(parseInt( deletedContentId ) );
                }
            }else {
                deleteIds.push( parseInt( deletedContentId )  );
            }
        });

        if( publishedIds.length > 0 ) {
            SearchModel.deletePackContentsByIds(connection_ikon_cms, pctId, publishedIds, function (err, result) {
                if (err) {
                    connection_ikon_cms.release();
                    res.status(500).json(err.message);
                }
            });
        }
        if( deleteIds.length > 0 ) {
            SearchModel.deleteUnwantedPackContentsByContentIds(connection_ikon_cms, pctId, deleteIds, function (err, response) {
                if (err) {
                    connection_ikon_cms.release();
                    res.status(500).json(err.message);
                }
            });
        }
    });
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
        }else{
            packManager.updatePackageModified(connection_ikon_cms,req.body.packId,function(err,response){
                if(err){
                     connection_ikon_cms.release();
                     res.status(500).json(err.message);
                     return false;
                }
            });
        }
    });
    return true;
}

function addEditContents(connection_ikon_cms,data,req,seq){
    SearchModel.searchContentsExist(connection_ikon_cms, data, function (err, response) {
        if (err) {
            connection_ikon_cms.release();
            res.status(500).json(err.message);
        }else {
            data['pc_arrange_seq'] = (req.body.rule == "Auto" || req.body.auto == true) ? seq : null;

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