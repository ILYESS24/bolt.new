declare module 'react-dnd' {
  export function DndProvider(props: any): JSX.Element;
  export function useDrag(options: any): any[];
  export function useDrop(options: any): any[];
}

declare module 'react-dnd-html5-backend' {
  export const HTML5Backend: any;
}