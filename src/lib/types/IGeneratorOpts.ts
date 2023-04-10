
import { Db } from 'mongodb';
import { IParserOpts } from 'tparserr';

export type TParserInheritedOpts = Pick<IParserOpts,
    'files'
    | 'useRelativePaths'
    | 'callerBaseDir'
    | 'targetDir'
    | 'includeOnlyExports'
    | 'includeNestedClassNames'
    | 'enableDecorators'
    | 'enableSourceFilePathing'
>;

export interface IGeneratorOpts extends TParserInheritedOpts {
    connectionString?: string;

    databaseName?: string;

    mongoDb?: Db;
}