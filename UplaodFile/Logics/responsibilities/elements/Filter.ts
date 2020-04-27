import { ResponsibilitiesHolder } from './../holders/ResponsibilitiesHolder';
import { CheckSize } from '../../templates/CheckSize';
import { CheckStatus } from '../../templates/CheckStatus';
import { CheckFileSize } from '../../templates/CheckFileSize';
export class Filter implements ResponsibilitiesHolder {

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
            let err: string[] = [];
            let respSize: boolean = CheckSize(this.data);
            let respStatus: boolean = CheckStatus(this.data);
            let respFileSize: boolean = CheckFileSize(this.data);
            if (respSize && respStatus && respFileSize) {
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
            } else {

                if (!respStatus) {
                    console.log("error checking status");
                    err.push("error checking status");
                }
                if (!respSize) {
                    console.log("error checking size");
                    err.push("error checking size")
                }
                if (!respFileSize) {
                    console.log("error checking file size");
                    err.push("error checking file size");
                }
                reject(err);
            }

        })
    };

}