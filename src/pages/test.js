/* eslint-disable react-hooks/rules-of-hooks */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Link, Container, Typography, TextField } from '@mui/material';

export default function test() {
  const [file, setfile] = useState([]);
  const [filepreview, setfilepreview] = useState(null);

  const onClickme = async () => {
    const formdata = new FormData();
    formdata.append('emp_name', '1B3vpxR0vTyHe0poycjaSjw40IBXjnpC');
    formdata.append('emp_tel', 2000);
    formdata.append('emp_iden', 'aadsadawsadsads');
    formdata.append('emp_address', 'file 4513 51asd');
    formdata.append('emp_username', 'aof@gmail.comฟฟ');
    formdata.append('emp_password', 'Aof.0877861592');
    formdata.append('emp_department', 'file123456');
    formdata.append('emp_position', 'file123456');
    formdata.append('emp_salary', 1500.25);
    formdata.append('emp_start', new Date());
    formdata.append('emp_end', new Date());
    formdata.append('emp_bank', 'asdasdasda sd asd as das');
    formdata.append('emp_bank_number', '240680465465034');
    formdata.append('emp_pic', file);
    formdata.append('emp_status', 'active');
    // formdata.append('emp_timestamp', new Date());
    const data = {
      salary_owner: '1B3vpxR0vTyHe0poycjaSjw40IBXjnpC',
      salary_amount: 123132123,
      salary_pic: '1546546546341',
      salary_date: new Date(),
      salary_payroll_date: new Date(),
      // lew_end: new Date(),
      // lew_number_day: 5,
      // lew_manager_confirm: true,
      // lew_ceo_confirm: true,
      // lew_timestamp: new Date(),
    };
    const postdata = await axios.put('http://localhost:8004/v1/office/employee/62899b62d51e6862b3038f49', formdata);
    console.log(postdata);
  };
  const handleInputChange = async (event) => {
    setfile(event.target.files[0] ? event.target.files[0] : []);
    setfilepreview(event.target.files[0] ? URL.createObjectURL(event.target.files[0]) : null);
  };
  const deleteData = async () => {
    const postdata = await axios.delete(
      'http://localhost:8004/v1/office/delete_image/1B3vpxR0vTyHe0poycjaSjw40IBXjnpC'
    );
    console.log(postdata);
  };

  // 1B3vpxR0vTyHe0poycjaSjw40IBXjnpC-
  return (
    <div>
      <TextField
        type="file"
        className="form-control"
        autoComplete="filemik"
        name="upload_file"
        onChange={handleInputChange}
      />
      <Button onClick={() => onClickme()}>test</Button>
      {filepreview !== null ? (
        <img
          className="previewimg"
          src={filepreview}
          alt="UploadImage"
          width="50%"
          higth="50%"
          style={{ margin: 'auto' }}
        />
      ) : null}
    </div>
  );
}
