import * as indexModule from './index'

// lambda handler function

export interface AssocEvent {
  path: string;
  httpMethod: string;
  body?: string;
}

//figures out what http method has been called: GET, PUT, PATCH
//call the relevant helper function
//return the relevant object
export const handler = async (event: AssocEvent): Promise<any> => {};

//method is get
//get the note and technical status for that person for that week
export async function getAssociate(): Promise<any> {
  return true;
}

//method is put
//create the note and technical status for that person for that week
export async function putAssociate(): Promise<qcFeedback | null> {
  let response = new qcFeedback();
  return response;
}

//method is patch
//update an existing note or status
export const patchAssociate = async (
  updateObject: string
): Promise<qcFeedback | null> => {
  return null;
}

export class qcFeedback {
  batchId: string = '';
  weekId: number = 0;
  associateId: string = '';
  qcNote: string = '';
  qcTechnicalStatus: number = 0;
}
