
import { describe, it, expect } from '@jest/globals';

import Builder from '../../../src/lib/mongo/schema/Builder';

import ParserOutput from './files/SimpleParserOutput.json';
import TransformedMongoSchema from './files/SimpleTransformedMongoSchema.json';

import AnnotationsParserOutput from './files/AnnotationsParserOutput.json';
import AnnotationsTransformedMongoSchema from './files/AnnotationsTransformedMongoSchema.json';


describe('mongo.Builder', () => {

    it('should transform tparserrs output into valid MongoDB Schema Validation descrition envelope', async () => {
        const sutResult = Builder.transform(ParserOutput);

        expect(sutResult).toEqual(TransformedMongoSchema);
    });

    it('should transform tparserrs output into valid MongoDB Schema Validation descrition envelope considering annotations', async () => {
        const sutResult = Builder.transform(AnnotationsParserOutput);

        expect(sutResult).toEqual(AnnotationsTransformedMongoSchema);
    });

});
