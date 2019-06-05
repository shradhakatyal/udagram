import fs from 'fs';
import Jimp = require('jimp');
import http from 'http';
import request from 'request';

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string>{
    return new Promise( async resolve => {
        const photo = await Jimp.read(inputURL);
        const outpath = '/tmp/filtered.'+Math.floor(Math.random() * 2000)+'.jpg';
        await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(__dirname+outpath, (img)=>{
            resolve(__dirname+outpath);
        });
    });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files:Array<string>){
    for( let file of files) {
        fs.unlinkSync(file);
    }
}

export async function validateImageUrl(imageURL: string) {
    return new Promise( async (resolve, reject) => {
        if(!imageURL) {
            reject("Image url is missing");
        }
        try {
            request.get(imageURL)
            .on('error', function(err: any) {
                reject(err);
            })
            .on('response', function(response: any) {
                if(response && response.headers["content-type"].indexOf("image") > -1) {
                    resolve(true);
                }
                reject(false);
            });
        } catch(e) {
            reject(e);
        }
        
    });
    
}


    