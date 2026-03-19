var skjema = document.createElement("form");
skjema.setAttribute('method',"POST");
skjema.setAttribute('action',"/createUser_");

var brukernavn = document.createElement("input"); //input element, text
brukernavn.setAttribute('type',"text");
brukernavn.setAttribute('name',"brukernavn");

var passord = document.createElement("input"); //input element, text
passord.setAttribute('type',"text");
passord.setAttribute('name',"passord");

var kallenavn = document.createElement("input"); //input element, text
kallenavn.setAttribute('type',"text");
kallenavn.setAttribute('name',"kallenavn");

var send = document.createElement("input"); //input element, Submit button
send.setAttribute('type',"submit");
send.setAttribute('value',"submit");

skjema.appendChild(brukernavn);
skjema.appendChild(passord);
skjema.appendChild(send);

document.getElementsByTagName('body')[0].appendChild(form);

/*
brukernavn = username
passord = password
kallenavn = nickname 
skjema = form
send = submitt
*/