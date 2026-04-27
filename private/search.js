/*
-------------------------------
    SEARCH BY NAME
-------------------------------
*/

/*
-------------------------------
    Gets user input
-------------------------------
*/
//Info gotten from dashboard.html ⤵
const search_ = document.getElementById('searchShow_');
const input_ = document.getElementById('showName_');

// SENDING INFO TO APP function⤵
search_.addEventListener('submit', async (event) => {  //wait to run untill event is retrived
    event.preventDefault(); // preventDefault = stops the page from reloading 
    const searchName_ = input_.value.trim(); //get the showName_ input and make into a value and remove any white space at the star/end with trim

    if (!searchName_) return; //checks if the search is empty

    const sendShow_ = await getShowData_(searchName_); //sendShow_ waits to hqppen untill info from getShowData_ is there
    if (sendShow_ && sendShow_.data_) { //if both are true then continue
        const showId_ = sendShow_.data_.id || sendShow_.data_.tvdb_id; //see if either id or tvdb_id is availeble from getShowData_

        await fetch('http://localhost:3000/api/registerShowDB_', { //send the info to app.js
            method: 'POST', //send using POST 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({searchName_: showId_}) // Convert JS object to JSON string
        });
    }
    await displayShow_(searchName_) //pauses the rest of the function untill displayShow_
});

/*
-------------------------------
    Get info from the api
-------------------------------
*/
async function getShowData_(searchName_) {
    // token needed for retriving information ⤵
    const token_ = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZ2UiOiIiLCJhcGlrZXkiOiI3YjUzZmFhMC03MzI5LTRmOGItOThmYS00ZmVlMzYyYzFmMTAiLCJjb21tdW5pdHlfc3VwcG9ydGVkIjpmYWxzZSwiZXhwIjoxNzc5ODk2NjM0LCJnZW5kZXIiOiIiLCJoaXRzX3Blcl9kYXkiOjEwMDAwMDAwMCwiaGl0c19wZXJfbW9udGgiOjEwMDAwMDAwMCwiaWQiOiIyOTg0MDU5IiwiaXNfbW9kIjpmYWxzZSwiaXNfc3lzdGVtX2tleSI6ZmFsc2UsImlzX3RydXN0ZWQiOmZhbHNlLCJwaW4iOm51bGwsInJvbGVzIjpbXSwidGVuYW50IjoidHZkYiIsInV1aWQiOiIifQ.gN0l9meWu2elrSVwDmVszl2Z0OfbRQUa_1xznVg9wjLecLAfBKE1MZuPFgqMB4J62Ul9CT877VUDbQ6b159xfOI2UO7rio1XQ1UkiF3iuile1SkyW03AsXgQA63DLLCuF5vABhldHNI5XU1dPlbxiTgY4EV8VwOcjAzNw6Xi5VYQvGiRM_d8opn2vJ58dVms5GV2pTsxbU5DnBw-O25rsOo2B0pUsaZ-Nx_7JUsFIGAcG3elJqBDwY7kGXf6MeGJ2uUcbCS6FhFzsPFyMBOIi2a0M42s4fQ3LZy4YgHm3bVRL7SGEiGH9ZzqlLEr6NHA971zETf5HMolzYEegtUUSahCKXsGzYjMTJYhpD-74x8lb72xf63q8KJ2yXVvM8-Y1cahzsF6ia1Ej-PtD9oy0uqKGB3JpPffzGo_6KxPfut2ICixXrfAelVmK7ZHDecBNTIiTzXRItbIza5CwJCXUy9UIgSnHrScE346-gsit8OBBqyuBVFynJvoE8Q91PGNg24-p4A24_-FhQ216A2eFAdPwwovPeIssYT5y5r31sU1Ak0_zs8uzyS7oASBCwpAn02mGDc5bit9n7bO1KZ2xZ60KdB1VmfW0MFltYMA_DptqVwr96-54Q5bOXgp_8-XaCNOhA5eNhh9eSxzTlAL9uoWanitinrnUhw_zZK0Hjg";
    // gets an array of series matching user input with basic info from api⤵ 
    const arrayRes_ = await fetch(`https://api4.thetvdb.com/v4/search?query=${encodeURIComponent(searchName_)}&type=series`, { //encodeURIComponent = remove white space at start/end.
        headers: {
            'Authorization': 'Bearer ' + token_ //needed to get info
        }
    });

    const data_ = await arrayRes_.json(); //data = array of series

    if (data_.data && data_.data.length > 0) { //check if the search resault exist
        const databaseShowId_ = data_.data[0].tvdb_id; //checks if empty. Gets first resault matching user input. Gets tvdb_id from said result
        const seriesRes_ = await fetch(`https://api4.thetvdb.com/v4/series/${databaseShowId_}`, { //uses tvdb_id to get more info on show
            headers: {
                'Authorization': 'Bearer ' + token_
            }
        });
        return await seriesRes_.json(); //await getting seriesRes_ befor returning it. 
    }

    // console.log("Your shows:", data); // <-- This will print the toke
    return data_;
}

