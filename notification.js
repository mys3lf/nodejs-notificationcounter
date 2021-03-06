var express = require('express'), mysql = require('mysql'), bodyParser = require('body-parser');
var app = express();

var pool = mysql.createPool(require('./config.json'));


var server = app

    .use(bodyParser.json())
    .use(bodyParser.urlencoded({
        extended: true
    }))
    .listen(8084, function () {
        var host = server.address().address
        var port = server.address().port

        console.log("Server listing at http://", host, port)
    });

app.get('/notifications/users/:userId', function (req, res) {
    // Help function for preparing query results for response json
    function returnData(error, results, fields) {
        if (error) throw error;

        var response = {
                userId: req.params.userId,
                notification: []
            };

        for (var i = 0; i < results.length; i++) {
            response.notification.push(
                {
                    targetId: results[i].targetId,
                    type: results[i].type,
                    value: results[i].value
                }
            );
        }

        res.json(response);
    }

    if (req.params.userId != null) {
        // Get all notifications for requested user 
        pool.query('SELECT * ' + 
                   'FROM notifications ' +
                   'WHERE userId=?',
                   [req.params.userId], returnData);
    } else {
        res.status(400).send('Missing User Id!');
    }
}).put('/notifications/users/:userId', function (req, res) {
    if (req.params.userId != null && req.body.targetId != null && req.body.type != null) {   
        pool.query('SELECT COUNT(*) AS count FROM notifications WHERE userId=? AND targetId=? AND type=?' ,
                    [req.params.userId,req.body.targetId,req.body.type],
                    (error, results, fields) => {
                        if (results[0].count) {
                        // If the requested entry exist
                        // Update data and increase value
                        pool.query('UPDATE notifications ' + 
                                   'SET value = value + 1 ' +
                                   'WHERE userId=? AND targetId=? AND type=?' 
                                    ,[req.params.userId,req.body.targetId,req.body.type]
                                    ,(error, result, fields) => {
                                        if (error) {
                                            console.error(error);
                                            res.status(500).send('SQL ERROR: UPDATE failed!');
                                            throw error;
                                        }
                                        res.status(201).send('Success');
                            });
                        } else {
                        // Else insert notification into database
                        pool.query('INSERT INTO notifications (userId, targetId, type, value) ' +
                                   "VALUES ('" + req.params.userId + "', '" + req.body.targetId + "', '" + req.body.type + "', 1)"
                                    ,(error, result, fields) => {
                                        if (error) {
                                            res.status(500).send('SQL ERROR: INSERT INTO failed!');
                                            throw error;
                                        }
                                    res.status(201).send('Success');
                                    })
                        }
                    });
    } else {
        res.send(400, 'Missing Parameter!');
    }
}).delete('/notifications/users/:userId', function (req, res) {
    if (req.params.userId != null && req.body.targetId != null && req.body.type != null) { 
            // Delete requested entry
            pool.query('DELETE FROM notifications WHERE userId=? AND targetId=? AND type=?'
                    ,[req.params.userId,req.body.targetId,req.body.type]
                    ,(error, result, fields) => {
                        if (error) {
                            res.status(500).send('SQL ERROR: DELETE failed!');
                            throw error;
                        }
                    
                        res.status(201).send('Success');
                    });
    } else {
        res.status(400).send('Missing Parameter!');
    }
});