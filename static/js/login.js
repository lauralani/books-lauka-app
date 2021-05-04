async function onloginpageload() {
    //await setloginname();
    //await getreferrer();
    await handlelogin();
}

async function setloginname() {
    fetch("/.auth/me", { mode: "same-origin" })
        .then(body => body.json())
        .then(response => {
            if (response.clientPrincipal) {
                document.getElementById("loginname").innerText = response?.clientPrincipal?.userDetails;
            }
            else {
                document.getElementById("loginname").innerText = "not logged in";
            }
        })
}

async function getreferrer() {
    const referrer = document.referrer;
    document.getElementById("referrer").innerText = referrer;
}
async function handlelogin() {
    var principal, request;

    console.log(window.location);
    try {
        request = await fetch("/.auth/me", { mode: "same-origin" });
        principal = await request.json();
    } catch (error) {
        console.log("error getting login info");
    }
    console.log(principal);
    let returnurl = window.location.origin + "/admin/dashboard";
    if (principal.clientPrincipal === null) 
        window.location = "/.auth/login/aad?post_login_redirect_uri=" + returnurl;
    else
        window.location = returnurl;
}
