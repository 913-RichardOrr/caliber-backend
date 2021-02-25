/**
 * When the function is called an http response is created
 * @param body- message to be in the body of the http response
 * @param statusCode- status code to be returned
 * @param header- any extra header to be added to our baseHeader
 */

export default function createResponse(body: any = {}, statusCode: number = 200, headers: any = {}) {
    const baseHeader: any = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
    }
    Object.keys(headers).forEach(key => {
        baseHeader[key] = headers[key];
    })
    return {
        body,
        statusCode,
        headers: baseHeader
    };
}
