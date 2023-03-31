
import { Parserr } from 'tparserr';

import Schema from './mongo/Schema';
import Collection from './mongo/Collection';

import Session from './util/Session';

import IGeneratorOpts from './types/IGeneratorOpts';


class Generator {

    public async generate(opts: IGeneratorOpts) {

        Session.setConfigOpts(opts);

        const typeDescription = await Parserr.parse(
            Session.getTParserrOpts()
        );
        console.error(JSON.stringify(typeDescription));

        const schema = Schema.transform(typeDescription);
        console.error(JSON.stringify(schema));

        await Collection.generate(schema);
    }

}

export default new Generator();