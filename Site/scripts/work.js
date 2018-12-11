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

function fillAuthor(resource,data){
  console.log(data);
  for (obj of data){
    //var newResource = obj["work"]["value"].replace("http://dbpedia.org/resource/","");
	$("#informations").append("<a href=\"painter.html?painter=" +resource+ "\">" + obj["name"]["value"] + "</a><br/>");
	//$("#informations").append("<p> Author : "+ obj["name"]["value"] + "</p>");
  }
}

function fillDetailedPaintings(data){
  for (obj of data){
    //var newResource = obj["work"]["value"].replace("http://dbpedia.org/resource/","");
	$("#depiction").append("<p>"+ obj["depiction"]["value"] + "</p>");
	$("#informations").append("<h4>"+ obj["title"]["value"] + "</h4>");
	$("#informations").append("<p>"+ obj["year"]["value"] + "</p>");

    //$("#informations").append("<p>"+ obj["author"]["value"] + "</p>");
	var newResource = obj["author"]["value"].replace("http://dbpedia.org/resource/","");
	sendQueryWithParam(prepareGetNameAuthorQuery(newResource),fillAuthor,newResource);


	$("#informations").append("<p>"+ obj["description"]["value"] + "</p>");
	$("#informations").append("<p>"+ obj["type"]["value"] + "</p>");
	}
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


function prepareGetNameAuthorQuery(author){
   return "select ?name where{ dbr:"+author+" foaf:name ?name. \
		FILTER (lang(?name)=\"en\")}";
}

function sendQuery(query,func){
  URL = "http://dbpedia.org/sparql";
  var queryUrl = encodeURI(URL + "?query=" + query + "&format=json");
  $.ajax(queryUrl).done(function(response){
    func(response.results.bindings);
  });
}

function sendQueryWithParam(query,func,param){
  URL = "http://dbpedia.org/sparql";
  var queryUrl = encodeURI(URL + "?query=" + query + "&format=json");
  $.ajax(queryUrl).done(function(response){
    func(param,response.results.bindings);
  });
}
