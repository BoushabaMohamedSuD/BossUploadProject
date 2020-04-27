import { ResponsibilitiesHolder } from './../holders/ResponsibilitiesHolder';
let AWS = require("aws-sdk");
AWS.config.update({ region: 'us-east-1' });
const s3 = new AWS.S3();


export class DeleteFolder implements ResponsibilitiesHolder {

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


            let type = this.data.request.type;


            let objects = new Array();

            this.data.
                data.keys.forEach(element => {
                    let object = {
                        Key: element.Key
                    };
                    objects.push(object);
                });

            let paramsList = {
                Bucket: type + "-bossupload",
                Delete: {
                    Objects: objects,
                    Quiet: false
                }
            };



            s3.deleteObjects(paramsList, (err, data) => {
                if (err) {
                    console.log(err, err.stack);
                    reject("we cannot delete objects");
                }
                else {
                    //console.log(data);

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


                }

            });





        });
    };

}