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
    
    var cours = document.getElementById("cours"+ind).value;      
    
    if ( cours === ""){
            coursInscrit[ind] = "";
    }
    else
    {
            var url = "/info/" + document.getElementById("user_prog").value + "/" + cours.toString().replace("-", "/");            
            request.open("GET", url, true);           

            request.onreadystatechange = function() {
                if (request.readyState === 4) {
                    coursInscrit[ind] = JSON.parse(request.responseText);
                    console.log(JSON.stringify(coursInscrit[ind]));
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
    messages = [];
    
    if ( nbCourses < MIN_INSCRIPTIONS){
        messages.push({message: "Vous n'avez pas atteint le minimum d'inscriptions qui est de: " + MIN_INSCRIPTIONS});
        isFormValid = false;
    }
    
    if ( nbCourses > MAX_INSCRIPTIONS ){
        messages.push({message: "Vous avez atteint le maximum d'inscriptions qui est de: " + MAX_INSCRIPTIONS});
        isFormValid = false;
    }
    
    for(var i = 0; i < coursInscrit.length; i++){
        if ( coursInscrit[i].message !== undefined ){
            messages.push(coursInscrit[i].message);
            isFormValid = false;
        }
        else{
            if ( coursInscrit[i] !== "" )
                checkConflit(i);
        }
    }
    
    if (isValidForm){
        console.log("Form is valid")     
    }
    else{
        console.log(JSON.stringify(messages));
    }
}

function checkConflit(ind){
    var cours = coursInscrit[ind];
    
    for(var i = 0; i < cours.horaire.seances.length; i++){
        var seance = cours.horaire.seances[i];
        for(var j = 0; j < coursInscrit.length; j++){
            if ( j !== ind && coursInscrit[j] !== ""){
                for(var k = 0; k < coursInscrit[j].horaire.seances.length; k++){
                    var seanceCompare = coursInscrit[j].horaire.seances[k];
                    if ( seance.jour === seanceCompare.jour){
                        if (seance.debut >= seanceCompare.debut && seance.fin <= seanceCompare.fin){
                            messages.push({message: "Le cours " + cours.sigle + " est en conflit d'horaire avec le cours " + coursInscrit[j].sigle});
                            isValidForm = false;                            
                        }
                    }
                }
            }
        }
    }
}