/**
 * Created by sujata.patne on 18-09-2015.
 */
var mysql = require('../config/db').pool;
var SearchModel = require('../models/searchModel');

exports.showArrangeContents = function (req, res, next) {
    try {
        if (req.session && req.session.pack_UserName && req.session.pack_StoreId) {
            mysql.getConnection('CMS', function (err, connection_ikon_cms) {
                if(req.body.unselectedContentsList.length > 0){
                    deleteUnwantedContents(connection_ikon_cms, req.body.pctId, req.body.unselectedContentsList);
                }
                for (var contentId in req.body.selectedContentList) {
                    var cnt = 0;
                    var data = {
                        pc_pct_id: parseInt(req.body.pctId),
                        pc_cm_id: req.body.selectedContentList[contentId],
                    }
                    addEditContents(connection_ikon_cms,data);
                }
                connection_ikon_cms.release();
                res.send({
                    "success": true,
                    "status": 200,
                    "message": "Search Contents saved successfully!."
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


exports.showPublishContents = function (req, res, next) {
    try {
        if (req.session && req.session.pack_UserName && req.session.pack_StoreId) {
            mysql.getConnection('CMS', function (err, connection_ikon_cms) {
                if(req.body.unselectedContentsList.length > 0){
                    deleteUnwantedContents(connection_ikon_cms, req.body.pctId, req.body.unselectedContentsList);
                }
                for (var contentId in req.body.selectedContentList) {
                    var data = {
                        pc_pct_id: parseInt(req.body.pctId),
                        pc_cm_id: req.body.selectedContentList[contentId],
                        pc_ispublished: 1
                    }
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
    SearchModel.getUnwantedPackContents(connection_ikon_cms, pctId, data, function (err, result) {
        if (err) {
            connection_ikon_cms.release();
            res.status(500).json(err.message);
        }else {
            if(result[0].contents != null ) {
                var contentList = result[0].contents.split(',')
                    .map(function (element) {
                        return element
                    })
                console.log(contentList)
                var count = contentList.length;
                deleteContent(0);
                function deleteContent(cnt) {
                    var j = cnt;
                        var data = {
                            pc_pct_id: pctId,
                            pc_cm_id: contentList[j]
                        };
                    console.log(contentList[j])
                    SearchModel.isPublishedContents(connection_ikon_cms, data, function (err, response) {
                        if (err) {
                            connection_ikon_cms.release();
                            res.status(500).json(err.message);
                        } else {
                            if (response) {
                                SearchModel.deletePackContents(connection_ikon_cms, data, function (err, result) {
                                    if (err) {
                                        connection_ikon_cms.release();
                                        res.status(500).json(err.message);
                                    }
                                })
                            } else {
                                SearchModel.deleteUnwantedPackContents(connection_ikon_cms, data, function (err, response) {
                                    if (err) {
                                        connection_ikon_cms.release();
                                        res.status(500).json(err.message);
                                    }
                                })
                            }
                            cnt = cnt + 1;
                            if (cnt < count) {
                                deleteContent(cnt);
                            }
                        }
                    })

                }
            }
        }
    })
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
                console.log(data)
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