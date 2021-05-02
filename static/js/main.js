async function onloadmain() {
    await populatetable();
}

async function populatetable() {
    const books = await (await fetch("/api/books", { mode: "same-origin" })).json();

    if (books === null)
    {
        return 1;
    }

    const template = document.getElementById("template-tablerow");
    const container = document.getElementById("table-wrapper").querySelector("tbody");
    
    container.innerHTML = null;

    books.forEach(book => {
        let clone = template.content.cloneNode(true);
        clone.querySelector("#td-title").innerText = book.Title;
        clone.querySelector("#td-author").innerText = book.Author;
        clone.querySelector("#td-series").innerText = book.Series;
        clone.querySelector("#td-language").innerText = book.Language;
        if (book.Read)
            clone.querySelector("#td-read").innerText = "✔️";
        else
            clone.querySelector("#td-read").innerText = "❌";

        container.appendChild(clone);
    });
    
    console.log(books);
}
