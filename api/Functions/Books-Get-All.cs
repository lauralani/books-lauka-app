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
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "books")] HttpRequest req)
        {
            TableDatabase db = new TableDatabase(Environment.GetEnvironmentVariable("APP_STORAGEACCOUNT"), "books");
            List<Book> books = db.GetAllBooks().ToList();


            return new ContentResult { Content = JsonConvert.SerializeObject(books), ContentType = "application/json", StatusCode = 200 };
        }
    }
}
