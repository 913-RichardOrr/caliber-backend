import axios from "axios";

export interface AssociateEvent {
  path: string;
  httpMethod: string;
  body?: string;
}
/**
 * get the names/ids of all the associates in a batch
 * @param path is the string path with the batch/week information.
 */
export async function getAssociates(path: string): Promise<any[] | null> {
  let URI: string = 'https://caliber2-mock.revaturelabs.com:443/mock/training';
  let newpath = path.split('/');
  return axios.get(URI +"/batch/"+newpath[newpath.length-1], { withCredentials: true })
    .then((result: { data: any; }) => result.data)
    .catch((err: any) => {
      console.error(err);
      return null;
    });
}