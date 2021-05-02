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
    var principal;

    console.log(window.location);
    try {
        principal = await fetch("/.auth/me", { mode: "same-origin" }).json()
    } catch (error) {
        let returnurl = window.location.origin + "/admin/index.html";
        window.location = "/.auth/login/aad?post_login_redirect_uri=" + returnurl;
    }

    window.location = "/admin/index.html";

}
