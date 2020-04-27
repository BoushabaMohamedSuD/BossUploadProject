import { ResponsibilitiesHolder } from './../holders/ResponsibilitiesHolder';
let AWS = require("aws-sdk");
AWS.config.update({ region: 'us-east-1' });
const s3 = new AWS.S3();

export class FetchListKeys implements ResponsibilitiesHolder {

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
            let type = this.data.request.type;

            let params;

            if (folder != "") {
                params = {
                    Bucket: type + "-bossupload",
                    Prefix: email + "/" + folder,
                    //MaxKeys: 2
                };
            } else {
                params = {
                    Bucket: type + "-bossupload",
                    Prefix: email
                    //MaxKeys: 2
                };
            }


            s3.listObjects(params, (err, data) => {
                if (err) {
                    console.log(err, err.stack);
                    reject("we cannot list keys");
                }
                else {
                    //console.log(data);
                    data.Contents.forEach(element => {
                        let object = {
                            Key: element.Key,
                            size: element.Size
                        };
                        this.data.data.keys.push(object);
                    });
                    //console.log(objects);


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


                };


            });



        })
    };

}