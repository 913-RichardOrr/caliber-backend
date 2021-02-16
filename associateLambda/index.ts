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

export const patchAssociate = async (
  path: string,
  updateObject: string
): Promise<QCFeedback | null> => {
  const client = new Client();



  const q_note = 'update qcnotes set note = $1::text where associateid = $2::text and weekid = $3::integer and batchid = $3::text';
  const q_status = 'update qcnotes set techstatus = $1::integer where associateid = $2::text and weekid = $3::integer and batchid = $3::text';


  return null;
}

function parsePath(path: string): any {
  const parts = path.split('/');
  const associateId = parts[parts.length - 1];
  const weekId = Number(parts[parts.length - 3]);
  const batchId = Number(parts[parts.length - 5]);
  return { batchId, weekId, associateId };
}

export interface QCFeedback {
  batchId: string;
  weekId: number;
  associateId: string;
  qcNote: string;
  qcTechnicalStatus: number;
}