
/*const AWS = require("aws-sdk");
AWS.config.update({ region: 'us-east-1' });
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

console.log("test");

let getUserByEmail = async (userPoolId, email) => {
    const params = {
        UserPoolId: userPoolId,
        Filter: `email = "${email}"`
    }
    return cognitoidentityserviceprovider.listUsers(params).promise()
}


let userRs = getUserByEmail("us-east-1_xmlerYTkV",
    "medY1998yz@gmail.com")
    .then(data => console.log(data))
    .catch(err => console.log(err));

console.log("fin test");*/



const AWS = require("aws-sdk");
var s3 = new AWS.S3();


/*
//the body dosn't matter
var params = { Bucket: 'private-bossupload', Key: 'folderInBucket/', Body: '' };

s3.upload(params, function (err, data) {
    if (err) {
        console.log("Error creating the folder: ", err);
    } else {
        console.log("Successfully created a folder on S3");

    }
});*/


let key = "";

let nameT = "mohamed";
let type = "private";

let params = {
    Bucket: type + "-bossupload",
    Prefix: "nodejs1998yz@gmail.com/Images/typaescript-aws-sam-master.zip",
    //MaxKeys: 2
};



let objects = new Array();


let i="4";
let ins = parseInt(i, 10);
console.log(ins);
console.log(typeof(ins));

//console.log(params)
/*s3.listObjects(params, function (err, data) {
    if (err) {
        console.log(err, err.stack);
    }
    else {
        console.log(data.Contents);
        console.log(data.Contents[0].Size);
        /* data.Contents.forEach(element => {
             let object = {
                 Key: element.Key,
                 size: element.Size
             };
             objects.push(object);
 
         });
         console.log(objects);*/
        /*  let paramst = {
              Bucket: "public-bossuplaod",
              Delete: {
                  Objects: objects,
                  Quiet: false
              }
          };
          console.log(paramst.Delete)
  
          s3.deleteObjects(paramst, (err, data) => {
              if (err) console.log(err, err.stack); // an error occurred
              else console.log(data);           // successful response
  
          });*/

  /*  };


});*/


/*

var paramst = {
    Bucket: "public-bossuplaod",
    Delete: {
        Objects: [
            {
                Key: "Test/**"
            }
        ],
        Quiet: false
    }
};*/
/*
s3.deleteObjects(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data);           // successful response

});


*/