
export interface ResponsibilitiesHolder {

    setNextChaine: (chaine: ResponsibilitiesHolder) => void;
    process: () => Promise<any>;

}