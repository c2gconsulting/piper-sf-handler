/*
 * Copyright 2015 C2G Consulting Ltd. All rights reserved.
 *
 * Licensed under the MIT License (the "License");
 * you may not use this file except in compliance with the License.
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

//variables
var hostname = "salesdemo4.successfactors.com";
var http = require('https');
var authToken = '';
var xcsrfToken = '';
var jsonData = '';
var eachResData = '';

//data for handling leave information
var timeAccountType ; 
var leaveQuotaInfo ; 
var leaveUser;

function setOptions ( options ){
  this.options = options;
}
/**
*Connect to SuccessFactor OData APi
*@param clientID : SuccessFactor company name
*@param userP : Sucessfactor username
*@param passW: Successfactor password
*@param callback: Callback that takes response as parameter
*/
var connect = function( clientID , userP , passW , callback){
	  var options = {
      hostname: hostname,
      path: encodeURI ( "/odata/v2/User?$format=json&$filter=userId eq '"+userP+"1' & $select=username,userId" ),
      method: 'GET',
      auth: userP+"@"+clientID+":"+passW

    };
    
    makeHTTPRequest( options , 'connect', callback );
};

/**
* Gets leave quota
*@param clientID : SuccessFactor company name
*@param userP : Sucessfactor username
*@param passW: Successfactor password
* @param callback callback that takes 2 arguments err and the response body
 */

var getLeaveQuota = function (clientID, userP, passW , callback ) {
    
    var options = {
        hostname: hostname,
        path: encodeURI ( "/odata/v2/EmpTimeAccountBalance?$format=json&$filter=userId eq '"+getLeaveUser()+
          "'  and timeAccountType eq '"+getLeaveType()+"'  & $select=username,userId " ),
        method: 'GET',
        auth: userP+"@"+clientID+":"+passW
    };

    makeHTTPRequest( options , 'leaveQuotaBalance' , callback );
} ;

/**
* Maps leave external code to descriptive name
@param leaveType: External code for leave type ( timeAccountType )
*/
var mapLeaveType = function ( leaveType ){
  switch ( leaveType ){
    case 'SICKNESS_CURRENT':
      return 'Sickness leave';
    case 'VACATION_CURRENT':
      return 'Vacation leave';
  }
}
/**
* Sets Leave User
*@param user: Successfactor userId
*/
var setLeaveUser = function ( user ){
  leaveUser = user;
}

/**
* Gets Leave User
*/
function getLeaveUser(){
  return leaveUser;
}


/**
* Sets Leave Type
*@param leaveType: Successfactor TimeAccountTypes like SICKNESS_CURRENT , VACATION_CURRENT
*/
var setLeaveType = function( leaveType ){
  timeAccountType = leaveType;
}

/**
* Gets Leave User
*/
function getLeaveType(){
  return timeAccountType;
}


/**
* Makes an HTTP Request usually a GET or POST
*@param user: Successfactor userId
*/
function makeHTTPRequest ( options , operation , callback ){ 
  //initialize vars
  
  var req = http.request( options , function ( res ) {

          if ( res. statusCode == 200 ){
                jsonData = '';
                xcsrfToken = res.headers['x-csrf-token'];
                res.setEncoding('utf8');
                
                res.on('data', function (chunk) {
                  jsonData += chunk;
                });

                res.on('end', function(){
                  jsonData = JSON.parse( jsonData );
                  callback ( jsonData );
                  
                  switch( operation ){
                    case 'connect':
                        // console.log( 'Successfully connected!' ); 
                      break;

                    case 'leaveQuotaBalance':
                        // console.log ( 'Leave quota balance' );
                      break;

                    case 'timeAccountType':
                        // console.log( 'Time account type' );
                      break;
                    default:
                  }
              });
          }   
    });

    req.on ( 'error' , function( e ){
          console.log ( "Problem with request "+ e.message);
    });

     req.end();
}

//register methods for package
module.exports.connect = connect;
module.exports.setLeaveType = setLeaveType;
module.exports.getLeaveType = getLeaveType;
module.exports.setLeaveUser = setLeaveUser;
module.exports.getLeaveUser = getLeaveUser;
module.exports.getLeaveQuota = getLeaveQuota;


//==================================================================================================================================/
//Sample code on testing the package methods//
//Connecting to successfactors
connect( "acetxe" , "cgrant" , "demo101" , function ( res ) {
   var outmsg = '';
   if ( res.d.results.length > 0 ){
      outmsg = "Connection was successful...\n";
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





