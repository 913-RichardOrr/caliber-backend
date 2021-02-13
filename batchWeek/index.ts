///batches/{batchId}/weeks
//      POST (add a new week to this batch)
// /batches/{batchId}/weeks/{weekId}
//      GET (get all the information for the specified week)
//              -name
//              -notes
//              -etc
//      POST (add an overall note for the batch)

//check path and method name


export interface BatchWeekEvent {
    path: string;
    body?: string;
    method?: string;
}

//handler function for Lambda
export const handler = async (event: BatchWeekEvent) => {
    return '';
}

//a POST method to add a new week to a batch
export const addNewWeek = async (): Promise<any> => {};

//a GET method to get all weeks
export const getWeek = async (): Promise<any> => {};

//a POST method to a note to an overall note to a week
export const addNote = async (): Promise<any> => {};
