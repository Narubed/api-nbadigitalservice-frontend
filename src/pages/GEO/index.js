/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Grid, Container, Typography, Card } from '@mui/material';
import axios from 'axios';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
// sections
// utils
import { fShortenNumber } from '../../utils/formatNumber';
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
  const [Province, setProvince] = React.useState([]);
  const [Amphures, setAmphures] = React.useState([]);
  const [Districts, setDistricts] = React.useState([]);

  React.useEffect(async () => {
    const tokenKey = {
      tokenKey: process.env.REACT_APP_WEB_TOKEN_KEY,
    };
    const getProvince = await axios.post(
      `${process.env.REACT_APP_WEB_GEO_BACKEND}/provinces/
        `,
      tokenKey
    );
    const getAmphures = await axios.post(
      `${process.env.REACT_APP_WEB_GEO_BACKEND}/amphures/
          `,
      tokenKey
    );
    const getDistricts = await axios.post(
      `${process.env.REACT_APP_WEB_GEO_BACKEND}/districts/
          `,
      tokenKey
    );
    setProvince(getProvince.data.data);
    setAmphures(getAmphures.data.data);
    setDistricts(getDistricts.data.data);
    // setProvince(getNews.data.data);
  }, []);
  const onClickCard = (req) => {
    console.log(req);
  };
  return (
    <Page title="GEO">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          เลือกละดับที่ต้องการเเก้ไข
        </Typography>
        <Grid container spacing={3}>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            component={RouterLink}
            to="/dashboard/geo/district"
            onClick={() => onClickCard('ตำบล')}
          >
            <Card
              sx={{
                py: 5,
                boxShadow: 0,
                textAlign: 'center',
                color: (theme) => theme.palette.error.darker,
                bgcolor: (theme) => theme.palette.error.lighter,
                '&:hover': {
                  color: '#F0FFF0',
                  backgroundColor: '#BA55D3',
                },
              }}
            >
              <IconWrapperStyle
                sx={{
                  color: (theme) => theme.palette.error.dark,
                  backgroundImage: (theme) =>
                    `linear-gradient(135deg, ${alpha(theme.palette.error.dark, 0)} 0%, ${alpha(
                      theme.palette.error.dark,
                      0.24
                    )} 100%)`,
                }}
              >
                <Iconify icon="healthicons:low-level-outline" width={24} height={24} />
              </IconWrapperStyle>

              <Typography variant="h3">{fShortenNumber(Districts.length)}</Typography>

              <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
                ตำบล
              </Typography>
            </Card>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            component={RouterLink}
            to="/dashboard/geo/amphur"
            onClick={() => onClickCard('อำเภอ')}
          >
            <Card
              sx={{
                py: 5,
                boxShadow: 0,
                textAlign: 'center',
                color: (theme) => theme.palette.info.darker,
                bgcolor: (theme) => theme.palette.info.lighter,
                '&:hover': {
                  color: '#F0FFF0',
                  backgroundColor: '#BA55D3',
                },
              }}
            >
              <IconWrapperStyle
                sx={{
                  color: (theme) => theme.palette.info.dark,
                  backgroundImage: (theme) =>
                    `linear-gradient(135deg, ${alpha(theme.palette.info.dark, 0)} 0%, ${alpha(
                      theme.palette.info.dark,
                      0.24
                    )} 100%)`,
                }}
              >
                <Iconify icon="healthicons:medium-level-outline" width={24} height={24} />
              </IconWrapperStyle>

              <Typography variant="h3">{fShortenNumber(Amphures.length)}</Typography>

              <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
                อำเภอ
              </Typography>
            </Card>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            component={RouterLink}
            to="/dashboard/geo/province"
            onClick={() => onClickCard('จังหวัด')}
          >
            <Card
              sx={{
                py: 5,
                boxShadow: 0,
                textAlign: 'center',
                color: (theme) => theme.palette.warning.darker,
                bgcolor: (theme) => theme.palette.warning.lighter,
                '&:hover': {
                  color: '#F0FFF0',
                  backgroundColor: '#BA55D3',
                },
              }}
            >
              <IconWrapperStyle
                sx={{
                  color: (theme) => theme.palette.warning.dark,
                  backgroundImage: (theme) =>
                    `linear-gradient(135deg, ${alpha(theme.palette.warning.dark, 0)} 0%, ${alpha(
                      theme.palette.warning.dark,
                      0.24
                    )} 100%)`,
                }}
              >
                <Iconify icon="healthicons:high-level-outline" width={24} height={24} />
              </IconWrapperStyle>

              <Typography variant="h3">{fShortenNumber(Province.length)}</Typography>

              <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
                จังหวัด
              </Typography>
            </Card>
          </Grid>

          {/* <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Bug Reports" total={234} color="error" icon="ant-design:bug-filled" />
          </Grid> */}
        </Grid>
      </Container>
    </Page>
  );
}
