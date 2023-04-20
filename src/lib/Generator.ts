
import { Parserr, ITypeDescription } from 'tparserr';

import { promises as afs } from 'fs';
import path from 'path';

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

        await this.buildSchema(typeDescription);
    }

    public async generateForTypes(opts: Pick<IGeneratorOpts, 'connectionString' | 'databaseName' | 'mongoDb'>, typesFile?: string) {
        await Session.setConfigOpts(opts);

        const typeDescriptionFile = await afs.readFile(typesFile || path.resolve(process.cwd(), 'schema.json'), 'utf-8');

        const typeDescription = JSON.parse(typeDescriptionFile);

        await this.buildSchema(typeDescription);
    }

    private async buildSchema(typeDescription: ITypeDescription[]) {
        const schemaOpts = SchemaBuilder.transform(typeDescription);

        await DatabaseGenerator.generate(schemaOpts);
    }

}

export default new Generator();