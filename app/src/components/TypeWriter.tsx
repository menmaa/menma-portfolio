"use client";

import { useState, useEffect, useMemo, useRef, Children } from 'react';
import { Typography, Stack, TypographyProps } from '@mui/material';

type ChildrenOf<T> = React.ReactElement<T> | React.ReactElement<T>[];

type TypeWriterTextProps = TypographyProps & {
  speed?: number;
  children: string;
};

type TypeWriterProps = {
  speed?: number;
  children: ChildrenOf<TypeWriterTextProps>;
  onComplete?: () => void;
};

type TypeWriterState = {
  counter: number;
  index: number;
};

export function TypeWriter({ speed = 1, onComplete, children }: TypeWriterProps) {
  const [state, setState] = useState<TypeWriterState>({ counter: 0, index: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const elements = useMemo(() => {
    return Children.toArray(children) as Array<React.ReactElement<TypeWriterTextProps>>;
  }, [children]);

  const updateInterval = useMemo(() => {
    let characters = 0;
    for(const el of elements) {
      characters += el.props.children.length;
    }

    return 1000 / (characters * speed);
  }, [elements, speed]);

  useEffect(() => {
    const element = ref.current;
    if(!element) return;

    function onClick() {
      setState({ index: elements.length, counter: 0 });
    }

    element.addEventListener('click', onClick, { once: true });
    return () => {
      element.removeEventListener('click', onClick);
    };
  }, [elements]);

  useEffect(() => {
    if (state.index === elements.length) {
      if(onComplete) onComplete();
      return;
    };

    function update() {
      if (elements[state.index].props.children.length === state.counter) {
        setState((current) => ({ index: current.index + 1, counter: 0 }));
        return;
      }
      setState((current) => ({ index: current.index, counter: current.counter + 1 }));
    }

    const timer = setTimeout(update, updateInterval);
    return () => clearTimeout(timer);
  }, [state, updateInterval, elements, onComplete]);

  return (
    <Stack spacing={4} alignItems="flex-start" ref={ref}>
      {elements.map((child: React.ReactElement<TypeWriterTextProps>, i: number) => {
        if(i < state.index) return child;
        if(i > state.index) return null;

        return (
          <Typography key={i} { ...child.props } sx={{
            ...child.props.sx,
            '&::after': {
              content: '"_"'
            }
          }}>
            {child.props.children.substring(0, state.counter)}
          </Typography>
        );
      })}
    </Stack>
  );
}