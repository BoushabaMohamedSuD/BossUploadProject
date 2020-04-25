
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


let key = "Test1";

let nameT = "mohamed";
let type = "private";

var params = {
    Bucket: type + "-bossupload",
    Prefix: key + "/" + nameT,
    //MaxKeys: 2
};
s3.listObjects(params, function (err, data) {
    if (err) console.log(err, err.stack);
    else console.log(data);


});


