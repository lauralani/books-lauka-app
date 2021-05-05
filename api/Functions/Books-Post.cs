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
    public static class BooksPost
    {
        [FunctionName("books-post")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "backend/books")] HttpRequest req)
        {
            System.IO.StreamReader sr = new System.IO.StreamReader(req.Body);
            string requestbody = await sr.ReadToEndAsync();
            Book newbook;

            try
            {
                newbook = JsonConvert.DeserializeObject<Book>(requestbody);
            }
            catch
            {
                return new BadRequestResult();
            }

            newbook.RowKey = Guid.NewGuid().ToString().Split("-")[0];
            newbook.PartitionKey = newbook.Title.Substring(0, 1).ToLowerInvariant();
            newbook.Timestamp = DateTime.Now;
            
            TableDatabase db = new TableDatabase(Environment.GetEnvironmentVariable("APP_COSMOSDB_CONNECTION"), Environment.GetEnvironmentVariable("APP_COSMOSDB_TABLE"));

            await db.AddItemAsync<Book>(newbook);

            return new CreatedResult($"{(req.IsHttps ? "https://" : "http://")}{req.Headers["Host"]}/api/public/books/{newbook.RowKey}", null);
        }
    }
}
