
function toASCII(str){
	return str
        .replace(/[ÀÁÂÃÄÅ]/g,"A")
        .replace(/[àáâãäå]/g,"a")
        .replace(/[ÈÉÊË]/g,"E")
        .replace(/[èéêë]/g,"e")
        .replace(/[ÔÖ]/g,"O")
        .replace(/[ôö]/g,"o")
        .replace(/[ù]/g,"u");
}

/*
*Implementation of the levenshtein distance
*between two words.
*/
function LevenshteinDistance(word1, word2){
  var len1 = word1.length;
  var len2 = word2.length;
  var matrix = [];
  for (var line = 0; line <= len1; line++) {
  matrix[line] = [];
  for (var column = 0; column <= len2; column++) matrix[line][column] = 0;
  }

  for (var i = 1; i <= len1; i++) matrix[i][0] = i;
  for (var j = 1; j <= len2; j++) matrix[0][j] = j;

  for (var j = 1; j <= len2; j++){
  for (var i = 1; i <= len1; i++){
    var cost = word1[i-1] == word2[j-1] ? 0 : 1;
    matrix[i][j] = Math.min(Math.min(matrix[i-1][j] + 1, matrix[i][j-1] + 1), matrix[i-1][j-1] + cost);
  }
  }
  return matrix[len1][len2];
}

/**
*This function retrieves from dbPedia every possible name of painter
*that is close to the user's word.
*/
function getClosestNames(research){
  //Ask dbPedia for the allowed resources
  var url="http://dbpedia.org/sparql";
  var query=["select distinct ?p where {", "?p a yago:Painter110391653; a dbo:Artist}"].join(" ");
  var queryUrl=url+"?query="+encodeURIComponent(query)+"&format=json";
  $.ajax({
    url:queryUrl,
    success:function(result){
      //We've got all names, let's search for the closest one(s)
  		searchTerms = research.split(" ");
  		results=[];
      for (var i =0; i<result.results.bindings.length; i++){
        var resource = result.results.bindings[i].p.value.substr(result.results.bindings[i].p.value.lastIndexOf("/")+1);
        resource=toASCII(resource);
        subItems = resource.split(/[_-]/g);
        var allMatch=true;
        var distance=0;
        for (var j = 0; j<searchTerms.length; j++){
        	found=false;
        	for(var k=0; k<subItems.length; k++){
        		var localDistance=LevenshteinDistance(searchTerms[j],subItems[k]);
		      	if (localDistance<3){
		      		distance+=localDistance;
		  				found=true;
		          break;
		        }
        	}
        	if (!found){
        		allMatch=false;
        		break;
        	}
        }
        if (allMatch){
        	results.push({resource : resource, distance:distance});
        }
      }
      results.sort(function compare(a, b){
      	if (a.distance<b.distance){
      		return -1;
      	}if (a.distance>b.distance){
      		return 1;
      	}
      	return 0;
      });
      var html="<h3 id=\"query_title\">Search Results</h3><table>";
      for(var i=0; i<results.length; i++){
				html+="<tr><td onclick=\"location.href=\'html/painter.html?painter="+results[i].resource+"\'\">" + results[i].resource.replace(/[_]/g," ")+"</td></tr>\n";
      }
  		section=$("#resultZone")[0];
  		html+="</table>";
  		section.innerHTML=html;
    }
  });
}

function searchPainters(){
  var name = $("#research_bar").val();
  name = toASCII(name);
  getClosestNames(name);
}

//This line blocks the form to refresh the page when submitting
$("form").submit(function() { return false; });
