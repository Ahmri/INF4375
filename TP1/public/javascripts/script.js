/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var MIN_INSCRIPTIONS = 1;
var MAX_INSCRIPTIONS = 5;
var coursInscrit = ["", "", "", "", "", ""];
var isValidForm = true;
var nbCourses = 0;
var messages = [];

function validateCours(ind) { 
    var request = new XMLHttpRequest();
    isValidForm = true;
    messages = [];
    var cours = document.getElementById("cours"+ind).value;           
    coursInscrit[ind] = "";    
    
    if ( cours === ""){            
        calcCourses();
        validateForm();
    }else if ( cours.toString().charAt(7) !== '-'){
        messages.push({message: "Syntaxe invalide pour le cours: " + cours});
        validateForm();
    }else if ( document.getElementById("user_prog").value === ""){
        document.getElementById("cours"+ind).value = "";        
        validateForm(); 
    }
    else{
        var url = "/info/" + document.getElementById("user_prog").value + "/" + cours.toString().replace("-", "/");            
        request.open("GET", url, true);           

        request.onreadystatechange = function() {
            if (request.readyState === 4 && request.status === 200) {
                var res = JSON.parse(request.responseText);
                if ( res.message === undefined ){
                    coursInscrit[ind] = res;                       
                }                
                else{
                    messages.push(res);                        
                }
                calcCourses();
                validateForm();
            }                                       
        };
        request.send();
    }        
}

function calcCourses(){
    nbCourses = 0;
    for(var i = 0; i < coursInscrit.length; i++){
        if (coursInscrit[i] !== "")
            nbCourses++;
    }
}

function validateForm(){    
    if ( document.getElementById("code_permanent").value === ""){
        messages.push({message: "Code permanent invalide"});
        isValidForm = false;
    }
    
    if ( document.getElementById("user_prog").value === ""){
        messages.push({message: "Programme invalide"});
        isValidForm = false;
    }
    
    if ( nbCourses < MIN_INSCRIPTIONS){
        messages.push({message: "Vous n'avez pas atteint le minimum d'inscriptions valides qui est de: " + MIN_INSCRIPTIONS});
        isValidForm = false;
    }
    
    if ( nbCourses > MAX_INSCRIPTIONS ){
        messages.push({message: "Vous avez atteint le maximum d'inscriptions valides qui est de: " + MAX_INSCRIPTIONS});
        isValidForm = false;
    }
    
    for (var i = 0; i < coursInscrit.length - 1; i++){
        cours = coursInscrit[i];
        if ( cours !== "" ){            
            if ( cours.horaire.places_restantes === 0 ){
                messages.push({message: "Il n'y a plus de places disponibles pour le cours: " + cours.sigle.toString().toUpperCase() + "-" + cours.horaire.groupe});                
            }
        
            if ( nbCourses > 1){            
                checkConflit(i);
            }
        }        
    }
    
     if ( messages.length !== 0){        
        isValidForm = false;
    } 
    
    if (isValidForm){        
        document.getElementById("list").innerHTML = "";
        document.getElementById("submit").disabled = false;
    }
    else{
        var htmlList = "<ul>";
        for (var i = 0; i < messages.length; i++){
            htmlList += "<li>" + messages[i].message.toString() + "</li>";
        }
        htmlList += "</ul>";
        document.getElementById("list").innerHTML = htmlList;        
        document.getElementById("submit").disabled = true;
    }
}

function checkConflit(ind){
    var cours = coursInscrit[ind];
    
    for(var i = ind + 1; i < coursInscrit.length; i++){        
        var coursCompare = coursInscrit[i];
        
        if ( coursCompare !== ""){
           var conflit = false;
        
            for (var j = 0; j < cours.horaire.seances.length; j++){
                seance = cours.horaire.seances[j];

                for(var k = 0; k < coursCompare.horaire.seances.length; k++){
                    seanceCompare = coursCompare.horaire.seances[k];

                    if ( seance.jour === seanceCompare.jour){
                        if (seance.debut >= seanceCompare.debut && seance.fin <= seanceCompare.fin){
                            conflit = true;
                        }
                    }
                }                     
            }
            
            if ( conflit ){
                messages.push({message: "Le cours " + cours.sigle.toString().toUpperCase() + "-" + cours.horaire.groupe 
                            + " est en conflit d'horaire avec le cours " + coursCompare.sigle.toString().toUpperCase() 
                            + "-" + coursCompare.horaire.groupe});                
            } 
        }          
    }
}

function resetForm(){
    for (var i = 0; i < 6; i++){
        coursInscrit[i] = "";
        document.getElementById("cours"+i).value = "";
    }
    calcCourses();
    validateForm();
}