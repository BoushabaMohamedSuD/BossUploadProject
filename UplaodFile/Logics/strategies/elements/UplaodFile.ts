import { UpdateDB } from './../../responsibilities/elements/UpdateDB';
import { FilterUpdateObject } from './../../responsibilities/elements/FilterUpdateObject';
import { FetchListKeys } from './../../responsibilities/elements/FetchListKeys';
import { GeneratorUrl } from './../../responsibilities/elements/GeneratorUrl';
import { Filter } from './../../responsibilities/elements/Filter';
import { FetchData } from './../../responsibilities/elements/FetchData';
import { ResponsibilitiesHolder } from './../../responsibilities/holders/ResponsibilitiesHolder';
import { StrategiesHolder } from './../holders/StrategiesHolder';
export class UplaodFile implements StrategiesHolder {
    private chaine!: ResponsibilitiesHolder;
    private event: any;
    private data: {
        request: {
            email: string,
            key: string,
            folder: string,
            type: string,
            fileSize: number,
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
            url: String,
        }

    };
    constructor(event: any) {
        this.event = event;
        this.data = {
            request: {
                email: "",
                key: "",
                folder: "",
                type: "",
                fileSize: 0,
            },
            data: {
                status: "",
                maxSize: 0,
                consSize: 0,
                keys: new Array(),
            },
            response: {
                url: "",
            }
        };


        this.treatment();

        this.chaine = new FetchData(this.data);

        this.chaine
            .setNextChaine(new FetchListKeys(this.data))
            .setNextChaine(new Filter(this.data))
            .setNextChaine(new FilterUpdateObject(this.data))
            .setNextChaine(new GeneratorUrl(this.data))
        //.setNextChaine(new UpdateDB(this.data));


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
        //this.data.request.email = "nodejs1998yz@gmail.com"
        this.data.request.key = body.key;
        this.data.request.folder = body.folder;
        this.data.request.fileSize = body.fileSize;
        this.data.request.type = body.type;
        console.log(this.data);

    }


}