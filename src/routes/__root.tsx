import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import clsx from 'clsx';
import ThemeDropdown from '../components/ThemeDropdown';
export const Route = createRootRoute({
  component: () => (
    <>
      <nav className="navbar shadow-sm bg-primary text-primary-content gap-4">
        <div className="navbar-start flex gap-2">
          <img src="/poker.png" alt="logo" className="h-10 w-10 navbar-start" />
          <h1 className="text-lg">Planning Poker</h1>
        </div>
        <div className="navbar-center flex gap-2">
          <Link to="/" className="link [&.active]:font-bold">
            Home
          </Link>{' '}
          <Link to="/about" className="link [&.active]:font-bold">
            About
          </Link>
        </div>
        <div className="navbar-end">
          <ThemeDropdown />
        </div>
      </nav>
      <div
        className={clsx(
          'flex-1 flex flex-col justify-center items-center py-4 px-2',
        )}
      >
        <div className="w-full">{<Outlet />}</div>
      </div>

      <TanStackRouterDevtools />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  ),
});
