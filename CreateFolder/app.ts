


let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 * @param {string} event.resource - Resource path.
 * @param {string} event.path - Path parameter.
 * @param {string} event.httpMethod - Incoming request's method name.
 * @param {Object} event.headers - Incoming request headers.
 * @param {Object} event.queryStringParameters - query string parameters.
 * @param {Object} event.pathParameters - path parameters.
 * @param {Object} event.stageVariables - Applicable stage variables.
 * @param {Object} event.requestContext - Request context, including authorizer-returned key-value pairs, requestId, sourceIp, etc.
 * @param {Object} event.body - A JSON string of the request payload.
 * @param {boolean} event.body.isBase64Encoded - A boolean flag to indicate if the applicable request payload is Base64-encode
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 * @param {string} context.logGroupName - Cloudwatch Log Group name
 * @param {string} context.logStreamName - Cloudwatch Log stream name.
 * @param {string} context.functionName - Lambda function name.
 * @param {string} context.memoryLimitInMB - Function memory.
 * @param {string} context.functionVersion - Function version identifier.
 * @param {function} context.getRemainingTimeInMillis - Time in milliseconds before function times out.
 * @param {string} context.awsRequestId - Lambda request ID.
 * @param {string} context.invokedFunctionArn - Function ARN.
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * @returns {boolean} object.isBase64Encoded - A boolean flag to indicate if the applicable payload is Base64-encode (binary support)
 * @returns {string} object.statusCode - HTTP Status Code to be returned to the client
 * @returns {Object} object.headers - HTTP Headers to be returned
 * @returns {Object} object.body - JSON Payload to be returned
 * 
 */



const AWS = require("aws-sdk");
const s3 = new AWS.S3();




// we have to use (return callback ) instead of return resp 
//beceaus it's async function


export async function lambdaHandler(event, context, callback) {


    console.log("create folder");

    let body = JSON.parse(event.body);
    let email = event.requestContext.authorizer.claims.email;
    let type = body.type;
    let folder = body.folder;
    let params;
    console.log(email);
    console.log(folder);
    console.log(type);


    //body don't matter in this case 
    return new Promise((resolve, rejecte) => {
        if (folder != "" && (type == "private" || type == "public")) {
            console.log("begun creation");
            params = { Bucket: type + '-bossupload', Key: email + '/' + folder + '/', Body: '' };
            s3.upload(params, (err, data) => {
                if (err) {
                    console.log("Error creating the folder: ", err);
                    response = {
                        'statusCode': 400,
                        'headers': {
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Headers": "*",
                            "Access-Control-Allow-Methods": "*"
                        },
                        'body': JSON.stringify({
                            data: "we cannot get url",
                            err: err,
                        })
                    };

                    //return response;
                    resolve(response);

                } else {
                    console.log("Successfully created a folder on S3");
                    console.log('The URL is');
                    response = {
                        'statusCode': 200,
                        'headers': {
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Headers": "*",
                            "Access-Control-Allow-Methods": "*"
                        },
                        'body': JSON.stringify({
                            data: true,
                        })
                    };

                    // return response;
                    resolve(response);
                }
            });

        } else {
            console.log("stop creation");
            response = {
                'statusCode': 400,
                'headers': {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*",
                    "Access-Control-Allow-Methods": "*"
                },
                'body': JSON.stringify({
                    data: "folder name is empty or type is not match with the requirement",
                    err: false,
                })
            };
            //return response;
            resolve(response);

        }

        console.log("end creation");

    })




};
