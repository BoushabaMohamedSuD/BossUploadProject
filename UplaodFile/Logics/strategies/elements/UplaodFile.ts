import { StrategiesHolder } from './../holders/StrategiesHolder';
export class UplaodFile implements StrategiesHolder {
    private event: any;
    private data: any;
    constructor(event: any) {
        this.event = event
        this.treatment()
    }

    public process(): Promise<any> {
        return new Promise((resolve, reject) => {

        })
    };

    private treatment(): void {
        // custom mapping event to data
    }


}