/*
-------------------------------
    Display info for user
-------------------------------
*/

async function displayShow_(seriesRes_) { //gets the series info from /series api search
    const show_ = await getShowData_(seriesRes_); //wait untill said info arrives

    if (!show_ || !show_.data) {
        console.log("No show data found");
        // Optionally, display a message to the user, e.g.:
        // const container_ = document.getElementById('series');
        // container_.innerHTML = "<p>No results found.</p>";
        return;
    }

    const container_ = document.getElementById('series'); // use div from dashboard.html
    container_.innerHTML = ""; // Clear previous content



    const showData_ = show_.data // to avoid having to wright out show_.data
    console.log("Your displayShow_ is:", showData_); 
    const title_ = showData_.name || showData_.seriesName || "Title not found"; //check in order if there is data in the different one. if not use "title not found"
    
    let posterURL_= ""; //clear content
    if (showData_.image) { //see if the shows image is availeble
        posterURL_ = showData_.image; //if so, use image, if not then see if:
    } else if (showData_.artworks && showData_.artworks.length > 0) { // show artwork is not empty AND it has at least one item in it
        posterURL_ = showData_.artworks[0].image; //if so use the first item in show artwork array
    }

    const bio_ = showData_.overview || showData_.description || "No Description"; //same as above just differnet names ⤴

    const titleElem_ = document.createElement('h2'); // create a header for title
    titleElem_.textContent = title_; //the text in titleElem_ is the info gotten in title_
    container_.appendChild(titleElem_); // make it the child of the div so it's inside

    if (posterURL_) {
        const img_ = document.createElement('img'); //create an img for the poster
        img_.src = posterURL_; //turn into a src so image will appear
        img_.alt = title_; //the alternative text is the show title
        img_.style.width = '200px'; //choose size
        container_.appendChild(img_); // make it the child of the div so it's inside
    }

    const bioElem_ = document.createElement('p'); //same as above with different name ⤴
    bioElem_.textContent = bio_;
    container_.appendChild(bioElem_);
}
/*
-------------------------------
    OLD VERSION (WITH ID SEARCH)
-------------------------------
*/

// const search_ = document.getElementById('searchShow_');
// const input_ = document.getElementById('showName_');

// search_.addEventListener('submit', async (event) => {  //async stops search_ from running before the info arrives
//     event.preventDefault(); // Prevents the page from reloading 
//     const showId_ = input_.value.trim(); //trim removes space at end. Value = gets the user input

//     if (!showId_) return;
//     await displayShow_(showId_) //pauses the function untill displayShow_ runs 
// });

