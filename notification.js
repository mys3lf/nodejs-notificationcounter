var express = require('express'), mysql = require('mysql'), bodyParser = require('body-parser');
var app = express();

var pool = mysql.createPool(require('./config.json'));


var server = app

    .use(bodyParser.json())
    .use(bodyParser.urlencoded({
        extended: true
    }))
    .listen(1337, function () {
        var host = server.address().address
        var port = server.address().port

        console.log("Server listing at http://", host, port)
    });


app.get('/notifications/userId/:userId', function (req, res) {
    console.log("GET PARAMETER");
    // Help function for preparing query results for response json
    function returnData(error, results, fields) {
        if (error) throw error;

        var response = {
                userId: results[0].userId,
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
});

app.post('/notifications/userId/:userId/targetId/:targetId/type/:type', function (req, res) {
    console.log("POST PARAMETER");
    if (req.params.userId != null && req.params.targetId != null && req.params.type != null) {   
        pool.query('SELECT COUNT(*) AS count FROM notifications WHERE userId=? AND targetId=? AND type=?' ,
                    [req.params.userId,req.params.targetId,req.params.type],
                    (error, results, fields) => {
                        if (results[0].count) {
                        // If the requested entry exist
                        // Update data and increase value
                        pool.query('UPDATE notifications ' + 
                                   'SET value = value + 1 ' +
                                   'WHERE userId=? AND targetId=? AND type=?' 
                                    ,[req.params.userId,req.params.targetId,req.params.type]
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
                        pool.query('INSERT INTO notifications (userId, targetId, type) ' +
                                   "VALUES ('" + req.params.userId + "', '" + req.params.targetId + "', '" + req.params.type + "')"
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
});

app.delete('/notifications/userId/:userId/targetId/:targetId/type/:type', function (req, res) {
    console.log("DELETE PARAMETER");
    if (req.params.userId != null && req.params.targetId != null && req.params.type != null) { 
            // Delete requested entry
            pool.query('DELETE FROM notifications WHERE userId=? AND targetId=? AND type=?'
                    ,[req.params.userId,req.params.targetId,req.params.type]
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