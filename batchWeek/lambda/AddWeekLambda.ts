import { Client } from 'pg';

export default async function AddWeekLambda(event:any) {
    const client = new Client();
    const week = JSON.parse(event.body);
    client.connect();

    const query = `insert into qc_week (id, category_id, batch_id, week)
                    values ($1::number, $2::number, $3::text, $4::number)`;
    const values = [week.id, week.category_id, week.batch_id, week.week];

    let response = await client.query(query, values);
    if (response) {
        client.end();
        return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT"
        }
        };
    } else {
        client.end();
        return {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT"
            }
        };
    }
}

