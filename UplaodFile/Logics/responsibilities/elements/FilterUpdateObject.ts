import { ResponsibilitiesHolder } from './../holders/ResponsibilitiesHolder';
import { CheckSize } from '../../templates/CheckSize';
import { CheckStatus } from '../../templates/CheckStatus';
import { CheckFileSize } from '../../templates/CheckFileSize';
let AWS = require("aws-sdk");
AWS.config.update({ region: 'us-east-1' });
let dynamodb = new AWS.DynamoDB();

export class FilterUpdateObject implements ResponsibilitiesHolder {

    private Nextchaine!: ResponsibilitiesHolder;
    private data: any;

    constructor(data: any) {
        this.data = data;
    }

    public setNextChaine(chaine: ResponsibilitiesHolder): ResponsibilitiesHolder {
        this.Nextchaine = chaine;
        return this.Nextchaine;
    }

    public process(): Promise<any> {
        return new Promise((resolve, reject) => {
            // code here
            let folder = this.data.request.folder;
            let email = this.data.request.email;
            let key = this.data.request.key;
            let consSize = this.data.data.consSize;

            let keyWantedObject;

            if (folder != "") {
                keyWantedObject = email + "/" + folder + "/" + key;
            } else {
                keyWantedObject = email + "/" + key;
            }
            let updateSize: boolean = false;

            this.data
                .data.keys.forEach(element => {
                    if (element.key == keyWantedObject) {
                        updateSize = true;
                    }
                });

            if (updateSize) {

                let sizeconsumed;

                let sizeconsumedString: string = sizeconsumed.toString()

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
                    UpdateExpression: "SET #Y = :y"
                };
                dynamodb.updateItem(params, function (err, data) {
                    if (err) console.log(err, err.stack);
                    else console.log(data);

                });

            } else {

                //if evrything is ok
                if (this.Nextchaine != null) {
                    console.log('going to next chaine');
                    this.Nextchaine.process()
                        .then((resp) => {
                            // resp is her false or true
                            if (resp) {
                                resolve(resp);
                            } else {
                                reject(resp);
                            }

                        })
                        .catch((err) => {
                            //console.log(err);
                            //console.log('Error');
                            reject(err);
                        });
                } else {
                    console.log('this is the end of the chaine');
                    resolve(true);
                }



            }






        });
    };

}