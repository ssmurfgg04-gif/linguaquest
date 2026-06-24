import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AppHeader } from "../components/AppHeader";
import { Toaster } from "../components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 pb-24">
        <section className="mt-16 sm:mt-24 flex flex-col items-center text-center">
          <div className="text-7xl mb-4">🗺️</div>
          <h1 className="text-display text-3xl sm:text-4xl text-foreground">Lost your way?</h1>
          <p className="mt-3 max-w-md text-muted-foreground">
            This page hasn't been discovered yet. Try a different path or head back home.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-soft hover:scale-105 transition-transform"
            >
              Go home
            </Link>
            <Link
              to="/progress"
              className="inline-flex items-center justify-center rounded-full border border-border bg-surface px-6 py-2.5 text-sm font-bold text-foreground hover:bg-accent transition-transform"
            >
              My progress
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center surface-card p-8">
        <div className="text-5xl mb-2">😅</div>
        <h1 className="text-display text-2xl text-foreground">Oops — something tripped us up</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Try again, or head home. No worries, your progress is safe.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-soft hover:scale-105 transition-transform"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-full border border-input bg-surface px-5 py-2.5 text-sm font-bold text-foreground hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Ujuziverse — Speak English & Swahili with confidence" },
      { name: "description", content: "AI-powered language learning for school students. Practice real-life conversations in English, Swahili & French through fun roleplay with friendly AI characters" },
      { name: "author", content: "Ujuziverse" },
      { name: "theme-color", content: "#E8734A" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: "Ujuziverse" },
      { property: "og:title", content: "Ujuziverse — Speak English & Swahili with confidence" },
      { property: "og:description", content: "AI-powered language learning for school students. Practice real-life conversations in English, Swahili & French through fun roleplay with friendly AI characters" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Ujuziverse — Speak English & Swahili with confidence" },
      { name: "twitter:description", content: "AI-powered language learning for school students. Practice real-life conversations in English, Swahili & French through fun roleplay with friendly AI characters" },
      { property: "og:image", content: "/og-image.png" },
      { name: "twitter:image", content: "/og-image.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap" },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "service-worker", href: "/sw.js", scope: "/" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Toaster />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  // Register service worker for PWA installability
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
