/* eslint-disable camelcase */
import { filter } from 'lodash';
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
// material
import {
  Card,
  Table,
  Stack,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import Page from '../../../components/Page';
import Label from '../../../components/Label';
import Scrollbar from '../../../components/Scrollbar';
import Iconify from '../../../components/Iconify';
import SearchNotFound from '../../../components/SearchNotFound';
import { DistrictListHead, DistrictToolbar, DistrictMoreMenu } from '../../../sections/@dashboard/geo/district';

// mock

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'nba_geo_name', label: 'ภูมิภาค', alignRight: false },
  { id: 'nba_zone', label: 'เขตพื้นที่', alignRight: false },
  { id: 'province_name', label: 'ชื่อจังหวัด', alignRight: false },
  { id: 'amphur_name', label: 'ชื่ออำเภอ', alignRight: false },
  { id: 'district_name', label: 'ชื่อตำบล', alignRight: false },
  { id: 'post_code', label: 'รหัสไปรษณีย์', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) =>
        _user.province_name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.amphur_name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.district_name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        // _user.post_code.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.nba_geo_name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function AmphurApp() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [Districts, setDistricts] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(async () => {
    const tokenKey = {
      tokenKey: process.env.REACT_APP_WEB_TOKEN_KEY,
    };
    const getProvince = await axios.post(
      `${process.env.REACT_APP_WEB_GEO_BACKEND}/join_nba_geo_province_amphur_district/
        `,
      tokenKey
    );
    setDistricts(getProvince.data.data);
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = Districts.map((n) => n.district_name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - Districts.length) : 0;

  const filteredDistricts = applySortFilter(Districts, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredDistricts.length === 0;

  return (
    <Page title="ตำบล">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Districts
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/dashboard/geo/create-district"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New District
          </Button>
        </Stack>

        <Card>
          <DistrictToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <DistrictListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={Districts.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredDistricts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const {
                      province_name,
                      nba_geo_name,
                      nba_zone,
                      amphur_name,
                      district_name,
                      district_id,
                      post_code,
                    } = row;
                    const isItemSelected = selected.indexOf(province_name) !== -1;

                    return (
                      <TableRow
                        hover
                        key={district_id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          {/* <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, name)} /> */}
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography align="left">
                              {nba_geo_name === 'ภาคกลาง' ? <Label color="success">{nba_geo_name}</Label> : null}
                              {nba_geo_name === 'ภาคเหนือ' ? <Label color="warning">{nba_geo_name}</Label> : null}
                              {nba_geo_name === 'ภาคตะวันออกเฉียงเหนือ' ? (
                                <Label color="primary">{nba_geo_name}</Label>
                              ) : null}
                              {nba_geo_name === 'ภาคใต้' ? <Label color="error">{nba_geo_name}</Label> : null}
                              {nba_geo_name === 'กรุงเทพมหานคร' ? <Label color="default">{nba_geo_name}</Label> : null}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{nba_zone}</TableCell>
                        <TableCell align="left">{province_name}</TableCell>
                        <TableCell align="left">
                          <Label color="default">{amphur_name}</Label>
                        </TableCell>
                        <TableCell align="left">
                          <Label color="default">{district_name}</Label>
                        </TableCell>
                        <TableCell align="left">
                          <Label color="success">{post_code}</Label>
                        </TableCell>

                        <TableCell align="right">
                          <DistrictMoreMenu value={row} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100, 200, 500]}
            component="div"
            count={Districts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
