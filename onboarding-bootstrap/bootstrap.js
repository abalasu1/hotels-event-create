require('dotenv').config()
var xlsxRows = require('xlsx-rows');
var rpnative = require('request-promise-native');
var path = require('path');
var API_KEY, API_HOST, API_SECRET

exports.main = function (args){

   
    var locationrows = xlsxRows( { file: path.join( __dirname, './data.xlsx') , sheetname: "locations"});
    var hotelrows = xlsxRows( { file: path.join( __dirname, './data.xlsx'), sheetname: "hotels"});
    API_KEY = params['services.api.key']
    API_SECRET = params['services.api.secret']
    API_HOST = params['services.api.host']

    //console.log ( locationrows)
    return addLocations(locationrows)
    .then( function( locations){
        console.log ("added locations ") ;
        locations.forEach(function(location){
            console.log (   location);
        })
        return addProperties(hotelrows) ;
    })
    .then(function(properties){
        console.log ( "added properties") ;
        properties.forEach(function(property){
            console.log (  property);
        })
        return { message: "Added locations and properties "}
    })
    .catch(function(err){
        console.log (err);
        return { message: err }
    })


}

function addLocations(rows){
    var index = 0 ;
    let promises = [];
    
        rows.forEach(function(row){
            if ( index == 0 ){
                // header
            }else{
                promises.push (  addLocation(row) );
            }
            index++;
        })
        return Promise.all(promises) ;
          

}


function addLocation(row){

 return new Promise(function(resolve,reject){

        var requestBody = { 
            Name: "LocationCreated",
            Payload: { name: row[1] , fullname:row[1] , coordinates: { lat: row[4] , lng: row[5] } , icon: row[3] , placeId: row[0]},
            EventId : row[0]
        }
        

        var options = { method: 'POST',
            url:  API_HOST +  '/api/Events',
            headers: 
            { accept: 'application/json',
                'content-type': 'application/json',
                'x-ibm-client-secret': API_SECRET,
                'x-ibm-client-id': API_KEY },
            body:  requestBody,
            json: true 
        };


        rpnative(options)
        .then(function(data){
             resolve(data);
        })
        .catch(function(err){
             reject(err);
        })

    })
}

function addProperties(rows){

    var promises =[] ;
    var index = 0 ;
    rows.forEach(function(row){
        if ( index > 0 ) {
            promises.push(addProperty(row) );
        }
        index ++ ;
    })
    return Promise.all( promises);
}

function addProperty(row){
   return new Promise(function(resolve,reject){

        var requestBody = { 
            Name: "PropertyCreated",
            Payload: { name: row[1] , fullname:row[1] , coordinates: { lat: row[4] , lng: row[5] } , icon: row[3] , placeid: row[0]},
            EventId : row[0]
        }
        

        var options = { method: 'POST',
            url:  API_HOST +  '/api/Events',
            headers: 
            { accept: 'application/json',
                'content-type': 'application/json',
                'x-ibm-client-secret': API_SECRET,
                'x-ibm-client-id': API_KEY },
            body:  requestBody,
            json: true 
        };


        rpnative(options)
        .then(function(data){
             resolve(data);
        })
        .catch(function(err){
             reject(err);
        })

    })

}

