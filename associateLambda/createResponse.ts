export default function createResponse(body: any = {}, statusCode: number = 200, headers: any = {}) {
    const baseHeader: any = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
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