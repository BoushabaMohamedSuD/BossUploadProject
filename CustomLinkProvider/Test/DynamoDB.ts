let AWS = require("aws-sdk");
AWS.config.update({ region: 'us-east-1' });
var dynamodb = new AWS.DynamoDB();


var params = {
    Key: {
        "email": {
            S: "test1@gmail.com"
        },
    },
    TableName: "Users_Info"
};

dynamodb.getItem(params, function (err, data) {
    if (err) console.log(err, err.stack);
    else console.log(data);

});

/*
var params = {
    Item: {
        "email": {
            S: "test1@gmail.com"
        },
        "Artist": {
            S: "No One You Know"
        },
        "SongTitle": {
            S: "Call Me Today"
        }
    },
    ReturnConsumedCapacity: "TOTAL",
    TableName: "Users_Info"
};
dynamodb.putItem(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data);           // successful response

});*/