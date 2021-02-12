// lambda handler function

export interface AssocEvent {
  path: string;
  body?: string;
  method: string;
}

//figures out what http method has been called: GET, PUT, PATCH
//call the relevant helper function
//return the relevant object
export async function handler(event: AssocEvent): Promise<any> {
  return {};
}

export class qcFeedback {
  batchId: string = '';
  weekId: number = -1;
  associateId: string = '';
  qcNote: string = '';
  qcTechnicalStatus: number = -1;
}

//method is get
//get the note and technical status for that person for that week
export async function getAssociate(): Promise<any> {
  return true;
}

//method is put
//create the note and technical status for that person for that week
export async function putAssociate(): Promise<any> {}

//method is patch
//update an existing note or status
export async function patchAssociate(): Promise<any> {}
