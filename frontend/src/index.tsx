import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import theme from "./theme";
import { initializeMockAdapter } from "./utils/mockApi";

initializeMockAdapter();

const queryClient = new QueryClient();

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Router>
      <QueryClientProvider client={queryClient}>
        <App />
        <CssBaseline />
        <ToastContainer />
      </QueryClientProvider>
    </Router>
  </ThemeProvider>,
  document.getElementById("root")
);
