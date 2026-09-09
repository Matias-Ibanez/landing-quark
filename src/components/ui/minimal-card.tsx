// Adapted from cult-ui `minimal-card` (MIT).
// Changes for QUARK: zinc dark palette, next/image with fill, single radius
// system (24px card / 16px image) matching the rest of the page.

import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

const MinimalCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-[24px] border border-zinc-800 bg-zinc-900/50 p-2 transition-colors hover:bg-zinc-900",
      className,
    )}
    {...props}
  >
    {children}
  </div>
));
MinimalCard.displayName = "MinimalCard";

const MinimalCardImage = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    src: string;
    alt: string;
    sizes?: string;
  }
>(({ className, alt, src, sizes, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative mb-5 aspect-[4/3] w-full overflow-hidden rounded-[16px] ring-1 ring-zinc-800",
      className,
    )}
    {...props}
  >
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes ?? "(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"}
      className="object-cover grayscale contrast-125"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/50 to-transparent" />
  </div>
));
MinimalCardImage.displayName = "MinimalCardImage";

const MinimalCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "px-2 text-lg font-medium leading-tight text-zinc-50",
      className,
    )}
    {...props}
  />
));
MinimalCardTitle.displayName = "MinimalCardTitle";

const MinimalCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "px-2 pb-3 pt-2 text-sm leading-relaxed text-zinc-400",
      className,
    )}
    {...props}
  />
));
MinimalCardDescription.displayName = "MinimalCardDescription";

const MinimalCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 pt-0", className)} {...props} />
));
MinimalCardContent.displayName = "MinimalCardContent";

const MinimalCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-4 pt-0", className)}
    {...props}
  />
));
MinimalCardFooter.displayName = "MinimalCardFooter";

export {
  MinimalCard,
  MinimalCardImage,
  MinimalCardTitle,
  MinimalCardDescription,
  MinimalCardContent,
  MinimalCardFooter,
};

export default MinimalCard;
