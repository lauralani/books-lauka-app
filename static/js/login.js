async function onloginpageload() {
    await setloginname();
    await getreferrer();
}

async function setloginname() {
    fetch("/.auth/me",{mode: "same-origin"})
    .then(body => body.json())
    .then(response => {
        if (response.clientPrincipal)
        {
            document.getElementById("loginname").innerText = response?.clientPrincipal?.userDetails;
        }
        else
        {
            document.getElementById("loginname").innerText = "not logged in";
        }
    })
}

async function getreferrer() {
    const referrer = document.referrer;
    document.getElementById("referrer").innerText = referrer;
}
