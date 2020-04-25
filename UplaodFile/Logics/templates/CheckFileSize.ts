export function CheckFileSize(data: any): boolean {
    console.log('Check File Size');
    let fileSize = data.data.request.fileSize;
    if (fileSize < 26214400) {
        console.log("file size less then 25 mb allowed");
        return true;
    } else {
        console.log("file size bigger then 25 mb not allowed ");
        return false;
    }


}