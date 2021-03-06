const AWS = require("aws-sdk");
AWS.config.update({ region: 'us-east-1' });
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
const dynamodb = new AWS.DynamoDB();


//for getting the the user that is already signup 
//who has the same email with 
const getUserByEmail = async (userPoolId, email) => {
    const params = {
        UserPoolId: userPoolId,
        Filter: `email = "${email}"`
    }
    return cognitoidentityserviceprovider.listUsers(params).promise()
}

const linkProviderToUser = async (username, userPoolId, providerName, providerUserId) => {
    const params = {
        DestinationUser: {
            ProviderAttributeValue: username,
            ProviderName: 'Cognito'
        },
        SourceUser: {
            ProviderAttributeName: 'Cognito_Subject',
            ProviderAttributeValue: providerUserId,
            ProviderName: providerName
        },
        UserPoolId: userPoolId
    }

    const result = await (new Promise((resolve, reject) => {
        cognitoidentityserviceprovider.adminLinkProviderForUser(params, (err, data) => {
            if (err) {
                reject(err)
                return
            }
            resolve(data)
        })
    }))

    return result
}

export async function lambdaHandler(event, context, callback) {
    console.log("begun operation");
    console.log(event);
    return new Promise((resolve, reject) => {
        if (event.triggerSource === 'PreSignUp_ExternalProvider') {
            console.log("exeternal sign up");
            // if an exteral provider is triggered

            getUserByEmail(event.userPoolId,
                event.request.userAttributes.email)
                .then(userRs => {
                    console.log(userRs);
                    if (userRs && userRs.Users.length == 1) {
                        console.log("we fund user with the same email");
                        console.log("begun linking")
                        //check if userStatus is confirmed

                        if (userRs.Users[0].UserStatus == "CONFIRMED") {
                            console.log("user is confirmed");
                            //user is confirmed
                            // we link her the user who sign up with the ednetity provider
                            //with the internall user
                            //cause we allow just one email

                            const [providerName, providerUserId] = event.userName.split('_') // event userName example: "Facebook_12324325436"
                            linkProviderToUser(userRs.Users[0].Username, event.userPoolId, providerName, providerUserId)
                                .then(resp => {
                                    console.log("link success");
                                    console.log(resp);
                                    resolve(callback(null, event));
                                })
                                .catch(err => {
                                    console.log("link failed");
                                    console.log(err);
                                    resolve(callback("!link failed", null));
                                });
                        } else {
                            //user is not confirmed
                            console.log("user is not confirmed");
                            resolve(callback("!Original User is not confirmed yet", null));

                        }




                    } else if (userRs && userRs.Users.length > 1) {
                        console.log("multiple user with the same email")
                        console.log("this is an error");
                        resolve(callback("!Internal Error Custom", null));
                    } else {
                        //no user with the same email exist 
                        //so we accept sign up
                        //and we create an iteme on the table
                        console.log('user not found, skip.');
                        console.log("create original item");
                        let params = {
                            Item: {
                                "email": {
                                    S: event.request.userAttributes.email
                                },
                                "status": {
                                    S: "Normal"
                                },
                                "size_consumed": {
                                    N: "0"
                                },
                                "size_allowed": {
                                    N: "1073741824"
                                }
                            },
                            ReturnConsumedCapacity: "TOTAL",
                            TableName: "Users_Info"
                        };
                        dynamodb.putItem(params, function (err, data) {
                            if (err) {
                                //console.log(err, err.stack);
                                resolve(callback("!cannot create item on dynamo db", null));
                            }
                            else {
                                //console.log(data);
                                console.log("Succes Create Item");
                                resolve(callback(null, event));
                            }

                        });




                    }

                })
                .catch(err => {
                    console.log("we cannot get user with the same email");
                    console.log(err);
                    resolve(callback("!we cannot get user with the same email", null));
                });



        } else {
            console.log('internall signup');
            console.log("userpoolid : " + event.userPoolId);
            console.log("user email : " + event.request.userAttributes.email);
            //if  the the user who want to sign up is enternal
            //we have to chech is the email is already exist 

            getUserByEmail(event.userPoolId,
                event.request.userAttributes.email)
                .then(userRs => {
                    console.log(userRs);
                    if (userRs && userRs.Users.length > 0) {
                        console.log("user with the ame email already exist  forbiden");
                        // the user her is laready existe
                        // he is already sign ip with an external provied
                        //or he is already exist
                        //so we need to block or deny the sign up process her
                        resolve(callback("!user with the ame email already exist  forbiden", null));

                    } else {
                        console.log('good  user with the same email not found');
                        console.log('skip');
                        console.log("create item on dynamodb");

                        let params = {
                            Item: {
                                "email": {
                                    S: event.request.userAttributes.email
                                },
                                "status": {
                                    S: "Normal"
                                },
                                "size_consumed": {
                                    N: "0"
                                },
                                "size_allowed": {
                                    N: "1073741824"
                                }
                            },
                            ReturnConsumedCapacity: "TOTAL",
                            TableName: "Users_Info"
                        };
                        dynamodb.putItem(params, function (err, data) {
                            if (err) {
                                //console.log(err, err.stack);
                                resolve(callback("!cannot create item on dynamo db", null));
                            }
                            else {
                                //console.log(data);
                                console.log("Succes Create Item");
                                resolve(callback(null, event));
                            }

                        });


                    }
                })
                .catch(err => {
                    console.log("we cannot list user with the same email");
                    console.log(err);
                    resolve(callback("!we cannot list user with the same email", null));
                });


        }

        // return callback(null, event)

    })


}