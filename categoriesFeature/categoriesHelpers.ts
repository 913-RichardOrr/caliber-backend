interface responseType {
    statusCode: number,
    header: {},
    body: {}
}

// function for /categories GET method (query params for inactive ? active = false)
export const getCategories = async (client: any, params?: any) => {
    if (params) {
        const q = 'select c.categoryId, c.skill, c.active from category c where active=$1::text';
        const args = [params];
        const res = await client.query(q, args);
        await client.end();
        if (res) {
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
                },
                body: JSON.stringify(res.rows),
            }
        } else {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
                }
            }
        }
    } else {
        const q = 'select c.categoryId, c.skill, c.active from category c';
        const res = await client.query(q);
        await client.end();
        if (res) {
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
                },
                body: JSON.stringify(res.rows),
            }
        } else {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                }
            }
        }
    }
}

// function for /categories POST method (add a new category)
export const postCategories = async (client: any, event: any) => {
    const q = 'insert into category (skill,active) values ($1,$2)';
    const params = [event.body.skill, event.body.active];
    const resp = await client.query(q, params);
    await client.end();
    if (resp) {
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
            },
            body: JSON.stringify(resp),
        }
    } else {
        return {
            statusCode: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            }
        }
    }
}
// function for /categories/{categoryId} PUT method (update a category to be active/inactive)
export const putCategory = async (client: any, event: any) => {
    const category = event.path.substring(event.path.lastIndexOf('/') + 1, event.path.length);
    const q = 'update category set skill=$1, active=$2 where categoryId=$3';
    const params = [event.body.skill, event.body.active, category];
    const resp = await client.query(q, params);
    await client.end();
    if (resp) {
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
            },
            body: JSON.stringify(resp),
        }
    } else {
        return {
            statusCode: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            }
        }
    }
}