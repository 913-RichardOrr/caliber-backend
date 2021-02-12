interface responseType {
    statusCode: number,
    header: {},
    body: {}
}

export const handler = async (event: any) => {

}

// function for /categories GET method (query params for inactive ? active = false)
export const getCategories = async (params?: any) => {
    let response: responseType = {statusCode: 0, header: {}, body: {}};
    return response;
}

// function for /categories POST method (add a new category)
export const postCategories = async (event: any) => {
    let response: responseType = {statusCode: 0, header: {}, body: {}};
    return response;
}
// function for /categories/{categoryId} PUT method (update a category to be active/inactive)
export const putCategory = async (event: any) => {
    let response: responseType = {statusCode: 0, header: {}, body: {}};
    return response;
}