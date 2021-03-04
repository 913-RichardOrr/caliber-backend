import GetWeeksByBatchId from './GetWeeksByBatchId';
import AddWeekLambda from './AddWeekLambda';
import UpdateFeedbackLambda from './UpdateFeedbackLambda';

export interface BatchWeekEvent {
    path: string;
    body?: string; // contains a week object when doing either post request
    httpMethod: string;
}

/**
 * This is the entrypoint to the dockerized lambda function which is responsible for handling the
 * following API Gateway enpoints/requests:
 * 
 * /qc/batches/{batchid}/weeks
 *     GET Gets all of the week objects for a given batchId in the qcWeeks table
 *     POST - Adds a new week object into the qcWeeks table
 * /qc/batches/{batchid}/weeks/{weeknumber}
 *     POST - Updates the overall note and technical status for a week object in the qcWeeks table
 * 
 * @param {BatchWeekEvent} event - The event passed in from API Gateway
 * @returns {object} - An HTTP response
 */
export const handler = async (event: BatchWeekEvent) => {
    // obtain everything in the path after "/batches/"
    let eventSubstr = event.path.split('/batches/')[1];
    // contains "{batchId}", "weeks", and optionally "{weeknumber}"
    let sub = eventSubstr.split('/');

    // check length of substring after the split
    if(sub.length === 2) {
        // GET on /qc/batches/{batchid}/weeks
        if(event.httpMethod === 'GET'){
            return GetWeeksByBatchId(sub[0]);
        // POST on /qc/batches/{batchid}/weeks
        } else if (event.httpMethod === 'POST'){
            return AddWeekLambda(event);
        }
    } else if (sub.length === 3) {
        // POST on /qc/batches/{batchid}/weeks/{weeknumber}
        if(event.httpMethod === 'POST'){
            return UpdateFeedbackLambda(event);
        }
    }
    // malformed request
    return {
        statusCode: 400,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        }
    };
}
