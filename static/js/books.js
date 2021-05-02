async function onloadbooks() {
    console.log(await getbook())
}

async function getquerystring() {
    var fullpath = window.location.pathname;
    var fragments = fullpath.split("/");
    return fragments[fragments.length - 1];
}

async function getbook() {
    var body;
    var querystring = await getquerystring();
    if (querystring === null)
        return null;

    try {
        response = await fetch("/api/public/books/" + querystring, { mode: "same-origin" }).json();
    } catch (error) {
        return null;
    }
    return response;
}

async function testpost() {
    await fetch("/api/admin/books", {mode: "same-origin", method: "POST"});
}

async function testput() {
    await fetch("/api/admin/books/asdsadsadsad", {mode: "same-origin", method: "PUT"});
}

async function testdelete() {
    await fetch("/api/admin/books/asdsadsadsad", {mode: "same-origin", method: "DELETE"});
}

async function testget(id) {
    await fetch("/api/public/books/" + id, {mode: "same-origin", method: "GET"});
}
