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
  sendQuery(prepareMovementQuery(), fillMovement);
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
	annotate("#description");
	sendQuery(prepareQueryArtists(),fillArtists);
}

function fillArtists(data) {
  for (painter of data){
    var depiction = painter["depiction"] ? painter["depiction"]["value"] : "../resources/images/anonymous-person.png";
    var name = painter["name"]["value"];
    var painter = "painter.html?painter=" + painter["painter"]["value"].replace("http://dbpedia.org/resource/","");
    $("#galleryPainters").append("<a href = \""+ painter +"\"><img src = \"" + depiction + "\" + data-image=\"" + depiction + "\" + alt=\"" + name + "\"></a>");
  }
  $("#galleryPainters").unitegallery({
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


function prepareMovementQuery(){ //UP-TO-DATE
  return "select ?name str(?description) as ?description where {\
         <http://dbpedia.org/resource/"+MOVEMENT+"> rdfs:label ?name.\
		OPTIONAL {\
           <http://dbpedia.org/resource/"+MOVEMENT+"> dbo:abstract ?description\
		}\
        FILTER(lang(?name) = \"en\")\
        FILTER(lang(?description) = \"en\")}";
}
function prepareQueryArtists(){
  return "select ?painter max(str(?name)) as ?name ?depiction where {\
          ?painter a yago:Painter110391653;\
          dbo:movement <http://dbpedia.org/resource/" + MOVEMENT + "> ;\
          foaf:name ?name.\
          OPTIONAL {?painter foaf:depiction ?depiction}\
          FILTER (lang(?name)=\"en\")\
         }\
         ORDER BY DESC (?depiction)";
}

function sendQuery(query,func){
  URL = "http://dbpedia.org/sparql";
  var queryUrl = encodeURI(URL + "?query=" + query + "&format=json");
  $.ajax(queryUrl).done(function(response){
    func(response.results.bindings);
  });
}
