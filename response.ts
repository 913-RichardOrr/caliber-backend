export function createResponse(body: any = {}, statusCode: number = 200, headers: any = {}) {
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

export default createResponse();