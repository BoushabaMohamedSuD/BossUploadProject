
const AWS = require("aws-sdk");
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

console.log("fin test");