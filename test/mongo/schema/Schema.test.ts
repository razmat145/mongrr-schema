
import { describe, it, expect } from '@jest/globals';

import SchemaBuilder from '../../../src/lib/mongo/schema/Builder';

import ParserOutput from './files/SimpleParserOutput.json';
import TransformedMongoSchema from './files/SimpleTransformedMongoSchema.json';

import AnnotationsParserOutput from './files/AnnotationsParserOutput.json';
import AnnotationsTransformedMongoSchema from './files/AnnotationsTransformedMongoSchema.json';


describe('mongo.SchemaBuilder', () => {

    it('should transform tparserrs output into valid MongoDB Schema Validation descrition envelope', async () => {
        const sutResult = SchemaBuilder.transform(ParserOutput);

        expect(sutResult).toEqual(TransformedMongoSchema);
    });

    it('should transform tparserrs output into valid MongoDB Schema Validation descrition envelope considering annotations', async () => {
        const sutResult = SchemaBuilder.transform(AnnotationsParserOutput);

        expect(sutResult).toEqual(AnnotationsTransformedMongoSchema);
    });

});
