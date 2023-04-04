
import { TIndexDirection } from '../types/Index';

export function Index(direction?: TIndexDirection): Function {
    return () => { return; };
}

export * from './propertyType/Number';
export * from './propertyType/String';