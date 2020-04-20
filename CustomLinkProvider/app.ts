let response;

export async function lambdaHandler(event, context) {
    try {

        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'hello world',
                type: 'Cognito'
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};