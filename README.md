# nodejs-notificationcounter

GET Data:
{
	"user-id": "user-id",
	"notifications": [
		{
			"id": "id",
			"items": [ 
			{
				"type": "chat",
				"value": "1"
			}, 
			{
				"type": "matching",
				"value": "new"
			}
			]
		}
	]
}

PUT /notifications <-- Create user if not exist

 {
	"user-id": "user-id", 
	"type": "add" /*add | replace | read*/
	"notifications": [
		{
			"id": "id", 
			"items": [ /* optional. read to not need items*/
			{
				"type": "chat",
				"value": "1"
			}, 
			{
				"type": "matching",
				"value": "new"
			}
			]
		}
	] 
 }