// qc/batches/{batchId}/weeks
//      GET (Gets all of the week objects for a given batchId in the qcWeeks table in our postgreSQL)
//      POST (add a new week to this batch)
// qc/batches/{batchId}/weeks/{weekId}
//      POST (update overall note and update overall status for the batch)

import GetWeeksByBatchId from './GetWeeksByBatchId';
import AddWeekLambda from './AddWeekLambda';
import UpdateFeedbackLambda from './UpdateFeedbackLambda';

export interface BatchWeekEvent {
    path: string;
    body?: string;
    httpMethod?: string;
}

//handler function for Lambda
export const handler = async (event: BatchWeekEvent) => {
    // obtain everything in the path after "/batches/"
    let eventSubstr = event.path.split('/batches/')[1];
    // contains "{batchId}", "weeks", and optionally "{weeknumber}"
    let sub = eventSubstr.split('/');

    // check length of substring after the split
    if(sub.length === 2) {
        // check if HTTP method is GET
        if(event.httpMethod === 'GET'){
            return GetWeeksByBatchId(sub[0]);
        // check if HTTP method is POST
        } else if (event.httpMethod === 'POST'){
            return AddWeekLambda(event);
        }
    } else if (sub.length === 3) {
        // check if HTTP method is POST
        if(event.httpMethod === 'POST'){
            return UpdateFeedbackLambda(event);
        }
    }

    return {statusCode: 400};
}
