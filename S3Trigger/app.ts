


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
let dynamodb = new AWS.DynamoDB();


export async function lambdaHandler(event, context) {
    return new Promise((resolve, reject) => {
        //console.log(event);
        //console.log(event.Records[0].s3);
        let key = event.Records[0]
            .s3.object.key;
        let size = event.Records[0]
            .s3.object.size;
        // console.log(key);
        //console.log(size);

        let email = decodeURIComponent(key.split("/")[0]);
        console.log(email);


        let params = {
            Key: {
                "email": {
                    S: email
                },
            },
            TableName: "Users_Info"
        };

        dynamodb.getItem(params, (err, resp) => {
            if (err) {
                console.log(err, err.stack);
                response = {
                    'statusCode': 400,
                    'headers': {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": "*",
                        "Access-Control-Allow-Methods": "*"
                    },
                    'body': JSON.stringify({
                        error: err,
                    })
                };
                // return callback(null, response);
                //return response;
                reject(response);
            }
            else {
                console.log(resp);
                if (resp != null) {

                    let consSize = parseInt(resp.Item.size_consumed.N, 10);

                    let sizeconsumedString = (consSize + size).toString()

                    console.log("fetch data complete");

                    let params = {
                        ExpressionAttributeNames: {
                            "#y": "size_consumed"
                        },
                        ExpressionAttributeValues: {

                            ":y": {
                                N: sizeconsumedString
                            }
                        },
                        Key: {
                            "email": {
                                S: email
                            },

                        },
                        ReturnValues: "ALL_NEW",
                        TableName: "Users_Info",
                        UpdateExpression: "SET #y = :y"
                    };
                    dynamodb.updateItem(params, (err, data) => {
                        if (err) {
                            console.log(err, err.stack);
                            response = {
                                'statusCode': 400,
                                'headers': {
                                    "Access-Control-Allow-Origin": "*",
                                    "Access-Control-Allow-Headers": "*",
                                    "Access-Control-Allow-Methods": "*"
                                },
                                'body': JSON.stringify({
                                    error: err,
                                })
                            };
                            // return callback(null, response);
                            //return response;
                            reject(response);
                        }
                        else {
                            //if evrything is ok
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
                            // return callback(null, response);
                            //return response;
                            resolve(response);


                        }

                    });







                } else {
                    console.log("data is null in fetch data");
                    response = {
                        'statusCode': 400,
                        'headers': {
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Headers": "*",
                            "Access-Control-Allow-Methods": "*"
                        },
                        'body': JSON.stringify({
                            error: "data is null in fetch data",
                        })
                    };
                    // return callback(null, response);
                    //return response;
                    reject(response);
                }
            }

        });






    })



};
