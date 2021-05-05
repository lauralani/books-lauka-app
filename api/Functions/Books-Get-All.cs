using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Books.Classes;
using System.Collections.Generic;
using System.Linq;

namespace Books
{
    public static class BooksGetAll
    {
        [FunctionName("books-get-all")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "public/books")] HttpRequest req)
        {
            TableDatabase db = new TableDatabase(Environment.GetEnvironmentVariable("APP_STORAGEACCOUNT"), "test");
            List<Book> books = await db.GetAllItemsAsync<Book>();

            if (!string.IsNullOrWhiteSpace(req.Query["sortby"]))
            {
                string sortby = req.Query["sortby"];
                switch (sortby.ToLowerInvariant())
                {
                    case "author":
                        books = books.OrderBy(o => o.Author).ToList();
                        break;
                    case "genre":
                        books = books.OrderBy(o => o.Genre).ToList();
                        break;
                    case "series":
                        books = books.OrderBy(o => o.Series).ToList();
                        break;
                    case "universe":
                        books = books.OrderBy(o => o.Universe).ToList();
                        break;
                    default:
                        books = books.OrderBy(o => o.Title).ToList();
                        break;
                }
            }
            else
                books = books.OrderBy(o => o.Title).ToList();

            if (!string.IsNullOrWhiteSpace(req.Query["last"]))
            {
                int last;
                if (!int.TryParse(req.Query["last"], out last))
                    return new BadRequestObjectResult("Query \"last\" must be a whole number!");
                List<Book> lastbooks = books.Take<Book>(last).ToList();

                return new ContentResult { Content = JsonConvert.SerializeObject(lastbooks), ContentType = "application/json", StatusCode = 200 };
            }
            return new ContentResult { Content = JsonConvert.SerializeObject(books), ContentType = "application/json", StatusCode = 200 };
        }
    }
}
