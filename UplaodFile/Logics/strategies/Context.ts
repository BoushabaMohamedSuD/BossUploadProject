import { StrategiesHolder } from './holders/StrategiesHolder';


export class Context {
    private strategy!: StrategiesHolder;
    constructor(strategy: StrategiesHolder) {
        this.strategy = strategy;
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