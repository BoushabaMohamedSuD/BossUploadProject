export function CheckStatus(data: any): boolean {
    console.log('Check Status');
    if (data.data.status == "Normal") {
        console.log("status confirmed");
        return true;
    } else {
        console.log("status is not confirmed")
        return false;
    }

}