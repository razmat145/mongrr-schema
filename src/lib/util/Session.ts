
import _ from 'lodash';
import { Db } from 'mongodb';

import { IParserOpts } from 'tparserr';

import { IGeneratorOpts } from '../types/IGeneratorOpts';


class Session {

    private opts: IGeneratorOpts;

    public setConfigOpts(opts: IGeneratorOpts) {
        this.opts = _.assign(this.getConfigDefaults(), opts);
    }

    public getConfigItem<T extends keyof IGeneratorOpts>(configKey: T) {
        if (!_.isEmpty(this.opts)) {
            return this.opts[configKey];
        } else {
            throw new Error('Parserr Session ConfigOpts not initialised');
        }
    }

    public getConfig(): IGeneratorOpts {
        if (!_.isEmpty(this.opts)) {
            return this.opts;
        } else {
            throw new Error('Parserr Session ConfigOpts not initialised');
        }
    }

    public getDatabase(): Db {
        return this.getConfigItem('mongoDb');
    }

    public getTParserrOpts(): IParserOpts {
        return _.pick(this.opts, [
            'files',
            'useRelativePaths',
            'callerBaseDir',
            'targetDir',
            'includeOnlyExports',
            'includeNestedClassNames',
            'enableDecorators'
        ]);
    }

    private getConfigDefaults(): Partial<IGeneratorOpts> {
        return {
            includeOnlyExports: true,
            includeNestedClassNames: true,
            enableDecorators: true
        };
    }

}

export default new Session();