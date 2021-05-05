using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Books.Classes;
using System.Dynamic;

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
            
            dynamic splitbookid = new ExpandoObject();
            splitbookid.PartitionKey = bookid.Split("-")[0];
            splitbookid.RowKey = bookid.Split("-")[1];

            if (!string.IsNullOrWhiteSpace(newbook.RowKey) && newbook.RowKey != splitbookid.RowKey)
                return new BadRequestResult();
            if (!string.IsNullOrWhiteSpace(newbook.PartitionKey) && newbook.PartitionKey != splitbookid.PartitionKey)
                return new BadRequestResult();

            TableDatabase db = new TableDatabase(Environment.GetEnvironmentVariable("APP_STORAGEACCOUNT"), "test");

            Book dbbook = await db.GetItemByIDAsync<Book>(bookid);

            newbook.RowKey = splitbookid.RowKey;
            newbook.PartitionKey = splitbookid.PartitionKey;


            if (dbbook == null)
            {
                // book doesnt exist already
                newbook.Timestamp = DateTime.Now;
                await db.AddItemAsync<Book>(newbook);
                return new CreatedResult($"{(req.IsHttps ? "https://" : "http://")}{req.Headers["Host"]}/api/public/books/{newbook.ID}", null);
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
