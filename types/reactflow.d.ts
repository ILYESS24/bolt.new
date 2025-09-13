declare module '@reactflow/core' {
  export interface Node {
    id: string;
    type: string;
    position: { x: number; y: number };
    data: any;
  }
  
  export interface Edge {
    id: string;
    source: string;
    target: string;
  }
  
  export function useNodesState(initial: Node[]): [Node[], any, any];
  export function useEdgesState(initial: Edge[]): [Edge[], any, any];
  export function addEdge(edge: Edge, edges: Edge[]): Edge[];
  
  export default function ReactFlow(props: any): JSX.Element;
  export const Controls: any;
  export const Background: any;
  export const MiniMap: any;
  export const NodeToolbar: any;
  export const BackgroundVariant: any;
  export const MarkerType: any;
}