// async function getShowData_(showId_) {
//     // token needed for retriving information ⬇️
//     const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZ2UiOiIiLCJhcGlrZXkiOiI3YjUzZmFhMC03MzI5LTRmOGItOThmYS00ZmVlMzYyYzFmMTAiLCJjb21tdW5pdHlfc3VwcG9ydGVkIjpmYWxzZSwiZXhwIjoxNzc4NzA0MDgwLCJnZW5kZXIiOiIiLCJoaXRzX3Blcl9kYXkiOjEwMDAwMDAwMCwiaGl0c19wZXJfbW9udGgiOjEwMDAwMDAwMCwiaWQiOiIyOTg0MDU5IiwiaXNfbW9kIjpmYWxzZSwiaXNfc3lzdGVtX2tleSI6ZmFsc2UsImlzX3RydXN0ZWQiOmZhbHNlLCJwaW4iOm51bGwsInJvbGVzIjpbXSwidGVuYW50IjoidHZkYiIsInV1aWQiOiIifQ.e1qg4pc46lysJF0fq31_2vUulJZRPOXbLDzxpyI5nPF9OiYKrtlXV1LECsNPkxb8h18bryWte_eduikWwBfBE9tiY_n2__PpDS_FB7buct3ki32y6HUtX1AUDNIr6XvtpGjU0OjFvbnNd3Au9zGb5pZNdiqqY61QJzYEDSKXOtEM2Q-zSLxJ1tDcqBT3tM26nr8rNp-JoOB7yT6fYiTHl2JXvVyfrCq7GCWNVOPj9KbSFXHEtUQCifXki9bBVMMCYoLteVm1IKcWTYodeGN7AXYKhdsncRHxh9Rba7C78tdPsf-sgrxFrMlRnPGCqPVxjTdfyx56mpixW2IAPsJOPv6FxqJbyw5do9XURIhqAoPTyywtYTzt8xZcJ2HMmTo9sgMZJkw8U0ch_UQwY70qjZzZfHeLsG-IpDtmGfNNLAMfUz67YIklbJ-vjQKxOjdz86VUVooPE5YfWvp_IfHSEE9yLp5DwBctTrcD9SCF3gzvUbqIgA4h7Z3bxW9fnd3-6DRcfaU2pts01rL9vG4r-BnmJJCx090AYTTp-vVt80fDgE3QTwoooyyeBVn0CPH2lENIk1XFnWVxKcX2Nlaes5lFGRm0cZadPuMjKNs5D82GLqL4pNV7NLAxsr7MAUKycAU15iQCCONfcKElZjWs1EpIpKDTlOJwAoB0zeRZBDs";
//     // getting the info from the API ⬇️
//     const res = await fetch(`https://api4.thetvdb.com/v4/series/${showId_}`, {
//         headers: {
//             'Authorization': 'Bearer ' + token
//         }
//     });

//     const data = await res.json(); 
//     console.log("Your shows:", data); // <-- This will print the toke
//     return data;
// }

// async function displayShow_(showId_) {
//     const show_ = await getShowData_(showId_);

//     const container_ = document.getElementById('series');
//     container_.innerHTML = ""; // Clear previous content

//     console.log("Your displayShow_ is:", show_);

//     const showData_ = show_.data

//     const title_ = showData_.name || showData_.seriesName || "Title not found";

//         let posterURL_= "";
//     if (showData_.image) {
//         posterURL_ = showData_.image;
//     } else if (showData_.artworks && showData_.artworks.length > 0) {
//         posterURL_ = showData_.artworks[0].image;
//     }

//     const bio_ = showData_.overview || showData_.description || "No Description";

//     const titleElem_ = document.createElement('h2');
//     titleElem_.textContent = title_;
//     container_.appendChild(titleElem_);

//     if (posterURL_) {
//         const img_ = document.createElement('img');
//         img_.src = posterURL_;
//         img_.alt = title_;
//         img_.style.width = '200px';
//         container_.appendChild(img_);
//     }

//     const bioElem_ = document.createElement('p');
//     bioElem_.textContent = bio_;
//     container_.appendChild(bioElem_);
// }