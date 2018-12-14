function annotate(id){
	var text= ($(id)[0]).innerHTML;
	var url="http://model.dbpedia-spotlight.org/en/annotate";
	var textURI=encodeURI(text);
	console.log(url);
  	var queryUrl=url+"?text="+textURI+"&confidence=0.95&format=json";
	$.ajax({
		url:queryUrl,
		type:"GET",
		dataType:"json",
		success:function(result){
			var newText="";
			var prec=0;
			for(var i=0; i<result.Resources.length; i++){
				newText+=text.substr(prec, parseInt(result.Resources[i]["@offset"],10)-prec);
				//console.log(text.substr(prec, parseInt(result.Resources[i]["@offset"],10)-prec));
				var queryType = ["select ?v where {OPTIONAL{<", result.Resources[i]["@URI"],"> a yago:Painter110391653 VALUES ?v {\"Painter\"}} OPTIONAL{<",result.Resources[i]["@URI"],"> a dbo:Work; dbo:author ?painter. ?painter a yago:Painter110391653 VALUES ?v {\"Painting\"}} OPTIONAL {<",result.Resources[i]["@URI"],"> dct:subject dbc:Art_movements VALUES ?v {\"Movement\"}}}"].join("");
				var found = false;
				$.ajax({
					url:"http://dbpedia.org/sparql?query="+encodeURI(queryType)+"&format=json",
					type:"GET",
					dataType:"json",
					async:false,
				}).done(function (answer){
					if (answer.results.bindings.length!=0){
						var link="";
						if (answer.results.bindings[0].v==undefined){
							return;
						}
						if (answer.results.bindings[0].v.value==="Painter"){
							link+="<a href=\"../html/painter.html?painter=";
						} else if (answer.results.bindings[0].v.value==="Painting"){
							link+="<a href=\"../html/work.html?work=";
						} else if (answer.results.bindings[0].v.value==="Movement"){
							link+="<a href=\"../html/movement.html?movement=";
						}
						link+=result.Resources[i]["@URI"].substr(result.Resources[i]["@URI"].lastIndexOf("/")+1);
						link+="\">";
						link+=result.Resources[i]["@surfaceForm"];
						link+="</a>";
						newText+=link;
						found=true;
					}
				});
				if (!found){
					newText+=result.Resources[i]["@surfaceForm"];
				}
				prec=parseInt(result.Resources[i]["@offset"],10)+parseInt(result.Resources[i]["@surfaceForm"].length,10);
			}
			newText+=text.substr(prec);
			($(id)[0]).innerHTML=newText;
		}
	});
}
