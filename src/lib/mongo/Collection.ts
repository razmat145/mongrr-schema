
import _ from 'lodash';
import { CollectionInfo } from 'mongodb';

import Session from '../util/Session';

import ISchemaObject from '../types/ISchemaObject';


class Collection {

    private existingCollections: Array<CollectionInfo> = [];

    public async generate(schema: Array<ISchemaObject>) {
        await this.loadExistingCollection();

        for (const colSchema of schema) {
            await this.createUpdateCollection(colSchema);
        }
    }

    private async createUpdateCollection(schema: ISchemaObject) {

        const doesCollectionExist = this.doesCollectionExist(schema.title);

        if (doesCollectionExist) {
            await this.updateCollection(schema);
        } else {
            await this.createCollection(schema);
        }
    }

    private async createCollection(schema: ISchemaObject) {
        try {
            await Session.getDatabase().createCollection(
                schema.title, {
                validator: { $jsonSchema: schema }
            });
        } catch (err) {
            throw new Error(`Error while creating schema for collection: ${schema.title}; with message: ${err.message}`);
        }
    }

    private async updateCollection(schema: ISchemaObject) {
        try {
            await Session.getDatabase().command({
                collMod: schema.title,
                validator: { $jsonSchema: schema }
            });
        } catch (err) {
            throw new Error(`Error while updating schema for collection: ${schema.title}; with message: ${err.message}`);
        }
    }

    private async loadExistingCollection() {
        let existingCollection;
        try {
            existingCollection = await Session.getDatabase().listCollections().toArray();
        } catch (err) {
            throw new Error(`Cannot get existing collections on passed in mongo database; with message: ${err.message}`);
        }
        this.existingCollections = existingCollection;
    }

    private doesCollectionExist(name: string) {
        const foundColl = _.find(this.existingCollections, coll => coll.name === name);

        return !_.isEmpty(foundColl);
    }

}

export default new Collection();