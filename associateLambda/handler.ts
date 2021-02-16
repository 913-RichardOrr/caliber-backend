import createResponse from './createResponse';
import {getAssociate,putAssociate,patchAssociate} from './index'

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
  export async function handler(event: AssociateEvent): Promise<any> {
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
        console.log("Inside put!");
        const associate = await putAssociate(event.body);
        if (associate) {
          return createResponse(JSON.stringify(associate), 200);
        } else {
          return createResponse('', 404);
        }
      }
      case ('PATCH'): {
        const associate = await patchAssociate(event.path, event.body);
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