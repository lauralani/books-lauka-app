async function submitform() {
    var newbook = {
        Author: document.getElementById("input-author").value,
        Genre: document.getElementById("input-genre").value,
        Title: document.getElementById("input-title").value,
        Universe: document.getElementById("input-universe").value,
        Series: document.getElementById("input-series").value,
        Language: document.getElementById("input-language").value,
        Read: document.getElementById("input-read").checked,
        Lent: document.getElementById("input-lent").checked
    };

    return request = await fetch("/api/backend/books", {
        method: "POST",
        mode: "same-origin",
        body: JSON.stringify(newbook)
    });
}


async function addbook() {
    setformdisabled(true);
    document.getElementById("button-add-single").textContent = "Loading...";
    document.getElementById("button-add-single").disabled = true;
    var response = await submitform();

    if (response.ok) {
        window.location = "/admin/dashboard";
    }
    else {
        document.getElementById("button-add-single").textContent = "something went wrong!";
        console.log(response);
    }

}

async function addmultiplebooks() {
    setformdisabled(true);
    var buttontext = document.getElementById("button-add-multiple").textContent;
    document.getElementById("button-add-multiple").textContent = "Loading...";
    document.getElementById("button-add-multiple").disabled = true;
    var response = await submitform();
    if (response.ok) {
        await clearform();
        await setformdisabled(false);
        document.getElementById("button-add-multiple").textContent = buttontext;
        document.getElementById("button-add-multiple").disabled = false;
    }
    else {
        document.getElementById("button-add-multiple").textContent = "something went wrong!";
        console.log(response);
    }

}

async function setformdisabled(bool) {
    document.getElementById("input-author").disabled = bool;
    document.getElementById("input-genre").disabled = bool;
    document.getElementById("input-title").disabled = bool;
    document.getElementById("input-universe").disabled = bool;
    document.getElementById("input-series").disabled = bool;
    document.getElementById("input-language").disabled = bool;
    document.getElementById("input-read").disabled = bool;
    document.getElementById("input-lent").disabled = bool;
}

async function clearform() {
    document.getElementById("input-author").value = null;
    document.getElementById("input-genre").value = null;
    document.getElementById("input-title").value = null;
    document.getElementById("input-universe").value = null;
    document.getElementById("input-series").value = null;
    document.getElementById("input-language").value = null;
    document.getElementById("input-read").checked = false;
    document.getElementById("input-lent").checked = false;
}
