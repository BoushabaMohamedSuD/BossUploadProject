


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
    try {

        let body = JSON.parse(event.body);
        let email = event.requestContext.authorizer.claims.email;
        let allObjects:
            {
                publicData: any[],
                privateData: any[]
            };

        let paramsPublic = {
            Bucket: "public-bossupload",
            Prefix: email + "/",
            //MaxKeys: 2
        };

        let paramsPrivate = {
            Bucket: "private-bossupload",
            Prefix: email + "/",
            //MaxKeys: 2
        };


        s3.listObjects(paramsPublic, (err, data) => {
            if (err) {
                console.log(err, err.stack);
                response = {
                    'statusCode': 400,
                    'body': JSON.stringify({
                        data: "we cannot get keys",
                        err: err,
                    })
                };
                return response;
            }
            else {
                console.log(data);
                // send data contents
                allObjects.publicData
                    .push(data.Contents);

                s3.listObjects(paramsPrivate, (err, data) => {
                    if (err) {
                        console.log(err, err.stack);
                        response = {
                            'statusCode': 400,
                            'body': JSON.stringify({
                                data: "we cannot get keys",
                                err: err,
                            })
                        };
                        return response;
                    }
                    else {
                        console.log(data);
                        // send data contents
                        allObjects.privateData
                            .push(data.Contents);

                        response = {
                            'statusCode': 200,
                            'body': JSON.stringify({
                                data: allObjects,

                            })
                        };
                        return response;

                    };


                });


            };


        });


        /* */

    } catch (err) {
        console.log(err);
        return err;
    }


};
