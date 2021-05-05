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
    public static class BooksDelete
    {
        [FunctionName("books-delete")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "backend/books/{bookid}")] HttpRequest req, string bookid)
        {
            TableDatabase db = new TableDatabase(Environment.GetEnvironmentVariable("APP_COSMOSDB_CONNECTION"), Environment.GetEnvironmentVariable("APP_COSMOSDB_TABLE"));
            Book requestedbook = await db.GetItemByIDAsync<Book>(bookid);

            if (requestedbook == null)
                return new NotFoundResult();
            
            await db.DeleteItemAsync<Book>(requestedbook);

            return new NoContentResult();
        }
    }
}
