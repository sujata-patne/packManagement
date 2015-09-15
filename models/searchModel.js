/**
 * Created by sujata.patne on 11-09-2015.
 */
exports.getKeywords = function(dbConnection, callback){
    dbConnection.query('select cm.* from catalogue_master AS cm where cm.cm_name in ("Search Keywords") order by cm.cm_id ', function (err, keywords) {
        callback(err, keywords)
    });
}

exports.getLanguages = function(dbConnection, callback){
    dbConnection.query('select cm.*,cd.cd_id, cd.cd_name from catalogue_master AS cm ' +
        'join catalogue_detail as cd on cm.cm_id = cd.cd_cm_id where cm.cm_name in ("Languages") order by cm.cm_id ', function (err, languages) {
        callback(err, languages)
    });
}

exports.getGenres = function(dbConnection, callback){
    dbConnection.query('select cm.*,cd.cd_id, cd.cd_name from catalogue_master AS cm ' +
        'join catalogue_detail as cd on cm.cm_id = cd.cd_cm_id where cm.cm_name in ("Genres") order by cm.cm_id ', function (err, genres) {
        callback(err, genres)
    });
}

exports.getSubGenres = function(dbConnection, callback){
    dbConnection.query('select cm.*,cd.cd_id, cd.cd_name from catalogue_master AS cm ' +
        'join catalogue_detail as cd on cm.cm_id = cd.cd_cm_id where cm.cm_name in ("Sub Genres") order by cm.cm_id ', function (err, subgenres) {
        callback(err, subgenres)
    });
}

exports.getMood = function(dbConnection, callback){
    dbConnection.query('select cm.*,cd.cd_id, cd.cd_name from catalogue_master AS cm ' +
        'join catalogue_detail as cd on cm.cm_id = cd.cd_cm_id where cm.cm_name in ("Mood") order by cm.cm_id ', function (err, mood) {
        callback(err, mood)
    });
}

exports.getPhotographer = function(dbConnection, callback){
    dbConnection.query('select cm.*,cd.cd_id, cd.cd_name from catalogue_master AS cm ' +
        'join catalogue_detail as cd on cm.cm_id = cd.cd_cm_id where cm.cm_name in ("Photographer") order by cm.cm_id ', function (err, photographer) {
        callback(err, photographer)
    });
}

exports.getVendor = function(dbConnection, callback){
    dbConnection.query('SELECT vd_id AS cd_id, vd_name AS cd_name, (select cm.cm_id FROM catalogue_master AS cm WHERE cm.cm_name in ("Vendor") )as cm_id ' +
        'FROM icn_vendor_detail WHERE vd_is_active = 1 ', function (err, vendor) {
        callback(err, vendor)
    });
}

exports.getActorActress = function(dbConnection, callback){
    dbConnection.query('SELECT distinct cd.cd_id, cd.cd_name, cd.cd_cm_id as cm_id FROM catalogue_detail AS cd ' +
        'inner join catalogue_master as cm on (cm.cm_id = cd.cd_cm_id) ' +
        'inner join multiselect_metadata_detail as mmd ON ( cd.cd_desc = mmd.cmd_group_id && cd.cd_cm_id = mmd.cmd_entity_type ) ' +
        'inner join catalogue_detail as role on (role.cd_id  = mmd.cmd_entity_detail) ' +
        'where cm.cm_name="Celebrity" and role.cd_name in ("Actress","Actor")', function (err, actor_actress) {
        callback(err, actor_actress)
    });
}

