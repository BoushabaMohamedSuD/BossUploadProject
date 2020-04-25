import { ResponsibilitiesHolder } from './../holders/ResponsibilitiesHolder';

const AWS = require("aws-sdk");
var s3 = new AWS.S3();
export class GeneratorUrl implements ResponsibilitiesHolder {

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
            let email = this.data.request.email;
            let key = this.data.request.key;
            let folder = this.data.request.folder;
            let type = this.data.request.type;
            let params
            if (folder != "") {
                params = {
                    Bucket: type + '-bossupload',
                    Key: email + "/" + folder + "/" + key,
                    ContentType: "multipart/form-data",
                    Expires: 60
                };

            } else {
                params = {
                    Bucket: type + '-bossupload',
                    Key: email + "/" + key,
                    ContentType: "multipart/form-data",
                    Expires: 60
                };

            }
            s3.getSignedUrl('putObject', params, (err, url) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log('The URL is', url);
                    this.data.response.url = url;


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