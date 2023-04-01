
import _ from 'lodash';
import { Parserr } from 'tparserr';

import SchemaBuilder from './mongo/schema/Builder';
import Collection from './mongo/Collection';

import Session from './util/Session';

import { IGeneratorOpts } from './types/IGeneratorOpts';


class Generator {

    public async generate(opts: IGeneratorOpts) {

        Session.setConfigOpts(opts);

        const typeDescription = await Parserr.parse(
            Session.getTParserrOpts()
        );

        const schemaOpts = SchemaBuilder.transform(typeDescription);

        await Collection.generate(_.map(schemaOpts, 'schema'));
    }

}

export default new Generator();