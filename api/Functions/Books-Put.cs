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
    public static class BooksPut
    {
        [FunctionName("books-put")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "backend/books/{bookid}")] HttpRequest req, string bookid)
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

            if (!string.IsNullOrWhiteSpace(newbook.RowKey) && newbook.RowKey != bookid)
                return new BadRequestResult();
            if (!string.IsNullOrWhiteSpace(newbook.PartitionKey) && newbook.PartitionKey != bookid)
                return new BadRequestResult();

            TableDatabase db = new TableDatabase(Environment.GetEnvironmentVariable("APP_STORAGEACCOUNT"), "books");

            Book dbbook = await db.GetItemByKeyAsync<Book>(bookid);

            newbook.RowKey = bookid;
            newbook.PartitionKey = bookid;


            if (dbbook == null)
            {
                // book doesnt exist already
                newbook.Timestamp = DateTime.Now;
                await db.AddItemAsync<Book>(newbook);
                return new CreatedResult($"{(req.IsHttps ? "https://" : "http://")}{req.Headers["Host"]}/api/public/books/{newbook.RowKey}", null);
            }
            else
            {
                // book exists
                newbook.ETag = dbbook.ETag;
                newbook.Timestamp = DateTime.Now;
                await db.ReplaceItemAsync<Book>(newbook);
                return new ContentResult { Content = JsonConvert.SerializeObject(newbook), ContentType = "application/json", StatusCode = 200 };
            }
        }
    }
}
