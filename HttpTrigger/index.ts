import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as imageThumbnail from 'image-thumbnail';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const imageUrl = (req.query.imageUrl || (req.body && req.body.imageUrl));    

    try {
        if (imageUrl) {
            let options = { responseType: 'base64' }
            const thumbnail = await imageThumbnail({ uri: imageUrl }, options);            
            
            context.res = {
                // status: 200, /* Defaults to 200 */
                body: thumbnail
            };
        }
        else {
            context.res = {
                status: 400,
                body: "Please pass a image URL to get the thumbnail"
            };
        }
    }
    catch (err) {
        console.error(err);
        context.res = {
            status: 500,
            body: err
        };
    }
};

export default httpTrigger;