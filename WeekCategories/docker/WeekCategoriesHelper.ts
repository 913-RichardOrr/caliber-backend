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

    return await client.query(query, values).then((response: any) => {
        client.end();
        if (response) {
            console.log("i am runnign in the response retutn location");
            return createResponse(JSON.stringify(response), 200);
        } else {
            return createResponse('No Rows Available', 400);
        }
    }).catch((err: Error) => {
        console.log(err);
        client.end();
        return createResponse('Could not add row', 404);
    });
}

/**
 * Retrieve all categories (category[]) from a given week from the database
 * 
 * @client - the client from pg
 * @param {getCategoryParams} params - the weekId that specifies which week we want categories for
 */

 

export const getCategories = async (client: any, weeknumber: number, batchid: string) => {

    //we want the name of category and the id
    let res;
    try {
        res = await client.query('select qcweekid from qcweeks where batchid=$1::text and weeknumber=$2::integer', [batchid, weeknumber]);
    } catch(err) {
        console.log(err);
        client.end();
        return createResponse('Not Found',404);
    }
    
    if(!res.rows[0].qcweekid) {
        return createResponse('Not Found',404);
    }

    
    let qcweekid = Number(res.rows[0].qcweekid);
    console.log(JSON.stringify(res));
    console.log('qc week id '+qcweekid);
    return await client.query(`select c.skill, c.categoryid from categories c join weekcategories w on c.categoryid = w.categoryid where w.qcweekid = ${qcweekid}`
    ).then((res:any)=>{
        client.end();
        return createResponse(JSON.stringify(res.rows), 200);
    }).catch((err: any)=> {
        console.log(err);
        client.end();
        return createResponse('Not Found',404);
    }); 
}

export const deleteCategory = async (client: any, weeknumber: number, batchid: string, categoryid: number) => {
    let res;
    try {
        res = await client.query('select qcweekid from qcweeks where batchid=$1::text and weeknumber=$2::integer', [batchid, weeknumber]);
    } catch(err) {
        console.log(err);
        client.end();
        return createResponse('Id Does Not Exist', 400);
    }
    
    if(!res.rows[0].qcweekid) {
        return createResponse('Not Found',404);
    }

    let qcweekid = Number(res.rows[0].qcweekid);
    return await client.query('delete from weekcategories where qcweekid = $1::integer and categoryid = $2::integer', [qcweekid, categoryid] ).then((response: any) => {
        client.end();
        if (response) {
            return createResponse('Successfully Deleted', 200);
        } else {
            return createResponse('Does Not Exist', 400);
        }
    }).catch((err: Error) => {
        console.log(err);
        client.end();
        return createResponse('Does Not Exist', 400);
    });
}
