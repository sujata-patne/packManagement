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
                    packDetails: function (callback) {
                        SearchModel.getPackDetails( connection_ikon_cms, function(err,packDetails){
                            callback(err, packDetails);
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

        }
    }catch(err){

    }
};

exports.saveSearchData = function (req, res, next) {
    try {
        if (req.session && req.session.pack_UserName && req.session.pack_StoreId) {
            mysql.getConnection('CMS', function (err, connection_ikon_cms) {
                async.parallel({
                    MaxSearchCriteriaId: function (callback) {
                        SearchModel.getLastSearchCriteriaId(connection_ikon_cms,function(err,MaxSearchCriteriaId){
                            callback(err,MaxSearchCriteriaId);
                        });
                    },
                    SearchCriteriaData : function(callback){
                        SearchModel.getSearchCriteriaData(connection_ikon_cms,req.body,function(err,response){
                            callback(err,response);
                        });
                    }
                },function (err, results) {
                    //console.log(results.OperatorDetails)
                    if (results.PackExists) {
                        connection_ikon_cms.release();
                        res.send({"success": false, "message": "Pack Name must be unique."});
                    } else {
                        req.body.contentTypeDataDetails.forEach(function(searchFieldData, searchFieldId){
                            SearchModel.searchCriteriaFieldExist(connection_ikon_cms,req.body.pctId,searchFieldId,function(err,response) {
                                if(err){
                                    connection_ikon_cms.release();
                                    res.send({"success" : false,"message" : "Search Criteria Not Added."});
                                }
                                if(response){
                                    EditSearchCriteria();
                                }
                                else {
                                    AddSearchCriteria();
                                }

                                function AddSearchCriteria(){
                                    var data = {
                                        pcr_rec_type: 1,
                                        pcr_pct_id: req.body.pctId,
                                        pcr_metadata_type: searchFieldId,
                                        pcr_metadata_search_criteria: searchFieldData,
                                        pcr_start_date: req.body.releaseDurationStart,
                                        pcr_end_date: req.body.releaseDurationEnd
                                    }
                                    console.log(data)
                                    SearchModel.addSearchCriteriaField(connection_ikon_cms,data,function(err,response) {
                                        if(err){
                                            connection_ikon_cms.release();
                                            res.status(500).json(err.message);
                                        }
                                        /*else {
                                            connection_ikon_cms.release();
                                            res.send({ success: true, message: 'Subscription Plan Updated successfully.' });
                                        }*/
                                    })

                                }
                            })
                        })
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