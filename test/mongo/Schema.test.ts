
import { describe, it, expect } from '@jest/globals';

import Schema from '../../src/lib/mongo/Schema';

import ParserOutput from './files/ParserOutput.json';
import TransformedMongoSchema from './files/TransformedMongoSchema.json';


describe('mongo.Schema', () => {

    it('should transform tparserrs output into valid MongoDB Schema Validation descrition', async () => {
        const sutResult = Schema.transform(ParserOutput);

        expect(sutResult).toEqual(TransformedMongoSchema);
    });

});
