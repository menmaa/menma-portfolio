"use client";

import { Container, Grow, GrowProps } from "@mui/material";
import React from "react";

type ScrollInGrowProps = GrowProps & {
  onScrollIn?: () => void;
  onScrollOut?: () => void;
};

export default function ScrollInGrow({ children, onScrollIn, onScrollOut, ...props }: ScrollInGrowProps) {
  const [isVisible, setIsVisible] = React.useState<boolean>(false);
  const sectionRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!sectionRef.current) return;
    const section = sectionRef.current;

    const options: IntersectionObserverInit = {
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ isIntersecting }) => {
        setIsVisible(isIntersecting);
        
        if(isIntersecting && onScrollIn) {
          onScrollIn();
        } else if(!isIntersecting && onScrollOut) {
          onScrollOut();
        }
      }); 
    }, options);
    observer.observe(section);

    return () => {
      observer.unobserve(section);
    };
  }, [onScrollIn, onScrollOut]);

  return (
    <Container ref={sectionRef}>
      <Grow {...props} in={isVisible}>{children}</Grow>
    </Container>
  );
}