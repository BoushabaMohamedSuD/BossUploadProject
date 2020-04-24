import { ResponsibilitiesHolder } from './../holders/ResponsibilitiesHolder';
export class FetchData implements ResponsibilitiesHolder {

    private Nextchaine!: ResponsibilitiesHolder;
    public setNextChaine(chaine: ResponsibilitiesHolder): ResponsibilitiesHolder {
        this.Nextchaine = chaine;
        return this.Nextchaine;
    }

    public process(): Promise<any> {
        return new Promise((resolve, reject) => {
            // code her

            if (this.Nextchaine != null) {
                console.log('going to next chaine');
                this.Nextchaine.process()
                    .then((data) => {
                        resolve(data);

                    })
                    .catch((err) => {
                        console.log(err);
                        console.log('Error');
                        reject(err);
                    });
            } else {
                console.log('this is the end of the chaine');
            }
        })
    };

}