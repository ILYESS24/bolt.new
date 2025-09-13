declare module '@/components/WebContainer' {
  import { ComponentType } from 'react';
  
  interface WebContainerProps {
    projectFiles?: Array<{
      name: string;
      content: string;
      path: string;
    }>;
    onPreview?: (url: string) => void;
    onError?: (error: string) => void;
  }
  
  const WebContainer: ComponentType<WebContainerProps>;
  export default WebContainer;
}

declare module '@/components/AdvancedAppGenerator' {
  import { ComponentType } from 'react';
  
  interface AdvancedAppGeneratorProps {
    onProjectGenerated?: (project: any) => void;
  }
  
  const AdvancedAppGenerator: ComponentType<AdvancedAppGeneratorProps>;
  export default AdvancedAppGenerator;
}

declare module '@/components/VisualEditor' {
  import { ComponentType } from 'react';
  
  interface VisualEditorProps {
    onSave?: (nodes: any[], edges: any[]) => void;
    onExport?: (data: any) => void;
  }
  
  const VisualEditor: ComponentType<VisualEditorProps>;
  export default VisualEditor;
}

declare module '@/components/CodeEditor' {
  import { ComponentType } from 'react';
  
  interface CodeEditorProps {
    file: {
      name: string;
      content: string;
      language: string;
      path: string;
    };
    onContentChange?: (content: string) => void;
  }
  
  const CodeEditor: ComponentType<CodeEditorProps>;
  export default CodeEditor;
}

declare module '@/components/Terminal' {
  import { ComponentType } from 'react';
  
  const Terminal: ComponentType<any>;
  export default Terminal;
}

declare module '@/components/AutoFixPanel' {
  import { ComponentType } from 'react';
  
  interface AutoFixPanelProps {
    projectId: string;
  }
  
  const AutoFixPanel: ComponentType<AutoFixPanelProps>;
  export default AutoFixPanel;
}