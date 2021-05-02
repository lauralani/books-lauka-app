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
        clone.querySelector("#tabledata-title").innerText = book.Title;
        clone.querySelector("#tabledata-author").innerText = book.Author;
        clone.querySelector("#tabledata-series").innerText = book.Series;
        clone.querySelector("#tabledata-language").innerText = book.Language;
        if (book.Read)
            clone.querySelector("#tabledata-read").innerText = "✔️";
        else
            clone.querySelector("#tabledata-read").innerText = "❌";

        container.appendChild(clone);
    });
    
    console.log(books);
}
