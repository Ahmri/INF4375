
var request = require('request')
    , qs = require('querystring')
    , iconv = require("iconv-lite")
    , parser = require("../public/javascripts/UqamResponseParser.js")
    , fs = require('fs')
    , xmldom = require("xmldom");

exports.cours = function(req, res){    
    var params = qs.stringify({sigle: req.params.sigle, code_prog: req.params.prog, an_ses2: "Automne 2013", Iframe: 0});
    request.post({
      headers: {'content-type' : 'application/x-www-form-urlencoded', 'Content-Length': params.length},
      url: "http://www.websysinfo.uqam.ca/regis/rwe_horaire_cours",
      body:    params,
      encoding: "binary"
    }, function(error, response, body){
        parser.parse(iconv.decode(body, "ISO-8859-1"), function(msg, parsedHTML){
            var coursGroupe;
            for(var i = 0; i < parsedHTML.length; i++){
                
                if (parsedHTML[i].groupe == req.params.groupe){
                    console.log(parsedHTML[i].groupe);
                    coursGroupe = parsedHTML[i];
                }
            }
            
            if ( coursGroupe !== undefined){
                res.json({sigle: req.params.sigle, horaire: coursGroupe});
            }
            else{
                res.json({message: "Groupe " + req.params.groupe + " est invalide pour le cours " + req.params.sigle + " pour la session Automne 2013"});
            }
        });
    }
    );
};

exports.inscription = function(req, res){
   res.render('inscription', { title: 'Inscription' }); 
};

exports.xml = function(req, res){    
    fs.readFile("inscriptions.xml", function(err, data) {
        if (err) {
            console.log("Error reading XML");
            var xml =   '<?xml version="1.0" encoding="UTF-8"?>' +
                        '<inscriptions></inscriptions>';
            var domRoot = new xmldom.DOMParser().parseFromString(xml);          
            var inscription = createInscription(domRoot, req);

            domRoot.getElementsByTagName("inscriptions")[0].appendChild(inscription);

            fs.writeFile("inscriptions.xml", domRoot.toString(), function(err) {
                if(err) {
                    res.writeHead(200, {'content-type': 'text/plain', 'charset':'utf-8'});
                    res.write("Une erreur est survenu lors de l'enrigestrement");
                    res.end();                    
                }
                else{
                    res.render('success');
                }
            });
        } 
        else {           
            var domRoot = new xmldom.DOMParser().parseFromString(data.toString());
            var inscription = createInscription(domRoot, req);

            domRoot.getElementsByTagName("inscriptions")[0].appendChild(inscription);            
            fs.unlink('inscriptions.xml', function (err) {
                if (err) throw err;                    
            });            
            
            fs.writeFile("inscriptions.xml", domRoot.toString(), function(err) {
                if(err) {
                    res.writeHead(200, {'content-type': 'text/plain', 'charset':'utf-8'});
                    res.write("Une erreur est survenu lors de l'enrigestrement");
                    res.end();                    
                }
                else{
                   res.render('success');
                }
            });            
         }
    });    
};

function createInscription(domRoot, req){    
    var inscription = domRoot.createElement("inscription");
    var code_perm = domRoot.createElement("codePermanent");
    var code_perm_text = domRoot.createTextNode(req.body.code_permanent.toString().toUpperCase());
    code_perm.appendChild(code_perm_text);
    inscription.appendChild(code_perm);

    var code_prog = domRoot.createElement("programme");
    var code_prog_text = domRoot.createTextNode(req.body.user_prog.toString().toUpperCase());
    code_prog.appendChild(code_prog_text);
    inscription.appendChild(code_prog);

    var cours;
    var cours_text;

    if (req.body.cours0 !== ""){
        cours = domRoot.createElement("cours");
        cours_text = domRoot.createTextNode(req.body.cours0.toString().toUpperCase());
        cours.appendChild(cours_text);
        inscription.appendChild(cours);
    }

    if (req.body.cours1 !== ""){
        cours = domRoot.createElement("cours");
        cours_text = domRoot.createTextNode(req.body.cours1.toString().toUpperCase());
        cours.appendChild(cours_text);
        inscription.appendChild(cours);
    }

    if (req.body.cours2 !== ""){
        cours = domRoot.createElement("cours");
        cours_text = domRoot.createTextNode(req.body.cours2.toString().toUpperCase());
        cours.appendChild(cours_text);
        inscription.appendChild(cours);
    }

    if (req.body.cours3 !== ""){
        cours = domRoot.createElement("cours");
        cours_text = domRoot.createTextNode(req.body.cours3.toString().toUpperCase());
        cours.appendChild(cours_text);
        inscription.appendChild(cours);
    }

    if (req.body.cours4 !== ""){
        cours = domRoot.createElement("cours");
        cours_text = domRoot.createTextNode(req.body.cours4.toString().toUpperCase());
        cours.appendChild(cours_text);
        inscription.appendChild(cours);
    }

    if (req.body.cours5 !== ""){
        cours = domRoot.createElement("cours");
        cours_text = domRoot.createTextNode(req.body.cours5.toString().toUpperCase());
        cours.appendChild(cours_text);
        inscription.appendChild(cours);
    }
    return inscription;
}