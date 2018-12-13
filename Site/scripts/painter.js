var PAINTER;
$(document).ready(function(){
  launch();

})
function getUrlParam(param){
  var pageURL = window.location.search.substring(1),
        uRLVariables = pageURL.split('&'),
        parameterName,
        i;

    for (i = 0; i < uRLVariables.length; i++) {
        parameterName = uRLVariables[i].split('=');

        if (parameterName[0] === param) {
            PAINTER  = parameterName[1] === undefined ? true : decodeURIComponent(parameterName[1]);
        }
    }
}
//-----------------------------------------------

function launch(){
  getUrlParam("painter"); // Put the value in the global variable PAINTER
  sendQuery(prepareGeneralInfoQuery(), fillGeneralInfo);
  sendQuery(prepareBriefPaintingsQuery(), fillBriefPaintings);
  sendQuery(prepareInfluencedByQuery(), fillInfluencedBy);
  sendQuery(prepareInfluencedQuery(),fillInfluenced);
  sendQuery(prepareSameNationalityQuery(), fillSameNationality);
  sendQuery(prepareSameMovementQuery(), fillSameMovement);
}

function fillSameMovement(data){
  if(data.length) $("#h4sameMov").show();
  for (painter of data){
    var depiction = painter["depiction"] ? painter["depiction"]["value"] : "../resources/images/anonymous-person.png";
    var name = painter["name"]["value"];
    var painter = "painter.html?painter=" + painter["painter"]["value"].replace("http://dbpedia.org/resource/","");
    $("#gallerySameMovement").append("<a href = \""+ painter +"\"><img src = \"" + depiction + "\" + data-image=\"" + depiction + "\" + alt=\"" + name + "\"></a>");
  }

  $("#gallerySameMovement").unitegallery({
    tile_width: 180,						//tile width
    tile_height: 150,
    gallery_theme: "tilesgrid",
    gallery_width: "100%",
    grid_num_rows:1,
    theme_navigation_type:"arrows",
    theme_navigation_align: "center",
    tile_enable_textpanel: true,
    tile_textpanel_source: "alt",
    tile_textpanel_title_text_align: "center",
    tile_as_link : true,
    tile_show_link_icon: true
  });
}
function fillSameNationality(data){
  if(data.length) $("#h4sameNat").show();
  for (painter of data){
    var depiction = painter["depiction"] ? painter["depiction"]["value"] : "../resources/images/anonymous-person.png";
    var name = painter["name"]["value"];
    var painter = "painter.html?painter=" + painter["painter"]["value"].replace("http://dbpedia.org/resource/","");
    $("#gallerySameNationality").append("<a href = \""+ painter +"\"><img src = \"" + depiction + "\" + data-image=\"" + depiction + "\" + alt=\"" + name + "\"></a>");
  }

  $("#gallerySameNationality").unitegallery({
    tile_width: 180,						//tile width
    tile_height: 150,
    gallery_theme: "tilesgrid",
    gallery_width: "100%",
    grid_num_rows:1,
    theme_navigation_type:"arrows",
    theme_navigation_align: "center",
    tile_enable_textpanel: true,
    tile_textpanel_source: "alt",
    tile_textpanel_title_text_align: "center",
    tile_as_link : true,
    tile_show_link_icon: true
  });
}
function fillInfluenced(data){
  if (data.length) {
    $("#h4influenced").show();
  }
  for (painter of data){
    var depiction = painter["depiction"] ? painter["depiction"]["value"] : "../resources/images/anonymous-person.png";
    var name = painter["name"]["value"];
    var painter = "painter.html?painter=" + painter["painter"]["value"].replace("http://dbpedia.org/resource/","");
    $("#galleryInfluenced").append("<a href = \""+ painter +"\"><img src = \"" + depiction + "\" + data-image=\"" + depiction + "\" + alt=\"" + name + "\"></a>");
  }

  $("#galleryInfluenced").unitegallery({
    tile_width: 180,						//tile width
    tile_height: 150,
    gallery_theme: "tilesgrid",
    gallery_width: "100%",
    grid_num_rows:1,
    theme_navigation_type:"arrows",
    theme_navigation_align: "center",
    tile_enable_textpanel: true,
    tile_textpanel_source: "alt",
    tile_textpanel_title_text_align: "center",
    tile_as_link : true,
    tile_show_link_icon: true
  });
}
function fillInfluencedBy(data){
  if (data.length) {
    $("#h4influencedBy").show();
  }
  for (painter of data){
    var depiction = painter["depiction"] ? painter["depiction"]["value"] : "../resources/images/anonymous-person.png";
    var name = painter["name"]["value"];
    var painter = "painter.html?painter=" + painter["painter"]["value"].replace("http://dbpedia.org/resource/","");
    $("#galleryInfluencedBy").append("<a href = \""+ painter +"\"><img src = \"" + depiction + "\" + data-image=\"" + depiction + "\" + alt=\"" + name + "\"></a>");
  }
  $("#galleryInfluencedBy").unitegallery({
    tile_width: 180,						//tile width
    tile_height: 150,
    gallery_theme: "tilesgrid",
    gallery_width: "100%",
    grid_num_rows:1,
    theme_navigation_type:"arrows",
    theme_navigation_align: "center",
    tile_enable_textpanel: true,
    tile_textpanel_source: "alt",
    tile_textpanel_title_text_align: "center",
    tile_as_link : true,
    tile_show_link_icon: true
  });
}
function fillGeneralInfo(data){
  var painterObj = data[0];
  var name = painterObj["name"]["value"];
  var abstract = painterObj["abstract"]["value"];

  $("#docTitle").html(name);
  $("#painterName").html(name);
  if (painterObj["depiction"] != undefined) {
      $("#painterImage").attr("src",painterObj["depiction"]["value"]);
      $("#painterImage").css("display","block");
  }
  $("#generalInfoTable").append("<tr><td>Name: </td><td>" + name + "</td></tr>");
  if (painterObj["birth_date"] != undefined) {
    $("#generalInfoTable").append("<tr><td>Birthdate: </td><td>" + painterObj["birth_date"]["value"] + "</td></tr>");
  }
  if (painterObj["death_date"] != undefined) {
    $("#generalInfoTable").append("<tr><td>Deathdate: </td><td>" + painterObj["death_date"]["value"]  + "</td></tr>");
  }
  if (painterObj["gender"] != undefined){
    $("#generalInfoTable").append("<tr><td>Gender: </td><td>" + painterObj["gender"]["value"] + "</td></tr>");
  }
  if (painterObj["nationality"] != undefined){
    $("#generalInfoTable").append("<tr><td>Nationality: </td><td>" + painterObj["nationality"]["value"] + "</td></tr>");
  }
  $("#painterAbstract").html(abstract);
  sendQuery(prepareMovementsQuery(), fillMovements);
}
function fillMovements(data){
  var movs = [];
  for (mov of data){
    movs.push(mov["movement"]["value"])
  }
  if(movs != [])
    $("#generalInfoTable").append("<tr><td>Movements: </td><td>" + movs.join(', ') + "</td></tr>");

}
function fillBriefPaintings(data){
  if (data.length) {
    $("#h4paintings").show();
  }
  for (picture of data){
    var imageSource = picture["depiction"]["value"];
    var imageTitle = picture["title"]["value"];
    var imageURI = "work.html?work=" + picture["picture"]["value"].replace("http://dbpedia.org/resource/","");
    $("#gallery").append("<a href = \""+ imageURI +"\"><img src = \"" + imageSource + "\" + data-image=\"" + imageSource + "\" + alt=\"" + imageTitle + "\"></a>");
  }

  $("#gallery").unitegallery({
    tile_width: 180,						//tile width
    tile_height: 150,
    gallery_theme: "tilesgrid",
    gallery_width: "100%",
    grid_num_rows:2,
    theme_navigation_type:"arrows",
    theme_navigation_align: "center",
    tile_enable_textpanel: true,
		tile_textpanel_source: "alt",
    tile_textpanel_title_text_align: "center",
    tile_as_link : true,
    tile_show_link_icon: true
  });
}
function fillDetailedPaintings(data){
}

