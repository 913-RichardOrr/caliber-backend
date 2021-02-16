import * as indexModule from './index';
import { Client } from 'pg';

// lambda handler function

export interface AssociateEvent {
  path: string;
  httpMethod: string;
  body?: string;
}

//figures out what http method has been called: GET, PUT, PATCH
//call the relevant helper function
//return the relevant object
export const handler = async (event: AssociateEvent): Promise<any> => {};

//method is get
//get the note and technical status for that person for that week
export async function getAssociate(batchId: string, weekId: number, associateId: string): Promise<QCFeedback|null> {
  return null;
}

//method is put
//create the note and technical status for that person for that week
export async function putAssociate(): Promise<QCFeedback | null> {
  let response = new QCFeedback();
  return response;
}

//method is patch
//update an existing note or status
export const patchAssociate = async (
  path: string,
  updateObject: string
): Promise<QCFeedback | null> => {
  const client = new Client();



  const q_note = 'update qcnotes set note = $1::text where associateid = $2::text and weekid = $3::integer and batchid = $3::text';
  const q_status = 'update qcnotes set techstatus = $1::integer where associateid = $2::text and weekid = $3::integer and batchid = $3::text';

  try {
    await client.connect();
    
  }

  return null;
}

function parsePath (path: string): Object {
  const parts = path.split('/');
  const associateId = parts[parts.length - 1];
  const weekId = Number(parts[parts.length - 3]);
  const batchId = Number(parts[parts.length - 5]);
  return {batchId, weekId, associateId};
}

export class QCFeedback {
  batchId: string = '';
  weekId: number = 0;
  associateId: string = '';
  qcNote: string = '';
  qcTechnicalStatus: number = 0;
}
