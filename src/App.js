/* eslint-disable react/prefer-stateless-function */
// routes
import React, { Component } from 'react';
import Router from './routes';
import RouterNoAccessToken from './routes_no_accessToken';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';

// ----------------------------------------------------------------------
class App extends Component {
  render() {
    const token = sessionStorage.getItem('token');
    const message = sessionStorage.getItem('message');
    if (!token || message !== 'logged in successfully') {
      console.log('wasd');
      return (
        <ThemeProvider>
          <ScrollToTop />
          <BaseOptionChartStyle />
          <RouterNoAccessToken />
        </ThemeProvider>
      );
    }
    return (
      <ThemeProvider>
        <ScrollToTop />
        <BaseOptionChartStyle />
        <Router />
      </ThemeProvider>
    );
  }
}
export default App;
