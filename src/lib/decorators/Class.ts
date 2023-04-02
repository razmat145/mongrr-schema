
import { TCompoundIndexInputDefinition } from '../types/Index';

export function CollectionName(name: string): Function {
    return () => { return; };
}

export function CompoundIndex(...args: Array<TCompoundIndexInputDefinition>): Function {
    return () => { return; };
}