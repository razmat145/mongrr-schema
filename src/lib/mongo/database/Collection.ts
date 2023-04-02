
import _ from 'lodash';
import { CollectionInfo } from 'mongodb';

import Session from '../../util/Session';

import { ISchemaOpts } from '../../types/SchemaOpts';


class Collection {

    private existingCollections: Array<CollectionInfo> = [];

    public async createUpdateCollection(schemaOpt: ISchemaOpts) {

        const doesCollectionExist = this.doesCollectionExist(schemaOpt.collectionName);

        if (doesCollectionExist) {
            await this.updateCollection(schemaOpt);
        } else {
            await this.createCollection(schemaOpt);
        }
    }

    private async createCollection(schemaOpt: ISchemaOpts) {
        try {
            await Session.getDatabase().createCollection(
                schemaOpt.collectionName, {
                validator: { $jsonSchema: schemaOpt.schema }
            });
        } catch (err) {
            throw new Error(`Error while creating schema for collection: ${schemaOpt.collectionName}; with message: ${err.message}`);
        }
    }

    private async updateCollection(schemaOpt: ISchemaOpts) {
        try {
            await Session.getDatabase().command({
                collMod: schemaOpt.collectionName,
                validator: { $jsonSchema: schemaOpt.schema }
            });
        } catch (err) {
            throw new Error(`Error while updating schema for collection: ${schemaOpt.collectionName}; with message: ${err.message}`);
        }
    }

    public async loadExistingCollections() {
        try {
            this.existingCollections = await Session.getDatabase().listCollections().toArray();
        } catch (err) {
            throw new Error(`Cannot get existing collections on passed in mongo database; with message: ${err.message}`);
        }
    }

    public clearExistingCollections() {
        this.existingCollections = [];
    }

    private doesCollectionExist(name: string) {
        const foundColl = _.find(this.existingCollections, coll => coll.name === name);

        return !_.isEmpty(foundColl);
    }

}

export default new Collection();