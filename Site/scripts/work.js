var WORK;
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
            WORK  = parameterName[1] === undefined ? true : decodeURIComponent(parameterName[1]);
        }
    }
}
//-----------------------------------------------

function launch(){
  getUrlParam("work"); // Put the value in the global variable PAINTER
  sendQuery(prepareDetailedPaintingsQuery(), fillDetailedPaintings);
}

function fillInfluenced(data){
  for (obj of data){
    var newResource = obj["painter"]["value"].replace("http://dbpedia.org/resource/","");
    $("#influenced").append("<a href=\"painter.html?painter=" +newResource+ "\">" + obj["name"]["value"] + "</a><br/>");
  }
}
function fillGeneralInfo(data){
  console.log(JSON.stringify(data));
}
function fillBriefPaintings(data){
  console.log(data);
}
function fillDetailedPaintings(data){
  console.log(data);
}
function prepareDetailedPaintingsQuery(){ //UP-TO-DATE
  return "select DISTINCT ?author ?title str(?description) as ?description ?depiction ?year ?type where {\
         dbr:"+WORK+" a dbo:Work;\
         dbo:author ?author;\
         rdfs:label ?title;\
         foaf:depiction ?depiction;\
         dbo:abstract ?description.\
         OPTIONAL {\
           dbr:"+WORK+" dbp:year ?year\
           FILTER(datatype(?year) = xsd:date OR datatype(?year) = xsd:integer)\
         }\
         OPTIONAL {\
           dbr:"+WORK+" dbp:type [rdfs:label ?type]\
           FILTER(lang(?type) = \"en\")\
         }\
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
  return "select DISTINCT max(str(?name)) as ?name str(?gender) as ?gender ?depiction str(?nationality) as ?nationality max(str(?birth_date)) as ?birth_date max(str(?death_date)) as ?death_date str(?abstract) where { \
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
