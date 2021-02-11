// lambda handler function
import * as associateLambda from './associateService';

export interface AssocEvent {
  path: string;
  body?: any;
  method?: string;
}

//figures out what http method has been called: GET, PUT, PATCH
//call the relevant helper function
//return the relevant object
export async function handler(event: AssocEvent): Promise<any> {
  return {};
}

export class qcFeedback {
  batchId: string = '';
  weekId: number = -1;
  associateId: string = '';
  qcNote: string = '';
  qcTechnicalStatus: number = -1;
}
