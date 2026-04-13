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
    const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZ2UiOiIiLCJhcGlrZXkiOiI3YjUzZmFhMC03MzI5LTRmOGItOThmYS00ZmVlMzYyYzFmMTAiLCJjb21tdW5pdHlfc3VwcG9ydGVkIjpmYWxzZSwiZXhwIjoxNzc4NzA0MDgwLCJnZW5kZXIiOiIiLCJoaXRzX3Blcl9kYXkiOjEwMDAwMDAwMCwiaGl0c19wZXJfbW9udGgiOjEwMDAwMDAwMCwiaWQiOiIyOTg0MDU5IiwiaXNfbW9kIjpmYWxzZSwiaXNfc3lzdGVtX2tleSI6ZmFsc2UsImlzX3RydXN0ZWQiOmZhbHNlLCJwaW4iOm51bGwsInJvbGVzIjpbXSwidGVuYW50IjoidHZkYiIsInV1aWQiOiIifQ.e1qg4pc46lysJF0fq31_2vUulJZRPOXbLDzxpyI5nPF9OiYKrtlXV1LECsNPkxb8h18bryWte_eduikWwBfBE9tiY_n2__PpDS_FB7buct3ki32y6HUtX1AUDNIr6XvtpGjU0OjFvbnNd3Au9zGb5pZNdiqqY61QJzYEDSKXOtEM2Q-zSLxJ1tDcqBT3tM26nr8rNp-JoOB7yT6fYiTHl2JXvVyfrCq7GCWNVOPj9KbSFXHEtUQCifXki9bBVMMCYoLteVm1IKcWTYodeGN7AXYKhdsncRHxh9Rba7C78tdPsf-sgrxFrMlRnPGCqPVxjTdfyx56mpixW2IAPsJOPv6FxqJbyw5do9XURIhqAoPTyywtYTzt8xZcJ2HMmTo9sgMZJkw8U0ch_UQwY70qjZzZfHeLsG-IpDtmGfNNLAMfUz67YIklbJ-vjQKxOjdz86VUVooPE5YfWvp_IfHSEE9yLp5DwBctTrcD9SCF3gzvUbqIgA4h7Z3bxW9fnd3-6DRcfaU2pts01rL9vG4r-BnmJJCx090AYTTp-vVt80fDgE3QTwoooyyeBVn0CPH2lENIk1XFnWVxKcX2Nlaes5lFGRm0cZadPuMjKNs5D82GLqL4pNV7NLAxsr7MAUKycAU15iQCCONfcKElZjWs1EpIpKDTlOJwAoB0zeRZBDs";
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