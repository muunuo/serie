// Working on: trying to make it so user can serch a id/name and get the show they want.

let UserSearch_ = document.getElementById('searchForShow');
let UserSearchShow_ = document.addEventListener('submit', UserSearch_);

const SearchShow_ = document.getElementById('showName').value;

let showId = SearchShow_

async function getShowData_(showId) {
    const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZ2UiOiIiLCJhcGlrZXkiOiI3YjUzZmFhMC03MzI5LTRmOGItOThmYS00ZmVlMzYyYzFmMTAiLCJjb21tdW5pdHlfc3VwcG9ydGVkIjpmYWxzZSwiZXhwIjoxNzc4NzA0MDgwLCJnZW5kZXIiOiIiLCJoaXRzX3Blcl9kYXkiOjEwMDAwMDAwMCwiaGl0c19wZXJfbW9udGgiOjEwMDAwMDAwMCwiaWQiOiIyOTg0MDU5IiwiaXNfbW9kIjpmYWxzZSwiaXNfc3lzdGVtX2tleSI6ZmFsc2UsImlzX3RydXN0ZWQiOmZhbHNlLCJwaW4iOm51bGwsInJvbGVzIjpbXSwidGVuYW50IjoidHZkYiIsInV1aWQiOiIifQ.e1qg4pc46lysJF0fq31_2vUulJZRPOXbLDzxpyI5nPF9OiYKrtlXV1LECsNPkxb8h18bryWte_eduikWwBfBE9tiY_n2__PpDS_FB7buct3ki32y6HUtX1AUDNIr6XvtpGjU0OjFvbnNd3Au9zGb5pZNdiqqY61QJzYEDSKXOtEM2Q-zSLxJ1tDcqBT3tM26nr8rNp-JoOB7yT6fYiTHl2JXvVyfrCq7GCWNVOPj9KbSFXHEtUQCifXki9bBVMMCYoLteVm1IKcWTYodeGN7AXYKhdsncRHxh9Rba7C78tdPsf-sgrxFrMlRnPGCqPVxjTdfyx56mpixW2IAPsJOPv6FxqJbyw5do9XURIhqAoPTyywtYTzt8xZcJ2HMmTo9sgMZJkw8U0ch_UQwY70qjZzZfHeLsG-IpDtmGfNNLAMfUz67YIklbJ-vjQKxOjdz86VUVooPE5YfWvp_IfHSEE9yLp5DwBctTrcD9SCF3gzvUbqIgA4h7Z3bxW9fnd3-6DRcfaU2pts01rL9vG4r-BnmJJCx090AYTTp-vVt80fDgE3QTwoooyyeBVn0CPH2lENIk1XFnWVxKcX2Nlaes5lFGRm0cZadPuMjKNs5D82GLqL4pNV7NLAxsr7MAUKycAU15iQCCONfcKElZjWs1EpIpKDTlOJwAoB0zeRZBDs";
    const res = await fetch(`https://api4.thetvdb.com/v4/series/${showId}`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    const data = await res.json();
    console.log("Your shows:", data); // <-- This will print the toke
    return data;
}

async function displayShow_(showId) {
    const show_ = await getShowData_(showId);

    const container_ = document.getElementById('series');
    container_.innerHTML = ""; // Clear previous content

    // console.log("Your displayShow_ is:", show_);

    const showData_ = show_.data

    const title_ = showData_.name || showData_.seriesName || "Title not found";

    // const posterURL_ = "";
    // posterURL_ = showData_.image || "No image found";
    
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

displayShow_(100001);
getShowData_(100001);
