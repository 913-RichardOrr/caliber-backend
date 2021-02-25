import createResponse from "./response";


interface categoryParams{
    weekID: number,
    categoryID: number
}

interface getCategoryParams{
    weekID: number

}

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
