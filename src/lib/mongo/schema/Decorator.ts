
import _ from 'lodash';

import { ITypeDescription, IAnnotation } from 'tparserr';

import { IIndexDescription } from '../../types/Index';


class Decorator {

    public extractDecoratedCollectionName(typeDescription: ITypeDescription): string {
        const collectionNameAnnot = this.getByName(typeDescription.annotations, 'CollectionName');

        return !_.isEmpty(collectionNameAnnot)
            ? this.extractSingleValue(collectionNameAnnot)
            : null;
    }

    public extractPropertyIndexDecorators(property: string, typeDescription: ITypeDescription): IIndexDescription {
        const indexAnnot = this.getByName(typeDescription.annotations, 'Index');

        return !_.isEmpty(indexAnnot)
            ? {
                property,
                direction: this.extractSingleValue(indexAnnot) || 'asc'
            }
            : null;
    }

    private getByName(annotations: Array<IAnnotation>, name: string): IAnnotation {
        if (_.isEmpty(annotations)) {
            return null;
        }

        return _.find(annotations, annot => annot.name === name);
    }

    private extractSingleValue(annotation: IAnnotation) {
        return !_.isEmpty(annotation.args)
            ? annotation.args[0]
            : null;
    }

}

export default new Decorator();