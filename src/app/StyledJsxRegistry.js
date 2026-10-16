"use client";

import React, { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { StyleRegistry, createStyleRegistry } from 'styled-jsx';

// Server-renders <style jsx> blocks (Navbar, PortfolioGrid, PropertyDetails,
// Testimonials) so their CSS arrives with the HTML. Without this, those styles
// only appear after JavaScript loads and the page visibly jumps — e.g. the
// mobile menu links flash at the top-left and then slide away.
export default function StyledJsxRegistry({ children }) {
  const [registry] = useState(() => createStyleRegistry());

  useServerInsertedHTML(() => {
    const styles = registry.styles();
    registry.flush();
    return <>{styles}</>;
  });

  return <StyleRegistry registry={registry}>{children}</StyleRegistry>;
}
