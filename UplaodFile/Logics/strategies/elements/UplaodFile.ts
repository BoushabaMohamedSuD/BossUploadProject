import { StrategiesHolder } from './../holders/StrategiesHolder';
export class UplaodFile implements StrategiesHolder {
    private event: any;
    private data: any;
    constructor(event: any) {
        this.event = event
        this.treatment(this.event, this.data)
    }

    public process(): Promise<any> {
        return new Promise((resolve, reject) => {

        })
    };

    private treatment(event: any, data: any): void {
        // custom mapping event to data
    }


}