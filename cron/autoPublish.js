var CronJob = require('cron').CronJob;
var mysql = require('../config/db').pool;
var async = require("async");
var packManager = require('../models/packModel');
var SearchModel = require('../models/searchModel');
var underscore = require("underscore");
var moment = require("moment");


new CronJob('60 * * * * 1-5', function () {
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
						SearchModel.setPackSearchCriteraFields( connection_ikon_cms, PackDetails[j].pct_id, function(err, contentTypeData ) {
							contentTypeData["limitCount"] = '';
							contentTypeData["searchWhereTitle"] = '';
							contentTypeData["searchWherePropertyTitle"] = '';
							SearchModel.getSearchCriteriaResult(connection_ikon_cms,contentTypeData,function(err,searchContentList){
								if (err) {
									res.status(500).json(err.message);
									console.log(err.message)
								} else {
									for(var z = 0; z < searchContentList.length; z++) {
										(function() {
											var x = z;
											process.nextTick(function() {
												console.log('New Tick ' + x);
												SearchModel.deletePackContentsForCron(connection_ikon_cms, PackDetails[j].pct_id, function(err,resp){
													if(err){
														console.log(err.message)
													}else{
														var seq = x;
														var insertData = {
															pc_pct_id : PackDetails[j].pct_id,
															pc_cm_id :  searchContentList[x].cm_id,
															pc_ispublished : 1,
															pc_arrange_seq : ++seq,
															pc_modified_on :  new Date(),
															pc_created_on : new Date(),
															pc_modified_on :  new Date()
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
																	pct_id : PackDetails[j].pct_id,
																	pct_modified_on : new Date()
																}

																packManager.updatePackNextRuleDate( connection_ikon_cms, udata, function(err,resp){
																	if(err){
																		connection_ikon_cms.release();
																	}else{
																		//console.log('Finally updated next rule date ');
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
							});
						})
					}else{
 					}
				});
			})();
		}
	});
});
}