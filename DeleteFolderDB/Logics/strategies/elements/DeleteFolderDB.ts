import { FetchObjects } from './../../responsibilities/elements/FetchObjects';

import { ResponsibilitiesHolder } from './../../responsibilities/holders/ResponsibilitiesHolder';
import { StrategiesHolder } from './../holders/StrategiesHolder';
export class DeleteFolderDB implements StrategiesHolder {
    private chaine!: ResponsibilitiesHolder;
    private event: any;
    private data: {
        request: {
            email: string,
            folder: string,
            type: string,

        },
        data: {
            status: string,
            maxSize: number,
            consSize: number,
            keys: {
                key: string,
                size: number
            }[],
        },
        response: {
            resp: boolean,
        }

    };
    constructor(event: any) {
        this.event = event;
        this.data = {
            request: {
                email: "",
                folder: "",
                type: "",

            },
            data: {
                status: "",
                maxSize: 0,
                consSize: 0,
                keys: new Array(),
            },
            response: {
                resp: false,
            }
        };


        this.treatment();

        this.chaine = new FetchObjects(this.data);

        /*this.chaine
            .setNextChaine(new FetchListKeys(this.data))
            .setNextChaine(new Filter(this.data))
            .setNextChaine(new FilterUpdateObject(this.data))
            .setNextChaine(new GeneratorUrl(this.data));;*/


    }

    public process(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.chaine
                .process()
                .then((resp) => {
                    //resp true or false
                    if (resp) {
                        //if the response is true we resolve data
                        resolve(this.data.response);
                    } else {
                        // if not some of resp fails
                        reject("some of respo fails");

                    }
                })
                .catch(err => {
                    //some of respo reject an error
                    reject(err);
                });

        })
    };

    private treatment(): void {
        let body = JSON.parse(this.event.body);
        this.data.request.email = this.event.requestContext.authorizer.claims.email;
        this.data.request.folder = body.folder;
        this.data.request.type = body.type;
        console.log(this.data);
    }


}