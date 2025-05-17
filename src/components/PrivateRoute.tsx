
import { Outlet } from 'react-router-dom';

/**
 * PrivateRoute - Simplified component that just renders content
 * No authentication checks - purely demonstrative
 */
export const PrivateRoute = () => {
  return <Outlet />;
};
