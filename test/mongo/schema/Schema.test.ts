
import { describe, it, expect } from '@jest/globals';

import SchemaBuilder from '../../../src/lib/mongo/schema/Builder';

import ParserOutput from './files/ParserOutput.json';
import TransformedMongoSchema from './files/TransformedMongoSchema.json';


describe('mongo.SchemaBuilder', () => {

    it('should transform tparserrs output into valid MongoDB Schema Validation descrition', async () => {
        const sutResult = SchemaBuilder.transform(ParserOutput);

        expect(sutResult).toEqual(TransformedMongoSchema);
    });

});
