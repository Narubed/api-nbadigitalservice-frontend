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

export default function DashboardApp() {
  const values = JSON.parse(localStorage.getItem('value'));
  const [GEO, setGEO] = React.useState([]);
  const [GEONBA, setGEONBA] = React.useState([]);
  const [Zone, setZone] = React.useState([]);

  React.useEffect(async () => {
    const tokenKey = {
      tokenKey: process.env.REACT_APP_WEB_TOKEN_KEY,
    };
    const getEGO = await axios.post(
      `${process.env.REACT_APP_WEB_GEO_BACKEND}/geo/
          `,
      tokenKey
    );
    const getEGONBA = await axios.post(
      `${process.env.REACT_APP_WEB_GEO_BACKEND}/nba-geo/
            `,
      tokenKey
    );
    const getZone = await axios.post(
      `${process.env.REACT_APP_WEB_GEO_BACKEND}/zone/
            `,
      tokenKey
    );
    setZone(getZone.data.data);
    setGEO(getEGO.data.data);
    setGEONBA(getEGONBA.data.data);
  }, []);
  const handleSubmits = async (e) => {
    if (!e.province_name || !e.geo || !e.geo_nba || !e.zone || !e.ISO) {
      Swal.fire({
        icon: 'error',
        title: 'กรอกข้อมูลไม่ครบ',
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      const data = {
        province_id: values.province_id,
        province_name: e.province_name,
        geo_id: e.geo,
        nba_geo_id: e.geo_nba,
        nba_zone: e.zone,
        province_code: parseInt(e.ISO, 10),
        tokenKey: process.env.REACT_APP_WEB_TOKEN_KEY,
      };
      Swal.fire({
        title: 'Are you sure?',
        text: 'คุณต้องการแก้ไขจังหวัดหรือไม่ !',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ตกลง!',
        cancelButtonText: 'ยกเลิก',
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.put(
            `${process.env.REACT_APP_WEB_GEO_BACKEND}/province
              `,
            data
          );
          Swal.fire({
            icon: 'success',
            title: 'คุณได้แก้ไขข้อมูลจังหวัดเรียบร้อยเเล้ว',
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
      geo_nba: values.nba_geo_id,
      geo: values.geo_id,
      zone: values.nba_zone,
      province_name: values.province_name,
      ISO: values.province_code,
    },
    onSubmit: (e) => {
      handleSubmits(e);
    },
  });
  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;
  return (
    <Page title="สร้างจังหวัด">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          เพิ่มข้อมูลจังหวัด
        </Typography>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={12}>
                <TextField fullWidth select label="ภูมิภาค" {...getFieldProps('geo')}>
                  {GEO.map((option) => (
                    <MenuItem key={option.GEO_ID} value={option.GEO_ID}>
                      {option.GEO_NAME}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField fullWidth select label="ภูมิภาคของ NBA" {...getFieldProps('geo_nba')}>
                  {GEONBA.map((option) => (
                    <MenuItem key={option.nba_geo_id} value={option.nba_geo_id}>
                      {option.nba_geo_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>

              <TextField fullWidth select label="เขต" {...getFieldProps('zone')}>
                {Zone.map((option) => (
                  <MenuItem key={option.nba_zone} value={option.nba_zone}>
                    {option.zone_name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField type="number" fullWidth label="ISO-Code-TH (ใส่เเค่ตัวเลข)" {...getFieldProps('ISO')} />
              <TextField fullWidth label="ชื่อจังหวัดใหม่" {...getFieldProps('province_name')} />
              {/* <div className="w-full h-10 pl-1 pr-1 text-base placeholder-gray-600 rounded-lg appearance-none focus:shadow-outline">
                <div className="text-base placeholder-gray-600">ค้นหาจังหวัด</div>
                <Select
                  options={Provinces}
                  onChange={(e) => setSelectProvince(e.value)}
                  defaultValue={{ value: values.province_name, label: values.province_name }}
                />
              </div> */}

              <Button fullWidth size="large" type="submit" variant="contained">
                เพิ่มข้อมูลจังหวัด
              </Button>
            </Stack>
          </Form>
        </FormikProvider>
      </Container>
    </Page>
  );
}
