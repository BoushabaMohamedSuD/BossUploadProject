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

            //the key of previeus file we want to update it
            //in this cas the key is the same of the file we want to uplaod it
            let keyWantedObject;


            //the size of the previeus file we want tu update it
            let wantedFileSize;



            if (folder != "") {
                keyWantedObject = email + "/" + folder + "/" + key;
            } else {
                keyWantedObject = email + "/" + key;
            }


            let updateSize: boolean = false;



            this.data
                .data.keys.forEach(element => {
                    if (element.key == keyWantedObject) {
                        wantedFileSize = element.size;
                        updateSize = true;
                    }
                });

            if (updateSize) {


                //beceaus we are going to delete the previous file 
                //we need to decrease the consumed size in userInfo table
                let sizeconsumed = consSize - wantedFileSize;

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
                    UpdateExpression: "SET #y = :y"
                };
                dynamodb.updateItem(params, (err, data) => {
                    if (err) {
                        console.log(err, err.stack);
                        reject("we cannot update consemed size in FilterUpdateObject");
                    }
                    else {
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