import * as indexModule from './index'
import createResponse from './createResponse'
import { Client } from 'pg';

export interface AssociateEvent {
  path: string;
  httpMethod: string;
  body?: string;
}
/**
 * Method is get
 * get the note and technical status for that person for that week
 * @param path is the string path with the batch/week/associate information.
 */
export async function getAssociate(path: string): Promise<QCFeedback | null> {
  let associateInfo = parsePath(path);
  const client = new Client();
  client.connect();
  const query = `select batchId,weekId,associateId from qc_notes where batchId = $1::text
    && weekId = $2::integer && associateId = $3::integer`;
  let res: any;
  try {
    res = await client.query(query, [associateInfo.batchId,associateInfo.weekId,associateInfo.associateIds]);
  } catch (error) {
    console.log(error);
  }
  return res;
};

//method is put
//create the note and technical status for that person for that week
export async function putAssociate(updateObject: any): Promise<QCFeedback | null> {
  console.log("Inside put associate!");
  
  // let response = new QCFeedback();
  return null;
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
    await client.connect();
    await client.query(q, args);

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

function parsePath(path: string): any {
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

