import {
  clientAuthHref,
  type PlatformNavigation,
} from "@/features/auth/routing";
import { onboardingHref } from "@/features/owner-onboarding/routing";
import { publicBarbershopHref } from "@/features/public-barbershop/routing";

export function institutionalLinks(
  platform: PlatformNavigation,
  publicOrigin: string | null = platform.origin,
) {
  const example = publicOrigin
    ? publicBarbershopHref("demo-esquina", publicOrigin)
    : null;
  return {
    onboarding: onboardingHref(),
    login: clientAuthHref(platform.origin, "login"),
    ownerSignup: clientAuthHref(
      platform.origin,
      "cadastro",
      undefined,
      "barbearia",
    ),
    clientSignup: clientAuthHref(platform.origin, "cadastro"),
    catalog: platform.origin
      ? new URL("/barbearias", platform.origin).href
      : null,
    example,
    booking: example ? new URL("/agendar", example).href : null,
  };
}
