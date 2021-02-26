// function for /categories GET method (query params for inactive ? active = false)
export const getCategories = async (client: any, params?: any) => {
    if (params) {
        const stringParams = JSON.stringify(params);
        const active = (stringParams.substring(11, stringParams.length - 4));
        const q = 'select c.categoryid, c.skill, c.active from categories c where active=$1::boolean';
        const args = [active];
        const res = await client.query(q, args);
        await client.end();
        if (res) {
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Headers': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
                },
                body: JSON.stringify(res.rows),
            }
        } else {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Headers': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
                },
                body: JSON.stringify(res)
            }
        }
    } else {
        const q = 'select c.categoryid, c.skill, c.active from categories c';
        const res = await client.query(q);
        await client.end();
        if (res) {
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Headers': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
                },
                body: JSON.stringify(res.rows),
            }
        } else {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Headers': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
                },
                body: JSON.stringify(res)
            }
        }
    }
}

// function for /categories POST method (add a new category)
export const postCategories = async (client: any, event: any) => {
    const q = 'insert into categories (skill,active) values ($1::text,true) returning categoryid, skill, active';
    const params = [event.body];
    const resp = await client.query(q, params);
    await client.end();
    if (resp) {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
            },
            body: JSON.stringify(resp),
        }
    } else {
        return {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Headers': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            }
        }
    }
}
// function for /categories/{categoryId} PUT method (update a category to be active/inactive)
export const putCategory = async (client: any, event: any) => {
    const categoryid = event.path.substring(event.path.lastIndexOf('/') + 1, event.path.length);
    const q = 'update categories set skill=$1, active=$2 where categoryid=$3';
    const params = [JSON.parse(event.body).skill, JSON.parse(event.body).active, categoryid];
    const resp = await client.query(q, params);
    await client.end();
    if (resp) {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Headers': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
            },
            body: JSON.stringify(resp),
        }
    } else {
        return {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Headers': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            }
        }
    }
}