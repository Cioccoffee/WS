function annotate(id){
	var text= ($(id)[0]).innerHTML;
	var url="http://model.dbpedia-spotlight.org/en/annotate";
	var textURI=encodeURI(text);
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
				var queryPainter="ASK WHERE { <"+result.Resources[i]["@URI"]+"> a ?p. FILTER(?p=yago:Painter110391653)}";
				var queryPainting="ASK WHERE { <"+result.Resources[i]["@URI"]+"> a dbo:Work; dbo:author ?painter. ?painter a yago:Painter110391653}";
				var queryMovement = "ASK WHERE { <"+result.Resources[i]["@URI"]+"> dct:subject dbc:Art_movements}";
				var found = false;
				$.ajax({
					url:"http://dbpedia.org/sparql?query="+encodeURI(queryPainter)+"&format=json",
					type:"GET",
					dataType:"json",
					async:false,
				}).done(function (answer){
					if (answer.boolean){
						var link = "<a href=\"../html/painter.html?painter=";
						link+=result.Resources[i]["@URI"].substr(result.Resources[i]["@URI"].lastIndexOf("/")+1);
						link+="\">";
						link+=result.Resources[i]["@surfaceForm"];
						link+="</a>";
						newText+=link;
						found=true;
					}
				});
				$.ajax({
					url:"http://dbpedia.org/sparql?query="+encodeURI(queryPainting)+"&format=json",
					type:"GET",
					dataType:"json",
					async:false,
				}).done(function (answer){
					if (answer.boolean){
						var link = "<a href=\"../html/work.html?work=";
						link+=result.Resources[i]["@URI"].substr(result.Resources[i]["@URI"].lastIndexOf("/")+1);
						link+="\">";
						link+=result.Resources[i]["@surfaceForm"];
						link+="</a>";
						newText+=link;
						found=true;
					}
				});
				$.ajax({
					url:"http://dbpedia.org/sparql?query="+encodeURI(queryMovement)+"&format=json",
					type:"GET",
					dataType:"json",
					async:false,
				}).done(function (answer){
					if (answer.boolean){
						var link = "<a href=\"../html/painter.html?painter=";//FIXME : address
						//console.log(result.Resources[i]);
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
