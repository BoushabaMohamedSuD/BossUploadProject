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
        },
        data: {
            status: string,
            maxSize: number,
            fileSize: number,
            expirationDate: number,
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
            },
            data: {
                status: "",
                maxSize: 0,
                fileSize: 0,
                expirationDate: 0,
            },
            response: {
                url: "",
            }
        };


        this.treatment();

        this.chaine = new FetchData(this.data);

        this.chaine
            .setNextChaine(new Filter(this.data))
            .setNextChaine(new GeneratorUrl(this.data));;


    }

    public process(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.chaine
                .process()
                .then((resp) => {
                    //resp true or false
                    if (resp) {
                        //if the response is true we resolve data
                        resolve(this.data);
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
        this.data.request.email = this.event.context.email;
        this.data.request.key = this.event.context.data.key;
        this.data.request.folder = this.event.context.data.folder;
        console.log(this.data);

    }


}