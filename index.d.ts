declare module "index" {
    import { Plugin } from './node_modules/esbuild/lib/main';
    interface Config {
        importmap: {
            imports: {
                [key: string]: string;
            };
        };
        directory: string;
    }
    export function cache({ importmap, directory }: Config): Plugin;
}
