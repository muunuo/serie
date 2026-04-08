// bearer token activated 08.04.2026
async function getBearerToken() {
    const res = await fetch('https://api4.thetvdb.com/v4/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apikey: '7b53faa0-7329-4f8b-98fa-4fee362c1f10' })
    });
    const data = await res.json();
    const token = data.data.token;
    // The token is usually in data.token
    console.log("Your Bearer token:", token); // <-- This will print the token in your browser's console
    return token;
}

// getBearerToken();

async function getSomeData() {
    const token = process.env.BEARERTOKEN;
    const res = await fetch('https://api4.thetvdb.com/v4/series/448176', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
    const data = await res.json();
    console.log("Your shows:", data); // <-- This will print the toke
    return data;
}

getSomeData();



// const APIkey = "7b53faa0-7329-4f8b-98fa-4fee362c1f10";
// let show_; // user input is stored here.

// api4.thetvdb.com/v4 /login


// async function getShow_() {
//     const res = await fetch('https://api.chucknorris.io/jokes/random');
//     const data = await res.json();
    
//     // Tømmer sida for gamle vitsar
//     document.querySelector("#vits").innerHTML = "";

//     // Opprettar ein ny vits i ein paragraf
//     let vits = document.createElement("p");
//     vits.innerText = data.value;
//     document.querySelector("#vits").appendChild(vits);
    
//     // Legg til eit bilete av Chuck Norris
//     let bilde = document.createElement("img");
//     bilde.src = data.icon_url;
//     document.querySelector("#vits").appendChild(bilde);
// }

// hentVits(); // Slik at me får ein vits med ein gong me lastar sida

// // Slik kan me hente ein vits kvar gong me trykker på ein knapp på tastaturet
// document.body.addEventListener("keydown", hentVits);