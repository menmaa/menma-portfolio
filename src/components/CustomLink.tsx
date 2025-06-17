"use client";

import { addBasePath } from "next/dist/client/add-base-path";
import NextLink from "next/link";
import { forwardRef } from "react";

const Link = forwardRef<HTMLAnchorElement, React.ComponentProps<"a">>(
  function Link({ href, onClick, ...rest }, ref) {
    if (!href) return;

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      const currentUrl = window.location;
      const targetUrl = getURL(href);

      if (isModifiedEvent(e)) return false; // Ignore clicks with modifier keys
      if (currentUrl.origin !== targetUrl.origin) return false; // External URL
      if (currentUrl.pathname !== targetUrl.pathname || currentUrl.search !== targetUrl.search) return false; // Different page

      const target = document.getElementById(targetUrl.hash.slice(1));
      if (target) {
        const y = target.getBoundingClientRect().top + window.scrollY - 50;
        window.scrollTo({ top: y, behavior: "smooth" });
        window.history.replaceState(null, "", targetUrl.href);
        return true;
      } else if(window.scrollY > window.innerHeight * 0.1) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return true;
      }

      return false;
    };

    return (
      <NextLink
        href={href}
        onClick={(e) => {
          if (handleClick(e)) e.preventDefault();
          if (onClick) onClick(e);
        }}
        {...rest}
        ref={ref}
      />
    );
  }
);

function getURL(href: string): URL {
  return new URL(addBasePath(href), location.href);
}

// https://github.com/vercel/next.js/blob/400ccf7b1c802c94127d8d8e0d5e9bdf9aab270c/packages/next/src/client/link.tsx#L169
function isModifiedEvent(event: React.MouseEvent): boolean {
  const eventTarget = event.currentTarget as HTMLAnchorElement | SVGAElement;
  const target = eventTarget.getAttribute("target");
  return (
    (target && target !== "_self") ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey || // triggers resource download
    (event.nativeEvent && event.nativeEvent.button === 1)
  );
}

export default Link;