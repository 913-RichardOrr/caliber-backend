//Tests for associate lambda handler and helpers

import { handler, getAssociate, putAssociate, patchAssociate, qcFeedback } from '../index';
import Client from 'pg';

describe('tests for handler', () => {

});

describe('tests for getAssociate', () => {

});

describe('tests for putAssociate', () => {

});

describe('tests for patchAssociate', () => {

    const original: qcFeedback = {
        batchId: 'YYMM-mmmDD-Stuff',
        weekId: 1,
        associateId: 'example@example.net',
        qcNote: 'blablabla',
        qcTechnicalStatus: 2
    };

    const mockConnect = jest.fn();
    const mockQuery = jest.fn();
    const mockEnd = jest.fn();
    jest.mock('pg', ()=>{
        return {
            Client: ()=>({connect: mockConnect, query: mockQuery, end: mockEnd})
        }
    });

    test('That updating an associate\'s note works', async () => {
        const testUpdateObject = {qcNote: 'Updated blablabla'};

        const updatedObject = original;
        updatedObject.qcNote = testUpdateObject.qcNote;

        await expect(patchAssociate(JSON.stringify(testUpdateObject))).toBe(updatedObject);
        expect(mockConnect).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockEnd).toHaveBeenCalledTimes(1);
    });

    test('That updating an associate\'s status works', async () => {
        const testUpdateObject = {qcTechnicalStatus: 3};

        const updatedObject = original;
        updatedObject.qcTechnicalStatus = testUpdateObject.qcTechnicalStatus;

        await expect(patchAssociate(JSON.stringify(testUpdateObject))).toBe(updatedObject);
        expect(mockConnect).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockEnd).toHaveBeenCalledTimes(1);
    });

    test('That invalid input returns an error but doesn\'t break anything', async () => {
        const testUpdateObject = {nonsense: 3};

        await expect(patchAssociate(JSON.stringify(testUpdateObject))).toBe(null);
        expect(mockConnect).toHaveBeenCalledTimes(0);
        expect(mockQuery).toHaveBeenCalledTimes(0);
        expect(mockEnd).toHaveBeenCalledTimes(0);
    });
});