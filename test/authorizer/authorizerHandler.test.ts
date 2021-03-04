const serviceAccount = require('firebase-service-account-DO_NOT_PUSH.json');
import { handler } from '../../authorizer/authorizerHandler';
var module = require('../../authorizer/authorizerHelper');
import admin from 'firebase-admin';

const vp = {
    ROLE_QC: false,
    ROLE_VP: true,
    ROLE_TRAINER: false
};
jest.mock('firebase-admin', () => {
    const verifyIdToken = jest
            .fn()
            .mockImplementation((token: string) => Promise.resolve(vp))
    return {
        apps: [],
        credential: {
            cert: jest.fn()
        },
        initializeApp: jest.fn(),
        auth: jest.fn(() => ({
            verifyIdToken: verifyIdToken
        }))        
    }
});

jest.mock(
    'firebase-service-account-DO_NOT_PUSH.json',
    () => ({
        settings: 'someSetting'
    }),
    { virtual: true }
);

const event = {
    authorizationToken: 'Bearer tokenvalue',
    methodArn: 'anything'
};

const noBearer = {
    authorizationToken: 'tokenvalue',
    methodArn: 'anything'
};
const noToken = {
    methodArn: 'anything'
};
const context = {
    fail: jest.fn()
};

describe('Authorizer Handler Test Suite', () => {
    beforeAll(() => {
        module.helper = jest.fn();
        module.generateIamPolicy = jest
            .fn()
            .mockImplementation((effect, resource) => {
                return 'anything';
            });
    });

    test('when the token is in the wrong format', async () => {
        await handler(noBearer, context);
        expect(context.fail).toBeCalled();
        expect(context.fail).toBeCalledWith('Unauthorized');
        await handler(noToken, context);
        expect(context.fail).toBeCalled();
        expect(context.fail).toBeCalledWith('Unauthorized');
    });

    test('establish connection when admin.apps.length is 0', async () => {
        await handler(event, context);
        expect(admin.initializeApp).toBeCalled();
        expect(admin.apps.length).toBe(0);
        expect(admin.auth().verifyIdToken).toBeCalled();
        expect(admin.auth().verifyIdToken).toBeCalledWith(
            event.authorizationToken.split(' ')[1]
        );
    });

    test('user with vp role is allow access to all route', async () => {
        await handler(event, context);
        expect(module.generateIamPolicy).toBeCalled();
        expect(module.generateIamPolicy).toBeCalledWith(
            'Allow',
            event.methodArn
        );
        //will not call helper function, vp returns allow before that
        expect(module.helper.mock.calls.length).toBe(0);
    });
});
