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
    if (req.query.userId != null) {
        pool.query('SELECT , targetId, type, value ' + 
                   'FROM notifications' +
                   'WHERE =?',
                   [req.query.userId], returnData);
    } else {
        res.send(400, 'Missing User Id!');
    }
}).put('/notification/:userId/:targetId/:type', function (req, res) {
    if (req.query.userId != null && req.query.targetId != null && req.query.type != null) {
            if(pool.query('SELECT Count(*) FROM notifications WHERE userId=? targetId=? type=? )' ,[req.params.userId,req.params.targetId,req.params.type])) {
                pool.query('UPDATE notifications' + 
                           'SET value = value + 1' +
                           'WHERE userId=? targetId=? type=? )' 
                           ,[req.params.userId,req.params.targetId,req.params.type],
                            (error, result, fields) => {
                                if (error) {
                                    res.send(500, 'SQL ERROR: UPDATE faild!');
                                    throw error;
                                }

                                res.send(201, 'Success');
                            }
                );
            } else {
                pool.query('INSERT INTO notifications (userId, targetId, type)' +
                           'VALUES (' + req.params.userId + req.params.targetId + req.params.type + ')'
                           ,(error, result, fields) => {
                                if (error) {
                                    res.send(500, 'SQL ERROR: INSERT INTO faild!');
                                    throw error;
                                }
                                
                                res.send(201, 'Success');
                            })
            }
    } else {
        res.send(400, 'Missing Parameter!');
    }
}).delete('/notification/:userId/:targetId/:type', function (req, res) {
    if (req.query.userId != null && req.query.targetId != null && req.query.type != null) {
            pool.query('DELETE FROM notifications WHERE userId=? targetId=? type=?'
                    ,[req.params.userId,req.params.targetId,req.params.type]
                    ,(error, result, fields) => {
                        if (error) {
                            res.send(500, 'SQL ERROR: INSERT INTO faild!');
                            throw error;
                        }
                    
                        res.send(201, 'Success');
                    });
    } else {
        res.send(400, 'Missing Parameter!');
    }
})