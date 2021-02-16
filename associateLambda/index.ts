import * as indexModule from './index';
import createResponse from './createResponse';
import { Client } from 'pg';

export interface AssociateEvent {
  path: string;
  httpMethod: string;
  body?: string;
}

/**
 * figures out what http method has been called: GET, PUT, PATCH, then
 * calls the relevant helper function return the relevant object
 * @param event
 */
export const handler = async (event: AssociateEvent): Promise<any> => {
  switch (event.httpMethod) {
    case 'GET': {
      const associate = await getAssociate(event.path);
      if (associate) {
        return createResponse(JSON.stringify(associate), 200);
      } else {
        return createResponse('', 404);
      }
    }
    case 'PUT': {
      const associate = await putAssociate(event.body, event.path);
      if (associate) {
        return createResponse(JSON.stringify(associate), 200);
      } else {
        return createResponse('', 404);
      }
    }
    case 'PATCH': {
      const associate = await patchAssociate(event.path, event.body);
      if (associate) {
        return createResponse(JSON.stringify(associate), 200);
      } else {
        return createResponse('', 404);
      }
    }
    default: {
      console.log('Something went wrong in handler');
      break;
    }
  }
};

/**
 * Method is get
 * get the note and technical status for that person for that week
 * @param path is the string path with the batch/week/associate information.
 */
export async function getAssociate(path: string): Promise<QCFeedback | null> {
  let associateInfo = parsePath(path);
  const client = new Client();
  client.connect();
  const q = `select batchId,weekId,associateId from qc_notes where batchId = '${associateInfo.batchId}'
    && weekId = '${associateInfo.weekId}' && associateId = '${associateInfo.associateId}'`;
  let res: any;
  try {
    res = await client.query(q);
  } catch (error) {
    console.log(error);
  }
  return res;
}
/**
 * adds a new associate
 * @param body - contains the qcNote and technical status
 */
export async function putAssociate(body: string, path: string) {
  let bodyObject = JSON.parse(body);
  let pathObject = JSON.parse(parsePath(path));
  let response = {
    batchId: pathObject.batchId,
    weekId: pathObject.weekId,
    associateId: pathObject.associateId,
    qcNote: bodyObject.qcNote,
    qcTechnicalStatus: bodyObject.qcTechnicalStatus,
  };
  console.log(`body: ${JSON.stringify(bodyObject)}`);
  console.log(`path: ${JSON.stringify(pathObject)}`);
  console.log(`response: ${JSON.stringify(response)}`);

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
  return response || null;
}
export const patchAssociate = async (
  path: string,
  updateObject: string
): Promise<QCFeedback | null> => {
  const client = new Client();

  const q_note =
    'update qcnotes set note = $1::text where associateid = $2::text and weekid = $3::integer and batchid = $3::text';
  const q_status =
    'update qcnotes set techstatus = $1::integer where associateid = $2::text and weekid = $3::integer and batchid = $3::text';

  return null;
};

function parsePath(path: string): any {
  const parts = path.split('/');
  const associateId = parts[parts.length - 1];
  const weekId = Number(parts[parts.length - 3]);
  const batchId = Number(parts[parts.length - 5]);
  return parts[0];
}

export interface QCFeedback {
  batchId: string;
  weekId: number;
  associateId: string;
  qcNote: string;
  qcTechnicalStatus: number;
}
