"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PlatformNavigation } from "@/features/auth/routing";
import { institutionalLinks, institutionalNavigation } from "../routing";
import styles from "../institutional.module.css";

export function InstitutionalHeader({
  platform,
}: {
  platform: PlatformNavigation;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const trigger = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(false), []);
  const links = institutionalLinks(platform);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
      },
      { rootMargin: "-100px 0px -60% 0px" },
    );
    for (const item of institutionalNavigation) {
      const section = document.querySelector(item.href);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, []);

  // Same native dialog/focus/body-lock behavior as the shared drawer; its styles stay untouched.
  useEffect(() => {
    const element = dialog.current;
    if (!element || !open) return;
    const opener = trigger.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    element.showModal();
    closeButton.current?.focus({ preventScroll: true });
    const desktop = window.matchMedia("(min-width:1024px)");
    function onDesktop() {
      if (!desktop.matches) return;
      close();
      requestAnimationFrame(() =>
        document
          .querySelector<HTMLElement>(`.${styles["desktop-nav"]} a`)
          ?.focus({ preventScroll: true }),
      );
    }
    onDesktop();
    desktop.addEventListener("change", onDesktop);
    return () => {
      desktop.removeEventListener("change", onDesktop);
      element.close();
      document.body.style.overflow = previousOverflow;
      if (opener?.checkVisibility()) opener.focus({ preventScroll: true });
    };
  }, [open, close]);

  function navigation() {
    return institutionalNavigation.map((item) => (
      <a
        key={item.href}
        href={item.href}
        aria-current={active === item.href ? "location" : undefined}
        onClick={() => {
          setActive(item.href);
          close();
        }}
      >
        {item.label}
      </a>
    ));
  }
  return (
    <>
      <a
        className={`${styles.theme} ${styles.skipLink}`}
        href="#conteudo-institucional"
      >
        Ir para o conteúdo
      </a>
      <header className={`${styles.theme} ${styles["site-header"]}`}>
        <div className={`${styles.wrap} ${styles["header-row"]}`}>
          <button
            ref={trigger}
            type="button"
            className={styles["menu-toggle"]}
            aria-label="Abrir menu"
            aria-controls="institutional-menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <span />
            <span />
          </button>
          <a
            className={styles.brand}
            href="#inicio"
            aria-label="BarberHub, início"
            onClick={() => setActive("")}
          >
            BARBER<span>HUB</span>
          </a>
          <nav
            className={styles["desktop-nav"]}
            aria-label="Navegação institucional"
          >
            {navigation()}
          </nav>
          <div className={styles["desktop-access"]}>
            <a
              className={styles.login}
              href={links.login ?? undefined}
              aria-disabled={!links.login || undefined}
            >
              Entrar
            </a>
            <a
              className={`${styles.button} ${styles.small}`}
              href={links.ownerSignup ?? undefined}
              aria-disabled={!links.ownerSignup || undefined}
            >
              Criar conta
            </a>
          </div>
        </div>
        <dialog
          ref={dialog}
          className={styles.drawer}
          id="institutional-menu"
          aria-labelledby="institutional-menu-title"
          onCancel={(event) => {
            event.preventDefault();
            close();
          }}
          onClick={(event) => {
            if (
              event.target === event.currentTarget &&
              event.clientX > event.currentTarget.getBoundingClientRect().right
            )
              close();
          }}
          onKeyDown={(event) => {
            if (event.key !== "Tab") return;
            const controls = [
              ...event.currentTarget.querySelectorAll<HTMLElement>(
                "a[href],button:not([disabled])",
              ),
            ].filter((el) => el.checkVisibility());
            const first = controls[0],
              last = controls[controls.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last?.focus();
            }
            if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first?.focus();
            }
          }}
        >
          <div className={styles["drawer-top"]}>
            <h2 id="institutional-menu-title">Menu</h2>
            <button
              ref={closeButton}
              type="button"
              className={styles["menu-close"]}
              aria-label="Fechar menu"
              onClick={close}
            >
              ×
            </button>
          </div>
          <nav aria-label="Menu institucional">{navigation()}</nav>
          <div className={styles["drawer-access"]}>
            <p>O acesso Google ainda está indisponível.</p>
            <a
              className={`${styles.button} ${styles.outline}`}
              href={links.login ?? undefined}
              aria-disabled={!links.login || undefined}
              onClick={close}
            >
              Entrar
            </a>
            <a
              className={styles.button}
              href={links.ownerSignup ?? undefined}
              aria-disabled={!links.ownerSignup || undefined}
              onClick={close}
            >
              Criar conta
            </a>
          </div>
        </dialog>
      </header>
    </>
  );
}
