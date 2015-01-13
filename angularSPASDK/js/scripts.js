$(document).ready(function() {
//        getPixel();
});

//function getPixel(){
//    var params = {},action = 'firepixel';
//    if(getUrlVars()["affiliate"]){ 
//        params.affiliate = getUrlVars()["affiliate"]
//    }
////    if($.cookie('billingInfo')){
////        params.prospectID = JSON.parse($.cookie('billingInfo')).prospectID;
////    }
//    //params.pageTypeID =  pageId;
//    jsonObj = JSON.stringify(params);
//    $.post( "TriangleCRM/Controller.php", { 
//        action : action,
//        data : jsonObj }).done(function(response){
//            obj = JSON.parse(response);
//            if(obj.State == 'error'){
//                console.log(obj.Info)
//            }
//            else{
//                document.body.innerHTML += obj.Result;
//            }
//    });
//}
//
//function getUrlVars()
//{
//    var vars = [], hash;
//    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
//    for(var i = 0; i < hashes.length; i++)
//    {
//        hash = hashes[i].split('=');
//        vars.push(hash[0]);
//        vars[hash[0]] = hash[1];
//    }
//    return vars;
//}