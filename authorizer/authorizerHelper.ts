export interface Role {
    qc: boolean;
    vp: boolean;
    trainer: boolean;
}

// Helper funtion for generating the response API Gateway requires to handle the token verification
export function generateIamPolicy(effect: any, resource: any) {
    const authResponse: any = {};

    if (effect && resource) {
        const policyDocument: any = {};
        policyDocument.Version = '2012-10-17';
        policyDocument.Statement = [];
        const statementOne: any = {};
        statementOne.Action = 'execute-api:Invoke';
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }

    return authResponse;
}

/**
 *
 * @param arn :string, event.methodARN stores request method & request route
 * @param roles: Role, role of the user including qc, vp, trainer
 */
export function helper(arn: string, roles: Role) {
    let status = 'Deny';
    //arn looks something like this
    //arn:smth.smth-smth/state-name/GET/categories
    const pathParts = arn.split('/');
    //the method for the request
    const method = pathParts[2];

    // /categories
    if (pathParts[3].includes('categories')) {
        // if categoryId doesn't exist
        if (!pathParts[4]) {
            if (method == 'GET' && (roles.qc || roles.trainer)) {
                status = 'Allow';
            }
        }
        // /batches
    } else if (pathParts[3].includes('batches')) {
        if (method == 'GET' && (roles.qc || roles.trainer)) {
            status = 'Allow';
        }
        // /qc
    } else if (pathParts[3].includes('qc')) {
        //if weeks doesn't exist
        if (!pathParts[6]) {
            if (method == 'GET' && (roles.qc || roles.trainer)) {
                status = 'Allow';
            }
        } else {
            //if WeekId doesn't exist
            // /batches/{batchId}/weeks
            if (!pathParts[7]) {
                if (method == 'GET' && (roles.qc || roles.trainer)) {
                    status = 'Allow';
                } else if (method == 'POST' && roles.qc) {
                    status = 'Allow';
                }
            } else {
                //if categories/associates doesn't exist
                // /batches/{batchId}/weeks/{weekId}
                if (!pathParts[8]) {
                    if (method == 'POST' && roles.qc) {
                        status = 'Allow';
                    }
                } else if (pathParts[8].includes('categories')) {
                    //if categoryID doesn't exist
                    // /batches/{batchId}/weeks/{weekId}/categories
                    if (!pathParts[9]) {
                        if (
                            (method == 'GET' || method == 'POST') &&
                            (roles.qc || roles.trainer)
                        ) {
                            status = 'Allow';
                        }
                        // /batches/{batchId}/weeks/{weekId}/categories/{categoryId}
                    } else {
                        if (method == 'DELETE' && (roles.qc || roles.trainer)) {
                            status = 'Allow';
                        }
                    }
                    // /batches/{batchId}/weeks/{weekId}/associates/{associateId}
                } else if (pathParts[8].includes('associates')) {
                    if (method == 'GET' && (roles.qc || roles.trainer)) {
                        status = 'Allow';
                    } else if (
                        (method == 'PUT' || method == 'PATCH') &&
                        roles.qc
                    ) {
                        status = 'Allow';
                    }
                }
            }
        }
    }
    return status;
}
