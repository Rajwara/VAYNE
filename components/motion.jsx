'use client';

import { useInView, useReducedMotion } from '@/lib/hooks';
import { EASE } from '@/lib/theme';

/** Heading whose words slide up from a mask when scrolled into view. */
export function SplitText({ text, as: Tag = 'h2', style, delay = 0, step = 0.05, italic, id }) {
  const [ref, seen] = useInView(0.35);
  const reduced = useReducedMotion();
  const words = String(text).split(' ');
  return (
    <Tag ref={ref} id={id} aria-label={text} style={{ margin: 0, ...style }}>
      {words.map((w, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            verticalAlign: 'top',
            paddingBottom: '0.1em',
            marginBottom: '-0.1em',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              whiteSpace: 'pre',
              fontStyle: italic && italic.includes(i) ? 'italic' : undefined,
              transform: seen || reduced ? 'none' : 'translateY(110%)',
              transition: reduced ? 'none' : `transform 1s ${EASE} ${delay + i * step}s`,
            }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        </span>
      ))}
    </Tag>
  );
}

/** Fades and lifts its children in when scrolled into view. */
export function Reveal({ children, delay = 0, style, as: Tag = 'div', y = 24, className }) {
  const [ref, seen] = useInView(0.12);
  const reduced = useReducedMotion();
  const on = seen || reduced;
  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: on ? 1 : 0,
        transform: on ? 'none' : `translateY(${y}px)`,
        transition: reduced ? 'none' : `opacity .7s linear ${delay}s, transform 1s ${EASE} ${delay}s`,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
