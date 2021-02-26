import createResponse from "./response";


interface categoryParams {
    weekID: number,
    categoryID: number
}

interface getCategoryParams {
    weekID: number

}

export const addCategory = async (client: any, params: categoryParams) => {

    const query = `insert into weekcategories (categoryid, qcweekid) values ($1, $2)`;
    const values = [params.categoryID, params.weekID];

    await client.query(query, values).then((response: any) => {
        client.end();
        if (response) {
            return createResponse(JSON.stringify(response.rows), 200);
        } else {
            return createResponse('', 400);
        }
    });
}

export const getCategories = async (client: any, params: getCategoryParams) => {

    let response;

    //we want the name of category and the id
    response = await client.query(`select c.skill, c.categoryid from categories c join weekcategories w on c.categoryid = w.categoryid`, (err: any, res: any) => {
        console.log(res.rows);
        client.end();
    });

    if (response) {
        return createResponse(JSON.stringify(response.rows), 200);
    } else {
        return createResponse('', 400);
    };
}

export const deleteCategory = async (client: any, params: categoryParams) => {
    await client.query(`delete from weekcategories where qcweekid = ${params.weekID}`).then((response: any) => {
        client.end();
        if (response) {
            return createResponse('', 200);
        } else {
            return createResponse('', 400)
        }
    });
}
