import createResponse from './response';
import { getAssociates } from './batchAssociatesHelper'

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
  const associates = await getAssociates(event.path);
  if (associates) {
    return createResponse(JSON.stringify(associates), 200);
  }
  return createResponse('', 404);
}