import { Processor } from './../../general_interface/Processor';
export interface StrategiesHolder extends Processor {
    process: () => Promise<any>;

}