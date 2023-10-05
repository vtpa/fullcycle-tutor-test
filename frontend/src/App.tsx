import React, { useEffect } from "react";
import { Route, Switch, useHistory } from "react-router-dom";

import Auth from "./pages/Auth";
import { pageRoutes } from "./routes";
import { useGetProfile } from "./api/auth";
import { AppBar, Box, Toolbar } from "@mui/material";
import UserProfile from "./components/UserProfile/UserProfile";
import Categories from "./pages/Categories";
import Products from "./pages/Products";

function App() {
  const history = useHistory();
  const { error } = useGetProfile();

  useEffect(() => {
    if (error) {
      history.replace(pageRoutes.auth);
    }
  }, [error]);

  return (
    <>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Box display="flex" justifyContent="flex-end" width="100%">
            <UserProfile />
          </Box>
        </Toolbar>
      </AppBar>

      <Box width={500} m="auto" mt={2} mb={2}>
        <Switch>
          <Route path={pageRoutes.main} exact>
            <Products />
          </Route>
          <Route path={pageRoutes.auth} exact>
            <Auth />
          </Route>
          <Route path={pageRoutes.categories} exact>
            <Categories />
          </Route>
        </Switch>
      </Box>
    </>
  );
}

export default App;
