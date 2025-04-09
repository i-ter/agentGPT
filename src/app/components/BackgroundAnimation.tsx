'use client';

import { useEffect, useRef, useState } from 'react';

interface Node {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  type: string;
  velocityX: number;
  velocityY: number;
}

interface Link {
  source: string;
  target: string;
}

const NODE_COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // amber
  '#8B5CF6', // purple
  '#EC4899', // pink
];

const NODE_TYPES = ['circle', 'square', 'diamond'];

const BackgroundAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // Initial setup
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
        
        // Create initial nodes
        const initialNodeCount = Math.floor(width * height / 50000); // Adjust count based on screen size
        const newNodes: Node[] = [];
        
        for (let i = 0; i < initialNodeCount; i++) {
          newNodes.push({
            id: `node-${i}`,
            x: Math.random() * width,
            y: Math.random() * height,
            size: 10 + Math.random() * 15,
            color: NODE_COLORS[Math.floor(Math.random() * NODE_COLORS.length)],
            type: NODE_TYPES[Math.floor(Math.random() * NODE_TYPES.length)],
            velocityX: (Math.random() - 0.5) * 0.5,
            velocityY: (Math.random() - 0.5) * 0.5,
          });
        }
        
        setNodes(newNodes);
        
        // Create links between some nodes
        const newLinks: Link[] = [];
        const linkCount = Math.floor(initialNodeCount * 0.7);
        
        for (let i = 0; i < linkCount; i++) {
          const sourceIndex = Math.floor(Math.random() * newNodes.length);
          let targetIndex = Math.floor(Math.random() * newNodes.length);
          
          // Ensure we don't link a node to itself
          while (targetIndex === sourceIndex) {
            targetIndex = Math.floor(Math.random() * newNodes.length);
          }
          
          newLinks.push({
            source: newNodes[sourceIndex].id,
            target: newNodes[targetIndex].id,
          });
        }
        
        setLinks(newLinks);
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Animation loop
  useEffect(() => {
    if (!nodes.length || !dimensions.width || !dimensions.height) return;
    
    const updateNodes = () => {
      setNodes(prevNodes => {
        return prevNodes.map(node => {
          let newX = node.x + node.velocityX;
          let newY = node.y + node.velocityY;
          
          // Bounce off walls
          if (newX <= 0 || newX >= dimensions.width) {
            node.velocityX *= -1;
            newX = Math.max(0, Math.min(newX, dimensions.width));
          }
          
          if (newY <= 0 || newY >= dimensions.height) {
            node.velocityY *= -1;
            newY = Math.max(0, Math.min(newY, dimensions.height));
          }
          
          return {
            ...node,
            x: newX,
            y: newY,
          };
        });
      });
      
      animationFrameRef.current = requestAnimationFrame(updateNodes);
    };
    
    animationFrameRef.current = requestAnimationFrame(updateNodes);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [nodes, dimensions]);
  
  const getNodeShape = (node: Node) => {
    switch (node.type) {
      case 'square':
        return (
          <rect
            width={node.size}
            height={node.size}
            x={-node.size / 2}
            y={-node.size / 2}
            rx={2}
            fill={node.color}
            fillOpacity={0.2}
            stroke={node.color}
            strokeWidth={1}
          />
        );
      case 'diamond':
        return (
          <polygon
            points={`0,-${node.size/2} ${node.size/2},0 0,${node.size/2} -${node.size/2},0`}
            fill={node.color}
            fillOpacity={0.2}
            stroke={node.color}
            strokeWidth={1}
          />
        );
      default: // circle
        return (
          <circle
            r={node.size / 2}
            fill={node.color}
            fillOpacity={0.2}
            stroke={node.color}
            strokeWidth={1}
          />
        );
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <svg width="100%" height="100%">
        {/* Render links */}
        {links.map((link, index) => {
          const sourceNode = nodes.find(n => n.id === link.source);
          const targetNode = nodes.find(n => n.id === link.target);
          
          if (!sourceNode || !targetNode) return null;
          
          return (
            <line
              key={`link-${index}`}
              x1={sourceNode.x}
              y1={sourceNode.y}
              x2={targetNode.x}
              y2={targetNode.y}
              stroke={sourceNode.color}
              strokeOpacity={0.1}
              strokeWidth={1}
            />
          );
        })}
        
        {/* Render nodes */}
        {nodes.map(node => (
          <g
            key={node.id}
            transform={`translate(${node.x},${node.y})`}
          >
            {getNodeShape(node)}
          </g>
        ))}
      </svg>
    </div>
  );
};

export default BackgroundAnimation; 