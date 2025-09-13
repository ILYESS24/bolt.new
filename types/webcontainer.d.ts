declare module '@webcontainer/api' {
  export interface WebContainer {
    boot(): Promise<WebContainer>;
    mount(tree: any): Promise<void>;
    spawn(command: string, args?: string[]): Promise<any>;
    fs: {
      readFile(path: string, encoding?: string): Promise<string>;
      writeFile(path: string, content: string): Promise<void>;
      readdir(path: string, options?: any): Promise<any[]>;
    };
    on(event: string, callback: Function): void;
    teardown(): void;
  }
  
  export const WebContainer: {
    boot(): Promise<WebContainer>;
  };
}