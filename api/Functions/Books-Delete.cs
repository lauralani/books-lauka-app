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
            [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "public/books/{id}")] HttpRequest req, string id)
        {
            return new OkObjectResult(id);
        }
    }
}
