/* eslint-disable jsx-a11y/label-has-associated-control */
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
  Input,
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
  const [Provinces, setProvinces] = React.useState([]);
  const [Amphures, setAmphures] = React.useState([]);
  const [NewAmphures, setNewAmphures] = React.useState([]);
  const [SelectProvinces, setSelectProvinces] = React.useState(values.province_id);
  const [SelectAmphur, setSelectAmphur] = React.useState(values.amphur_id);

  React.useEffect(async () => {
    const tokenKey = {
      tokenKey: process.env.REACT_APP_WEB_TOKEN_KEY,
    };
    const getProvince = await axios.post(
      `${process.env.REACT_APP_WEB_GEO_BACKEND}/join_nba_geo_province/
        `,
      tokenKey
    );
    const getAmphures = await axios.post(
      `${process.env.REACT_APP_WEB_GEO_BACKEND}/amphures/
        `,
      tokenKey
    );
    setAmphurData(getAmphures.data.data);
    setProvinceData(getProvince.data.data);
  }, []);

  const setAmphurData = (req) => {
    const valueOption = [];
    req.forEach((element) => {
      valueOption.push({ ...element, value: element.amphur_id, label: element.amphur_name });
    });

    setAmphures(valueOption);
  };
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
    if (!SelectProvinces || !e.district_name || !e.ISO || !e.post_code || !SelectAmphur) {
      Swal.fire({
        icon: 'error',
        title: 'กรอกข้อมูลไม่ครบ',
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      const data = {
        district_id: values.district_id,
        district_code: parseInt(e.ISO, 10),
        district_name: e.district_name,
        post_code: e.post_code,
        amphur_id: SelectAmphur,
        province_id: SelectProvinces,
        tokenKey: process.env.REACT_APP_WEB_TOKEN_KEY,
      };
      Swal.fire({
        title: 'Are you sure?',
        text: 'คุณต้องการแก้ไขตำบลหรือไม่ !',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ตกลง!',
        cancelButtonText: 'ยกเลิก',
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.put(
            `${process.env.REACT_APP_WEB_GEO_BACKEND}/district
              `,
            data
          );
          Swal.fire({
            icon: 'success',
            title: 'คุณได้แก้ไขข้อมูลตำบลเรียบร้อยเเล้ว',
            showConfirmButton: false,
            timer: 1500,
          });
          setTimeout(() => {
            window.history.back();
          }, 1500);
        }
      });
    }
  };
  const filteredAmphures = (req) => {
    const filtereds = Amphures.filter((value) => value.province_id === req);
    setNewAmphures(filtereds);
    setSelectProvinces(req);
  };

  const formik = useFormik({
    initialValues: {
      district_name: values.district_name,
      post_code: values.post_code,
      ISO: values.district_code,
    },
    onSubmit: (e) => {
      handleSubmits(e);
    },
  });
  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;
  return (
    <Page title="สร้างตำบล">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          แก้ไขข้อมูลตำบล
        </Typography>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  type="number"
                  fullWidth
                  label="Location Code ของตำบล(ใส่เเค่ตัวเลข)"
                  {...getFieldProps('ISO')}
                />
                <TextField
                  type="number"
                  fullWidth
                  label="PostCode รหัสไปรษณีย์(ใส่เเค่ตัวเลข)"
                  {...getFieldProps('post_code')}
                />
              </Stack>

              {/* <TextField fullWidth label="ชื่ออำเภอ" {...getFieldProps('district_name')} /> */}

              <div className="w-full h-10 pl-1 pr-1 text-base placeholder-gray-600 rounded-lg appearance-none focus:shadow-outline">
                <div className="text-base placeholder-gray-600">ค้นหาจังหวัด</div>
                <Select
                  options={Provinces}
                  onChange={(e) => filteredAmphures(e.value)}
                  defaultValue={{ label: values.province_name, value: values.province_id }}
                  // defaultValue={{ label: 'ลพบุรี   ', value: 'ลพบุรี   ' }}
                />
              </div>
              <div className="w-full h-10 pl-1 pr-1 text-base placeholder-gray-600 rounded-lg appearance-none focus:shadow-outline">
                <div className="text-base placeholder-gray-600">ค้นหาอำเภอ *ค้นหาจังหวัดก่อน*</div>
                <Select
                  options={NewAmphures}
                  onChange={(e) => setSelectAmphur(e.value)}
                  defaultValue={{ label: values.amphur_name, value: values.amphur_id }}
                  // defaultValue={{ label: 'ลพบุรี   ', value: 'ลพบุรี   ' }}
                />
              </div>
              <br />
              <label>ชื่อตำบล</label>
              <TextField
                // className="inputCreateDistrict"
                type="text"
                // id="fname"
                // name="fname"
                // label="ชื่อตำบล"
                // defaultValue="55555"
                {...getFieldProps('district_name')}
              />
              <Button fullWidth size="large" type="submit" variant="contained">
                เพิ่มข้อมูลตำบล
              </Button>
            </Stack>
          </Form>
        </FormikProvider>
      </Container>
    </Page>
  );
}
