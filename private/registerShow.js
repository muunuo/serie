/* 
connect to dashboard.html

Plan: 
- User can register a show they have 
    ◻ Watchd 
    ◻ Will watch
    ◻ Are watching
(using status tabell)
◻ Registerd show is vieweble on user dashboard
    ◻ and stays there

How??
◻ Show id (from api) gets registerd into the database. 
- Using similure code as the one used for registring shows in 'show' reposetory
◻ Show id in database used to retrive the show info for user


code idea:
for every show watched create a box
In box : picture | name | more info

when on more info : register show??
*/
const search_ = document.getElementById('searchShow_');
const input_ = document.getElementById('showName_');

search_.addEventListener('submit', async (event) => {  //async stops search_ from running before the info arrives
    event.preventDefault(); // Prevents the page from reloading 
    const showId_ = input_.value.trim(); //trim removes space at end. Value = gets the user input

    if (!showId_) return;

    await fetch('http://localhost:3000/api/registerShowDB_', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({showId_: showId_}) // Convert JS object to JSON string
    })
    await displayShow_(showId_) //pauses the function untill displayShow_ runs 


});

async function getShowData_(showId_) {
    // token needed for retriving information ⤵
    const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZ2UiOiIiLCJhcGlrZXkiOiI3YjUzZmFhMC03MzI5LTRmOGItOThmYS00ZmVlMzYyYzFmMTAiLCJjb21tdW5pdHlfc3VwcG9ydGVkIjpmYWxzZSwiZXhwIjoxNzc4NzA0MDgwLCJnZW5kZXIiOiIiLCJoaXRzX3Blcl9kYXkiOjEwMDAwMDAwMCwiaGl0c19wZXJfbW9udGgiOjEwMDAwMDAwMCwiaWQiOiIyOTg0MDU5IiwiaXNfbW9kIjpmYWxzZSwiaXNfc3lzdGVtX2tleSI6ZmFsc2UsImlzX3RydXN0ZWQiOmZhbHNlLCJwaW4iOm51bGwsInJvbGVzIjpbXSwidGVuYW50IjoidHZkYiIsInV1aWQiOiIifQ.e1qg4pc46lysJF0fq31_2vUulJZRPOXbLDzxpyI5nPF9OiYKrtlXV1LECsNPkxb8h18bryWte_eduikWwBfBE9tiY_n2__PpDS_FB7buct3ki32y6HUtX1AUDNIr6XvtpGjU0OjFvbnNd3Au9zGb5pZNdiqqY61QJzYEDSKXOtEM2Q-zSLxJ1tDcqBT3tM26nr8rNp-JoOB7yT6fYiTHl2JXvVyfrCq7GCWNVOPj9KbSFXHEtUQCifXki9bBVMMCYoLteVm1IKcWTYodeGN7AXYKhdsncRHxh9Rba7C78tdPsf-sgrxFrMlRnPGCqPVxjTdfyx56mpixW2IAPsJOPv6FxqJbyw5do9XURIhqAoPTyywtYTzt8xZcJ2HMmTo9sgMZJkw8U0ch_UQwY70qjZzZfHeLsG-IpDtmGfNNLAMfUz67YIklbJ-vjQKxOjdz86VUVooPE5YfWvp_IfHSEE9yLp5DwBctTrcD9SCF3gzvUbqIgA4h7Z3bxW9fnd3-6DRcfaU2pts01rL9vG4r-BnmJJCx090AYTTp-vVt80fDgE3QTwoooyyeBVn0CPH2lENIk1XFnWVxKcX2Nlaes5lFGRm0cZadPuMjKNs5D82GLqL4pNV7NLAxsr7MAUKycAU15iQCCONfcKElZjWs1EpIpKDTlOJwAoB0zeRZBDs";
    // getting the info from the API ⤵
    const res = await fetch(`https://api4.thetvdb.com/v4/search?query=${encodeURIComponent(showId_)}&type=series`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    const data = await res.json(); 

    if (data.data && data.data.length > 0) {
        const correctId = data.data[0].tvdb_id;
        const seriesRes = await fetch(`https://api4.thetvdb.com/v4/series/${correctId}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        return await seriesRes.json();
    }

    // console.log("Your shows:", data); // <-- This will print the toke
    // return data;
}

async function displayShow_(showId_) {
    const show_ = await getShowData_(showId_);

    const container_ = document.getElementById('series');
    container_.innerHTML = ""; // Clear previous content

    console.log("Your displayShow_ is:", show_);

    const showData_ = show_.data

    const title_ = showData_.name || showData_.seriesName || "Title not found";

        let posterURL_= "";
    if (showData_.image) {
        posterURL_ = showData_.image;
    } else if (showData_.artworks && showData_.artworks.length > 0) {
        posterURL_ = showData_.artworks[0].image;
    }

    const bio_ = showData_.overview || showData_.description || "No Description";

    const titleElem_ = document.createElement('h2');
    titleElem_.textContent = title_;
    container_.appendChild(titleElem_);

    if (posterURL_) {
        const img_ = document.createElement('img');
        img_.src = posterURL_;
        img_.alt = title_;
        img_.style.width = '200px';
        container_.appendChild(img_);
    }

    const bioElem_ = document.createElement('p');
    bioElem_.textContent = bio_;
    container_.appendChild(bioElem_);
}