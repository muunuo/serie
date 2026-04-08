/*
For things directly effecting users

Table of contents: 
- nickname at the top of landing page
*/

(async function () {
    try {
        const response_ = await fetch('/api/sessionUser');
        if (!response_.ok) throw new Error('Not logged in');
        const user_ = await response_.json();

        // Find the element where you want to display the nickname
        // For example, an element with id="nickname"
        const nicknameElem_ = document.getElementById('nickname');
        if (nicknameElem_) {
            nicknameElem_.textContent = user_.nickname_ || user_.username_;
        }
    } catch (err) {
        // Optionally redirect to login or show a message
        console.error(err);
    }
})();


// async function hentBrukerData() {
//     const response = await fetch('/api/sessionUser');
//     if (response.ok) {
//         const data = await response.json();
//         const brukerDataDiv = document.getElementById('brukerData');
//         brukerDataDiv.innerHTML = `
//             <p>ID: ${data.bruker.id}</p>
//             <p>Fornavn: ${data.bruker.fornavn}</p>
//             <p>Etternavn: ${data.bruker.etternavn}</p>
//             <p>Passord: ${data.bruker.passord}</p>
//         `;
//     } else {
//         alert('Kunne ikke hente brukerdata');
//     }
// }