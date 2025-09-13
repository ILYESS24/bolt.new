import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Square,
  Circle,
  Triangle,
  Type,
  Image,
  Video,
  Music,
  FileText,
  Database,
  Globe,
  Users,
  Settings,
  Palette,
  Code,
  Eye,
  Save,
  Download,
  Upload,
  Trash2,
  Copy,
  Move,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface SimpleVisualEditorProps {
  onSave?: (data: any) => void;
  onExport?: (data: any) => void;
}

interface ComponentItem {
  id: string;
  type: string;
  label: string;
  icon: any;
  category: 'layout' | 'content' | 'media' | 'interactive' | 'data';
  defaultProps: any;
}

const componentItems: ComponentItem[] = [
  // Layout Components
  { id: 'container', type: 'container', label: 'Container', icon: Square, category: 'layout', defaultProps: { className: 'p-4 bg-white rounded-lg shadow' } },
  { id: 'grid', type: 'grid', label: 'Grid', icon: Square, category: 'layout', defaultProps: { className: 'grid grid-cols-2 gap-4' } },
  { id: 'flex', type: 'flex', label: 'Flex', icon: Square, category: 'layout', defaultProps: { className: 'flex items-center justify-center' } },
  { id: 'section', type: 'section', label: 'Section', icon: Square, category: 'layout', defaultProps: { className: 'py-8 px-4' } },
  
  // Content Components
  { id: 'heading', type: 'heading', label: 'Heading', icon: Type, category: 'content', defaultProps: { text: 'Heading', level: 1, className: 'text-2xl font-bold' } },
  { id: 'paragraph', type: 'paragraph', label: 'Paragraph', icon: Type, category: 'content', defaultProps: { text: 'This is a paragraph', className: 'text-gray-600' } },
  { id: 'button', type: 'button', label: 'Button', icon: Square, category: 'content', defaultProps: { text: 'Click me', className: 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600' } },
  { id: 'input', type: 'input', label: 'Input', icon: Type, category: 'content', defaultProps: { placeholder: 'Enter text...', className: 'px-3 py-2 border rounded' } },
  
  // Media Components
  { id: 'image', type: 'image', label: 'Image', icon: Image, category: 'media', defaultProps: { src: '/placeholder.jpg', alt: 'Image', className: 'w-full h-48 object-cover rounded' } },
  { id: 'video', type: 'video', label: 'Video', icon: Video, category: 'media', defaultProps: { src: '/video.mp4', className: 'w-full h-48 rounded' } },
  { id: 'icon', type: 'icon', label: 'Icon', icon: Circle, category: 'media', defaultProps: { name: 'star', size: 24, className: 'text-blue-500' } },
  
  // Interactive Components
  { id: 'form', type: 'form', label: 'Form', icon: FileText, category: 'interactive', defaultProps: { className: 'space-y-4' } },
  { id: 'modal', type: 'modal', label: 'Modal', icon: Square, category: 'interactive', defaultProps: { isOpen: false, className: 'fixed inset-0 bg-black bg-opacity-50' } },
  { id: 'dropdown', type: 'dropdown', label: 'Dropdown', icon: Triangle, category: 'interactive', defaultProps: { options: ['Option 1', 'Option 2'], className: 'relative' } },
  
  // Data Components
  { id: 'table', type: 'table', label: 'Table', icon: Database, category: 'data', defaultProps: { data: [], className: 'w-full border-collapse' } },
  { id: 'chart', type: 'chart', label: 'Chart', icon: Circle, category: 'data', defaultProps: { type: 'bar', data: [], className: 'w-full h-64' } },
  { id: 'list', type: 'list', label: 'List', icon: FileText, category: 'data', defaultProps: { items: ['Item 1', 'Item 2'], className: 'space-y-2' } },
];

const categories = [
  { id: 'layout', label: 'Layout', icon: Square },
  { id: 'content', label: 'Content', icon: Type },
  { id: 'media', label: 'Media', icon: Image },
  { id: 'interactive', label: 'Interactive', icon: Settings },
  { id: 'data', label: 'Data', icon: Database },
];

interface CanvasNode {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  props: any;
}

function ComponentPalette() {
  const [selectedCategory, setSelectedCategory] = useState('layout');
  const [draggedComponent, setDraggedComponent] = useState<ComponentItem | null>(null);

  const filteredComponents = componentItems.filter(comp => comp.category === selectedCategory);

  const handleDragStart = (component: ComponentItem) => {
    setDraggedComponent(component);
  };

  const handleDragEnd = () => {
    setDraggedComponent(null);
  };

  return (
    <div className="w-64 h-full glass-dark border-r border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <h3 className="text-lg font-semibold text-white">Components</h3>
      </div>

      {/* Categories */}
      <div className="p-4 border-b border-white/10">
        <div className="grid grid-cols-2 gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 p-2 rounded-lg text-sm transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-400/20 text-blue-400'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <category.icon className="w-4 h-4" />
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Components */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {filteredComponents.map((component) => (
            <div
              key={component.id}
              draggable
              onDragStart={() => handleDragStart(component)}
              onDragEnd={handleDragEnd}
              className="flex items-center space-x-3 p-3 rounded-lg border border-white/20 cursor-move transition-all hover:bg-white/5"
            >
              <component.icon className="w-5 h-5 text-blue-400" />
              <span className="text-white text-sm">{component.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Canvas({ nodes, onAddNode, onSelectNode, selectedNodeId }: {
  nodes: CanvasNode[];
  onAddNode: (node: CanvasNode) => void;
  onSelectNode: (nodeId: string | null) => void;
  selectedNodeId: string | null;
}) {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    
    const componentData = e.dataTransfer.getData('text/plain');
    if (componentData) {
      try {
        const component = JSON.parse(componentData);
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const newNode: CanvasNode = {
          id: `${component.type}-${Date.now()}`,
          type: component.type,
          label: component.label,
          x,
          y,
          props: component.defaultProps
        };
        
        onAddNode(newNode);
      } catch (error) {
        console.error('Failed to parse component data:', error);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Toolbar */}
      <div className="h-12 glass-dark border-b border-white/10 flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <button className="glass-button text-sm">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button className="glass-button text-sm">
            <Save className="w-4 h-4 mr-2" />
            Save
          </button>
          <button className="glass-button text-sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div 
        className={`flex-1 relative overflow-hidden ${isOver ? 'bg-blue-500/10' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }} />
        
        {/* Nodes */}
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`absolute p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedNodeId === node.id
                ? 'border-blue-400 bg-blue-400/20'
                : 'border-white/20 bg-white/5 hover:border-white/40'
            }`}
            style={{ left: node.x, top: node.y }}
            onClick={() => onSelectNode(node.id)}
            drag
            dragMomentum={false}
            onDragEnd={(e, info) => {
              // Update node position
              console.log('Node moved:', node.id, info.point);
            }}
          >
            <div className="flex items-center space-x-2 text-white">
              <Square className="w-4 h-4" />
              <span className="text-sm font-medium">{node.label}</span>
            </div>
          </motion.div>
        ))}

        {isOver && (
          <div className="absolute inset-0 border-2 border-dashed border-blue-400 bg-blue-400/10 flex items-center justify-center">
            <div className="text-blue-400 text-lg font-medium">Drop component here</div>
          </div>
        )}
      </div>
    </div>
  );
}

function PropertiesPanel({ selectedNode, onUpdateNode, onDeleteNode }: {
  selectedNode: CanvasNode | null;
  onUpdateNode: (nodeId: string, props: any) => void;
  onDeleteNode: (nodeId: string) => void;
}) {
  const [properties, setProperties] = useState<any>({});

  const handlePropertyChange = (key: string, value: any) => {
    const newProps = { ...properties, [key]: value };
    setProperties(newProps);
    if (selectedNode) {
      onUpdateNode(selectedNode.id, newProps);
    }
  };

  if (!selectedNode) {
    return (
      <div className="w-64 h-full glass-dark border-l border-white/10 flex items-center justify-center">
        <div className="text-center">
          <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">Select a component to edit properties</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 h-full glass-dark border-l border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Properties</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onDeleteNode(selectedNode.id)}
              className="p-1 text-gray-400 hover:text-red-400"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-400">{selectedNode.type}</p>
      </div>

      {/* Properties */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(selectedNode.props || {}).map(([key, value]) => (
          <div key={key}>
            <label className="block text-sm font-medium text-white mb-2">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
            {typeof value === 'string' ? (
              <input
                type="text"
                value={value}
                onChange={(e) => handlePropertyChange(key, e.target.value)}
                className="glass-input w-full"
              />
            ) : typeof value === 'number' ? (
              <input
                type="number"
                value={value}
                onChange={(e) => handlePropertyChange(key, Number(e.target.value))}
                className="glass-input w-full"
              />
            ) : typeof value === 'boolean' ? (
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handlePropertyChange(key, e.target.checked)}
                className="w-4 h-4 text-blue-400 bg-transparent border-white/20 rounded focus:ring-blue-400"
              />
            ) : (
              <textarea
                value={JSON.stringify(value, null, 2)}
                onChange={(e) => {
                  try {
                    handlePropertyChange(key, JSON.parse(e.target.value));
                  } catch (error) {
                    // Invalid JSON, keep as string
                  }
                }}
                className="glass-input w-full h-20 resize-none"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SimpleVisualEditor({ onSave, onExport }: SimpleVisualEditorProps) {
  const [nodes, setNodes] = useState<CanvasNode[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const handleAddNode = (node: CanvasNode) => {
    setNodes(prev => [...prev, node]);
  };

  const handleSelectNode = (nodeId: string | null) => {
    setSelectedNodeId(nodeId);
  };

  const handleUpdateNode = (nodeId: string, props: any) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, props } : node
    ));
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    setSelectedNodeId(null);
  };

  const selectedNode = nodes.find(node => node.id === selectedNodeId) || null;

  return (
    <div className="h-full flex glass-dark">
      <ComponentPalette />
      <Canvas 
        nodes={nodes}
        onAddNode={handleAddNode}
        onSelectNode={handleSelectNode}
        selectedNodeId={selectedNodeId}
      />
      <PropertiesPanel 
        selectedNode={selectedNode}
        onUpdateNode={handleUpdateNode}
        onDeleteNode={handleDeleteNode}
      />
    </div>
  );
}