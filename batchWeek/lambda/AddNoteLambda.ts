import { Client } from 'pg';

export function addOverallNote(event: any) {
    const client = new Client();
    const weekInfo = JSON.parse(event.body);

    const query = `insert into qc_week (overall_note) values ($1::text)`;
    const value = [weekInfo.overall_note];

    let response = client.query(query, value);

    if(response) {
        client.end();
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT"
            }
        }
    } else {
        client.end();
        return {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT"
            }
        }
    }
}