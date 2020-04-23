
import AWS from 'aws-sdk';
AWS.config.update({ region: 'us-east-1' });
var dynamodb = new AWS.DynamoDB();