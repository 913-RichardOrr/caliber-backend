import createResponse from "./response";


interface categoryParams{
    weekID: number,
    categoryID: number
}

interface getCategoryParams{
    weekID: number

}

/**
 * Add a weekCategory object into the week_catgories table
 * 
 * @client - the client from pg
 * @param {categoryParams} params - The weekId and categoryId of the weekCategory object to be added to database
 */
export const addCategory = async (client: any, params: categoryParams) => 
{ 
    const query = `insert into week_categories (category_id, qc_week_id) values ($1, $2)`;
    const values = [ params.categoryID, params.weekID ] ;

    let response = await client.query(query, values);
    client.end();
    if (response) {
        return createResponse(JSON.stringify(response.rows), 200);
    } else {
        return createResponse('', 400);
    }  
}

/**
 * Retrieve all categories (category[]) from a given week from the database
 * 
 * @client - the client from pg
 * @param {getCategoryParams} params - the weekId that specifies which week we want categories for
 */
export const getCategories = async (client: any, params: getCategoryParams) => {
    let response;

    //we want the name of category and the id
    response = await client.query(`select skill, id from category where id = (select category_id from week_categories where week_id = '${params.weekID}')`);
    client.end();

    if (response){
        return createResponse(JSON.stringify(response.rows), 200);
    } else{
        return createResponse('', 400);
    };
}

/**
 * Delete a weekCategory object into the week_catgories table
 * 
 * @client - the client from pg
 * @param {categoryParams} params - The weekId and categoryId of the weekCategory object to be deleted from database
 */
export const deleteCategory = async (client: any, params: categoryParams) => 
{
    await client.query(`delete from week_categories where category_id = ${params.categoryID} and qc_week_id =  ${params.weekID}`).then((response: any) => {
        client.end();
        if(response){
          return createResponse('', 200);      
        }else{
          return createResponse('', 400)
        }
      });
}
