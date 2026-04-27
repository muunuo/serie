/*
For things directly effecting users

Table of contents: 
- nickname at the top of landing page
*/

const deleteButton_ = document.getElementById('deleteButton');

async function user_() {
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

    deleteButton_.addEventListener('click', async () => {
        if (confirm(`Are you sure you want to delete "${user_.username_}"?`)) {
            try {
                const answer_ = await fetch (`/api/deleteUser_`, {//retrives users
                    method: 'DELETE' // deletes users
                });
                if (answer_.ok) {
                    alert("user deleted");
                } else {
                    alert("somthing went wrong. Try again later");
                }
            } catch (error) {
                console.error(error);
                alert("somthing went wrong. Try again later");
            }
        }
    });
};

user_();


// async function hentBrukerData() {
//     const sponse = await fetch('/api/sessionUser');
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