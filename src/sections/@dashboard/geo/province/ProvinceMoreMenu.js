import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
// component
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

export default function UserMoreMenu({ value }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const setLoacal = () => {
    localStorage.setItem('value', JSON.stringify(value));
  };
  const deleteProvince = async (e) => {
    const data = {
      tokenKey: process.env.REACT_APP_WEB_TOKEN_KEY,
    };
    Swal.fire({
      title: 'Are you sure?',
      text: 'คุณต้องการลบจังหวัดนี้ออกหรือไม่ !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'คุณได้ลบจังหวัดนี้ออกเเล้ว',
          showConfirmButton: false,
          timer: 1500,
        });
        await axios.delete(`${process.env.REACT_APP_WEB_GEO_BACKEND}/province/${value.province_id}`, {
          data,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    });
  };
  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: 'text.secondary' }} onClick={(e) => deleteProvince(e)}>
          <ListItemIcon>
            <Iconify icon="eva:trash-2-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem
          component={RouterLink}
          to="/dashboard/geo/edit-province"
          sx={{ color: 'text.secondary' }}
          onClick={() => setLoacal()}
        >
          <ListItemIcon>
            <Iconify icon="eva:edit-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="แก้ไข" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}
