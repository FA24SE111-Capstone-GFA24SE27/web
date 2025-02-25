import { NavLinkAdapter } from '@shared/components';
import IconButton from '@mui/material/IconButton';
import { Outlet } from 'react-router-dom';
import { Close } from '@mui/icons-material';
/**
 * The contacts sidebar content.
 */
function StudentViewSidebarContent() {
  return (
    <div className="flex flex-col flex-auto max-w-full w-fit">
      <IconButton
        className="absolute top-0 right-0 z-10 mx-32 my-16"
        component={NavLinkAdapter}
        to="."
        size="large"
      >
        <Close />
      </IconButton>

      <Outlet />
    </div>
  );
}

export default StudentViewSidebarContent;
