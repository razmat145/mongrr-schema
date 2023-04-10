
import _ from 'lodash';
import { Db, MongoClient } from 'mongodb';

import { IGeneratorOpts } from '../types/IGeneratorOpts';


class Connection {

    private database: Db;

    public async setup(opts: IGeneratorOpts) {
        this.validateConnectionOpts(opts);

        await this.initialise(opts);
    }

    public getDatabase() {
        if (this.database) {
            return this.database;
        } else {
            throw new Error('Connection util cannot be used without being initialised');
        }
    }

    private validateConnectionOpts(opts: IGeneratorOpts) {
        const { mongoDb, connectionString, databaseName } = opts;

        switch (true) {
            case !_.isEmpty(mongoDb):
            case !!connectionString && !!databaseName:
                return;

            default:
                throw new Error('Cannot use mongrr without providing either a mongodb.Db or connection opts');
        }
    }

    private async initialise(opts: IGeneratorOpts) {
        const { mongoDb, connectionString, databaseName } = opts;

        if (!_.isEmpty(mongoDb)) {
            this.database = mongoDb;
        } else {
            this.database = await this.initialiseDatabase(connectionString, databaseName);
        }
    }

    private async initialiseDatabase(connectionString: string, databaseName: string): Promise<Db> {
        try {
            const client = new MongoClient(connectionString);

            await client.connect();

            return client.db(databaseName);
        } catch (err) {
            throw new Error(`Error while initialising mongodb connection for: ${connectionString}; with message: ${err.message}`);
        }
    }

}

export default new Connection();