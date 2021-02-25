import { Client } from 'pg';

/**
 * Gets all of the week objects for a given batchId in the qcWeeks table in our postgreSQL
 * database. The 'pg' environment variables point to our RDS instance and should be set up using
 * CloudFormation. Called using GET on /qc/batches/{batchId}/weeks/.
 * @param {string} batchId - The batch's id we want to get the weeks for (this id comes from the mock api)
 * @returns {object} An HTTP resopnse with an array of weeks in the body
 */
export default async function getWeeksByBatchId(batchId: string) {
    const client = new Client();
    try {
        await client.connect(); 
        const query = `select qcweekid, weeknumber, note, overallstatus, batchid from qcweeks where batchid = $1::text`;
        const result = await client.query(query, [batchId]);   // batchId  the argument of function

        const headers = {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        };
        if(result) {
            return {
                statusCode: 200,
                body: JSON.stringify(result.rows),
                headers: headers
            }
        } else {
            return {
                statusCode: 404,
                headers: headers
            }
        }
    } catch(err) {
        console.error(err);
        return {statusCode: 500};
    } finally {
        client.end();
    }
}