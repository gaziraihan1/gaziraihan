'use client';

import dynamic from "next/dynamic";

const AnimatedBackground = dynamic(
  () => import("@/components/animations/GlobalEffects").then(m => m.AnimatedBackground),
  { ssr: false }
);

const GlowCursor = dynamic(
  () => import("@/components/animations/GlobalEffects").then(m => m.GlowCursor),
  { ssr: false }
);

const CommandMenu = dynamic(
  () => import("@/components/animations/CommandMenu").then(m => m.CommandMenu),
  { ssr: false }
);

export default function ClientOnlyProviders() {
  return (
    <>
      <AnimatedBackground />
      <GlowCursor />
      <CommandMenu />
    </>
  );
}