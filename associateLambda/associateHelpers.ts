import { Client } from 'pg';

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
export async function getAssociate(path: string): Promise<QCFeedback | null> {
  let associateInfo = parsePath(path);
  //if any of these params are undefined, return null and do not call anything
  if (!(associateInfo.batchid && associateInfo.weeknumber && associateInfo.associateid)) {
    return null;
  }
  const client = new Client();
  try {
    await client.connect();
    const query = `select batchid, weeknumber, associateid, notecontent, technicalstatus from qcnotes where batchid = $1::text and weeknumber = $2::integer and associateid = $3::text`;
    const res = await client.query(query, [
      associateInfo.batchid,
      associateInfo.weeknumber,
      associateInfo.associateid
    ]);
    return res.rows[0] as QCFeedback;
  } catch (err) {
    console.log(err);
    return null;
  } finally {
    client.end();
  }
}
/**
 * adds a new associate's note and technical status for the given week.
 * @param body - contains the noteContent and technical status
 * @param path - contains the batchId, weekNumber, and associateId
 */
export async function putAssociate(
  body: string,
  path: string
): Promise<QCFeedback | null> {
  let bodyObject = JSON.parse(body);
  let pathObject = parsePath(path);
  let response = {
    batchid: pathObject.batchid,
    weeknumber: pathObject.weeknumber,
    associateid: pathObject.associateid,
    notecontent: bodyObject.notecontent,
    technicalstatus: bodyObject.technicalstatus,
  };

  if (response.batchid === undefined) {
    return null;
  } else {
    const client = new Client();
    try {
      await client.connect();
      const res = await client.query(
        'insert into qcnotes(batchid, weeknumber, associateid, notecontent, technicalstatus) values ($1::text, $2::integer, $3::integer, $4::text, $5::integer) returning *',
        [
          response.batchid,
          response.weeknumber,
          response.associateid,
          response.notecontent,
          response.technicalstatus,
        ]
      );
      return response;
    } catch (err) {
      console.log(err);
      return null;
    } finally {
      client.end();
    }
  }
}

/**
 * Updates an associate's technical status or note for this week
 * @param path
 * @param updateObject
 */
export const patchAssociate = async (
  path: string,
  updateObject: string
): Promise<QCFeedback | null> => {
  // Connect to database
  const client = new Client();

  // Get the IDs from the path
  const { batchid, weeknumber, associateid } = parsePath(path);

  // Figure out how we're updating the note and/or the technical status
  const obj = JSON.parse(updateObject);
  
  let q_note = 'update qcnotes set notecontent = $1::text where associateid = $2::text and weeknumber = $3::integer and batchid = $4::text';
  let args_note = [obj.notecontent || '', associateid, weeknumber, batchid];
  
  let q_status = 'update qcnotes set technicalstatus = $1::integer where associateid = $2::text and weeknumber = $3::integer and batchid = $4::text';
  let args_status = [obj.technicalstatus || 0, associateid, weeknumber, batchid];

  // This function lets us update either the notecontent or the technicalstatus of an associate
  // If neither of these is present in the object, return null
  if (!obj.notecontent && !obj.technicalstatus) {
    return null;
  }

  // Actually update the table, return updated object if successful (or null if not)
  try {
    await client.connect();

    // Update note?
    if(obj.notecontent) {
      await client.query(q_note, args_note);
    }

    if(obj.technicalstatus) {
      await client.query(q_status, args_status);
    }

    // Return the updated object, so we can verify success
    const q_check =
      'select batchid, weeknumber, associateid, notecontent, technicalstatus from qcnotes where associateid = $2::text and weeknumber = $3::integer and batchid = $4::text';
    const res = await client.query(q_check, args_note);

    return res.rows[0] as QCFeedback;
  } catch (err) {
    console.log(err);

    return null;
  } finally {
    client.end();
  }
};

function parsePath(path: string): any {
  const parts = path.split('/');
  const associateid = parts[parts.length - 1];
  const weeknumber = Number(parts[parts.length - 3]);
  const batchid = parts[parts.length - 5];
  return { batchid: batchid, weeknumber: weeknumber, associateid: associateid };
}

export interface QCFeedback {
  batchid: string;
  weeknumber: number;
  associateid: string;
  notecontent: string;
  technicalstatus: number;
}
