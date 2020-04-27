import { Processor } from './../../general_interface/Processor';
export interface ResponsibilitiesHolder extends Processor {

    setNextChaine: (chaine: ResponsibilitiesHolder) => ResponsibilitiesHolder;
    process: () => Promise<any>;

}