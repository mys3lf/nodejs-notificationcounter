# nodejs-notificationcounter


GET Data:
> {
> 	"user-id": "user-id",
> 	"notifications": [
> 		{
> 			"id": "id",
> 			"items": [ 
> 			{
> 				"type": "chat",
> 				"value": "1"
> 			}, 
> 			{
> 				"type": "matching",
> 				"value": "new"
> 			}
> 			]
> 		}
> 	]
> }

PUT /notifications <-- Create user if not exist

> {
>	"user-id": "user-id", 
>	"type": "add" /*add | replace | read*/
>	"notifications": [
>		{
>			"id": "id", 
>			"items": [ /* optional. read to not need items*/
>			{
>				"type": "chat",
>				"value": "1"
>			}, 
>			{
>				"type": "matching",
>				"value": "new"
>			}
>			]
>		}
>	] 
> }


Table-Structure

> notifications (Table)
> id|user-id|notifications-id (columns)
> 
> 1|user1|chat_1_2
> 2|user2|chat_1_2
> 
> 
> notifications_items (Table)
> id|type|value (columns)
> 
> 1|chat|1
> 1|matching|new
> 2|chat|4
> 2|matching|new
