# SUBGBackend
SUBG App Backend

## This will haunt me in my dreams.

# Routes:

## User:

### GET /user/getNotRegistered:
##### For participants who are not registered

#### Response:
gravitasID  
name

### GET /user/getAll:
##### For all participants

#### Response:
gravitasID  
name


## Team:

### POST /team/registerTeam:
#### Request:
name1  
gravitasID1  
name2  
gravitasID2  
name3 (optional)  
gravitasID3 (optional)  

#### Response:
ObjectID of new document for team

### POST /team/findTeam:
#### Request:
name1  
gravitasID1  
name2  
gravitasID2  
name3 (optional)  
gravitasID3 (optional)  

#### Response: 
memberID1  
memberID2  
memberID3  




## Task:

### POST /task/assignTask:
#### Request:
name  
type  
location  
teamID  

#### Response: 
teamID  
type  
location  
reqTask: [{  (Array of tasks that were assigned)  
	\_id  
	name  
	type  
	location  
	description  
	ongoingTeams (array without the current team added)  
	completedTeams (array without the current team added)  
	points  
}]

### POST /task/getOngoing:
#### Request:
teamID

#### Response: 
[{  
\_id  
name  
type  
location  
description  
ongoingTeams (Array for the task)  
completedTeams (Array for the task)  
points  }]  


### POST /task/getCompleted:
#### Request:
teamID

#### Response: 
\_id  
name  
location  
description  
ongoingTeams (Array for the task)  
completedTeams (Array for the task)  

### POST /task/completeTask:
#### Request:
teamID  
type  
name  
location  

#### Response: 
\_id  
name  
location  
description  
ongoingTeams (Array for the task)  
completedTeams (Array for the task)  


### POST /task/countPoints:
#### Request:
teamID  

#### Response: 
[ { \_id: {}, totalPoints: Number } ]