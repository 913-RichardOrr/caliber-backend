const serviceAccount = require('firebase-service-account-DO_NOT_PUSH.json');
import {handler} from '../authorizerHandler';
var module = require('../authorizerHelper');
import admin from 'firebase-admin';

jest.mock('firebase-service-account-DO_NOT_PUSH.json', ()=>({
    settings: 'someSetting'
}), { virtual: true })

// jest.mock('firebase-admin', () => ({
//     admin: {
//         initializeApp: jest.fn(),
//         auth: {
//             verifyIdToken: jest
//                 .fn()
//                 .mockImplementation(() =>
//                     Promise.resolve({ qc: true, vp: false, trainer: false })
//                 )
//         }        
//     }
// }));

jest.mock("firebase-admin");


jest.mock('../authorizerHelper', ()=>{
    return jest.fn().mockReturnValue('Allow');
});

describe('Authorizer Handler Test Suite', () => {
    const vp = {
        qc: false,
        vp: true,
        trainer: false
    };
    beforeEach(() => {
        admin.initializeApp = jest.fn();
        admin.auth = jest.fn();
        admin.auth().verifyIdToken = jest.fn().mockReturnValue(Promise.resolve(vp));
    })

    test('authorizer for a ', async () => {
        module.helper = jest.fn();
        module.generateIamPolicy = jest.fn();
        const event = {
            authorizationToken: 'Bearer tokenvalue',
            methodArn: 'anything'
        }
        const context = {
            fail: jest.fn()
        }
        await handler(event, context);
        expect(module.generateIamPolicy).toBeCalled();
        expect(admin.auth().verifyIdToken).toBeCalled();
        expect(module.helper).toBeCalled();
    });
});