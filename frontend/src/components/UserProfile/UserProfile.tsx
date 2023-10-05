import React from "react";
import { Box, CircularProgress } from "@mui/material";
import { useGetProfile } from "../../api/auth";
import AccountMenu from "../AccountMenu/AccountMenu";
import Cookies from "js-cookie";

function UserProfile() {
  const { data: user, isLoading } = useGetProfile();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="flex-end">
        <CircularProgress color="inherit" size={24} />
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="flex-end">
      {user && Cookies.get("token") ? <AccountMenu user={user.email} /> : ""}
    </Box>
  );
}

export default UserProfile;
