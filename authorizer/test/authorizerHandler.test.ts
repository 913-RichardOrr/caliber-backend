const handler = require('../authorizerHandler');
const helper = require('../authorizerHelper');
const serviceAccount = require('firebase.json');

import admin from 'firebase-admin';
import { generateIamPolicy } from '../authorizerHandler';
jest.mock('firebase.json', ()=>({
    settings: 'someSetting'
  }), { virtual: true })

jest.mock('firebase-admin', () => ({
    initializeApp: jest.fn(),
    auth: {
        verifyIdToken: jest
            .fn()
            .mockImplementation(() =>
                Promise.resolve({ qc: true, vp: false, trainer: false })
            )
    }
}));

jest.mock('../authorizerHelper', ()=>{
    return jest.fn().mockReturnValue('Allow');
});



describe('Authorizer Handler Test Suite', () => {
    test('authorizer for a ', async () => {
        const event = {
            authorizationToken: 'Bearer tokenvalue',
            methodArn: 'anything'
        }
        const context = {
            fail: jest.fn()
        }
        jest.mock('../authorizerHelper', () => 'Allow');
        jest.mock('generateIamPolicy', ()=>jest.fn())
        await handler(event, context);
        expect(generateIamPolicy).toBeCalled();
    });
});

// test('something', async () => {
//     await login('example@gmail.com', 'smth');
//     expect(auth.signInWithEmailAndPassword).toBeCalledWith('example@gmail.com', 'smth');
// });