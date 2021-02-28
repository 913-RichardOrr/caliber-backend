import createResponse from './response';
import { getAssociates } from './batchAssociatesHelper'

export interface AssociateEvent {
  path: string;
  httpMethod: string;
  body?: string;
}

/**
 * passes the path to the helper function (to call mock api) 
 * handles the helper function's output
 * @param event 
 */
export async function handler(event: AssociateEvent): Promise<any> {
  const associates = await getAssociates(event.path);
  if (associates) {
    return createResponse(JSON.stringify(associates), 200);
  }
  return createResponse('', 404);
}