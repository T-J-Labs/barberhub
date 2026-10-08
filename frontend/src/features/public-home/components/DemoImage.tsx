import { getImageProps } from "next/image";
import captures from "../demo-captures.json";

type CaptureName = keyof typeof captures;
export type DemoImageKind =
  | "agenda"
  | "profile"
  | "service"
  | "professional"
  | "services"
  | "team"
  | "settings";
const variants: Record<
  DemoImageKind,
  {
    desktop: CaptureName;
    mobile: CaptureName;
    narrow: CaptureName;
    mobileMax: number;
  }
> = {
  agenda: {
    desktop: "agenda-720",
    mobile: "agenda-390",
    narrow: "agenda-320",
    mobileMax: 1100,
  },
  profile: {
    desktop: "profile-1060",
    mobile: "profile-390",
    narrow: "profile-320",
    mobileMax: 1023,
  },
  service: {
    desktop: "booking-service-390",
    mobile: "booking-service-390",
    narrow: "booking-service-358",
    mobileMax: 1023,
  },
  professional: {
    desktop: "booking-professional-390",
    mobile: "booking-professional-390",
    narrow: "booking-professional-358",
    mobileMax: 1023,
  },
  services: {
    desktop: "services-1024",
    mobile: "services-390",
    narrow: "services-320",
    mobileMax: 1023,
  },
  team: {
    desktop: "team-1024",
    mobile: "team-390",
    narrow: "team-320",
    mobileMax: 1023,
  },
  settings: {
    desktop: "settings-1024",
    mobile: "settings-390",
    narrow: "settings-320",
    mobileMax: 1023,
  },
};

function source(name: CaptureName) {
  return {
    ...captures[name],
    srcSet: `/landing/${name}.webp 1x, /landing/${name}@2x.webp 2x`,
  };
}

/** Art direction with lossless assets: never recompress text or crop the interface. */
export function DemoImage({
  kind,
  alt,
  hero = false,
}: {
  kind: DemoImageKind;
  alt: string;
  hero?: boolean;
}) {
  const { desktop, mobile, narrow, mobileMax } = variants[kind];
  const { props } = getImageProps({
    src: `/landing/${desktop}.webp`,
    ...captures[desktop],
    alt,
    unoptimized: true,
    loading: hero ? "eager" : "lazy",
    fetchPriority: hero ? "high" : "auto",
  });
  return (
    <picture>
      <source media="(max-width: 359px)" {...source(narrow)} />
      <source media={`(max-width: ${mobileMax}px)`} {...source(mobile)} />
      <img {...props} alt={alt} srcSet={source(desktop).srcSet} />
    </picture>
  );
}
