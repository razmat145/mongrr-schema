
import _ from 'lodash';

import { ITypeDescription, IAnnotation } from 'tparserr';

import { IIndexDescription, TIndexDirection } from '../../../types/Index';
import { ISchemaOptIndex } from '../../../types/SchemaOpts';


class Decorator {

    public extractDecoratedCollectionName(typeDescription: ITypeDescription): string {
        const collectionNameAnnot = this.getSingleByName(typeDescription.annotations, 'CollectionName');

        return !_.isEmpty(collectionNameAnnot)
            ? this.extractSingleValue(collectionNameAnnot)
            : null;
    }

    public extractPropertyIndex(property: string, typeDescription: ITypeDescription): IIndexDescription {
        const indexAnnot = this.getSingleByName(typeDescription.annotations, 'Index');

        return !_.isEmpty(indexAnnot)
            ? {
                property,
                direction: this.extractSingleValue(indexAnnot) || 'asc'
            }
            : null;
    }

    public extractCompoundIndexes(baseName: string, typeDescription: ITypeDescription): Array<ISchemaOptIndex> {
        const indexAnnots = this.getMultiByName(typeDescription.annotations, 'CompoundIndex');

        return !_.isEmpty(indexAnnots)
            ? _.map(indexAnnots,
                indexAnnot => ({
                    name: this.reduceCompoundIndexName(baseName, indexAnnot.args),
                    index: this.reduceCompountIndex(indexAnnot.args)
                })
            )
            : null;
    }

    public hasDecorator(typeDescription: ITypeDescription, decoratorName: string): boolean {
        const annotation = this.getSingleByName(typeDescription.annotations, decoratorName);

        return !_.isEmpty(annotation);
    }

    private reduceCompoundIndexName(baseName: string, args: Array<[string, TIndexDirection?]>): string {
        return _.reduce(
            args,
            (acc, arg) => acc + '_' + arg[0],
            baseName
        );
    }

    private reduceCompountIndex(args: Array<[string, TIndexDirection?]>): Array<IIndexDescription> {
        return _.map(args,
            arg => ({
                property: arg[0],
                direction: arg[1] || 'asc'
            })
        );
    }

    private getSingleByName(annotations: Array<IAnnotation>, name: string): IAnnotation {
        if (_.isEmpty(annotations)) {
            return null;
        }

        return _.find(annotations, annot => annot.name === name);
    }

    private getMultiByName(annotations: Array<IAnnotation>, name: string): Array<IAnnotation> {
        if (_.isEmpty(annotations)) {
            return null;
        }

        return _.filter(annotations, annot => annot.name === name);
    }

    private extractSingleValue(annotation: IAnnotation) {
        return !_.isEmpty(annotation.args)
            ? annotation.args[0]
            : null;
    }

}

export default new Decorator();