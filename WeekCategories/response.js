"use strict";
/**
 * When the function is called an http response is created
 * @param body- message to be in the body of the http response
 * @param statusCode- status code to be returned
 * @param header- any extra header to be added to our baseHeader
 */
exports.__esModule = true;
function createResponse(body, statusCode, headers) {
    if (body === void 0) { body = {}; }
    if (statusCode === void 0) { statusCode = 200; }
    if (headers === void 0) { headers = {}; }
    var baseHeader = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
    };
    Object.keys(headers).forEach(function (key) {
        baseHeader[key] = headers[key];
    });
    return {
        body: body,
        statusCode: statusCode,
        headers: baseHeader
    };
}
exports["default"] = createResponse;
