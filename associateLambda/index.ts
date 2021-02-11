// lambda handler function

interface AssocEvent {
  path: string;
  body?: string;
  method?: string;
}

//figures out what http method has been called: GET, PUT, PATCH
//call the relevant helper function
//return the relevant object
export const handler = async (event: AssocEvent): Promise<any> => {};

//method is get
//get the note and technical status for that person for that week
export const getAssociate = async (): Promise<any> => {};

//method is put
//create the note and technical status for that person for that week
export const putAssociate = async (): Promise<any> => {};

//method is patch
//update an existing note or status
export const patchAssociate = async (updateObject: string): Promise<any> => {

}

export class qcFeedback {
    batchId: string = '';
    weekId: number = 0;
    associateId: string = '';
    qcNote: string = '';
    qcTechnicalStatus: number = 0;
}
