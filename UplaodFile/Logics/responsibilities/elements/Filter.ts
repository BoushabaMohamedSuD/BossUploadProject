import { ResponsibilitiesHolder } from './../holders/ResponsibilitiesHolder';
import { CheckSize } from '../../templates/CheckSize';
import { CheckStatus } from '../../templates/CheckStatus';
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
            // code her
            let respSize: boolean = CheckSize(this.data);
            let respStatus: boolean = CheckStatus(this.data);
            if (respSize && respStatus) {
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
                    reject("error checking status");
                } else {
                    console.log("error checking size ");
                    reject("error checking size");
                }
            }

        })
    };

}