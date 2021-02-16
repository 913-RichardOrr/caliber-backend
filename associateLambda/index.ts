import * as indexModule from './index'
import createResponse from './createResponse'
import { Client } from 'pg';


export interface AssocEvent {
  path: string;
  httpMethod: string;
  body?: string;
}

/**
 * figures out what http method has been called: GET, PUT, PATCH, then 
 * calls the relevant helper function return the relevant object
 * @param event 
 */
export const handler = async (event: AssocEvent): Promise<any> => {
  switch (event.httpMethod) {
    case ('GET'): {
      const associate = await getAssociate(event.path);
      if (associate) {
        return createResponse(JSON.stringify(associate), 200);
      } else {
        return createResponse('', 404);
      }
    }
    case ('PUT'): {
      const associate = await putAssociate(event.body);
      if (associate) {
        return createResponse(JSON.stringify(associate), 200);
      } else {
        return createResponse('', 404);
      }
    }
    case ('PATCH'): {
      const associate = await patchAssociate(event.path,event.body);
      if (associate) {
        return createResponse(JSON.stringify(associate), 200);
      } else {
        return createResponse('', 404);
      }
    }
    default: {
      console.log("Something went wrong in handler");
      break;
    }
  }


};

/**
 * method is get
 * get the note and technical status for that person for that week
 * @param path is the string path with the batch/week/associate information.
 */
export async function getAssociate(path:string): Promise<qcFeedback | null> {
  // let splitter = path.split('/');
  // console.log(splitter);
  let associateInfo =  parsePath(path);
  const client = new Client();
    client.connect();
    const q = `select id, username, money from diner`;
    //const args = [event.username, event.password];
    let res;
    try{
        res = await client.query(q);
    } catch (error) {
        console.log(error);
    }
    console.log(res);
    client.end();
    return res;
};

//method is put
//create the note and technical status for that person for that week
export async function putAssociate(updateObject: any): Promise<qcFeedback | null> {
  let response = new qcFeedback();
  return response;
}

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