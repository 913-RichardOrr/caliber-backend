import { helper } from '../authorizerHelper';

describe('Authorizer Helper Test Suite', () => {
    //don't need to test vp, allowed access to all endpoints in main handler
    const trainer = {
        qc: false,
        vp: false,
        trainer: true
    };
    const qc = {
        qc: true,
        vp: false,
        trainer: false
    };
    const trainerqc = {
        qc: true,
        vp: false,
        trainer: true
    };
    test('access for /GET/categories', () => {
        const route =
            'arn:aws:execute-api:us-west-2:123:example/stagename/GET/categories';
        const trainerResult = helper(route, trainer);
        expect(trainerResult).toBe('Allow');
        const qcResult = helper(route, qc);
        expect(qcResult).toBe('Allow');
        const multResult = helper(route, trainerqc);
        expect(multResult).toBe('Allow');
    });

    test('access for /POST/categories', () => {
        const route =
            'arn:aws:execute-api:us-west-2:123:example/stagename/POST/categories';
        const trainerResult = helper(route, trainer);
        expect(trainerResult).toBe('Deny');
        const qcResult = helper(route, qc);
        expect(qcResult).toBe('Deny');
        const multResult = helper(route, trainerqc);
        expect(multResult).toBe('Deny');
    });

    test('access for /PUT/categories/categoriesId', () => {
        const route =
            'arn:aws:execute-api:us-west-2:123:example/stagename/POST/categories/categoriesId';
        const trainerResult = helper(route, trainer);
        expect(trainerResult).toBe('Deny');
        const qcResult = helper(route, qc);
        expect(qcResult).toBe('Deny');
        const multResult = helper(route, trainerqc);
        expect(multResult).toBe('Deny');
    });

    test('access for /GET/batches', () => {
        //checks for query params too
        const route =
            'arn:aws:execute-api:us-west-2:123:example/stagename/GET/batches?trainer=random@email.com';
        const trainerResult = helper(route, trainer);
        expect(trainerResult).toBe('Allow');
        const qcResult = helper(route, qc);
        expect(qcResult).toBe('Allow');
        const multResult = helper(route, trainerqc);
        expect(multResult).toBe('Allow');
    });

    test('access for /GET/qc/batches/batchId', () => {
        const route =
            'arn:aws:execute-api:us-west-2:123:example/stagename/GET/qc/batches/batchId';
        const trainerResult = helper(route, trainer);
        expect(trainerResult).toBe('Allow');
        const qcResult = helper(route, qc);
        expect(qcResult).toBe('Allow');
        const multResult = helper(route, trainerqc);
        expect(multResult).toBe('Allow');
    });

    test('access for /GET/qc/batches/batchId/weeks', () => {
        const route =
            'arn:aws:execute-api:us-west-2:123:example/stagename/GET/qc/batches/batchId/weeks';
        const trainerResult = helper(route, trainer);
        expect(trainerResult).toBe('Allow');
        const qcResult = helper(route, qc);
        expect(qcResult).toBe('Allow');
        const multResult = helper(route, trainerqc);
        expect(multResult).toBe('Allow');
    });

    test('access for /POST/qc/batches/batchId/weeks', () => {
        const route =
            'arn:aws:execute-api:us-west-2:123:example/stagename/POST/qc/batches/batchId/weeks';
        const trainerResult = helper(route, trainer);
        expect(trainerResult).toBe('Deny');
        const qcResult = helper(route, qc);
        expect(qcResult).toBe('Allow');
        const multResult = helper(route, trainerqc);
        expect(multResult).toBe('Allow');
    });

    test('access for /POST/qc/batches/batchId/weeks/weekId', () => {
        const route =
            'arn:aws:execute-api:us-west-2:123:example/stagename/POST/qc/batches/batchId/weeks/weekId';
        const trainerResult = helper(route, trainer);
        expect(trainerResult).toBe('Deny');
        const qcResult = helper(route, qc);
        expect(qcResult).toBe('Allow');
        const multResult = helper(route, trainerqc);
        expect(multResult).toBe('Allow');
    });

    test('access for /GET/qc/batches/batchId/weeks/weekId/categories', () => {
        const route =
            'arn:aws:execute-api:us-west-2:123:example/stagename/GET/qc/batches/batchId/weeks/weekId/categories';
        const trainerResult = helper(route, trainer);
        expect(trainerResult).toBe('Allow');
        const qcResult = helper(route, qc);
        expect(qcResult).toBe('Allow');
        const multResult = helper(route, trainerqc);
        expect(multResult).toBe('Allow');
    });

    test('access for /POST/qc/batches/batchId/weeks/weekId/categories', () => {
        const route =
            'arn:aws:execute-api:us-west-2:123:example/stagename/POST/qc/batches/batchId/weeks/weekId/categories';
        const trainerResult = helper(route, trainer);
        expect(trainerResult).toBe('Allow');
        const qcResult = helper(route, qc);
        expect(qcResult).toBe('Allow');
        const multResult = helper(route, trainerqc);
        expect(multResult).toBe('Allow');
    });

    test('access for /DELETE/qc/batches/batchId/weeks/weekId/categories/categoryId', () => {
        const route =
            'arn:aws:execute-api:us-west-2:123:example/stagename/DELETE/qc/batches/batchId/weeks/weekId/categories/categoryId';
        const trainerResult = helper(route, trainer);
        expect(trainerResult).toBe('Allow');
        const qcResult = helper(route, qc);
        expect(qcResult).toBe('Allow');
        const multResult = helper(route, trainerqc);
        expect(multResult).toBe('Allow');
    });

    test('access for /GET/qc/batches/batchId/weeks/weekId/associates/associateId', () => {
        const route =
            'arn:aws:execute-api:us-west-2:123:example/stagename/GET/qc/batches/batchId/weeks/weekId/associates/associateId';
        const trainerResult = helper(route, trainer);
        expect(trainerResult).toBe('Allow');
        const qcResult = helper(route, qc);
        expect(qcResult).toBe('Allow');
        const multResult = helper(route, trainerqc);
        expect(multResult).toBe('Allow');
    });

    test('access for /PUT/qc/batches/batchId/weeks/weekId/associates/associateId', () => {
        const route =
            'arn:aws:execute-api:us-west-2:123:example/stagename/PUT/qc/batches/batchId/weeks/weekId/associates/associateId';
        const trainerResult = helper(route, trainer);
        expect(trainerResult).toBe('Deny');
        const qcResult = helper(route, qc);
        expect(qcResult).toBe('Allow');
        const multResult = helper(route, trainerqc);
        expect(multResult).toBe('Allow');
    });

    test('access for /PATCH/qc/batches/batchId/weeks/weekId/associates/associateId', () => {
        const route =
            'arn:aws:execute-api:us-west-2:123:example/stagename/PATCH/qc/batches/batchId/weeks/weekId/associates/associateId';
        const trainerResult = helper(route, trainer);
        expect(trainerResult).toBe('Deny');
        const qcResult = helper(route, qc);
        expect(qcResult).toBe('Allow');
        const multResult = helper(route, trainerqc);
        expect(multResult).toBe('Allow');
    });
});
