var ConnectionPool = require('tedious-connection-pool');
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

var poolConfig = {
    min: 2,
    max: 5,
    log: true
};

// Connection details
var connectionConfig = {
    userName: 'edanidan',
    password: 'Ass123456',
    server: 'assignment3webdevserver.database.windows.net',
    options: { encrypt: true, database: 'Assignment3db' }
};

//create the pool
var pool = new ConnectionPool(poolConfig, connectionConfig);

pool.on('error', function (err) {
    if (err) {
        console.log(err);
    }
});
console.log('*** pool connection on ***');

exports.execQuery = (query) => {
    // console.log('********************************** QUERY **************************************')
    // console.log(query);
    // console.log('*******************************************************************************')
    return new Promise(function (resolve, reject) {
        try {
            var ans = [];
            var properties = [];

            //acquire a connection
            pool.acquire(function (err, connection) {
                if (err) {
                    console.log('acquire ' + err);
                    reject(err);
                }
                console.log('connection on');

                var dbReq = new Request(query, function (err, rowCount) {
                    if (err) {
                        console.log('********************************** DB ERROR **************************************')
                        console.log()
                        console.log('Request ' + err);
                        console.log()
                        console.log('**********************************************************************************')
                        reject(err);
                    }
                });

                dbReq.on('columnMetadata', function (columns) {
                    columns.forEach(function (column) {
                        if (column.colName != null)
                            properties.push(column.colName);
                    });
                });
                dbReq.on('row', function (row) {
                    var item = {};
                    for (i = 0; i < row.length; i++) {
                        item[properties[i]] = row[i].value;
                    }
                    ans.push(item);
                });

                dbReq.on('requestCompleted', function () {
                    console.log('request Completed: ' + dbReq.rowCount + ' row(s) returned');
                    console.log('____________ DB ANS ____________');
                    //console.log(ans);
                    console.log('________________________________');
                    connection.release();
                    resolve(ans);

                });
                connection.execSql(dbReq);

            });
        }
        catch (err) {
            reject(err)
        }
    });

};

