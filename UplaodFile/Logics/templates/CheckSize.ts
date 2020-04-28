export function CheckSize(data: any): boolean {
    console.log('Check Size');
    let consumedSize = data.data.consSize;
    let maxSize = data.data.maxSize;
    let fileSize = data.request.fileSize;
    console.log(":::::::::::::::::::::::::::::");
    console.log("file size : " + fileSize);
    console.log("maxsize : " + maxSize);
    console.log(typeof (maxSize));
    console.log("consumedsize : " + consumedSize);
    console.log(":::::::::::::::::::::::::::::");
    if ((fileSize + consumedSize) < maxSize) {
        console.log("still have space");
        return true;
    } else {
        console.log("free size consumed");
        return false;
    }


}