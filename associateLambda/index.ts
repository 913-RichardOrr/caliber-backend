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

/**
 * Updates an associate's technical status or note for this week
 * @param path 
 * @param updateObject 
 */
export const patchAssociate = async (
  path: string,
  updateObject: string
): Promise<QCFeedback | null> => {
  // Connect to database
  const client = new Client();

  // Get the IDs from the path
  const {batchId, weekId, associateId} = parsePath(path);

  // Figure out if we're editing the note or the technical status
  let q: string;
  let args = ['', associateId, weekId, batchId];
  const obj = JSON.parse(updateObject);
  if(obj.qcNote) {
    q = 'update qcnotes set qcNote = $1::text where associateid = $2::text and weekid = $3::integer and batchid = $4::text';
    args[0] = obj.qcNote;
  } else if(obj.qcTechnicalStatus) {
    q = 'update qcnotes set qcTechnicalStatus = $1::integer where associateid = $2::text and weekid = $3::integer and batchid = $4::text';
    args[0] = obj.qcTechnicalStatus;
  } else {
    return null;
  }

  // Actually update the table, return updated object if successful (or null if not)
  try {
    console.log(`args: ${JSON.stringify(args)}`);
    await client.connect();
    await client.query(q, args);
    console.log(`after args: ${JSON.stringify(args)}`);

    const q_check = 'select q.batchId, q.weekId, q.associateId, q.qcNote, q.qcTechnicalStatus from qcNotes q where associateid = $2::text and weekid = $3::integer and batchid = $4::text';
    const res = await client.query(q_check, args);
  
    return res.rows[0] as QCFeedback;
  } catch (err) {
    console.log(err);
  
    return null;
  } finally {
    client.end();
  }
}

function parsePath (path: string): any {
  const parts = path.split('/');
  const associateId = parts[parts.length - 1];
  const weekId = Number(parts[parts.length - 3]);
  const batchId = parts[parts.length - 5];
  return {'batchId': batchId, 'weekId': weekId, 'associateId': associateId};
}

export interface QCFeedback {
  batchId: string;
  weekId: number;
  associateId: string;
  qcNote: string;
  qcTechnicalStatus: number;
}
