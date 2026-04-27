// // bearer token activated 08.04.2026
// async function getBearerToken() {
//     const res = await fetch('https://api4.thetvdb.com/v4/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ apikey: '7b53faa0-7329-4f8b-98fa-4fee362c1f10' })
//     });
//     const data = await res.json();
//     const token = data.data.token;
//     // The token is usually in data.token
//     console.log("Your Bearer token:", token); // <-- This will print the token in your browser's console
//     return token;
// }

// getBearerToken();

// async function getSomeData() {
//     const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZ2UiOiIiLCJhcGlrZXkiOiI3YjUzZmFhMC03MzI5LTRmOGItOThmYS00ZmVlMzYyYzFmMTAiLCJjb21tdW5pdHlfc3VwcG9ydGVkIjpmYWxzZSwiZXhwIjoxNzc5ODk2NjM0LCJnZW5kZXIiOiIiLCJoaXRzX3Blcl9kYXkiOjEwMDAwMDAwMCwiaGl0c19wZXJfbW9udGgiOjEwMDAwMDAwMCwiaWQiOiIyOTg0MDU5IiwiaXNfbW9kIjpmYWxzZSwiaXNfc3lzdGVtX2tleSI6ZmFsc2UsImlzX3RydXN0ZWQiOmZhbHNlLCJwaW4iOm51bGwsInJvbGVzIjpbXSwidGVuYW50IjoidHZkYiIsInV1aWQiOiIifQ.gN0l9meWu2elrSVwDmVszl2Z0OfbRQUa_1xznVg9wjLecLAfBKE1MZuPFgqMB4J62Ul9CT877VUDbQ6b159xfOI2UO7rio1XQ1UkiF3iuile1SkyW03AsXgQA63DLLCuF5vABhldHNI5XU1dPlbxiTgY4EV8VwOcjAzNw6Xi5VYQvGiRM_d8opn2vJ58dVms5GV2pTsxbU5DnBw-O25rsOo2B0pUsaZ-Nx_7JUsFIGAcG3elJqBDwY7kGXf6MeGJ2uUcbCS6FhFzsPFyMBOIi2a0M42s4fQ3LZy4YgHm3bVRL7SGEiGH9ZzqlLEr6NHA971zETf5HMolzYEegtUUSahCKXsGzYjMTJYhpD-74x8lb72xf63q8KJ2yXVvM8-Y1cahzsF6ia1Ej-PtD9oy0uqKGB3JpPffzGo_6KxPfut2ICixXrfAelVmK7ZHDecBNTIiTzXRItbIza5CwJCXUy9UIgSnHrScE346-gsit8OBBqyuBVFynJvoE8Q91PGNg24-p4A24_-FhQ216A2eFAdPwwovPeIssYT5y5r31sU1Ak0_zs8uzyS7oASBCwpAn02mGDc5bit9n7bO1KZ2xZ60KdB1VmfW0MFltYMA_DptqVwr96-54Q5bOXgp_8-XaCNOhA5eNhh9eSxzTlAL9uoWanitinrnUhw_zZK0Hjg";
//     const res = await fetch('https://api4.thetvdb.com/v4/series/448176', {
//         headers: {
//             'Authorization': 'Bearer ' + token
//         }
//     });
//     const data = await res.json();
//     console.log("Your shows:", data); // <-- This will print the toke
//     return data;
// }

// getSomeData();