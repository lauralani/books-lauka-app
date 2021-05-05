var book;


async function onloadedit() {
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

async function editsubmit() {
    var newbook = {
        Author: document.getElementById("input-author").value,
        Genre: document.getElementById("input-genre").value,
        Title: document.getElementById("input-title").value,
        Universe: document.getElementById("input-universe").value,
        Series: document.getElementById("input-series").value,
        Language: document.getElementById("input-language").value,
        Read: document.getElementById("input-read").checked,
        Lent: document.getElementById("input-lent").checked,
        RowKey: book.RowKey,
        PartitionKey: book.PartitionKey
    };

    document.getElementById("button-save").textContent = "Loading...";
    document.getElementById("button-save").disabled = true;

    var response = await fetch("/api/backend/books/" + book.ID, {
        mode: "same-origin",
        method: "PUT",
        body: JSON.stringify(newbook)
    });

    if (response.ok) {
        window.location = "/admin/dashboard";
    }
    else {
        document.getElementById("button-save").textContent = "something went wrong!";
        console.log(response);
    }
}

async function editcancel() {
    window.location = "/admin/dashboard";
}
