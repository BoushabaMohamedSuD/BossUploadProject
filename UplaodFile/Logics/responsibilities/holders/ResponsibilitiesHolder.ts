
export interface ResponsibilitiesHolder {

    setNextChaine: (chaine: ResponsibilitiesHolder) => ResponsibilitiesHolder;
    process: () => Promise<any>;

}