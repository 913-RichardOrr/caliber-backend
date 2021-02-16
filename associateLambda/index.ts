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
  
  return null;
};

//method is put
//create the note and technical status for that person for that week
export async function putAssociate(updateObject: any): Promise<qcFeedback | null> {
  let response = new qcFeedback();
  return response;
}

//method is patch
//update an existing note or status
export const patchAssociate = async (path:string,  updateObject: any): Promise<qcFeedback | null> => {
  return null;
};

export class qcFeedback {
  batchId: string = '';
  weekId: number = 0;
  associateId: string = '';
  qcNote: string = '';
  qcTechnicalStatus: number = 0;
}
