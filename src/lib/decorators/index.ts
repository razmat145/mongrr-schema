
export * from './Class';
export * from './Property';

export function Description(description: string): Function {
    return () => { return; };
}