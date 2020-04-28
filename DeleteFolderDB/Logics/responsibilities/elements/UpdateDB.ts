import { ResponsibilitiesHolder } from './../holders/ResponsibilitiesHolder';
let AWS = require("aws-sdk");
AWS.config.update({ region: 'us-east-1' });

let dynamodb = new AWS.DynamoDB();


export class UpdateDB implements ResponsibilitiesHolder {

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

            let email = this.data.request.email;
            let consSize = this.data.data.consSize;


            let FolderSize = 0;


            this.data.
                data.keys.forEach(element => {
                    FolderSize = FolderSize + element.size;
                });

            if (FolderSize != 0) {

                let sizeconsumed = consSize - FolderSize;



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

                console.log("no file in the folder");

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