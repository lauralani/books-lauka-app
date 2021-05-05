var book;


async function onloaddelete() {
    book = await getbook();
    await populatepage(book);
}

async function getbook() {
    var body;
    var querystring = window.location.search.split("?")[1];
    if (querystring === undefined)
        return null;

    try {
        response = await (await fetch("/api/public/books/" + querystring, { mode: "same-origin" })).json();
    } catch (error) {
        return null;
    }
    return response;
}

async function populatepage(book) {
    if (book === undefined || book === null) {
        document.getElementById("input-id").value = "Invalid ID!";
        document.getElementById("button-confirm").disabled = true;
    }
    else {
        document.getElementById("input-id").value = book?.ID;
        document.getElementById("input-title").value = book?.Title;
        document.getElementById("input-author").value = book?.Author;
        document.getElementById("input-series").value = book?.Series;
        document.getElementById("input-universe").value = book?.Universe;
        document.getElementById("input-genre").value = book?.Genre;
        document.getElementById("input-language").value = book?.Language;
        document.getElementById("input-read").checked = book?.Read || false;
        document.getElementById("input-lent").checked = book?.Lent || false;
    }
}

async function deletesubmit() {
    document.getElementById("button-confirm").textContent = "Loading...";
    document.getElementById("button-confirm").disabled = true;

    var response = await fetch("/api/backend/books/" + book.ID, {
        mode: "same-origin",
        method: "DELETE"
    });

    if (response.ok) {
        window.location = "/admin/dashboard";
    }
    else {
        document.getElementById("button-confirm").textContent = "something went wrong!";
        console.log(response);
    }
}

async function deletecancel() {
    window.location = "/admin/dashboard";
}
