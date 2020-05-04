


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


export async function lambdaHandler(event, context) {


    let body = JSON.parse(event.body);
    let email = event.requestContext.authorizer.claims.email;
    let type = body.type;
    let folder = body.folder
    let params;

    if (folder != "") {
        params = {
            Bucket: type + "-bossupload",
            Prefix: email + "/" + folder + "/",
            //MaxKeys: 2
        };
    } else {
        params = {
            Bucket: type + "-bossupload",
            Prefix: email + "/"
            //MaxKeys: 2
        };
    }
    return new Promise((resolve, reject) => {
        s3.listObjects(params, (err, data) => {
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
                        data: "we cannot get keys",
                        err: err,
                    })
                };
                //return response;
                resolve(response);
            }
            else {
                console.log(data);
                // send data contents
                response = {
                    'statusCode': 200,
                    'headers': {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": "*",
                        "Access-Control-Allow-Methods": "*"
                    },
                    'body': JSON.stringify({
                        data: data.Contents,

                    })
                };
                //return response;
                resolve(response);
            };


        });

    });








};
