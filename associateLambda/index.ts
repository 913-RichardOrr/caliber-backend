import { Client } from 'pg';
import * as indexModule from './index';

// lambda handler function

export interface AssociateEvent {
  path: string;
  httpMethod: string;
  body?: string;
}

//figures out what http method has been called: GET, PUT, PATCH
//call the relevant helper function
//return the relevant object
export const handler = async (event: AssociateEvent): Promise<any> => {
  putAssociate(JSON.stringify({ qcNote: 'note', qcTechnicalStatus: 'status' }));
};

//method is get
//get the note and technical status for that person for that week
export async function getAssociate(
  batchId: string,
  weekId: number,
  associateId: string
): Promise<qcFeedback | null> {
  return null;
}

/**
 * adds a new associate
 * @param body - contains the qcNote and technical status
 */
export async function putAssociate(body: string): Promise<qcFeedback | null> {
  let response = new qcFeedback();
  // gets the strings from the path helper function.
  response = { ...JSON.parse(body) };
  const client = new Client();
  await client.connect();
  const res = await client.query(
    'insert into qc_note(batchid, weekid, associateid, qcnote, qctechnicalstatus) values ($1::text, $2::integer, $3::integer, $4::text, $5::integer) returning *',
    [
      response.batchId,
      response.weekId,
      response.associateId,
      response.qcNote,
      response.qcTechnicalStatus,
    ]
  );
  return res;
}

//method is patch
//update an existing note or status
export const patchAssociate = async (
  updateObject: string
): Promise<qcFeedback | null> => {
  return null;
};

export class qcFeedback {
  batchId: string = '';
  weekId: number = 0;
  associateId: string = '';
  qcNote: string = '';
  qcTechnicalStatus: number = 0;
}
