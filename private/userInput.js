/* 
All code that allows users to set a status on a show

User uses form to say what show they are registering
User uses a dropdown to choose watching, watched, or watch
User submits form
Form is sent to this document
Info from form is turnd into values
Values are sent through the search api and given an id
Id is sent to app.js file
value is sent to app.js
Value and id is put into database 
User id is put into database (using session id)

Later:
Each show can have their status changed by user.



<div id="">
        <form id="registerShow_">
            <label for="status">Choose an option:</label>
            <select id="chooseStatus_" name="status">
                <option value="now">watching</option>
                <option value="have">watched</option>
                <option value="will">watch</option>
            </select>
            <input type="text" name="showName" id="userRegisterShow_">
            <button type="submit" id="buttonRegister_" >Search</button>
        </form>
    </div>
*/

const form_ = document.getElementById('registerShow_'); //form
const registerdInput_ = document.getElementById('userRegisterShow_'); //show name
const dropdown_ = document.getElementById('chooseStatus_'); //status
const button_ = document.getElementById('buttonRegister_'); //button

form_.addEventListener('submit', async (event) => {
    event.preventDefault();
    const showRegisterd_ = registerdInput_.value.trim();
    const status_ = dropdown_.value.trim();

    if (!showRegisterd_) return;

    const getShowInfo_ = await gettingShowID_(showRegisterd_);
    if (getShowInfo_ && getShowInfo_.data) { //if both are true then continue
        const showId_ = getShowInfo_.data.id || getShowInfo_.data.tvdb_id; //see if either id or tvdb_id is availeble from getShowData_

        await fetch('http://localhost:3000/api/registerShowDB_', { //send the info to app.js
            method: 'POST', //send using POST 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({databaseShowId_: showId_, status_: status_}) // Convert JS object to JSON string
        });
    }
});

async function gettingShowID_(showName_) {
    // token needed for retriving information ⤵
    const token_ = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZ2UiOiIiLCJhcGlrZXkiOiI3YjUzZmFhMC03MzI5LTRmOGItOThmYS00ZmVlMzYyYzFmMTAiLCJjb21tdW5pdHlfc3VwcG9ydGVkIjpmYWxzZSwiZXhwIjoxNzc5ODk2NjM0LCJnZW5kZXIiOiIiLCJoaXRzX3Blcl9kYXkiOjEwMDAwMDAwMCwiaGl0c19wZXJfbW9udGgiOjEwMDAwMDAwMCwiaWQiOiIyOTg0MDU5IiwiaXNfbW9kIjpmYWxzZSwiaXNfc3lzdGVtX2tleSI6ZmFsc2UsImlzX3RydXN0ZWQiOmZhbHNlLCJwaW4iOm51bGwsInJvbGVzIjpbXSwidGVuYW50IjoidHZkYiIsInV1aWQiOiIifQ.gN0l9meWu2elrSVwDmVszl2Z0OfbRQUa_1xznVg9wjLecLAfBKE1MZuPFgqMB4J62Ul9CT877VUDbQ6b159xfOI2UO7rio1XQ1UkiF3iuile1SkyW03AsXgQA63DLLCuF5vABhldHNI5XU1dPlbxiTgY4EV8VwOcjAzNw6Xi5VYQvGiRM_d8opn2vJ58dVms5GV2pTsxbU5DnBw-O25rsOo2B0pUsaZ-Nx_7JUsFIGAcG3elJqBDwY7kGXf6MeGJ2uUcbCS6FhFzsPFyMBOIi2a0M42s4fQ3LZy4YgHm3bVRL7SGEiGH9ZzqlLEr6NHA971zETf5HMolzYEegtUUSahCKXsGzYjMTJYhpD-74x8lb72xf63q8KJ2yXVvM8-Y1cahzsF6ia1Ej-PtD9oy0uqKGB3JpPffzGo_6KxPfut2ICixXrfAelVmK7ZHDecBNTIiTzXRItbIza5CwJCXUy9UIgSnHrScE346-gsit8OBBqyuBVFynJvoE8Q91PGNg24-p4A24_-FhQ216A2eFAdPwwovPeIssYT5y5r31sU1Ak0_zs8uzyS7oASBCwpAn02mGDc5bit9n7bO1KZ2xZ60KdB1VmfW0MFltYMA_DptqVwr96-54Q5bOXgp_8-XaCNOhA5eNhh9eSxzTlAL9uoWanitinrnUhw_zZK0Hjg";
    
    // gets an array of series matching user input with basic info from api⤵ 
    const arrayRes_ = await fetch(`https://api4.thetvdb.com/v4/search?query=${encodeURIComponent(showName_)}&type=series`, { //encodeURIComponent = remove white space at start/end.
        headers: {
            'Authorization': 'Bearer ' + token_ //needed to get info
        }
    });
    
    const data_ = await arrayRes_.json();

    if (data_.data && data_.data.length > 0) { //check if the search resault exist
    const databaseShowId_ = data_.data[0].tvdb_id;
    const seriesRes_ = await fetch(`https://api4.thetvdb.com/v4/series/${databaseShowId_}`, {
        headers: {
                'Authorization': 'Bearer ' + token_
            }
        });
        return await seriesRes_.json();
    }
    return null;
}


