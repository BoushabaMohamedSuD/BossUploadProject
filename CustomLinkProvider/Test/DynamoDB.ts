let AWS = require("aws-sdk");
AWS.config.update({ region: 'us-east-1' });
var dynamodb = new AWS.DynamoDB();


var params = {
    Key: {
        "email": {
            S: "med1998yz@gmail.com"
        },
    },
    TableName: "Users_Info"
};

dynamodb.getItem(params, (err, data) => {
    if (err) console.log(err, err.stack);
    else {
        console.log(data);
        console.log(data.Item.email);
        console.log(data.Item.email.S);
    };

});

/*
var params = {
    Item: {
        "email": {
            S: "med1988yz@gmail.com"
        },
        "name": {
            S: "boushaba"
        },
        "size": {
            N: "340"
        },
        "Max": {
            N: "1024"
        }
    },
    ReturnConsumedCapacity: "TOTAL",
    TableName: "Users_Info"
};
dynamodb.putItem(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data);           // successful response

});*/


/*
var params = {
    ExpressionAttributeNames: {
        "#AT": "Max",
        "#Y": "Year"
    },
    ExpressionAttributeValues: {
        ":t": {
            N: "3000"
        },
        ":y": {
            N: "2015"
        }
    },
    Key: {
        "email": {
            S: "med1988yz@gmail.com"
        },

    },
    ReturnValues: "ALL_NEW",
    TableName: "Users_Info",
    UpdateExpression: "SET #Y = :y, #AT = :t"
};
dynamodb.updateItem(params, function (err, data) {
    if (err) console.log(err, err.stack);
    else console.log(data);

});*/