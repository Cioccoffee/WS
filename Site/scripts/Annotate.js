function annotate(){
	var text= ($("#textZone")[0]).innerHTML;
	//text=text.replace(/\([^\(]*\)/g,"");
	//console.log(text);
	var url="http://model.dbpedia-spotlight.org/en/annotate";
  	var queryUrl=url+"?text="+escape(text)+"&confidence=0.95&format=json";
	$.ajax({
		url:queryUrl,
		dataType:"json",
		success:function(result){
			console.log(result);
			for(var i=0; i<result.Resources.length; i++){
				var link = document.createElement("a");
				console.log(result.Resources[i]);
				link.setAttribute("href",result.Resources[i]["@URI"]);
				link.innerHTML=result.Resources[i]["@surfaceForm"];
				($("body")[0]).appendChild(link);
			}
		}
	});
}
