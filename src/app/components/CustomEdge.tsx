'use client';

import { useCallback } from 'react';
import { EdgeProps, getSmoothStepPath, useReactFlow } from 'reactflow';

const CustomEdge = ({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
}: EdgeProps) => {
  const { setEdges } = useReactFlow();
  
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      setEdges((edges) => edges.map((edge) => {
        if (edge.id === id) {
          return {
            ...edge,
            selected: !selected,
          };
        }
        return edge;
      }));
    },
    [id, selected, setEdges]
  );

  return (
    <g onClick={onEdgeClick}>
      <path
        d={edgePath}
        fill="none"
        strokeWidth={8}
        className="react-flow__edge-path"
        stroke={selected ? '#ff00ff' : '#6366F1'}
        strokeOpacity={selected ? 1 : 0.98}
        id={id}
        filter="url(#edge-glow)"
      />
      {/* Animated effect for the edge */}
      <path
        d={edgePath}
        fill="none"
        strokeWidth={6}
        className="react-flow__edge-path"
        stroke={selected ? '#ff00ff' : '#6366F1'}
        strokeOpacity={selected ? 0.98 : 0.95}
        strokeDasharray="5,5"
        id={`${id}-animated`}
        style={{
          animation: 'flowAnimation 1s linear infinite',
        }}
      />
      {/* Wider path for better click target, invisible */}
      <path
        d={edgePath}
        fill="none"
        strokeWidth={20}
        stroke="transparent"
        className="react-flow__edge-interaction"
        onClick={onEdgeClick}
        id={`${id}-interaction`}
      />
      {/* Define the glow filter */}
      <defs>
        <filter id="edge-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feFlood result="flood" floodColor="#6366F1" floodOpacity="0.5"></feFlood>
          <feComposite in="flood" result="mask" in2="SourceGraphic" operator="in"></feComposite>
          <feGaussianBlur in="mask" result="blurred" stdDeviation="4"></feGaussianBlur>
          <feMerge>
            <feMergeNode in="blurred"></feMergeNode>
            <feMergeNode in="SourceGraphic"></feMergeNode>
          </feMerge>
        </filter>
      </defs>
    </g>
  );
};

export default CustomEdge; 