exports.getProperty = function(dbConnection, callback){
    dbConnection.query('select cm.* from catalogue_master AS cm WHERE cm.cm_name in ("Property") order by cm.cm_id ', function (err, property) {
        callback(err, property)
    });
}
exports.getContentTitle = function(dbConnection, callback){
    dbConnection.query('select cm.* from catalogue_master AS cm WHERE cm.cm_name in ("Content Title") order by cm.cm_id ', function (err, title) {
        callback(err, title)
    });
}
exports.getContentId = function(dbConnection, callback){
    dbConnection.query('select cm.* from catalogue_master AS cm WHERE cm.cm_name in ("Content Ids") order by cm.cm_id ', function (err, id) {
        callback(err, id)
    });
}
exports.getLastSearchCriteriaId = function( dbConnection, callback ) {
    var query = dbConnection.query("SELECT MAX(pcr_id) as pcr_id FROM `icn_pack_content_rule`", function ( err, response ) {
        pcrId = response[0].pcr_id != null ? parseInt(response[0].pcr_id + 1) : 1;
        callback( err,pcrId );
    });
}
exports.saveSearchCriteria = function(dbConnection,data,callback){
    var query = dbConnection.query("INSERT INTO `icn_pack_content_rule` SET ? ",data, function (err, response) {
        callback(err,response);
    });
}
exports.getPackDetails = function(dbConnection,pctId,callback){
    dbConnection.query("SELECT pk.pk_id AS packId, pk.pk_cnt_display_opt AS display, pct.pct_cnt_type AS contentTypeId FROM icn_packs AS pk " +
        "JOIN icn_pack_content_type AS pct ON pk.pk_id = pct.pct_pk_id " +
        " WHERE pct.pct_id = ? ", [pctId],function (err, result) {
            if(result.length > 0){
                callback(err,true);
            }else{
                callback(err,false);
            }
        });
}
exports.getSearchCriteriaData = function(dbConnection,searchData,callback) {
    var whereStr = '1';
    if (searchData.contentTypeId) {
        whereStr += ' AND cmd.cm_content_type = ' + searchData.contentTypeId;
    }
    if (searchData.releaseDurationStart && searchData.releaseDurationEnd) {
        whereStr += ' AND cmd.cm_release_year BETWEEN ' + searchData.releaseDurationStart + ' AND ' + searchData.releaseDurationEnd;
    }
    if(searchData.contentTypeData.data !== undefined) {
        if (searchData.contentTypeData.data.Content_Title) {
            var searchIn = '';
            if (searchData.searchWhereTitle == 'start') {
                searchIn = ' LIKE "' + searchData.contentTypeData.data.Content_Title + '%"'
            }
            else if (searchData.searchWhereTitle == 'end') {
                searchIn = ' LIKE "%' + searchData.contentTypeData.data.Content_Title + '"'
            }
            else if (searchData.searchWhereTitle == 'anywhere') {
                searchIn = ' LIKE "%' + searchData.contentTypeData.data.Content_Title + '%"'
            }
            else if (searchData.searchWhereTitle == 'exact') {
                searchIn = ' LIKE "' + searchData.contentTypeData.data.Content_Title + '"'
            }
            whereStr += ' AND cmd.cm_title ' + searchIn;
        }
        if (searchData.contentTypeData.data.Property) {
            var searchIn = '';
            if (searchData.searchWherePropertyTitle == 'start') {
                searchIn = ' AND p.cm_title LIKE "' + searchData.contentTypeData.data.Property + '%"'
            }
            else if (searchData.searchWherePropertyTitle == 'end') {
                searchIn = ' AND p.cm_title LIKE "%' + searchData.contentTypeData.data.Property + '"'
            }
            else if (searchData.searchWherePropertyTitle == 'anywhere') {
                searchIn = ' AND p.cm_title LIKE "%' + searchData.contentTypeData.data.Property + '%"'
            }
            else if (searchData.searchWherePropertyTitle == 'exact') {
                searchIn = ' AND p.cm_title LIKE "' + searchData.contentTypeData.data.Property + '"'
            }
            whereStr += ' AND cmd.cm_property_id IN ( SELECT p.cm_id FROM content_metadata AS p WHERE ISNULL(p.cm_property_id) ' + searchIn + ' ) ';
        }
        if (searchData.contentTypeData.data.Content_Ids) {
            whereStr += ' AND cmd.cm_id IN (' + searchData.contentTypeData.data.Content_Ids + ') ';
        }
        if (searchData.contentTypeData.data.Vendor) {
            whereStr += ' AND cmd.cm_vendor = ' + searchData.contentTypeData.data.Vendor;
        }
        if (searchData.contentTypeData.data.Keywords) {
            var keywords = searchData.contentTypeData.data.Keywords.split(',')
                .map(function (element) {
                    return "'" + String(element).trim() + "'"
                }).join(" ,");
            whereStr += ' AND cmd.cm_key_words IN ( SELECT group_concat(mmd.cmd_group_id) FROM catalogue_detail AS kcd ' +
                'JOIN catalogue_master AS kcm ON kcd.cd_cm_id = kcm.cm_id ' +
                'JOIN multiselect_metadata_detail AS mmd ON mmd.cmd_entity_detail = kcd.cd_id ' +
                'WHERE kcm.cm_name = "Search Keywords" AND cd_name IN (' + keywords + ') )';

        }
        if (searchData.contentTypeData.data.Language) {
            whereStr += ' AND cmd.cm_language = ' + searchData.contentTypeData.data.Language;
        }
        if (searchData.contentTypeData.data.Actor_Actress) {
            whereStr += ' AND cmd.cm_celebrity = ' + searchData.contentTypeData.data.Actor_Actress;
        }
        if (searchData.contentTypeData.data.Genres) {
            whereStr += ' AND cmd.cm_genre = ' + searchData.contentTypeData.data.Genres;
        }
        if (searchData.contentTypeData.data.Sub_Genres) {
            whereStr += ' AND cmd.cm_sub_genre = ' + searchData.contentTypeData.data.Sub_Genres;
        }
        if (searchData.contentTypeData.data.Mood) {
            whereStr += ' AND cmd.cm_mood = ' + searchData.contentTypeData.data.Mood;
        }
        if (searchData.contentTypeData.data.Photographer) {
            whereStr += ' AND cmd.cm_protographer = ' + searchData.contentTypeData.data.Photographer;
        }
    }
    var query = dbConnection.query('select * from content_metadata As cmd where ' + whereStr, function (err, result) {
        callback(err,result);
    })
}

exports.searchCriteriaFieldExist = function(dbConnection,pctId,metaDataTypeId,callback){
    dbConnection.query("SELECT pk_id as id FROM icn_packs AS pk " +
        "JOIN icn_pack_content_type AS pct ON pk.pk_id = pct.pct_pk_id " +
        "JOIN icn_pack_content_rule AS pcr ON pcr.pcr_pct_id = pct.pct_id " +
        "WHERE pcr_pct_id = ? AND pcr_metadata_type = ? ",
        [pctId, metaDataTypeId],function (err, result) {
            console.log(result.length)
            if(result.length > 0){
                callback(err,true);
            }else{
                callback(err,false);
            }
        });
}
exports.addSearchCriteriaField = function(dbConnection,data,callback){
    var query = dbConnection.query("INSERT INTO icn_pack_content_rule SET ? ",data, function (err, response) {
        callback(err,response);
    });
}
exports.editSearchCriteriaField = function(dbConnection,data,callback){
    var query = dbConnection.query("UPDATE icn_pack_content_rule SET ? WHERE pcr_pct_id = ? AND pcr_metadata_type = ? ', [data, data.pctId, data.searchCriteriaId]",data, function (err, response) {
        callback(err,response);
    });
}