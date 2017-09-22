# nodejs-notificationcounter
Small service for saving notifications for example unread messages or matching information.


# MySQL Table
Tablename : notifications

| Name          | Typ           | Standard      |
| ------------- | ------------- | ------------- |
| userId        | varchar(60)   | -             |
| targetId      | varchar(60)   | -             |
| type          | varchar(10)   | -             |
| targetId      | int    (11)   | 1             |


# REST CALL's
>
> GET /notifications/userId/:userId
>
Get all notifications of the user with ":userId"

>
> PUT /notifications/userId/:userId
>
Request Data:
> targetId
> type

Adds or updates notification of the user ":userId" with the targetId ":targetId" with notification type ":type"

>
> DELETE /notifications/userId/:userId
>
Request Data:
> targetId
> type

Deletes notification of the user ":userId" with the chatId ":targetId" with notification type ":type" (for example after reading chat)

# License
MIT
