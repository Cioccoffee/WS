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
	console.log(WORK);
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
	$("#informations").append("<tr><td><b>Author</b></td><td>"
		+ "<a href=\"painter.html?painter=" +resource+ "\">" + obj["name"]["value"] + "</a><br/>" 
		+ "</td></tr>");
	//$("#informations").append("<a href=\"painter.html?painter=" +resource+ "\">" + obj["name"]["value"] + "</a><br/>");
	//$("#informations").append("<p> Author : "+ obj["name"]["value"] + "</p>");
  }
}

function fillDetailedPaintings(data){
  for (obj of data){
	if (obj.depiction !== undefined)
		$("#img_depiction").attr("src",obj["depiction"]["value"]);

    if (obj.title !== undefined){
	    $("#description").append("<h2>"+ obj["title"]["value"] + "</h2>");
		document.getElementById("tab_title").innerHTML =  obj["title"]["value"];
	}
	if (obj.description !== undefined)
		$("#description").append("<p>"+ obj["description"]["value"] + "</p>");
	else
		$("#description").append("<p> No description available </p>");

	if (obj.year !== undefined)
		$("#informations").append("<tr><td><b>Year</b></td><td>"+ obj["year"]["value"] + "</td></tr>");
	else
		$("#informations").append("<tr><td><b>Year</b></td><td> unknown </td></tr>");
		
	if (obj.author !== undefined) {
		var newResource = obj["author"]["value"].replace("http://dbpedia.org/resource/","");
		sendQueryWithParam(prepareGetNameAuthorQuery(newResource),fillAuthor,newResource);
	}
	
	if (obj.type !== undefined)
		$("#informations").append("<tr><td><b>Type</b></td><td>"+ obj["type"]["value"] + "</td></tr>");
	else
		$("#informations").append("<tr><td><b>Type</b></td><td> unknown </td></tr>");

	console.log(data);
	}
}

function prepareDetailedPaintingsQuery(){ //UP-TO-DATE
  return "select DISTINCT ?author ?title str(?description) as ?description ?depiction ?year ?type where {\
         <http://dbpedia.org/resource/"+WORK+"> a dbo:Work.\
		OPTIONAL {\
           <http://dbpedia.org/resource/"+WORK+"> dbo:author ?author\
		}\
		OPTIONAL {\
           <http://dbpedia.org/resource/"+WORK+"> rdfs:label ?title\
		}\
		 OPTIONAL {\
           <http://dbpedia.org/resource/"+WORK+"> foaf:depiction ?depiction\
		}\
		 OPTIONAL {\
           <http://dbpedia.org/resource/"+WORK+"> dbo:abstract ?description\
		}\
         OPTIONAL {\
           <http://dbpedia.org/resource/"+WORK+">  dbp:year ?year\
           FILTER(datatype(?year) = xsd:date OR datatype(?year) = xsd:integer)\
         }\
         OPTIONAL {\
           <http://dbpedia.org/resource/"+WORK+">  dbp:type [rdfs:label ?type]\
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
