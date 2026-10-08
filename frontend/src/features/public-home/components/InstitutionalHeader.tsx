import type { PlatformNavigation } from "@/features/auth/routing";
import { PublicHeader } from "@/features/navigation/components/public/PublicHeader";
import { institutionalLinks } from "../routing";
import styles from "../institutional.module.css";

export function InstitutionalHeader({ platform }: { platform: PlatformNavigation }) {
  return (
    <>
      <a className={`${styles.theme} ${styles.skipLink}`} href="#conteudo-institucional">
        Ir para o conteúdo
      </a>
      <PublicHeader context="landing" platform={platform} signupHref={institutionalLinks(platform).ownerSignup} />
    </>
  );
}
