/*
1. Hent fra app.js bruker id, status og show id
2. bruk show id til å hente info om show
3. vis info om show til bruker
4. seperer show etter status?
*/
/* 
Plan: 
- User can register a show they have 
    ◻ Watchd 
    ◻ Will watch
    ◻ Are watching
(using status tabell)
◻ Registerd show is vieweble on user dashboard
    ◻ and stays there

How??
X Show id (from api) gets registerd into the database. 
- Using similure code as the one used for registring shows in 'show' reposetory
◻ Show id in database used to retrive the show info for user


code idea:
for every show watched create a box
In box : picture | name | more info

when on more info : register show??
*/
async function statusSeries_() {
    const get_ = await fetch(`/api/checkSeriesStaus_`);
    const getSeries_ = await get_.json();
    console.log(getSeries_);

    for (const series_ of getSeries_) {
        console.log(series_.serie_id);

        const seriesId_ = series_.serie_id

        const token_ = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZ2UiOiIiLCJhcGlrZXkiOiI3YjUzZmFhMC03MzI5LTRmOGItOThmYS00ZmVlMzYyYzFmMTAiLCJjb21tdW5pdHlfc3VwcG9ydGVkIjpmYWxzZSwiZXhwIjoxNzc5ODk2NjM0LCJnZW5kZXIiOiIiLCJoaXRzX3Blcl9kYXkiOjEwMDAwMDAwMCwiaGl0c19wZXJfbW9udGgiOjEwMDAwMDAwMCwiaWQiOiIyOTg0MDU5IiwiaXNfbW9kIjpmYWxzZSwiaXNfc3lzdGVtX2tleSI6ZmFsc2UsImlzX3RydXN0ZWQiOmZhbHNlLCJwaW4iOm51bGwsInJvbGVzIjpbXSwidGVuYW50IjoidHZkYiIsInV1aWQiOiIifQ.gN0l9meWu2elrSVwDmVszl2Z0OfbRQUa_1xznVg9wjLecLAfBKE1MZuPFgqMB4J62Ul9CT877VUDbQ6b159xfOI2UO7rio1XQ1UkiF3iuile1SkyW03AsXgQA63DLLCuF5vABhldHNI5XU1dPlbxiTgY4EV8VwOcjAzNw6Xi5VYQvGiRM_d8opn2vJ58dVms5GV2pTsxbU5DnBw-O25rsOo2B0pUsaZ-Nx_7JUsFIGAcG3elJqBDwY7kGXf6MeGJ2uUcbCS6FhFzsPFyMBOIi2a0M42s4fQ3LZy4YgHm3bVRL7SGEiGH9ZzqlLEr6NHA971zETf5HMolzYEegtUUSahCKXsGzYjMTJYhpD-74x8lb72xf63q8KJ2yXVvM8-Y1cahzsF6ia1Ej-PtD9oy0uqKGB3JpPffzGo_6KxPfut2ICixXrfAelVmK7ZHDecBNTIiTzXRItbIza5CwJCXUy9UIgSnHrScE346-gsit8OBBqyuBVFynJvoE8Q91PGNg24-p4A24_-FhQ216A2eFAdPwwovPeIssYT5y5r31sU1Ak0_zs8uzyS7oASBCwpAn02mGDc5bit9n7bO1KZ2xZ60KdB1VmfW0MFltYMA_DptqVwr96-54Q5bOXgp_8-XaCNOhA5eNhh9eSxzTlAL9uoWanitinrnUhw_zZK0Hjg";
        // gets an array of series matching user input with basic info from api⤵ 
        const arrayRes_ = await fetch(`https://api4.thetvdb.com/v4/series/${seriesId_}`, { //encodeURIComponent = remove white space at start/end.
            headers: {
                'Authorization': 'Bearer ' + token_ //needed to get info
            }
        });

        const data_ = await arrayRes_.json();
        const allData_ = data_.data // to avoid having to wright out data_.data
        // console.log(allData_);

        const container_ = document.getElementById('statusSeries'); // use div from dashboard.html
        // container_.innerHTML = ""; // Clear previous content

        const title_ = allData_.name || allData_.seriesName || "Title not found"; //check in order if there is data in the different one. if not use "title not found"
        // console.log(allData_.name);

        let posterURL_= ""; //clear content
        if (allData_.image) { //see if the shows image is availeble
            posterURL_ = allData_.image; //if so, use image, if not then see if:
        } else if (allData_.artworks && allData_.artworks.length > 0) { // show artwork is not empty AND it has at least one item in it
            posterURL_ = allData_.artworks[0].image; //if so use the first item in show artwork array
        }

        const bio_ = allData_.overview || allData_.description || "No Description"; //same as above just differnet names ⤴

        const titleElem_ = document.createElement('h2'); // create a header for title
        titleElem_.textContent = title_; //the text in titleElem_ is the info gotten in title_
        container_.appendChild(titleElem_); // make it the child of the div so it's inside

        const showCard_ = document.createElement('div');
        showCard_.className = 'show-card';

        const body_ = document.createElement('div');
        body_.className = 'show-card-body';

        if (posterURL_) {
            const img_ = document.createElement('img'); //create an img for the poster
            img_.src = posterURL_; //turn into a src so image will appear
            img_.alt = title_; //the alternative text is the show title
            // img_.style.width = '200px'; //choose size
            img_.className = 'show-poster';
            container_.appendChild(img_); // make it the child of the div so it's inside
        }

        const bioElem_ = document.createElement('p'); //same as above with different name ⤴
        bioElem_.textContent = bio_;
        bioElem_.className = 'show-bio';
        // container_.appendChild(bioElem_);

        body_.appendChild(bioElem_);
        showCard_.appendChild(titleElem_);
        showCard_.appendChild(body_);
        container_.appendChild(showCard_)
    }

};
statusSeries_();
