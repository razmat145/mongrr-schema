
import { Parserr } from 'tparserr';

import SchemaBuilder from './mongo/schema/Builder';
import DatabaseGenerator from './mongo/database/Generator';

import Session from './util/Session';

import { IGeneratorOpts } from './types/IGeneratorOpts';


class Generator {

    public async generate(opts: IGeneratorOpts) {
        await Session.setConfigOpts(opts);

        const typeDescription = await Parserr.parse(
            Session.getTParserrOpts()
        );

        const schemaOpts = SchemaBuilder.transform(typeDescription);

        await DatabaseGenerator.generate(schemaOpts);
    }

}

export default new Generator();