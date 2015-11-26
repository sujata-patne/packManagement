var CronJob = require('cron').CronJob;
var mysql = require('../config/db').pool;
var async = require("async");
var packManager = require('../models/packModel');
var SearchModel = require('../models/searchModel');
var underscore = require("underscore");
var moment = require("moment");

// var job = new CronJob({
//   cronTime: '* * * * * 1-5',
//   onTick: function() {
//   	 // Our functionality here

//   },
//   start: false,
//   timeZone: "America/Los_Angeles"
// });
// job.start();

// new CronJob('00 00 09 0-6', function () {
//     autoPublish();
// }, null, true, 'Asia/Kolkata');

new CronJob('* * * * * 1-5', function () {
    autoPublish();
}, null, true, 'Asia/Kolkata');


function autoPublish(){
	  	 mysql.getConnection('CMS', function (err, connection_ikon_cms) {
  	 		packManager.getAllAutoPacks( connection_ikon_cms, function(err,PackDetails){
	            for(var i = 0; i < PackDetails.length; i++) {
				    (function() {
				       var j = i;
				       process.nextTick(function() {
							var someDate = moment(PackDetails[j].pct_nxt_rule_exe_date);
							var isToday = someDate.startOf('day').isSame(moment().startOf('day'));
							if(isToday){
								async.waterfall([
					                        function (callback) {
					                            SearchModel.getPackSearchDetails( connection_ikon_cms, PackDetails[j].pct_id, function(err,packSearchDetails){
					                                var contentTypeData = {};
					                                contentTypeData["limitCount"] = '';
					                                contentTypeData["searchWhereTitle"] = '';
					                                contentTypeData["searchWherePropertyTitle"] = '';
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
					                        },
					                        function (data, callback) {
					                            SearchModel.getSearchCriteriaResult(connection_ikon_cms,data,function(err,result){
					                                callback(err, {'searchContentList':result});
					                            });
					                        },
					                    ],
					                    function (err, results) {
					                        if (err) {
					                            res.status(500).json(err.message);
					                            console.log(err.message)
					                        } else {
					                           for(var z = 0; z < results.searchContentList.length; z++) {
												 (function() {
												  var x = z;
												  process.nextTick(function() {
												    		SearchModel.deletePackContentsForCron(connection_ikon_cms, PackDetails[j].pct_id, function(err,resp){
												    				if(err){

												    				}else{
												    					var insertData = {
												    						pc_pct_id : PackDetails[j].pct_id,
												    						pc_cm_id :  results.searchContentList[x].cm_id,
												    						pc_ispublished : 1
												    					}

												    					SearchModel.savePackContentForCron( connection_ikon_cms, insertData, function(err,resp){
												    						if(err){
												    							connection_ikon_cms.release();
												    						}else{
												    								var now = moment(new Date());
   																					var nxt_rule_date = now.add(PackDetails[j].pct_nxt_rule_duration,'days').format('YYYY-MM-DD');

   																					var udata ={
   																						pct_nxt_rule_exe_date : nxt_rule_date,
   																						pct_pk_id : PackDetails[j].pct_pk_id,
   																						pct_id : PackDetails[j].pct_id
   																					}

   																					packManager.updatePackNextRuleDate( connection_ikon_cms, udata, function(err,resp){
   																						if(err){
   																							connection_ikon_cms.release();
   																						}else{
   																							
   																							console.log('Finally updated next rule date ');
   																						}
   																					});
												    						}
												    					});
												    				}
					                          				 });
												   });
												 })();
												}
					                        }
					                    })
							}else{

							}
				       				
				       	});
				     })();
				}
            });

  	 });
}