/**
 * Thin compatibility layer so the ported FormulaX pages can keep using the
 * react-router-dom API surface while the app actually runs on TanStack Router.
 */
import {
  Link as TanLink,
  Outlet,
  useLocation as useTanLocation,
  useNavigate as useTanNavigate,
  useParams as useTanParams,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

export { Outlet };

type NavOpts = { replace?: boolean; state?: unknown };

export function useLocation() {
  const loc = useTanLocation();
  return {
    pathname: loc.pathname,
    search: loc.searchStr ?? "",
    hash: loc.hash ?? "",
    state: ((loc.state ?? {}) as unknown) as Record<string, unknown>,
    key: loc.href,
  };
}

export function useNavigate() {
  const navigate = useTanNavigate();
  const loc = useTanLocation();

  return (to: string | number, opts: NavOpts = {}) => {
    if (typeof to === "number") {
      if (typeof window !== "undefined") window.history.go(to);
      return;
    }
    const target = to === "." || to === "" ? loc.pathname : to;
    void navigate({
      to: target,
      replace: opts.replace ?? false,
      state: (prev: Record<string, unknown>) => ({
        ...prev,
        ...((opts.state as Record<string, unknown>) ?? {}),
      }),
    } as never);
  };
}

export function useParams<T extends Record<string, string> = Record<string, string>>() {
  return useTanParams({ strict: false } as never) as T;
}

export function useSearchParams(): [URLSearchParams, (next: URLSearchParams | Record<string, string>) => void] {
  const loc = useTanLocation();
  const navigate = useTanNavigate();
  const params = new URLSearchParams(loc.searchStr ?? "");

  const setParams = (next: URLSearchParams | Record<string, string>) => {
    const sp = next instanceof URLSearchParams ? next : new URLSearchParams(next);
    const obj: Record<string, string> = {};
    sp.forEach((v, k) => {
      obj[k] = v;
    });
    void navigate({ to: loc.pathname, search: obj, replace: true } as never);
  };

  return [params, setParams];
}

type LinkProps = {
  to: string;
  children?: ReactNode;
  className?: string;
  [key: string]: unknown;
};

export function Link({ to, children, ...rest }: LinkProps) {
  return (
    <TanLink to={to as never} {...(rest as object)}>
      {children as never}
    </TanLink>
  );
}

type NavLinkProps = {
  to: string;
  end?: boolean;
  children?: ReactNode | ((state: { isActive: boolean }) => ReactNode);
  className?: string | ((state: { isActive: boolean }) => string);
  [key: string]: unknown;
};

export function NavLink({ to, end, children, className, ...rest }: NavLinkProps) {
  const loc = useTanLocation();
  const isActive = end ? loc.pathname === to : loc.pathname === to || loc.pathname.startsWith(`${to}/`);
  const cls = typeof className === "function" ? className({ isActive }) : className;
  const kids = typeof children === "function" ? children({ isActive }) : children;

  return (
    <TanLink to={to as never} className={cls} {...(rest as object)}>
      {kids as never}
    </TanLink>
  );
}

export function Navigate({ to, replace = true }: { to: string; replace?: boolean }) {
  const navigate = useTanNavigate();
  if (typeof window !== "undefined") {
    void navigate({ to: to as never, replace });
  }
  return null;
}
