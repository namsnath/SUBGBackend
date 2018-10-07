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