import { Client } from 'pg';
import axios from "axios";

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
export async function getAssociates(path: string): Promise<QCFeedback | null> {
  let URI: string = 'https://aosczl5fvf.execute-api.us-west-2.amazonaws.com/default';
  let newpath = path.split('/');
  return axios.get(URI +"/batch/"+newpath[newpath.length-1], { withCredentials: true }).then((result: { data: any; }) => result.data).catch((err: any) => { console.error(err) });
}

export interface QCFeedback {
  batchid: string;
  weeknumber: number;
  associateid: string;
  notecontent: string;
  technicalstatus: number;
}
