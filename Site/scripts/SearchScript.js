
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
  var closestNames=[];
  $.ajax({
    url:queryUrl,
    success:function(result){
      //We've got all names, let's search for the closest one(s)
      for (var i =0; i<result.results.bindings.length; i++){
        var resource = result.results.bindings[i].p.value.substr(result.results.bindings[i].p.value.lastIndexOf("/")+1);
        subItems = resource.split("_");
        for (var j = 0; j<subItems.length; j++){
          if (LevenshteinDistance(research,subItems[j])<2){
            closestNames.push(resource);
            break;
          }
        }
        
      }
//      console.log(closestNames);
    }
  });
  //FIXME : find a way to wait the ajax to be finished before returning closestNames
  return closestNames;
}

function searchPainters(){
  var name = $("#research_bar").val();
  //document.location.href="results.html";
  //console.log(name);
  var results=getClosestNames(name);
  section=$("#resultZone")[0];
  var html="<h1>Search Results</h1><table style=\"width:100%\">"
  for(var i=0; i<results.length; i++){
    html+="<tr><th>"+results[i]+"</th><th>http://dbpedia.org/sparql/"+results[i]+"</th></tr>\n";
  }
  html+="</table>";
  section.innerHTML=html;
  return true;
}

//This line blocks the form to refresh the page when submitting
$("form").submit(function() { return false; });
