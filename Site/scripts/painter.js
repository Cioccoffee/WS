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
}

function fillInfluenced(data){
  for (obj of data){
    var newResource = obj["painter"]["value"].replace("http://dbpedia.org/resource/","");
    $("#influenced").append("<a href=\"painter.html?painter=" +newResource+ "\">" + obj["name"]["value"] + "</a><br/>");
  }
}
function fillGeneralInfo(data){

  // Page titles
  $("#painter_name").text(data[0]["name"]["value"]);
  $("#tab_title").text("Picassearch - " + data[0]["name"]["value"]);

  // depiction
  $("#depiction").attr("src",  data[0]["depiction"]["value"] );
  $("#description").text("TODO");

  // Abstract
  $("#abstract").text(data[0]["abstract"]["value"]);

  // Infos
  $("#identity").append("<tr><td>Nationality: </td><td>" +  data[0]["nationality"]["value"] + "</td></tr>");
  $("#identity").append("<tr><td>Birth name: </td><td> TODO </td></tr>");
  $("#identity").append("<tr><td>Birth date: </td><td>" +  data[0]["birth_date"]["value"] + "</td></tr>");
  $("#identity").append("<tr><td>Birth place: </td><td> TODO </td></tr>");
  $("#identity").append("<tr><td>Death date: </td><td>" +  data[0]["death_date"]["value"] + "</td></tr>");
  $("#identity").append("<tr><td>Movements: </td><td> TODO </td></tr>");
}
function fillBriefPaintings(data){
  console.log(data);

  var col = 0;
  var nb_artwork_by_line = 4;
  var table = "";
  for (object of data)
  {
      if (col == 0)
      {
          table += "<tr>"
      }

      table += "<td><img class=\"pictures\" src=\"" + object["depiction"]["value"] + "\">" + "</td>";

      col = col + 1;
      if ( col == nb_artwork_by_line)
      {
        table += "</tr>"
        col = 0;
      }
  }

  $("#artworks").append(table);

}
function fillDetailedPaintings(data){
  console.log(data);
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
   return "select ?painter ?name where{ ?painter a yago:Painter110391653; foaf:name ?name; dbo:influencedBy dbr:" + PAINTER + ". FILTER (lang(?name)=\"en\")}";
}

function sendQuery(query,func){
  URL = "http://dbpedia.org/sparql";
  var queryUrl = encodeURI(URL + "?query=" + query + "&format=json");
  $.ajax(queryUrl).done(function(response){
    func(response.results.bindings);
  });
}
