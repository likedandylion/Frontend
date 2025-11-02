// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import App from "@/App.jsx";

const GlobalStyle = createGlobalStyle`
  *,*::before,*::after{ box-sizing:border-box; }
  html,body,#root{ height:100%; }
  body{ margin:0; font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif; }
  a{ color:inherit; text-decoration:none; }
`;

const theme = {
  colors: { primary: "#2563eb", text: "#0f172a" },
  spacing: (n) => `${n * 4}px`,
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
