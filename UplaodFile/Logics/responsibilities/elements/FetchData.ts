import { ResponsibilitiesHolder } from './../holders/ResponsibilitiesHolder';
let AWS = require("aws-sdk");
AWS.config.update({ region: 'us-east-1' });
var dynamodb = new AWS.DynamoDB();
export class FetchData implements ResponsibilitiesHolder {

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
            // code her
            var params = {
                Key: {
                    "email": {
                        S: this.data.request.email
                    },
                },
                TableName: "Users_Info"
            };

            dynamodb.getItem(params, (err, resp) => {
                if (err) {
                    console.log(err, err.stack);
                    reject(err);
                }
                else {
                    console.log(resp);
                    if (resp != null) {
                        this.data.data.status = resp.Item.status.S;
                        this.data.data.maxSize = resp.Item.size_allowed.N;
                        this.data.data.consSize = resp.Item.size_consumed.N;


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
                                    // console.log(err);
                                    //console.log('Error');
                                    reject(err);
                                });
                        } else {
                            console.log('this is the end of the chaine');
                            resolve(true);
                        }

                    } else {
                        console.log("data is null in fetch data");
                        reject(" data in fetch data is null");
                    }
                }

            });

        })
    };

}