function prepareDetailedPaintingsQuery(){
  return "select DISTINCT ?picture ?title max(?year) as ?year str(?description) as ?description min(?type) as ?type ?depiction where {\
         ?picture a dbo:Work;\
         dbo:author dbr:" + PAINTER + ";\
         rdfs:label ?title;\
         foaf:depiction ?depiction;\
         dct:subject ?subject;\
         dbo:abstract ?description.\
         OPTIONAL {\
           ?picture dbp:year ?year\
           FILTER(datatype(?year) = xsd:date OR datatype(?year) = xsd:integer)\
         }\
         OPTIONAL {\
           ?picture dbp:type [rdfs:label ?type]\
           FILTER(lang(?type) = \"en\")\
         }\
        FILTER(CONTAINS(lcase(str(?subject)),\"painting\"))\
        FILTER(lang(?title) = \"en\")\
        FILTER(lang(?description) = \"en\")}";
}
function prepareBriefPaintingsQuery(){
  return "select DISTINCT ?picture str(?title) as ?title ?depiction where {\
         ?picture a dbo:Work;\
         dbo:author dbr:" + PAINTER + ";\
         rdfs:label ?title;\
         foaf:depiction ?depiction;\
         dct:subject ?subject.\
         FILTER(CONTAINS(lcase(str(?subject)),\"painting\"))\
         FILTER(lang(?title) = \"en\")}";
}
function prepareGeneralInfoQuery(){

  return "select DISTINCT max(str(?name)) as ?name str(?gender) as ?gender ?depiction str(?nationality) as ?nationality max(str(?birth_date)) as ?birth_date max(str(?death_date)) as ?death_date str(?abstract) as ?abstract where { \
  VALUES ?painter {dbr:" + PAINTER +"}\
  ?painter foaf:name ?name.\
  ?painter dbo:abstract ?abstract.\
  OPTIONAL {?painter foaf:gender ?gender}\
  OPTIONAL {?painter foaf:depiction ?depiction}\
  OPTIONAL {?painter dbp:nationality ?nationality}\
  OPTIONAL {?painter dbo:birthDate ?birth_date}\
  OPTIONAL {?painter dbo:deathDate ?death_date}\
  FILTER (lang(?name) = \"en\")\
  FILTER (lang(?gender) = \"en\")\
  FILTER (lang(?abstract) = \"en\")}";

}
function prepareInfluencedQuery(){
   return "select ?painter ?depiction max(str(?name)) as ?name where{?painter a yago:Painter110391653; foaf:name ?name; dbo:influencedBy dbr:"+ PAINTER +" OPTIONAL {?painter foaf:depiction ?depiction} FILTER (lang(?name)=\"en\")} ORDER BY DESC (?depiction)";
}
function prepareMovementsQuery(){
  return "select str(?movement) as ?movement where { \
    {{dbr:" + PAINTER + " dbo:movement [rdfs:label ?movement]}\
    UNION\
     {dbr:" + PAINTER + " dbp:movement [rdfs:label ?movement]}}\
     FILTER (lang(?movement)=\"en\")\
   }"
}
function prepareInfluencedByQuery(){
  return "select ?painter max(str(?name)) as ?name ?depiction where{\
          ?painter a yago:Painter110391653; foaf:name ?name.\
          OPTIONAL {?painter foaf:depiction ?depiction}\
          {{dbr:" + PAINTER + " dbo:influencedBy ?painter} UNION {dbr:" + PAINTER + " dbp:influencedBy ?painter}}\
          FILTER (lang(?name) = \"en\").\
          }";
}
function prepareSameNationalityQuery(){
  return "select ?painter max(str(?name)) as ?name ?depiction where{\
          dbr:" + PAINTER + " dbp:nationality ?nationality.\
          ?painter a yago:Painter110391653; dbp:nationality ?nationality; foaf:name ?name.\
          OPTIONAL {?painter foaf:depiction ?depiction}\
          FILTER (lang(?name) = \"en\" AND ?painter != dbr:" + PAINTER + ")\
        }\
        ORDER BY DESC (?depiction)";
}
function prepareSameMovementQuery(){
  return "select ?painter max(str(?name)) as ?name ?depiction where{\
          VALUES ?original {dbr:" + PAINTER + "}.\
          {?original dbo:movement ?movement} UNION {?original dbp:movement ?movement}.\
          ?painter a yago:Painter110391653; foaf:name ?name.\
          OPTIONAL {?painter foaf:depiction ?depiction}.\
          {?painter dbo:movement ?movement} UNION {?painter dbp:movement ?movement}\
          FILTER (?painter != ?original AND lang(?name) = \"en\")\
        }\
        ORDER BY DESC (?depiction)\
        LIMIT 16";
}

function sendQuery(query,func){
  URL = "http://dbpedia.org/sparql";
  var queryUrl = encodeURI(URL + "?query=" + query + "&format=json");
  $.ajax(queryUrl).done(function(response){
    func(response.results.bindings);
  });
}
