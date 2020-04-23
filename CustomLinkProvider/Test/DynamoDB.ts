let AWS = require("aws-sdk");
AWS.config.update({ region: 'us-east-1' });
var dynamodb = new AWS.DynamoDB();


var params = {
    Key: {
        "email": {
            S: "test@gmail.com"
        },
    },
    TableName: "Users_Info"
};

dynamodb.getItem(params, function (err, data) {
    if (err) console.log(err, err.stack);
    else console.log(data);

});
