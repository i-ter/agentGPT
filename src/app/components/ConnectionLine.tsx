'use client';

import { ConnectionLineComponentProps, getSmoothStepPath } from 'reactflow';

const ConnectionLine = ({
  fromX,
  fromY,
  fromPosition,
  toX,
  toY,
  toPosition,
}: ConnectionLineComponentProps) => {
  const [edgePath] = getSmoothStepPath({
    sourceX: fromX,
    sourceY: fromY,
    sourcePosition: fromPosition,
    targetX: toX,
    targetY: toY,
    targetPosition: toPosition,
  });

  return (
    <g>
      <path
        d={edgePath}
        fill="none"
        stroke="#6366F1"
        strokeWidth={6}
        className="animated"
        filter="url(#connection-glow)"
      />
      <path
        d={edgePath}
        fill="none"
        stroke="#6366F1"
        strokeWidth={12}
        strokeOpacity={0.3}
        className="animated"
        strokeLinecap="round"
      />
      <circle
        cx={toX}
        cy={toY}
        fill="#6366F1"
        r={7}
        stroke="#fff"
        strokeWidth={2}
        strokeOpacity={0.95}
        filter="url(#endpoint-glow)"
      />
      <defs>
        <filter id="connection-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feFlood result="flood" floodColor="#6366F1" floodOpacity="0.4"></feFlood>
          <feComposite in="flood" result="mask" in2="SourceGraphic" operator="in"></feComposite>
          <feGaussianBlur in="mask" result="blurred" stdDeviation="3"></feGaussianBlur>
          <feMerge>
            <feMergeNode in="blurred"></feMergeNode>
            <feMergeNode in="SourceGraphic"></feMergeNode>
          </feMerge>
        </filter>
        <filter id="endpoint-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feFlood result="flood" floodColor="#6366F1" floodOpacity="0.6"></feFlood>
          <feComposite in="flood" result="mask" in2="SourceGraphic" operator="in"></feComposite>
          <feGaussianBlur in="mask" result="blurred" stdDeviation="2"></feGaussianBlur>
          <feMerge>
            <feMergeNode in="blurred"></feMergeNode>
            <feMergeNode in="SourceGraphic"></feMergeNode>
          </feMerge>
        </filter>
      </defs>
    </g>
  );
};

export default ConnectionLine; 