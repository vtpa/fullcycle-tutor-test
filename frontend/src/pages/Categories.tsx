import React, { useState } from "react";
import { CategoriesTable } from "../components/CategoriesTable/CategoriesTable";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { AddCircleOutline } from "@mui/icons-material";
import Button from "@mui/material/Button";
import { ModalAddCategory } from "../components/ModalAddCategory/ModalAddCategory";

function Categories() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Box mb={4}>
        <Typography display="block" variant="h3" component="h3">
          Categories
        </Typography>
      </Box>
      <Box mb={4} textAlign={"right"}>
        <Button
          variant="contained"
          startIcon={<AddCircleOutline />}
          onClick={handleOpen}
        >
          Add Category
        </Button>
      </Box>
      <CategoriesTable />
      <ModalAddCategory open={open} handleClose={handleClose} />
    </>
  );
}

export default Categories;
