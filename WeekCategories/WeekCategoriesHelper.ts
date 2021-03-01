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
            console.log("i am runnign in the response retutn location");
            return createResponse(JSON.stringify(response), 200);
        } else {
            return createResponse('No Rows Available', 400);
        }
    });
}

/**
 * Retrieve all categories (category[]) from a given week from the database
 * 
 * @client - the client from pg
 * @param {getCategoryParams} params - the weekId that specifies which week we want categories for
 */

export const getCategories = async (client: any, params:getCategoryParams) => {

    //we want the name of category and the id
    await client.query(`select c.skill, c.categoryid from categories c join weekcategories w on c.categoryid = w.categoryid where w.qcweekid = ${params.weekID}`, (err: any, res: any) => {
        client.end();
        if (res) {
            return createResponse(JSON.stringify(res.rows), 200);
        } else {
            return createResponse('', 400);
        };
    });

    
}

export const deleteCategory = async (client: any, params: categoryParams) => {
    await client.query(`delete from weekcategories where qcweekid = ${params.weekID} and categoryid = ${params.categoryID}` ).then((response: any) => {
        client.end();
        if (response) {
            return createResponse('', 200);
        } else {
            return createResponse('', 400)
        }
    });
}
