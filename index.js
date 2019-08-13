const CryptoJS = require("crypto-js");
const fetch = require("node-fetch");
//Master Key
var mastKey='4oxsYXpOZyuO6cu3rbhbmUBNPwLzJWX9m9IygVjSp8lNnsyt4lfNN1hOPOgEQwwdyBkpjR5L2X84QgJQ15qwIw==';
//
var url='https://exhibiciondb.documents.azure.com:443';
var alcaldeArchivo='Alcalde';
var asambleaArchivo='Asamblea';
var circuitosArchivo='Circuitos';
var corregimientosArchivo='Corregimientos';
var diputadosGeneralArchivo='DiputadosGeneral';
var distritosArchivo='Distritos';
var partidosPoliticosArchivo='PartidosPoliticos';
var presidenteGeneralArchivo='PresidenteGeneral';
var presidentexCircuitoArchivo='PresidentexCircuito';
var presidentexDistritoArchivo='PresidentexDistrito';
var presidentexProvinciaArchivo='PresidentexProvincia';
var provinciasArchivo='Provincias';
var representanteArchivo='Representante';
var alianzaArchivo='Alianzas';
var diputadoPlurinominalCandidatosArchivo='DiputadoPlurinominalCandidatos';
var detalleAsambleaArchivo='DetalleAsamblea';
var api={Alcalde:{dbs:'/dbs/alcaldes/colls/general/docs',doc:'MayoraltiesData'},Asamblea:{dbs:'/dbs/asamblea/colls/general/docs',doc:'AssemblyData'},Circuitos:{dbs:'/dbs/catalogos/colls/circuitos/docs',doc:'CircuitsData'},Corregimientos:{dbs:'/dbs/catalogos/colls/corregimientos/docs',doc:'CorrectionsData'},DiputadosGeneral:{dbs:'/dbs/diputados/colls/general/docs',doc:'DeputiesData'},Distritos:{dbs:'/dbs/catalogos/colls/distritos/docs',doc:'DistrictsData'},PartidosPoliticos:{dbs:'/dbs/catalogos/colls/partidos/docs',doc:'PoliticalPartiesData'},PresidenteGeneral:{dbs:'/dbs/presidentes/colls/nacional/docs',doc:'NationalPresidentialData'},PresidentexCircuito:{dbs:'/dbs/presidentes/colls/circuitos/docs',doc:'CircuitsPresidentialData'},PresidentexDistrito:{dbs:'/dbs/presidentes/colls/distritos/docs',doc:'DistrictsPresidentialData'},PresidentexProvincia:{dbs:'/dbs/presidentes/colls/provincia/docs',doc:'ProvincePresidentialData'},Provincias:{dbs:'/dbs/catalogos/colls/provincias/docs',doc:'ProvincesData'},Representante:{dbs:'/dbs/representantes/colls/general/docs',doc:'RepresentativesData'},Representante2:{dbs:'/dbs/representantes/colls/general2/docs',doc:'RepresentativesData'},Alianzas:{dbs:'/dbs/catalogos/colls/alianzas/docs',doc:'AllianceData'},DiputadoPlurinominalCandidatos:{dbs:'/dbs/diputados/colls/candidatespluri/docs',doc:'PluriCandidateDeputiesData'},DetalleAsamblea:{dbs:'/dbs/asamblea/colls/details/docs',doc:'AssemblyData'}};
var alcaldeUrl=alcaldeArchivo;
var asambleaUrl=asambleaArchivo;
var circuitosUrl=circuitosArchivo;
var corregimientosUrl=corregimientosArchivo;
var diputadosGeneralUrl=diputadosGeneralArchivo;
var distritosUrl=distritosArchivo;
var partidosPoliticosUrl=partidosPoliticosArchivo;
var presidenteGeneralUrl=presidenteGeneralArchivo;
var presidentexCircuitoUrl=presidentexCircuitoArchivo;
var presidentexDistritoUrl=presidentexDistritoArchivo;
var presidentexProvinciaUrl=presidentexProvinciaArchivo;
var provinciasUrl=provinciasArchivo;var representanteUrl=representanteArchivo;
var alianzaUrl=alianzaArchivo;
var diputadoPlurinominalCandidatosUrl=diputadoPlurinominalCandidatosArchivo;

function getDataFromApi(apiKey){
	const callUrl=url+api[apiKey].dbs;
	var today=new Date();
	var UTCstring=today.toUTCString();
	var myUrl=callUrl.trim();
	var strippedurl=myUrl.replace(new RegExp('^https?://[^/]+/'),'/');
	var strippedparts=strippedurl.split('/');
	var truestrippedcount=strippedparts.length-1;
	var resourceId='';
	var resType='';

	if(truestrippedcount%2){
		resType=strippedparts[truestrippedcount];
		if(truestrippedcount>1){
			var lastPart=strippedurl.lastIndexOf('/');
			resourceId=strippedurl.substring(1,lastPart);
		}
	}
else{
	resType=strippedparts[truestrippedcount-1];
	strippedurl=strippedurl.substring(1);
	resourceId=strippedurl;
}


var today=new Date();
var UTCstring=today.toUTCString();
var verb='POST';
var date=UTCstring.toLowerCase();
var auth;
var key=CryptoJS.enc.Base64.parse(mastKey);
var text=(verb||'').toLowerCase()+
'\n'+
(resType||'').toLowerCase()+
'\n'+
(resourceId||'')+
'\n'+
(date||'').toLowerCase()+
'\n'+
''+
'\n';
var signature=CryptoJS.HmacSHA256(text,key);
var base64Bits=CryptoJS.enc.Base64.stringify(signature);
console.log("Base64 sig: "+base64Bits)
var MasterToken='master';var TokenVersion='1.0';
auth=encodeURIComponent('type='+MasterToken+'&ver='+TokenVersion+'&sig='+base64Bits);
return fetch(callUrl,{method:verb,body:JSON.stringify({query:'SELECT TOP 1 * FROM c ORDER BY c.CreatedDate desc',parameters:[]}),headers:{authorization:auth,'x-ms-date':UTCstring,'x-ms-version':'2017-02-22','x-ms-documentdb-isquery':true,'Content-Type':'application/query+json'},cache:'no-store'}).then(a=>a.json()).then(r=>{let response=r.Documents[0][api[apiKey].doc];
	return response;
});
}

function getAuthorizationTokenUsingMasterKey(verb, resourceType, resourceId, date, mastKey) {  
    var key = new Buffer(mastKey, "base64");  
  
    var text = (verb || "").toLowerCase() + "\n" +   
               (resourceType || "").toLowerCase() + "\n" +   
               (resourceId || "") + "\n" +   
               date.toLowerCase() + "\n" +   
               "" + "\n";  
  
    var body = new Buffer(text, "utf8");  
    var signature = CryptoJS.createHmac("sha256", key).update(body).digest("base64"); 
  
    var MasterToken = "master";  
  
    var TokenVersion = "1.0";  
  
    return encodeURIComponent("type=" + MasterToken + "&ver=" + TokenVersion + "&sig=" + signature);  
}  

console.log(getDataFromApi("PresidenteGeneral"))


//;return fetch(callUrl,{method:verb,body:JSON.stringify({query:'SELECT TOP 1 * FROM c ORDER BY c.CreatedDate desc',parameters:[]}),headers:{authorization:auth,'x-ms-date':UTCstring,'x-ms-version':'2017-02-22','x-ms-documentdb-isquery':true,'Content-Type':'application/query+json'},cache:'no-store'}).then(a=>a.json()).then(r=>{let response=r.Documents[0][api[apiKey].doc];return response;});}
