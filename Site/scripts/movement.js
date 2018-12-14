var MOVEMENT;
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
            MOVEMENT  = parameterName[1] === undefined ? true : decodeURIComponent(parameterName[1]);
        }
    }
	
}
//-----------------------------------------------

function launch(){
  getUrlParam("movement"); // Put the value in the global variable PAINTER
  sendQuery(prepareDetailedPaintingsQuery(), fillDetailedPaintings);
}

function fillMovement(data){
  obj = data[0];
	if (obj["name"] !== undefined){
	    $("#description").append("<h2>"+ obj["name"]["value"] + "</h2>");
			document.getElementById("tab_title").innerHTML =  obj["name"]["value"];
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

function prepareDetailedMovementQuery(){ //UP-TO-DATE
  return "select ?name str(?description) as ?description where {\
         <http://dbpedia.org/resource/"+MOVEMENT+"> rdfs:label ?name.\
		OPTIONAL {\
           <http://dbpedia.org/resource/"+MOVEMENT+"> dbo:abstract ?description\
		}\
        FILTER(lang(?name) = \"en\")\
        FILTER(lang(?description) = \"en\")}";
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
