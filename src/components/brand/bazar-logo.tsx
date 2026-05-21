import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface BazarLogoProps {
  variant?: "horizontal" | "icon";
  theme?: "light" | "dark";
  href?: string | null;
  className?: string;
  iconSize?: number;
}

export function BazarLogo({
  variant = "horizontal",
  theme = "light",
  href = "/",
  className,
  iconSize = 40,
}: BazarLogoProps) {
  const src =
    variant === "icon"
      ? "/logo/bazar-icon.png"
      : theme === "dark"
        ? "/logo/bazar-logo-horizontal-dark.svg"
        : "/logo/bazar-logo-horizontal.png";

  const imageWidth = variant === "icon" ? iconSize : Math.round(iconSize * 3.6);
  const imageHeight = iconSize;

  if (variant === "horizontal") {
    const frameHeight = Math.round(iconSize * 0.82);
    const frameWidth = Math.round(frameHeight * 3.05);
    const sourceHeight = Math.round(frameHeight * 2.25);
    const sourceWidth = Math.round(sourceHeight * 1.5);

    const img = (
      <span
        className="relative block overflow-hidden"
        style={{ width: frameWidth, height: frameHeight }}
      >
        <Image
          src={src}
          alt="bazar.ccaria"
          width={sourceWidth}
          height={sourceHeight}
          priority
          className="absolute max-w-none"
          style={{
            left: Math.round(frameHeight * -0.22),
            top: Math.round(frameHeight * -0.62),
            width: sourceWidth,
            height: sourceHeight,
          }}
        />
      </span>
    );

    if (href === null) {
      return (
        <span className={cn("inline-flex items-center shrink-0", className)}>
          {img}
        </span>
      );
    }

    return (
      <Link
        href={href}
        className={cn("inline-flex items-center shrink-0", className)}
      >
        {img}
      </Link>
    );
  }

  const img = (
    <Image
      src={src}
      alt="bazar.ccaria"
      width={imageWidth}
      height={imageHeight}
      className="h-auto shrink-0"
    />
  );

  if (href === null) {
    return (
      <span className={cn("inline-flex items-center shrink-0", className)}>
        {img}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={cn("inline-flex items-center shrink-0", className)}
    >
      {img}
    </Link>
  );
}
