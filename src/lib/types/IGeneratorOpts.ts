
import { Db } from 'mongodb';
import { IParserOpts } from 'tparserr';

type TParserOptsPaths = Pick<IParserOpts,
    'files'
    | 'useRelativePaths'
    | 'callerBaseDir'
    | 'targetDir'
    | 'includeOnlyDefaultExports'
    | 'includeNestedClassNames'
>;

interface IGeneratorOpts extends TParserOptsPaths {
    mongoDb: Db;
}

export default IGeneratorOpts;