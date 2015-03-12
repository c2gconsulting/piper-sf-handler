## Quick start

1. Install [Node.JS](http://nodejs.org/) on your computer.

2. Setup your project 

    Create a new Node.JS app :
    
    ```bash
    $ mkdir myapp
    $ cd myapp
    $ npm init
    ...
    ```
    
    Add node-piper as a dependency in your package.json
    
    ```json
      "dependencies": {
        "piper-mgr": "0.1.0"	
      },	
    ```
    
    Execute `npm install` in your current folder to fetch the dependencies
    
    Create an `index.js` file in myapp directory containing:
    
    ```javascript
    connect( "acetxe" , "cgrant" , "demo101" , function ( res ) {
    var outmsg = '';
    if ( res.d.results.length > 0 ){
        outmsg = "Connection to Successfactors was successful...\n";
        console.log( outmsg );

        //once successful , perform other api calls like getLeaveQuota , makeLeaveRequest

    else{
        outmsg = "Connection Failed!";
        console.log( outmsg );
    }


    ```

4. Start your app

```bash
$ node index.js
Response from Piper for registerClient:
Connection to Successfactors was successful!

Response from Piper for new connection:
{
 "status": "Connected",
 "client": {
    "_id": "54f1d37614ef3039468cd086",
    "name": "acetxe",
    "sftoken": "xoxb-AB0923F-09LSDKFJWOFKLS-LKALIWE099",
    "username": "cgrant",
    "userId": "cgrant1",
    "email":"cgrant@acetxe.com"
    "isActive": true,
    "__v": 0
  }
}
...
```

## Examples


## API

### connect

The `connect` function is used to connect to the Successfactor instance. It takes 4 arguments:
- `ClientId`: Name of Successfactors company e.g acetxe
- `username`: Username on Successfactors e.g cgrant
- `password`: Password on Successfactors e.g demo101
- `callback`: call function that takes http response as its arguments.


### setLeaveUser

The `setLeaveUser` function is used to set current user for leave information. It takes 1 argument: 
- `leaveUser`: UserId for user in Successfactors


### setLeaveType

The `setLeaveType` function is used to set current timeAccountType to be fetched for the user. It takes 1 argument: 
- `leaveType`: external code for timeAccountType. It is usually any of this VACATION_CURRENT , SICKNESS_CURRENT , PTO_CURRENT , PTO_AC


### getLeaveQuota

The `getLeaveQuota` function is used to fetch the leave balance for a user and a particular leave type. It takes 4 arguments:
- `ClientId`: Name of Successfactors company e.g acetxe
- `userId`: UserId on Successfactors e.g cgrant1
- `password`: Password on Successfactors e.g demo101
- `callback`: call function that takes http response as its arguments


```javascript
connect( "acetxe" , "cgrant" , "demo101" , function ( res ) {
   var outmsg = '';
   if ( res.d.results.length > 0 ){
      outmsg = "Connection to Successfactors was successful...\n";
      console.log( outmsg );
      //Getting leave quota from Successfactors
      setLeaveUser( 'cgrant1' );
      setLeaveType ( 'SICKNESS_CURRENT' );
      getLeaveQuota( "acetxe" , "cgrant" , "demo101" , function ( res ) {

         if ( res.d.results.length > 0 ){
             for ( a = 0 ; a<res.d.results.length;a++){
                  leaveQuotaBalance = res.d.results[a];
                  console.log ( "Leave Balance for "+mapLeaveType( leaveQuotaBalance.timeAccountType )+" for Successfactor user with id  "+leaveQuotaBalance.userId
              +" is "+leaveQuotaBalance.balance);
            
             }
        }else{
          res = "Query returned empty set!";
          console.log( res );
        }

      });

      setLeaveType ( 'VACATION_CURRENT' );
      getLeaveQuota( "acetxe" , "admin" , "demo101" , function ( res ) {

         if ( res.d.results.length > 0 ){
             for ( a = 0 ; a<res.d.results.length;a++){
                  leaveQuotaBalance = res.d.results[a];
                   console.log ( "Leave Balance for "+mapLeaveType( leaveQuotaBalance.timeAccountType )+" for Successfactor user with id  "+leaveQuotaBalance.userId
              +" is "+leaveQuotaBalance.balance);
            
             }
        }else{
          res = "Query returned empty set for user "+getLeaveUser()+"!";
          console.log( res );
        }
      });


  }else{
      outmsg = "Connection Failed!";
      console.log( outmsg );
  }
 
});
```