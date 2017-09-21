# nodejs-notificationcounter

# MySQL Table
Tablename : notifications

| Name          | Typ           | Standard      |
| ------------- | ------------- | ------------- |
| userId        | varchar(60)   | -             |
| targetId      | varchar(60)   | -             |
| type          | varchar(10)   | -             |
| targetId      | int    (11)   | 1             |


# REST CALL's

> GET /notifications/userId/:userId
get all notifications of the user with ":userId"

> PUT /notifications/userId/:userId/targetId/:targetId/type/:type
adds or updates notification of the user ":userId" with the chatId ":targetId" with notification type ":type"

> DELETE /notifications/userId/:userId/targetId/:targetId/type/:type
deletes notification of the user ":userId" with the chatId ":targetId" with notification type ":type" (for example after reading chat)
