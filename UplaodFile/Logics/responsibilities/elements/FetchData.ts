import { ResponsibilitiesHolder } from './../holders/ResponsibilitiesHolder';
export class FetchData implements ResponsibilitiesHolder {


    public setNextChaine(chaine: ResponsibilitiesHolder): ResponsibilitiesHolder {
        return chaine;
    }

    public process(): Promise<any> {
        return new Promise((resolve, reject) => {

        })
    };

}