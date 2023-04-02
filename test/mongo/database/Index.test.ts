
import { describe, it, jest, expect, afterEach } from '@jest/globals';

import Index from '../../../src/lib/mongo/database/Index';
import Session from '../../../src/lib/util/Session';

import { ISchemaOptIndex } from '../../../src/lib/types/SchemaOpts';
import { IMongoIndex } from '../../../src/lib/types/Index';

jest.mock('../../../src/lib/util/Session');

const mockedSessionGetDatabase = <jest.Mock>Session.getDatabase;

const mockListIndexes = jest.fn<() => Promise<Array<{ name: string }>>>();
const mockCreateIndex = jest.fn();
const mockMongoDatabase = {
    collection: (name: string) => ({
        listIndexes: () => ({ toArray: mockListIndexes }),
        createIndex: mockCreateIndex
    })
};

describe('mongo.database.Index', () => {

    const collectionName = 'MyUsers';
    const mockActiveIndex: ISchemaOptIndex = {
        "name": "MyUsers_active",
        "index": [
            {
                "property": "active",
                "direction": "desc"
            }
        ]
    }
    const mockListedIndexes: Array<IMongoIndex> = [{ name: 'MyUsers_active', key: { active: -1 } }];
    const mockListedIndexesDifferentName: Array<IMongoIndex> = [{ name: 'MyUsers_active101', key: { active: -1 } }];

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('initialisation', () => {

        it('should load and clear the existing indexes', async () => {

            mockedSessionGetDatabase.mockReturnValue(mockMongoDatabase);
            mockListIndexes.mockResolvedValue(mockListedIndexes);

            await Index.loadExistingIndexes(collectionName);

            expect(mockListIndexes).toHaveBeenCalled();
            expect(Index['existingIndexes']).toEqual(mockListedIndexes);
            expect(Index['collectionName']).toEqual(collectionName);

            Index.clearExistingIndexes();

            expect(Index['existingIndexes']).toEqual([]);
            expect(Index['collectionName']).toEqual(null);
        });

    });

    describe('createCollectionIndex', () => {

        it('should call to create the index if it does not exist', async () => {

            mockedSessionGetDatabase.mockReturnValue(mockMongoDatabase);
            mockListIndexes.mockResolvedValue([]);

            await Index.loadExistingIndexes(collectionName);

            expect(mockListIndexes).toHaveBeenCalled();

            await Index.createCollectionIndex(mockActiveIndex);

            expect(mockedSessionGetDatabase).toHaveBeenCalledTimes(2);

            expect(mockCreateIndex).toHaveBeenCalledTimes(1);
            expect(mockCreateIndex).toHaveBeenNthCalledWith(1,
                { active: -1 },
                { name: mockActiveIndex.name }
            );

            Index.clearExistingIndexes();
        });

        it('should not call to create the index if it already exists under the same name', async () => {

            mockedSessionGetDatabase.mockReturnValue(mockMongoDatabase);
            mockListIndexes.mockResolvedValue(mockListedIndexes);

            await Index.loadExistingIndexes(collectionName);

            expect(mockListIndexes).toHaveBeenCalled();

            await Index.createCollectionIndex(mockActiveIndex);

            expect(mockedSessionGetDatabase).toHaveBeenCalledTimes(1);
            expect(mockCreateIndex).toHaveBeenCalledTimes(0);

            Index.clearExistingIndexes();
        });

        it('should not call to create the index if it already exists under the same settings', async () => {

            mockedSessionGetDatabase.mockReturnValue(mockMongoDatabase);
            mockListIndexes.mockResolvedValue(mockListedIndexesDifferentName);

            await Index.loadExistingIndexes(collectionName);

            expect(mockListIndexes).toHaveBeenCalled();

            await Index.createCollectionIndex(mockActiveIndex);

            expect(mockedSessionGetDatabase).toHaveBeenCalledTimes(1);
            expect(mockCreateIndex).toHaveBeenCalledTimes(0);

            Index.clearExistingIndexes();
        });

    });

});
