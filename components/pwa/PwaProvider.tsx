"use client";

import { useEffect, useState } from "react";
import { Download, RefreshCw, Share, X } from "lucide-react";

const IOS_DISMISS_KEY = "ik-house:ios-install-dismissed";
const ANDROID_DISMISS_KEY = "ik-house:install-dismissed";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as { standalone?: boolean }).standalone === true
  );
}

function isIosSafari(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const isIos = /iPhone|iPad|iPod/.test(ua);
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
  return isIos && isSafari;
}

export default function PwaProvider() {
  const [updateReady, setUpdateReady] = useState<ServiceWorker | null>(null);
  const [installEvt, setInstallEvt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosTip, setShowIosTip] = useState(false);

  // Регистрация service worker + update flow
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    let reloading = false;

    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        // уже есть ожидающая новая версия
        if (reg.waiting && navigator.serviceWorker.controller) {
          setUpdateReady(reg.waiting);
        }
        reg.addEventListener("updatefound", () => {
          const sw = reg.installing;
          if (!sw) return;
          sw.addEventListener("statechange", () => {
            if (sw.state === "installed" && navigator.serviceWorker.controller) {
              setUpdateReady(sw);
            }
          });
        });
      })
      .catch(() => {});

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (reloading) return;
      reloading = true;
      window.location.reload();
    });
  }, []);

  // Android install prompt
  useEffect(() => {
    function onBip(e: Event) {
      e.preventDefault();
      if (localStorage.getItem(ANDROID_DISMISS_KEY)) return;
      if (isStandalone()) return;
      setInstallEvt(e as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", onBip);
    return () => window.removeEventListener("beforeinstallprompt", onBip);
  }, []);

  // iOS подсказка (не сразу, ненавязчиво)
  useEffect(() => {
    if (!isIosSafari() || isStandalone()) return;
    if (localStorage.getItem(IOS_DISMISS_KEY)) return;
    const t = setTimeout(() => setShowIosTip(true), 20000);
    return () => clearTimeout(t);
  }, []);

  async function install() {
    if (!installEvt) return;
    await installEvt.prompt();
    const { outcome } = await installEvt.userChoice;
    if (outcome === "dismissed") {
      localStorage.setItem(ANDROID_DISMISS_KEY, "1");
    }
    setInstallEvt(null);
  }

  return (
    <>
      {/* Toast обновления версии */}
      {updateReady && (
        <div
          role="status"
          className="fixed inset-x-3 z-[70] mx-auto flex max-w-md items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg"
          style={{ bottom: "calc(80px + env(safe-area-inset-bottom))" }}
        >
          <span className="text-sm font-medium text-ink">
            Доступна новая версия IK-HOUSE
          </span>
          <button
            onClick={() => updateReady.postMessage("SKIP_WAITING")}
            className="btn-primary min-h-10 shrink-0 px-3 py-2 text-sm"
          >
            <RefreshCw className="h-4 w-4" /> Обновить
          </button>
        </div>
      )}

      {/* Android: установить приложение */}
      {installEvt && !updateReady && (
        <div
          role="dialog"
          aria-label="Установить приложение"
          className="fixed inset-x-3 z-[70] mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg"
          style={{ bottom: "calc(80px + env(safe-area-inset-bottom))" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icons/icon-192.png"
            alt=""
            className="h-10 w-10 shrink-0 rounded-xl"
          />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-ink">Установить IK-HOUSE</div>
            <div className="text-xs text-ink-muted">
              Быстрый доступ с главного экрана
            </div>
          </div>
          <button
            onClick={install}
            className="btn-primary min-h-10 shrink-0 px-3 py-2 text-sm"
          >
            <Download className="h-4 w-4" /> Установить
          </button>
          <button
            aria-label="Закрыть"
            onClick={() => {
              localStorage.setItem(ANDROID_DISMISS_KEY, "1");
              setInstallEvt(null);
            }}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink-muted hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* iOS: инструкция добавления на экран Домой */}
      {showIosTip && !updateReady && (
        <div
          role="dialog"
          aria-label="Добавить на экран Домой"
          className="fixed inset-x-3 z-[70] mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-lg"
          style={{ bottom: "calc(80px + env(safe-area-inset-bottom))" }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/icons/icon-192.png"
                alt=""
                className="h-10 w-10 shrink-0 rounded-xl"
              />
              <div className="text-sm font-bold text-ink">
                Добавьте IK-HOUSE на экран «Домой»
              </div>
            </div>
            <button
              aria-label="Закрыть"
              onClick={() => {
                localStorage.setItem(IOS_DISMISS_KEY, "1");
                setShowIosTip(false);
              }}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink-muted hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <ol className="mt-2 space-y-1 text-sm text-ink-soft">
            <li className="flex items-center gap-1.5">
              1. Нажмите <Share className="inline h-4 w-4 text-brand-600" />{" "}
              «Поделиться» внизу Safari
            </li>
            <li>2. Выберите «На экран “Домой”»</li>
          </ol>
        </div>
      )}
    </>
  );
}
