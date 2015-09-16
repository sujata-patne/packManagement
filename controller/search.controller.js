var mysql = require('../config/db').pool;
var async = require("async");
var SearchModel = require('../models/searchModel');

//var data = require('../config/config');

//console.log(data.ContentTypeDetails[0].Manual[0].Wallpaper);

exports.getContentTypeDetails = function (req, res, next) {
    try {
        if (req.session && req.session.pack_UserName) {
            mysql.getConnection('CMS', function (err, connection_ikon_cms) {
                async.parallel({
                    keywords: function (callback) {
                        SearchModel.getKeywords( connection_ikon_cms, function(err,keywords){
                            callback(err, keywords);
                        });

                    },
                    languages: function (callback) {
                        SearchModel.getLanguages( connection_ikon_cms, function(err,languages){
                            callback(err, languages);
                        });
                    },
                    genres: function (callback) {
                        SearchModel.getGenres( connection_ikon_cms, function(err,genres){
                            callback(err, genres);
                        });
                    },
                    subgenres: function (callback) {
                        SearchModel.getSubGenres( connection_ikon_cms, function(err,subgenres){
                            callback(err, subgenres);
                        });
                    },
                    mood: function (callback) {
                        SearchModel.getMood( connection_ikon_cms, function(err,mood){
                            callback(err, mood);
                        });
                    },
                    photographer: function (callback) {
                        SearchModel.getPhotographer( connection_ikon_cms, function(err,photographer){
                            callback(err, photographer);
                        });
                    },
                    vendor: function (callback) {
                        SearchModel.getVendor( connection_ikon_cms, function(err,vendor){
                            callback(err, vendor);
                        });
                    },
                    actor_actress: function (callback) {
                        SearchModel.getActorActress( connection_ikon_cms, function(err,actor_actress){
                            callback(err, actor_actress);
                        });
                    },
                    property: function (callback) {
                        SearchModel.getProperty( connection_ikon_cms, function(err,property){
                            callback(err, property);
                        });
                    },
                    content_title: function (callback) {
                        SearchModel.getContentTitle( connection_ikon_cms, function(err,title){
                            callback(err, title);
                        });
                    },
                    content_id: function (callback) {
                        SearchModel.getContentId( connection_ikon_cms, function(err,id){
                            callback(err, id);
                        });
                    },
                    releaseYearStart: function (callback) {
                        SearchModel.getReleaseYearStart( connection_ikon_cms, function(err,id){
                            callback(err, id);
                        });
                    },
                    releaseYearEnd: function (callback) {
                        SearchModel.getReleaseYearEnd( connection_ikon_cms, function(err,id){
                            callback(err, id);
                        });
                    },
                    packDetails: function (callback) {
                        SearchModel.getPackDetails( connection_ikon_cms,req.params.pctId, function(err,packDetails){
                            callback(err, packDetails);
                        });
                    },
                    packSearchDetails: function (callback) {
                        SearchModel.getPackSearchDetails( connection_ikon_cms,req.params.pctId, function(err,packSearchDetails){
                            callback(err, packSearchDetails);
                        });
                    }
                },
                function (err, results) {
                    if (err) {
                        connection_ikon_cms.release();
                        res.status(500).json(err.message);
                        console.log(err.message)
                    } else {
                       // console.log(results)
                        connection_ikon_cms.release();
                        res.send(results);
                    }
                })
            })
        }else{
            res.redirect('/accountlogin');
        }
    }catch(err){
        res.status(500).json(err.message);
    }
};

