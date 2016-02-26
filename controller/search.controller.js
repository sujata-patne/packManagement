var mysql = require('../config/db').pool;
var async = require("async");
var SearchModel = require('../models/searchModel');
var ContentModel = require('../models/contentModel');
var formidable = require('formidable');
var fs = require('fs');
var inspect = require('util-inspect');
var moment = require('moment');

//var data = require('../config/config');

//console.log(data.ContentTypeDetails[0].Manual[0].Wallpaper);

exports.getSavedContents = function (req, res, next) {
    try {
        if (req.session && req.session.pack_UserName && req.session.pack_StoreId) {
            mysql.getConnection('CMS', function (err, connection_ikon_cms) {
                async.parallel({
                    packDetails: function (callback) {
                        SearchModel.getPackDetails( connection_ikon_cms,req.body.pctId, function(err,packDetails){
                            callback(err, packDetails);
                        });
                    },
                    packSearchDetails: function (callback) {
                        SearchModel.getPackSearchDetails( connection_ikon_cms,req.body.pctId, function(err,packSearchDetails){
                            callback(err, packSearchDetails);
                        });
                    },
                    packContentsSequence: function (callback) {
                        SearchModel.getPackContents(connection_ikon_cms, req.body.pctId, function (err, packContents) {
                            var data = {};
                            packContents.forEach(function(value,key){
                                data[value.pc_cm_id] = value.pc_arrange_seq;
                            })
                            //console.log(data)
                            callback(err, data);
                        })
                    },
                    packContentsPublished: function (callback) {
                        SearchModel.getPackContents(connection_ikon_cms, req.body.pctId, function (err, packContents) {
                            var data = {};
                            packContents.forEach(function(value,key){
                                data[value.pc_cm_id] = value.pc_ispublished;
                            })
                            //console.log(data)
                            callback(err, data);
                        })
                    },
                    contents: function (callback) {
                        SearchModel.getSavedContents(connection_ikon_cms, req.body.pctId, function (err, savedContents) {
                            callback(err, savedContents);
                        });
                    }
                },
                function (err, results) {
                    //console.log(results)
                    if (err) {
                        connection_ikon_cms.release();
                        res.status(500).json(err.message);
                        console.log(err.message)
                    } else {
                        connection_ikon_cms.release();
                        res.send(results);
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

exports.saveSearchContents = function (req, res, next) {
    try {
        if (req.session && req.session.pack_UserName && req.session.pack_StoreId) {
            //console.log(req.body.selectedContentList)
            mysql.getConnection('CMS', function (err, connection_ikon_cms) {
                var count = req.body.selectedContentList.length;

                SearchModel.deleteSearchedContent(connection_ikon_cms, req.body.pctId, function (err, response) {
                    if (err) {
                        connection_ikon_cms.release();
                        res.status(500).json(err.message);
                    }else{
//console.log(req.body.selectedContentList)
                        for (var i in req.body.selectedContentList) {
                            addEditSearchContents(req.body.selectedContentList[i]);
                            var cnt = 0;
                            function addEditSearchContents(contentId) {
                                var data = {
                                    pc_pct_id: req.body.pctId,
                                    pc_cm_id: contentId,
                                    pc_ispublished: 0,
                                    pc_arrange_seq: 0
                                }
                                //console.log(data)
                                SearchModel.saveSearchContents(connection_ikon_cms, data, function (err, response) {
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
                                                "message": "Search Contents added successfully!."
                                            });
                                        }
                                    }
                                })
                            }
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
                    rules: function (callback) {
                        SearchModel.getRules(connection_ikon_cms, function (err, rules) {
                            callback(err, rules);
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
                        SearchModel.getVendor( connection_ikon_cms,req.session.pack_StoreId, function(err,vendor){
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
                    singers: function (callback) {
                        SearchModel.getSinger( connection_ikon_cms, function(err,singers){
                            callback(err, singers);
                        });
                    },
                    music_directors: function (callback) {
                        SearchModel.getMusicDirectors( connection_ikon_cms, function(err,music_directors){
                            callback(err, music_directors);
                        });
                    },
                    adult: function (callback) {
                        SearchModel.getNudity( connection_ikon_cms, function(err,adult){
                            callback(err, adult);
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
                    property_release_year: function (callback) {
                        SearchModel.getReleaseYear( connection_ikon_cms, function(err,id){
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

exports.saveSearchCriteria = function (req, res, next) {
    try {
        if (req.session && req.session.pack_UserName && req.session.pack_StoreId) {
            mysql.getConnection('CMS', function (err, connection_ikon_cms) {
                var packData = {
                    pk_id : req.body.packId,
                    pk_rule_type : req.body.ruleType,
                    // pk_nxt_rule_duration : req.body.nextRuleDuration,
                    pk_modified_on: new Date(),
                    pk_modified_by: req.session.pack_UserName
                }
                /*update pack details*/
                packUpdateResponse = updatePackData( connection_ikon_cms,packData );

                //To add/ update the duration and next execution date : 
                var where_contentTypeDataDuration = {
                    pct_id : req.body.pctId,
                    pct_pk_id : req.body.packId
                }  
              
                var data_contentTypeDataDuration = {
                    pct_nxt_rule_duration : req.body.nextRuleDuration,
                } 

                updateContentTypeDurationResponse = updateContentTypeForDuration( connection_ikon_cms,data_contentTypeDataDuration , where_contentTypeDataDuration);

                /* Add/update pack search criteria fields with values */
                var count = req.body.contentTypeDataDetails.length;
                SearchModel.existSearchCriteriaField(connection_ikon_cms, req.body.pctId, function (err, response) {
                    if (err) {
                        connection_ikon_cms.release();
                        res.status(500).json(err.message);
                    } else {
                        if (response) {
                            SearchModel.deleteSearchCriteriaField(connection_ikon_cms, req.body.pctId, function (err, response) {
                                if (err) {
                                    connection_ikon_cms.release();
                                    res.status(500).json(err.message);
                                }
                            })
                        }
                    }
                })
                addEditSearch(0);

                function addEditSearch(cnt) {
                    var j = cnt;

                    var data = {
                        pcr_rec_type: 1,
                        pcr_pct_id: req.body.pctId,
                        pcr_start_year: req.body.releaseYearStart == '' ? null : req.body.releaseYearStart ,
                        pcr_end_year: req.body.releaseYearEnd == '' ? null : req.body.releaseYearEnd
                    }
                    for (var searchFieldId in req.body.contentTypeDataDetails[j]) {
                        data['pcr_metadata_type']= searchFieldId;
                        data['pcr_metadata_search_criteria'] = req.body.contentTypeDataDetails[j][searchFieldId];

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
                                            });
                                        } else {
                                            addEditSearch(cnt);
                                        }
                                    }
                                })
                            }
                        })
                    }
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

exports.getPackSearchResult = function (req, res, next) {
    try {
        if (req.session && req.session.pack_UserName) {
            mysql.getConnection('CMS', function (err, connection_ikon_cms) {
                    async.waterfall([
                            /* function (callback) {
                            //var contentTypeData = setPackSearchCriteraFields(connection_ikon_cms, req);
                            SearchModel.getPackSearchDetails( connection_ikon_cms, req.body.pctId, function(err,packSearchDetails){
                                var contentTypeData = {};
                                contentTypeData["storeId"] = req.session.pack_StoreId;
                                contentTypeData["limitCount"] = req.body.limitCount;
                                contentTypeData["searchWhereTitle"] = req.body.title;
                                contentTypeData["searchWherePropertyTitle"] = req.body.property;
                                contentTypeData["ruleName"] = req.body.rule;

                                packSearchDetails.forEach(function (metadataFields) {
                                    contentTypeData["contentTypeId"] = metadataFields.contentTypeId;

                                    if(metadataFields.pcr_start_year != '0000' || metadataFields.pcr_end_year != '0000'){
                                        contentTypeData["releaseYearStart"] = metadataFields.pcr_start_year;
                                        contentTypeData["releaseYearEnd"] = metadataFields.pcr_end_year;
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
                                    if (metadataFields.cm_name === "Singers") {
                                        contentTypeData["Singers"] = parseInt(metadataFields.pcr_metadata_search_criteria);
                                    }
                                    if (metadataFields.cm_name === "Music Directors") {
                                        contentTypeData["Music_Directors"] = parseInt(metadataFields.pcr_metadata_search_criteria);
                                    }
                                    if (metadataFields.cm_name === "Nudity") {
                                        contentTypeData["Nudity"] = parseInt(metadataFields.pcr_metadata_search_criteria);
                                    }
                                    if (metadataFields.cm_name === "Rules") {
                                        contentTypeData["Rules"] = metadataFields.pcr_metadata_search_criteria;
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
                                callback(err, contentTypeData);
                            });
                            setPackSearchCriteraFields( connection_ikon_cms, data, function( contentTypeData ) {
                                console.log(contentTypeData); process.exit(0);
                                callback(err, contentTypeData);

                            })
                        },*/
                        function (callback) {
                            //setPackSearchCriteraFields( connection_ikon_cms, req.body.pctId, function( contentTypeData ) {
                            SearchModel.setPackSearchCriteraFields( connection_ikon_cms, req.body.pctId, function(err,contentTypeData) {

                                contentTypeData["storeId"] = req.session.pack_StoreId;
                                contentTypeData["limitCount"] = req.body.limitCount;
                                contentTypeData["searchWhereTitle"] = req.body.title;
                                contentTypeData["searchWherePropertyTitle"] = req.body.property;
                                contentTypeData["ruleName"] = req.body.rule;

                                SearchModel.getSearchCriteriaResult(connection_ikon_cms,contentTypeData,function(err,result){
                                    callback(err, result);
                                });
                            })
                        },
                        function (searchContentList, callback) {
                          //  console.log(req.body.pctId)
                            SearchModel.getPackDetails( connection_ikon_cms,req.body.pctId, function(err,packDetails){
                                callback(err, searchContentList, packDetails);
                            });
                        },
                        function (searchContentList, packDetails, callback) {
                            SearchModel.getPackSearchDetails( connection_ikon_cms,req.body.pctId, function(err,packSearchDetails){
                                callback(err,searchContentList,packDetails,packSearchDetails);
                            });
                        },
                        function (searchContentList,packDetails,packSearchDetails,callback) {
                            SearchModel.getPackContentSequence( connection_ikon_cms,req.body.pctId, function(err,packContentSequence){
                                callback(err, searchContentList,packDetails,packSearchDetails,packContentSequence);
                            });
                        },
                        function (searchContentList,packDetails,packSearchDetails,packContentSequence,callback) {
                            SearchModel.getSavedContents(connection_ikon_cms, req.body.pctId, function (err, savedContents) {
                                callback(err, {'searchContentList':searchContentList,'packDetails':packDetails, 'packSearchDetails':packSearchDetails, 'packContentSequence':packContentSequence,'contents':savedContents});
                            });
                        }
                    ],
                    function (err, results) {
                        //console.log(results.packContentSequence)
                        if (err) {
                            connection_ikon_cms.release();
                            res.status(500).json(err.message);
                            console.log(err.message)
                        }
                        else {
                           // console.log(results.searchContentList.length)
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

exports.UploadFile =  function (req, res, next) {
            var form = new formidable.IncomingForm();
            var template_id;
            var count = 0;
            form.parse(req, function (err, fields, files) {
                var newPath = __dirname + "/../public/contentFiles/"+files.file.name;
                var absPath = "/contentFiles/"+files.file.name;
                var tmp_path = files.file.path;
                fs.rename(tmp_path,newPath, function (err) {
                   if (err) {
                      res.status(500).json(err.message);
                      connection_ikon_cms.release();
                   }
                   // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
                   fs.unlink(tmp_path, function(err) {
                       if (err) res.status(500).json(err.message);
                   });

                    mysql.getConnection('CMS', function (err, connection_ikon_cms) {
                        async.parallel({
                            MaxTemplateId : function(callback){
                                ContentModel.getLastInsertedTemplateId(connection_ikon_cms,function(err,MaxTemplateId){
                                        callback(err,MaxTemplateId);
                                }); 
                            },
                            MaxTemplateGroupId : function(callback){
                                ContentModel.getTemplateGroupIdForAny(connection_ikon_cms,function(err,MaxTemplateGroupId){
                                        callback(err,MaxTemplateGroupId);
                                }); 
                            },
                            MaxContentFilesId : function(callback){
                                ContentModel.getLastInsertedContentFilesId(connection_ikon_cms,function(err,MaxContentFilesId){
                                        callback(err,MaxContentFilesId);
                                }); 
                            }
                        },function(err,results){
                                if(results.MaxContentFilesId == template_id){
                                    template_id = template_id + 1;
                                }else{
                                    template_id = results.MaxContentFilesId;
                                }

                                var data = {
                                    cf_id: template_id + parseInt(Date.now().toString().slice(-2)),
                                    cf_cm_id : fields.cm_id,
                                    cf_url_base : absPath,
                                    cf_url : absPath,
                                    cf_absolute_url : absPath,
                                    cf_template_id : results.MaxTemplateGroupId
                                }

                               saveContentFiles( connection_ikon_cms, data, function( insertStatus ) {
                                   if(insertStatus == true){
                                        console.log("File uploaded!");
                                   }else{
                                        console.log("File not uploaded!");
                                   }
                               });
                        });
                    });
                });
        });

};

function saveContentFiles( connection_ikon_cms, data, callback ){
    ContentModel.saveContentFiles( connection_ikon_cms, data, function(err,response ){
        if(err){
            connection_ikon_cms.release();
            // res.status(500).json(err.message);
            callback( false );
        } else{
            callback( true  );
        }
    });

}

function setPackSearchCriteraFields( connection_ikon_cms, pctId, callback ){
    SearchModel.getPackSearchDetails( connection_ikon_cms, pctId, function(err,packSearchDetails) {
        //console.log(pctId)
        var contentTypeData = {};

        packSearchDetails.forEach(function (metadataFields) {
            contentTypeData["contentTypeId"] = metadataFields.contentTypeId;

            if (metadataFields.pcr_start_year != '0000' || metadataFields.pcr_end_year != '0000') {
                contentTypeData["releaseYearStart"] = metadataFields.pcr_start_year;
                contentTypeData["releaseYearEnd"] = metadataFields.pcr_end_year;
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
            if (metadataFields.cm_name === "Singers") {
                contentTypeData["Singers"] = parseInt(metadataFields.pcr_metadata_search_criteria);
            }
            if (metadataFields.cm_name === "Music Directors") {
                contentTypeData["Music_Directors"] = parseInt(metadataFields.pcr_metadata_search_criteria);
            }
            if (metadataFields.cm_name === "Nudity") {
                contentTypeData["Nudity"] = parseInt(metadataFields.pcr_metadata_search_criteria);
            }
            if (metadataFields.cm_name === "Rules") {
                contentTypeData["Rules"] = metadataFields.pcr_metadata_search_criteria;
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
        callback(contentTypeData);
    })
}

function saveTemplateForUpload( connection_ikon_cms, data ){
    ContentModel.saveTemplateForUpload( connection_ikon_cms, data, function(err,response ){
        if(err){
            connection_ikon_cms.release();
            // res.status(500).json(err.message);
            return false;
        }
    });
    return true;
}

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

function updateContentTypeForDuration( connection_ikon_cms, data , whereData ){
    SearchModel.updateContentTypeForDuration( connection_ikon_cms, data , whereData, function(err,response ){
        if(err){
            connection_ikon_cms.release();
            res.status(500).json(err.message);
            return false;
        }
    });
    return true;
}

