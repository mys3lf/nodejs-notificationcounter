var express = require('express'), mysql = require('mysql'), bodyParser = require('body-parser');
var app = express();

var pool = mysql.createPool(require('./config.json'));

var server = app

    .use(bodyParser.json())
    .use(bodyParser.urlencoded({
        extended: true
    }))
    .listen(8081, function () {
        var host = server.address().address
        var port = server.address().port

        console.log("Server listing at http://%s:%s", host, port)
    });


app.get('/notifications/:userId', function (req, res) {
    function returnData(error, results, fields) {
        if (error) throw error;

        var array = [];

        array.push(
            {
                userId: results[0].userId,
                notification: []
            }
        );

        for (var i = 0; i < results.length; i++) {
            array.notification.push(
                {
                    targetId: results[i].targetId,
                    type: results[i].type,
                    value: results[i].value
                }
            );
        }

        res.json(array);
    }
    if (req.query.userID != null) {
        pool.query('SELECT userId, targetId, type, value ' + 
                   'FROM notifications' +
                   'WHERE userId=' + req.params.userId,
                   [req.query.type], returnData);
    } else {
        res.send(400, 'Missing User Id!');
    }
})