exports.saveSearchData = function (req, res, next) {
    try {
        if (req.session && req.session.pack_UserName && req.session.pack_StoreId) {
            mysql.getConnection('CMS', function (err, connection_ikon_cms) {
                async.parallel({
                    /*SearchCriteriaData : function(callback){
                        console.log(req.body)
                        SearchModel.getSearchCriteriaData(connection_ikon_cms,req.body,function(err,response){
                            callback(err,response);
                        });
                    }*/
                },function (err, results) {
                    //console.log(results.SearchCriteriaData)
                    var packData = {
                        pk_id : req.body.packId,
                        pk_rule_type : req.body.ruleType,
                        pk_nxt_rule_duration : req.body.nextRuleDuration,
                        pk_modified_on: new Date(),
                        pk_modified_by: req.session.pack_UserName
                    }

                    packUpdateResponse = updatePackData( connection_ikon_cms,packData );

                    var count = req.body.contentTypeDataDetails.length;
                    addEditSearch(0)
                    function addEditSearch(cnt) {
                        var j = cnt;
                        for (var searchFieldId in req.body.contentTypeDataDetails[j]) {
                            SearchModel.searchCriteriaFieldExist(connection_ikon_cms, req.body.pctId, searchFieldId, function (err, response) {
                                if (err) {
                                    connection_ikon_cms.release();
                                    res.status(500).json(err.message);
                                }
                                var data = {
                                    pcr_rec_type: 1,
                                    pcr_pct_id: req.body.pctId,
                                    pcr_metadata_type: searchFieldId,
                                    pcr_metadata_search_criteria: req.body.contentTypeDataDetails[j][searchFieldId],
                                    //pcr_start_date: req.body.releaseYearStart,
                                   // pcr_end_date: req.body.releaseYearEnd
                                }
                                //console.log(searchFieldId +' : '+ req.body.contentTypeDataDetails[j][searchFieldId])
                                if (response) {
                                    SearchModel.editSearchCriteriaField(connection_ikon_cms, data, function (err, response) {
                                        if (err) {
                                            connection_ikon_cms.release();
                                            res.status(500).json(err.message);
                                        }
                                        else {
                                            cnt = cnt + 1;
                                            if (cnt == count) {
                                                connection_ikon_cms.release();
                                                res.send({
                                                    "success": true,
                                                    "status": 200,
                                                    //"message": "Search Criteria updated successfully added.",
                                                   // "SearchCriteriaResult" : results.SearchCriteriaData
                                                });
                                            } else {
                                                addEditSearch(cnt);
                                            }
                                        }
                                    })
                                }
                                else {
                                    getLastSearchCriteriaId(connection_ikon_cms, function (lastInsertedSearchCriteriaId) {
                                        if (lastInsertedSearchCriteriaId) {
                                            data['pcr_id'] = lastInsertedSearchCriteriaId;
                                            SearchModel.addSearchCriteriaField(connection_ikon_cms, data, function (err, response) {
                                                if (err) {
                                                    connection_ikon_cms.release();
                                                    res.status(500).json(err.message);
                                                }
                                                else {
                                                    cnt = cnt + 1;
                                                    if (cnt == count) {
                                                        connection_ikon_cms.release();
                                                        res.send({
                                                            "success": true,
                                                            "status": 200,
                                                            //"message": "Search Criteria added successfully added.",
                                                            //"SearchCriteriaResult" : results.SearchCriteriaData
                                                        });
                                                    } else {
                                                        addEditSearch(cnt);
                                                    }
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    }
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

exports.getPackSearchResult = function (req, res, next) {
    try {
        if (req.session && req.session.pack_UserName) {
            mysql.getConnection('CMS', function (err, connection_ikon_cms) {
                    async.waterfall([
                        function (callback) {
                            SearchModel.getPackSearchDetails( connection_ikon_cms, req.body.pctId, function(err,packSearchDetails){
                                var contentTypeData = {};

                                contentTypeData["limitCount"] = req.body.limitCount;
                                contentTypeData["searchWhereTitle"] = req.body.title;
                                contentTypeData["searchWherePropertyTitle"] = req.body.property;
                                packSearchDetails.forEach(function (metadataFields) {
                                    contentTypeData["contentTypeId"] = metadataFields.contentTypeId;

                                    if (metadataFields.cm_name === "releaseYearStart") {
                                        contentTypeData["releaseYearStart"] = metadataFields.pcr_metadata_search_criteria;
                                    }
                                    if (metadataFields.cm_name === "releaseYearEnd") {
                                        contentTypeData["releaseYearEnd"] = metadataFields.pcr_metadata_search_criteria;
                                    }
                                    if (metadataFields.cm_name === "Content Title") {
                                        contentTypeData["Content_Title"] = metadataFields.pcr_metadata_search_criteria;
                                    }
                                    if (metadataFields.cm_name === "Property") {
                                        contentTypeData["Property"] = metadataFields.pcr_metadata_search_criteria;
                                    }
                                    if (metadataFields.cm_name === "Search Keywords") {
                                        contentTypeData["Keywords"] = metadataFields.pcr_metadata_search_criteria;
                                    }
                                    if (metadataFields.cm_name === "Content Ids") {
                                        contentTypeData["Content_Ids"] = metadataFields.pcr_metadata_search_criteria;
                                    }
                                    if (metadataFields.cm_name === "Languages") {
                                        contentTypeData["Language"] = parseInt(metadataFields.pcr_metadata_search_criteria);
                                    }
                                    if (metadataFields.cm_name === "Celebrity") {
                                        contentTypeData["Actor_Actress"] = parseInt(metadataFields.pcr_metadata_search_criteria);
                                    }
                                    if (metadataFields.cm_name === "Genres") {
                                        contentTypeData["Genres"] = parseInt(metadataFields.pcr_metadata_search_criteria);
                                    }
                                    if (metadataFields.cm_name === "Sub Genres") {
                                        contentTypeData["Sub_Genres"] = parseInt(metadataFields.pcr_metadata_search_criteria);
                                    }
                                    if (metadataFields.cm_name === "Mood") {
                                        contentTypeData["Mood"] = parseInt(metadataFields.pcr_metadata_search_criteria);
                                    }
                                    if (metadataFields.cm_name === "Photographer") {
                                        contentTypeData["Photographer"] = parseInt(metadataFields.pcr_metadata_search_criteria);
                                    }
                                    if (metadataFields.cm_name === "Vendor") {
                                        contentTypeData["Vendor"] = parseInt(metadataFields.pcr_metadata_search_criteria);
                                    }
                                })
                                //console.log(contentTypeData)

                                callback(err, contentTypeData);
                            });
                        },
                        function (data, callback) {
                            SearchModel.getSearchCriteriaResult(connection_ikon_cms,data,function(err,result){
                                //console.log(result)
                                callback(err, {'searchContentList':result});
                            });
                        }
                    ],
                    function (err, results) {
                        if (err) {
                            connection_ikon_cms.release();
                            res.status(500).json(err.message);
                            console.log(err.message)
                        } else {
                            console.log(results.searchContentList.length)
                            connection_ikon_cms.release();
                            res.send(results);
                        }
                    })
            })
        }else{
            res.redirect('/accountlogin');
        }
    }catch(err){
        res.status(500).json(err.message);
    }
};

function getLastSearchCriteriaId( connection_ikon_cms, callback ) {
        SearchModel.getLastSearchCriteriaId(connection_ikon_cms,function(err,maxPCRID){
        if(err){
            connection_ikon_cms.release();
            res.status(500).json(err.message);
        }else{
            return callback( maxPCRID );
        }
    });
}
function updatePackData( connection_ikon_cms, data ){
    SearchModel.updatePackData( connection_ikon_cms, data, function(err,response ){
        if(err){
            connection_ikon_cms.release();
            res.status(500).json(err.message);
            return false;
        }
    });
    return true;
}