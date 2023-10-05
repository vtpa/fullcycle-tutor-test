import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { AddCircleOutline, ImportExport } from "@mui/icons-material";
import Button from "@mui/material/Button";
import { ModalAddProduct } from "../components/ModalAddProduct/ModalAddProduct";
import { ProductsTable } from "../components/ProductsTable/ProductsTable";
import { ModalInventoryMovement } from "../components/ModalInventoryMovement/ModalInventoryMovement";

function Products() {
  const [openAddProductModal, setOpenAddProductModal] = useState(false);
  const handleOpenAddProductModal = () => setOpenAddProductModal(true);
  const handleCloseAddProductModal = () => setOpenAddProductModal(false);

  const [openInventoryMovementModal, setOpenInventoryMovementModal] =
    useState(false);
  const handleOpenInventoryMovementModal = () =>
    setOpenInventoryMovementModal(true);
  const handleCloseInventoryMovementModal = () =>
    setOpenInventoryMovementModal(false);

  return (
    <>
      <Box mb={4}>
        <Typography display="block" variant="h3" component="h3">
          Products
        </Typography>
      </Box>
      <Box mb={4} justifyContent={"space-between"} display={"flex"}>
        <Button
          variant="contained"
          startIcon={<ImportExport />}
          onClick={handleOpenInventoryMovementModal}
        >
          Inventory Movement
        </Button>
        <Button
          variant="contained"
          startIcon={<AddCircleOutline />}
          onClick={handleOpenAddProductModal}
        >
          Add Product
        </Button>
      </Box>
      <ProductsTable />
      <ModalAddProduct
        open={openAddProductModal}
        handleClose={handleCloseAddProductModal}
      />
      <ModalInventoryMovement
        open={openInventoryMovementModal}
        handleClose={handleCloseInventoryMovementModal}
      />
    </>
  );
}

export default Products;
