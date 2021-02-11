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

export const handler = (event: BatchWeekEvent) => {
    return '';
}

export function getAllWeeks(){
    return [];
}

