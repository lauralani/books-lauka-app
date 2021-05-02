using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Books.Classes;

namespace Books
{
    public static class BooksGet
    {
        [FunctionName("books-get")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "public/books/{id}")] HttpRequest req, string id)
        {
            TableDatabase db = new TableDatabase(Environment.GetEnvironmentVariable("APP_STORAGEACCOUNT"), "books");
            Book book = await db.GetItemByKeyAsync<Book>(id);

            if (book == null)
                return new NotFoundResult();

            
            return new ContentResult { Content = JsonConvert.SerializeObject(book), ContentType = "application/json", StatusCode = 200 };
        }
    }
}
