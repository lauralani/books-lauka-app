using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.Azure.Cosmos.Table;
using System.Linq;
using System.Threading.Tasks;

namespace Books.Classes
{
    class TableDatabase
    {
        private CloudTable _table;
        private CloudTableClient _client;

        public TableDatabase(string connectionString, string table)
        {
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(connectionString);
            _client = storageAccount.CreateCloudTableClient();
            _table = _client.GetTableReference(table);
        }

        public CloudTable GetTable(string tablename)
        {
            return _client.GetTableReference(tablename);
        }

        public async Task<T> GetItemByKeyAsync<T>(string key) where T : TableEntity
        {
            TableOperation op = TableOperation.Retrieve<T>(key, key);
            TableResult result = await _table.ExecuteAsync(op);
            return result.Result as T;
        }

        [Obsolete()]
        public IEnumerable<Book> GetAllBooks()
        {
            TableQuery<Book> query = new TableQuery<Book>();
            return _table.ExecuteQuery(query).OrderBy(o => o.Title);
        }

        public async Task<List<T>> GetAllItemsAsync<T>() where T : TableEntity, new()
        {
            List<T> items = new List<T>();
            TableQuery<T> query = new TableQuery<T>();
            TableContinuationToken token = null;

            do
            {
                TableQuerySegment<T> page = await _table.ExecuteQuerySegmentedAsync<T>(query, token);
                token = page.ContinuationToken;
                items.AddRange(page.Results);
            }
            while (token != null);
            return items;
        }

        public async Task DeleteItemAsync<T>(T item) where T : TableEntity
        {
            TableOperation op = TableOperation.Delete(item);
            await _table.ExecuteAsync(op);
        }

        public async Task AddItemAsync<T>(T item) where T : TableEntity
        {
            TableOperation op = TableOperation.Insert(item);
            await _table.ExecuteAsync(op);
        }

        public async Task ReplaceItemAsync<T>(T item) where T : TableEntity
        {
            TableOperation op = TableOperation.Replace(item);
            await _table.ExecuteAsync(op);
        }
    }
}
