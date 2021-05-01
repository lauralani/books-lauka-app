using Microsoft.Azure.Cosmos.Table;
using System;
using System.Collections.Generic;
using System.Text;

namespace Books.Classes
{
    class Book : TableEntity
    {
        public string Author { get; set; }
        public string Genre { get; set; }
        public string Title { get; set; }
        public string Universe { get; set; }
        public string Series { get; set; }
        public bool Read { get; set; }
        public bool Lent { get; set; }

        public Book() { }
    }
}
