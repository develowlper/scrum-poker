import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
export const Route = createRootRoute({
  component: () => (
    <>
      <nav className="navbar shadow-sm bg-neutral text-neutral-content gap-4">
        <img src="/poker.png" alt="logo" className="h-10 w-10" />
        <div className="navbar-center flex gap-2">
          <Link to="/" className="link [&.active]:font-bold">
            Home
          </Link>{' '}
          <Link to="/about" className="link [&.active]:font-bold">
            About
          </Link>
        </div>
      </nav>

      <Outlet />
      <TanStackRouterDevtools />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  ),
});
