
using System;
using System.Collections.Generic;
using System.Data;
using Dapper.Contrib.Extensions;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using ISP.DataAccess.Interfaces;

namespace ISP.DataAccess
{
    public class DapperRepository<T> : IRepository<T> where T : class
    {
        private readonly string _connectionString;

        public DapperRepository(IConfiguration configuration)
        {
            _connectionString = configuration
               .GetConnectionString("MyISP")
               ?? throw new InvalidOperationException("Missing MyISP");
        }

        private IDbConnection Connection() => new SqlConnection(_connectionString);

        public IEnumerable<T> GetAll()
        {
            using var db = Connection();
            db.Open();
            return db.GetAll<T>();
        }

        public T? GetById(int id)
        {
            using var db = Connection();
            db.Open();
            return db.Get<T>(id);
        }

        public long Insert(T entity)
        {
            using var db = Connection();
            db.Open();
            return db.Insert(entity);
        }

        public bool Update(T entity)
        {
            using var db = Connection();
            db.Open();
            return db.Update(entity);
        }

        public bool Delete(int id)
        {
            using var db = Connection();
            db.Open();
            // need a dummy instance with Key = id
            var existing = db.Get<T>(id);
            if (existing == null) return false;
            return db.Delete(existing);
        }
    }
}
