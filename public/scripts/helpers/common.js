/**
 * Created by sujata.patne on 25-09-2015.
 */

function setContentTypeData(packSearchDetails){
    var contentTypeData = {};
    angular.forEach(packSearchDetails, function (metadataFields){
        if(metadataFields.cm_name === "Content Title"){
            contentTypeData["Content_Title"] = metadataFields.pcr_metadata_search_criteria;
        }
        if(metadataFields.cm_name === "Property"){
            contentTypeData["Property"] = metadataFields.pcr_metadata_search_criteria;
        }
        if(metadataFields.cm_name === "Search Keywords"){
            contentTypeData["Keywords"] = metadataFields.pcr_metadata_search_criteria;
        }
        if(metadataFields.cm_name === "Content Ids"){
            contentTypeData["Content_Ids"] = metadataFields.pcr_metadata_search_criteria;
        }
        if(metadataFields.cm_name === "Languages"){
            contentTypeData["Language"] = parseInt(metadataFields.pcr_metadata_search_criteria);
        }
        if(metadataFields.cm_name === "Singers"){
            contentTypeData["Singer"] = parseInt(metadataFields.pcr_metadata_search_criteria);
        }
        if(metadataFields.cm_name === "Music Directors"){
            contentTypeData["Music_Director"] = parseInt(metadataFields.pcr_metadata_search_criteria);
        }
        if(metadataFields.cm_name === "Nudity"){
            contentTypeData["Adult"] = parseInt(metadataFields.pcr_metadata_search_criteria);
        }
        if(metadataFields.cm_name === "Celebrity"){
            contentTypeData["Actor_Actress"] = parseInt(metadataFields.pcr_metadata_search_criteria);
        }
        if(metadataFields.cm_name === "Genres"){
            contentTypeData["Genres"] = parseInt(metadataFields.pcr_metadata_search_criteria);
        }
        if(metadataFields.cm_name === "Sub Genres"){
            contentTypeData["Sub_Genres"] = parseInt(metadataFields.pcr_metadata_search_criteria);
        }
        if(metadataFields.cm_name === "Mood"){
            contentTypeData["Mood"] = parseInt(metadataFields.pcr_metadata_search_criteria);
        }
        if(metadataFields.cm_name === "Photographer"){
            contentTypeData["Photographer"] = parseInt(metadataFields.pcr_metadata_search_criteria);
        }
        if(metadataFields.cm_name === "Vendor"){
            contentTypeData["Vendor"] = parseInt(metadataFields.pcr_metadata_search_criteria);
        }
        if(metadataFields.cm_name === "Property Release Year"){
            contentTypeData["property_release_year"] = parseInt(metadataFields.pcr_metadata_search_criteria);
        }
        if (metadataFields.cm_name === "Rules") {
            contentTypeData["Rules"] = parseInt(metadataFields.pcr_metadata_search_criteria);
        }
        contentTypeData['property_release_year'] = {'releaseYearStart':parseInt(metadataFields.pcr_start_year),'releaseYearEnd':parseInt(metadataFields.pcr_end_year)};

    })
    return contentTypeData;
}

function getSearchedfields(contentTypeData,list){
    var contentTypeDataDetails = [];
    angular.forEach(contentTypeData, function (value, key) {
        var data = {};
        if (key == 'property_release_year') {
            if (contentTypeData[key].releaseYearStart > 0 && contentTypeData[key].releaseYearEnd > 0) {
                data[list[key + '_id']] = 1;
                contentTypeDataDetails.push(data);
            }
        } else {
            if (value) {
                data[list[key + '_id']] = value;
                contentTypeDataDetails.push(data);
            }
        }
    })
    return contentTypeDataDetails;
}