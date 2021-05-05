async function onloadbooks() {
    var book = await getbook();

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
    }
    else {
        document.title = "Details: " + book?.Title;
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

async function testpost() {
    await fetch("/api/backend/books", { mode: "same-origin", method: "POST" });
}

async function testput(id) {
    await fetch("/api/backend/books/" + id, { mode: "same-origin", method: "PUT" });
}

async function testdelete(id) {
    await fetch("/api/backend/books/" + id, { mode: "same-origin", method: "DELETE" });
}

async function testget(id) {
    id ?
        await fetch("/api/public/books/" + id, { mode: "same-origin", method: "GET" }) :
        await fetch("/api/public/books", { mode: "same-origin", method: "GET" });

}
