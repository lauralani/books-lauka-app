async function onloadbooks() {
    var book = await getbook();
    document.getElementById("query").innerText = book?.Title;
}

async function getquerystring() {
    var fullpath = window.location.pathname;
    var fragments = fullpath.split("/");
    return fragments[fragments.length - 1];
}

async function getbook() {
    var body;
    var querystring = window.location.search.split("?")[1];
    if (querystring === null)
        return null;

    try {
        response = await (await fetch("/api/public/books/" + querystring, { mode: "same-origin" })).json();
    } catch (error) {
        return null;
    }
    return response;
}

async function testpost() {
    await fetch("/api/backend/books", {mode: "same-origin", method: "POST"});
}

async function testput(id) {
    await fetch("/api/backend/books/" + id, {mode: "same-origin", method: "PUT"});
}

async function testdelete(id) {
    await fetch("/api/backend/books/" + id, {mode: "same-origin", method: "DELETE"});
}

async function testget(id) {
    await fetch("/api/public/books/" + id, {mode: "same-origin", method: "GET"});
}
