import * as indexModule from './index';
import createResponse from './createResponse';
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
  //if any of these params are undefined, return null and do not call anything
  if (!(associateInfo.batchId && associateInfo.weekId && associateInfo.associateId)) {
    return null;
  }
  const client = new Client();
  try {
    await client.connect();
    const query = `select batchId,weekId,associateId from qc_notes where batchId = $1::text
    && weekId = $2::integer && associateId = $3::text`;
    const res = await client.query(query, [
    associateInfo.batchId,
    associateInfo.weekId,
    associateInfo.associateId,
    ]);
    return res.rows[0] as QCFeedback;
  } catch (err) {
    console.log(err);
    return null;
  } finally {
    client.end();
  }
}
/**
 * adds a new associate's note and technical status for the given week.
 * @param body - contains the qcNote and technical status
 * @param path - contains the batchId, weekId, and associateId
 */
export async function putAssociate(
  body: string,
  path: string
): Promise<QCFeedback | null> {
  let bodyObject = JSON.parse(body);
  let pathObject = parsePath(path);
  let response = {
    batchId: pathObject.batchId,
    weekId: pathObject.weekId,
    associateId: pathObject.associateId,
    qcNote: bodyObject.qcNote,
    qcTechnicalStatus: bodyObject.qcTechnicalStatus,
  };

  if (response.batchId === undefined) {
    return null;
  } else {
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
    client.end();
    return response;
  }
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
  const { batchId, weekId, associateId } = parsePath(path);

  // Figure out if we're editing the note or the technical status
  let q: string;
  let args = ['', associateId, weekId, batchId];
  const obj = JSON.parse(updateObject);
  if (obj.qcNote) {
    q =
      'update qcnotes set qcNote = $1::text where associateid = $2::text and weekid = $3::integer and batchid = $4::text';
    args[0] = obj.qcNote;
  } else if (obj.qcTechnicalStatus) {
    q =
      'update qcnotes set qcTechnicalStatus = $1::integer where associateid = $2::text and weekid = $3::integer and batchid = $4::text';
    args[0] = obj.qcTechnicalStatus;
  } else {
    return null;
  }

  // Actually update the table, return updated object if successful (or null if not)
  try {
    await client.connect();
    await client.query(q, args);

    const q_check =
      'select q.batchId, q.weekId, q.associateId, q.qcNote, q.qcTechnicalStatus from qcNotes q where associateid = $2::text and weekid = $3::integer and batchid = $4::text';
    const res = await client.query(q_check, args);

    return res.rows[0] as QCFeedback;
  } catch (err) {
    console.log(err);

    return null;
  } finally {
    client.end();
  }
};

function parsePath(path: string): any {
  const parts = path.split('/');
  const associateId = parts[parts.length - 1];
  const weekId = Number(parts[parts.length - 3]);
  const batchId = parts[parts.length - 5];
  return { batchId: batchId, weekId: weekId, associateId: associateId };
}

export interface QCFeedback {
  batchId: string;
  weekId: number;
  associateId: string;
  qcNote: string;
  qcTechnicalStatus: number;
}
