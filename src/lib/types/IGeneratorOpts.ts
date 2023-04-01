
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
>;

export interface IGeneratorOpts extends TParserInheritedOpts {
    mongoDb: Db;
}