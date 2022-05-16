/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { Link as RouterLink } from 'react-router-dom';
import Select from 'react-select';
import Swal from 'sweetalert2';
// @mui
import axios from 'axios';
// components
import {
  Stack,
  TextField,
  IconButton,
  InputAdornment,
  alpha,
  styled,
  Grid,
  Container,
  Typography,
  MenuItem,
  Button,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Page from '../../../../components/Page';
import Iconify from '../../../../components/Iconify';
// sections
// utils
// material
// component
import { fShortenNumber } from '../../../../utils/formatNumber';
// components
// ----------------------------------------------------------------------

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
}));

export default function DashboardApp() {
  const [Provinces, setProvinces] = React.useState([]);
  const [SelectProvinces, setSelectProvinces] = React.useState();

  React.useEffect(async () => {
    const tokenKey = {
      tokenKey: process.env.REACT_APP_WEB_TOKEN_KEY,
    };
    const getProvince = await axios.post(
      `${process.env.REACT_APP_WEB_GEO_BACKEND}/join_nba_geo_province/
        `,
      tokenKey
    );
    setProvinceData(getProvince.data.data);
  }, []);

  const setProvinceData = (req) => {
    const valueOption = [];
    req.forEach((element) => {
      const data = {
        value: element.province_id,
        label: element.province_name,
      };
      valueOption.push(data);
    });

    setProvinces(valueOption);
  };
  const handleSubmits = async (e) => {
    if (!SelectProvinces || !e.amphur_name || !e.ISO) {
      Swal.fire({
        icon: 'error',
        title: 'กรอกข้อมูลไม่ครบ',
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      const data = {
        province_id: SelectProvinces,
        amphur_name: e.amphur_name,
        amphur_code: parseInt(e.ISO, 10),
        tokenKey: process.env.REACT_APP_WEB_TOKEN_KEY,
      };
      Swal.fire({
        title: 'Are you sure?',
        text: 'คุณต้องการเพิ่มอำเภอหรือไม่ !',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ตกลง!',
        cancelButtonText: 'ยกเลิก',
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.post(
            `${process.env.REACT_APP_WEB_GEO_BACKEND}/amphure
              `,
            data
          );
          Swal.fire({
            icon: 'success',
            title: 'คุณได้เพิ่มข้อมูลอำเภอเรียบร้อยเเล้ว',
            showConfirmButton: false,
            timer: 1500,
          });
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      amphur_name: '',
      ISO: '',
    },
    onSubmit: (e) => {
      handleSubmits(e);
    },
  });
  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;
  return (
    <Page title="สร้างอำเภอ">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          เพิ่มข้อมูลอำเภอ
        </Typography>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                type="number"
                fullWidth
                label="Location Code ของอำเภอ (ใส่เเค่ตัวเลข)"
                {...getFieldProps('ISO')}
              />
              <TextField fullWidth label="ชื่ออำเภอ" {...getFieldProps('amphur_name')} />
              <div className="w-full h-10 pl-1 pr-1 text-base placeholder-gray-600 rounded-lg appearance-none focus:shadow-outline">
                <div className="text-base placeholder-gray-600">ค้นหาจังหวัด</div>
                <Select
                  options={Provinces}
                  onChange={(e) => setSelectProvinces(e.value)}
                  // defaultValue={{ label: 'ลพบุรี   ', value: 'ลพบุรี   ' }}
                />
              </div>
              <Button fullWidth size="large" type="submit" variant="contained">
                เพิ่มข้อมูลอำเภอ
              </Button>
            </Stack>
          </Form>
        </FormikProvider>
      </Container>
    </Page>
  );
}
