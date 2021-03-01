const serviceAccount = require('firebase-service-account-DO_NOT_PUSH.json');
import admin from 'firebase-admin';
import { Role, helper, generateIamPolicy } from './authorizerHelper';

export async function handler (event: any, context: any) {
    try {
        // Return from function if no authorizationToken present in header
        // context.fail('Unauthorized') will trigger API Gateway to return 401 response
        if (!event.authorizationToken) {
            return context.fail('Unauthorized');
        }

        // If auhorizationToken is present, split on space looking for format 'Bearer <token value>'
        const tokenParts = event.authorizationToken.split(' ');
        const tokenValue = tokenParts[1];

        // Return from function if authorization header is not formatted properly
        if (!(tokenParts[0].toLowerCase() === 'bearer' && tokenValue)) {
            return context.fail('Unauthorized');
        }

        // Prepare for validating Firebase JWT token by initializing SDK
        // Check if Firebase Admin SDK is already initialized, if not, then do it
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                databaseURL: 'https://training-team-253916.firebaseio.com'
            });
        }
        let roles: Role = {
            qc: false,
            vp: false,
            trainer: false
        };
        await admin
            .auth()
            .verifyIdToken(tokenValue)
            .then((claims: any) => {
                roles = {
                    qc: claims.ROLE_QC,
                    vp: claims.ROLE_VP,
                    trainer: claims.ROLE_TRAINER
                };
                console.log(roles);
            }).catch(err=>{
                console.log(err);
            });
        if (roles.vp) {
            return generateIamPolicy('Allow', event.methodArn);
        }
        let status = helper(event.methodArn, roles);
        if (status == 'Allow') {
            return generateIamPolicy('Allow', event.methodArn);
        }
        return generateIamPolicy('Deny', event.methodArn);
    } catch (err) {
        return generateIamPolicy('Deny', event.methodArn);
    }
};
