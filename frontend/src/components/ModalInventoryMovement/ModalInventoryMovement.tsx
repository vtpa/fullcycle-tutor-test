import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { modalBoxStyle } from "./ModalInventoryMovement.styles";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { AddCircleOutline, HourglassBottom } from "@mui/icons-material";
import { toast } from "react-toastify";
import Autocomplete from "@mui/material/Autocomplete";
import { useGetProducts } from "../../api/products";
import { useAddInventoryMovement } from "../../api/inventoryMovement";

interface ModalAddCategoryParams {
  open: boolean;
  handleClose: () => void;
}

interface AutoCompleteProps {
  id: string;
  label: string;
}

export function ModalInventoryMovement({
  handleClose,
  open,
}: ModalAddCategoryParams) {
  const [quantity, setQuantity] = useState("");
  const [product, setProduct] = useState<AutoCompleteProps | null>(null);
  const [type, setType] = useState<AutoCompleteProps | null>(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const { data: products } = useGetProducts(1);

  const autocompleteProductsOptions = products?.map((item) => ({
    id: item.id,
    label: item.name,
  }));

  const autocompleteTypeOptions: AutoCompleteProps[] = [
    {
      id: "add",
      label: "add",
    },
    {
      id: "sub",
      label: "sub",
    },
  ];

  const mutationAdd = useAddInventoryMovement(
    (oldData, newData) => [...oldData, newData],
    {
      product_id: product?.id || "",
      quantity: Number(quantity),
      type: (type?.id || "add") as "add" | "sub",
    }
  );

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setBtnLoading(true);

    try {
      if (!product || !type || Number(quantity) < 1) {
        toast.error(`Please verify the options.`, {
          position: "bottom-left",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }
      await mutationAdd.mutateAsync({
        id: product.id,
        name: quantity,
        category_id: product.id,
        quantity: Number(quantity),
        created_at: "...",
      });
      setQuantity("");
      setProduct(null);
      setType(null);
    } catch (e) {
      toast.error(`Error to add Inventory Movement.`, {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setBtnLoading(false);
    }
    handleClose();
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalBoxStyle}>
        <Typography variant="h6" component="h2">
          Inventory Movement
        </Typography>
        <form
          noValidate
          autoComplete="off"
          style={{ width: "100%" }}
          onSubmit={onSubmit}
        >
          <Box mt={2} mb={2}>
            <Autocomplete
              disablePortal
              fullWidth
              value={type}
              onChange={(event: any, newValue: AutoCompleteProps | null) => {
                setType(newValue);
              }}
              id="combo-box-demo"
              options={autocompleteTypeOptions}
              isOptionEqualToValue={() => true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  variant="outlined"
                  label="Movement Type"
                />
              )}
            />
          </Box>
          <Box mt={2} mb={2}>
            <TextField
              fullWidth
              autoComplete="off"
              id="outlined-basic-name"
              label="Quantity to add/sub"
              variant="outlined"
              type="number"
              name="name"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
              }}
            />
          </Box>
          <Box mt={2} mb={2}>
            <Autocomplete
              disablePortal
              fullWidth
              value={product}
              onChange={(event: any, newValue: AutoCompleteProps | null) => {
                setProduct(newValue);
              }}
              id="combo-box-demo"
              options={autocompleteProductsOptions ?? []}
              isOptionEqualToValue={() => true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  variant="outlined"
                  label="Product"
                />
              )}
            />
          </Box>
          <Box mt={2} textAlign={"right"}>
            <Button
              type="submit"
              variant="contained"
              startIcon={
                btnLoading ? <HourglassBottom /> : <AddCircleOutline />
              }
              color="primary"
              size="large"
              disabled={btnLoading}
            >
              {btnLoading ? "Wait..." : "Add"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}
