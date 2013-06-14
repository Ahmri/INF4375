
var request = require('request');
var qs = require('querystring');
var iconv = require("iconv-lite");
var parser = require("../public/javascripts/UqamResponseParser.js");

/*
 * GET home page.
 */
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

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