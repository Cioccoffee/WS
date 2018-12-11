function annotate(){
	var text= ($("#textZone")[0]).innerHTML;
	text=text.replace(/\([^\(]*\)/g,"");
	var url="http://model.dbpedia-spotlight.org/en/annotate";
  	var queryUrl=url+"?text="+escape(text)+"&confidence=0.95&format=json";
	console.log(escape(text));
	$.ajax({
		url:queryUrl,
		type:"GET",
		dataType:"json",
		mimeType:"json; charset=ISO-8859-1",
		success:function(result){
			console.log(result);
			var newText="";
			var prec=0;
			for(var i=0; i<result.Resources.length; i++){
				newText+=text.substr(prec, parseInt(result.Resources[i]["@offset"],10)-prec);
				console.log(text.substr(prec, parseInt(result.Resources[i]["@offset"],10)-prec));
				var link = "<a href=\"";
				console.log(result.Resources[i]);
				link+=result.Resources[i]["@URI"];
				link+="\">";
				link+=result.Resources[i]["@surfaceForm"];
				link+="</a>";
				newText+=link;
				prec=parseInt(result.Resources[i]["@offset"],10)+parseInt(result.Resources[i]["@surfaceForm"].length,10);
				//($("body")[0]).appendChild(link);
			}
			($("body")[0]).innerHTML+=newText;
		}
	});
}

//Pablo Ruiz y Picasso, also known as Pablo Picasso (/pɪˈkɑːsoʊ, -ˈkæsoʊ/; Spanish: [ˈpaβlo piˈkaso]; 25 October 1881 – 8 April 1973), was a Spanish painter, sculptor, printmaker, ceramicist, stage designer, poet and playwright who spent most of his adult life in France. Regarded as one of the greatest and most influential artists of the 20th century, he is known for co-founding the Cubist movement, the invention of constructed sculpture, the co-invention of collage, and for the wide variety of styles that he helped develop and explore. Among his most famous works are the proto-Cubist Les Demoiselles d'Avignon (1907), and Guernica (1937), a portrayal of the Bombing of Guernica by the German and Italian airforces at the behest of the Spanish nationalist government during the Spanish Civil War. Picasso, Henri Matisse and Marcel Duchamp are regarded as the three artists who most defined the revolutionary developments in the plastic arts in the opening decades of the 20th century, responsible for significant developments in painting, sculpture, printmaking and ceramics. Picasso demonstrated extraordinary artistic talent in his early years, painting in a naturalistic manner through his childhood and adolescence. During the first decade of the 20th century, his style changed as he experimented with different theories, techniques, and ideas. His work is often categorized into periods. While the names of many of his later periods are debated, the most commonly accepted periods in his work are the Blue Period (1901–1904), the Rose Period (1904–1906), the African-influenced Period (1907–1909), Analytic Cubism (1909–1912), and Synthetic Cubism (1912–1919), also referred to as the Crystal period. Exceptionally prolific throughout the course of his long life, Picasso achieved universal renown and immense fortune for his revolutionary artistic accomplishments, and became one of the best-known figures in 20th-century art.
//%0A%09%09Pablo%20Ruiz%20y%20Picasso%2C%20also%20known%20as%20Pablo%20Picasso%20%28/p%u026A%u02C8k%u0251%u02D0so%u028A%2C%20-%u02C8k%E6so%u028A/%3B%20Spanish%3A%20%5B%u02C8pa%u03B2lo%20pi%u02C8kaso%5D%3B%2025%20October%201881%20%u2013%208%20April%201973%29%2C%20was%20a%20Spanish%20painter%2C%20sculptor%2C%20printmaker%2C%20ceramicist%2C%20stage%20designer%2C%20poet%20and%20playwright%20who%20spent%20most%20of%20his%20adult%20life%20in%20France.%20Regarded%20as%20one%20of%20the%20greatest%20and%20most%20influential%20artists%20of%20the%2020th%20century%2C%20he%20is%20known%20for%20co-founding%20the%20Cubist%20movement%2C%20the%20invention%20of%20constructed%20sculpture%2C%20the%20co-invention%20of%20collage%2C%20and%20for%20the%20wide%20variety%20of%20styles%20that%20he%20helped%20develop%20and%20explore.%20Among%20his%20most%20famous%20works%20are%20the%20proto-Cubist%20Les%20Demoiselles%20d%27Avignon%20%281907%29%2C%20and%20Guernica%20%281937%29%2C%20a%20portrayal%20of%20the%20Bombing%20of%20Guernica%20by%20the%20German%20and%20Italian%20airforces%20at%20the%20behest%20of%20the%20Spanish%20nationalist%20government%20during%20the%20Spanish%20Civil%20War.%20Picasso%2C%20Henri%20Matisse%20and%20Marcel%20Duchamp%20are%20regarded%20as%20the%20three%20artists%20who%20most%20defined%20the%20revolutionary%20developments%20in%20the%20plastic%20arts%20in%20the%20opening%20decades%20of%20the%2020th%20century%2C%20responsible%20for%20significant%20developments%20in%20painting%2C%20sculpture%2C%20printmaking%20and%20ceramics.%20Picasso%20demonstrated%20extraordinary%20artistic%20talent%20in%20his%20early%20years%2C%20painting%20in%20a%20naturalistic%20manner%20through%20his%20childhood%20and%20adolescence.%20During%20the%20first%20decade%20of%20the%2020th%20century%2C%20his%20style%20changed%20as%20he%20experimented%20with%20different%20theories%2C%20techniques%2C%20and%20ideas.%20His%20work%20is%20often%20categorized%20into%20periods.%20While%20the%20names%20of%20many%20of%20his%20later%20periods%20are%20debated%2C%20the%20most%20commonly%20accepted%20periods%20in%20his%20work%20are%20the%20Blue%20Period%20%281901%u20131904%29%2C%20the%20Rose%20Period%20%281904%u20131906%29%2C%20the%20African-influenced%20Period%20%281907%u20131909%29%2C%20Analytic%20Cubism%20%281909%u20131912%29%2C%20and%20Synthetic%20Cubism%20%281912%u20131919%29%2C%20also%20referred%20to%20as%20the%20Crystal%20period.%20Exceptionally%20prolific%20throughout%20the%20course%20of%20his%20long%20life%2C%20Picasso%20achieved%20universal%20renown%20and%20immense%20fortune%20for%20his%20revolutionary%20artistic%20accomplishments%2C%20and%20became%20one%20of%20the%20best-known%20figures%20in%2020th-century%20art.%0A%09%09