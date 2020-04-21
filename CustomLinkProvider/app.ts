import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider'

const cognitoIdp = new CognitoIdentityServiceProvider()


//for getting the the user that is already signup 
//who has the same email with 
const getUserByEmail = async (userPoolId, email) => {
    const params = {
        UserPoolId: userPoolId,
        Filter: `email = "${email}"`
    }
    return cognitoIdp.listUsers(params).promise()
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
        cognitoIdp.adminLinkProviderForUser(params, (err, data) => {
            if (err) {
                reject(err)
                return
            }
            resolve(data)
        })
    }))

    return result
}

exports.handler = async (event, context, callback) => {
    if (event.triggerSource === 'PreSignUp_ExternalProvider') {
        // if an exteral provider is triggered

        const userRs: any = await getUserByEmail(event.userPoolId,
            event.request.userAttributes.email);


        if (userRs && userRs.Users.length > 0) {

            // we link her the user who sign up with the ednetity provider
            //with the internall user
            //cause we allow just one email

            const [providerName, providerUserId] = event.userName.split('_') // event userName example: "Facebook_12324325436"
            await linkProviderToUser(userRs.Users[0].Username, event.userPoolId, providerName, providerUserId)
        } else {
            console.log('user not found, skip.')
        }

    } else {
        //if  the the user who want to sign up is enternal
        //we have to chech is the email is already exist 

        const userRs: any = await getUserByEmail(event.userPoolId,
            event.request.userAttributes.email);
        if (userRs && userRs.Users.length > 0) {
            // the user her is laready existe
            // he is already sign ip with an external provied
            //or he is already exist
            //so we need to block or deny the sign up process her
            return callback(null, null);

        } else {
            console.log('good  user not found');
            console.log('skip');
        }
    }
    return callback(null, event)
}