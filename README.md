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
reqTask: {  
	\_id  
	name  
	type  
	location  
	description  
	teams (array without the current team added)  
}

### POST /task/getOngoing:
#### Request:
teamID

#### Response: 
\_id  
name  
location  
description  
ongoingTeams (Array for the task)  
completedTeams (Array for the task)  


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