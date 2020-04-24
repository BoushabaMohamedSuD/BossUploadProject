import { StrategiesHolder } from './holders/StrategiesHolder';


export class Context {
    private strategy!: StrategiesHolder;
    constructor(rastrategys: StrategiesHolder) {
        this.strategy = this.strategy;
    }

    public process(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.strategy.process()
                .then((resp) => {
                    if (resp) {
                        resolve(true);
                    }
                    reject(false)
                })
                .catch((err) => {
                    reject(false);
                });



        });
    }
}