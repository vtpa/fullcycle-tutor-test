import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { modalBoxStyle } from "./ModalAddProduct.styles";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { AddCircleOutline, HourglassBottom } from "@mui/icons-material";
import { useGetCategories } from "../../api/categories";
import { toast } from "react-toastify";
import Autocomplete from "@mui/material/Autocomplete";
import { useAddProduct } from "../../api/products";

interface ModalAddCategoryParams {
  open: boolean;
  handleClose: () => void;
}

interface AutoCompleteProps {
  id: string;
  label: string;
}

export function ModalAddProduct({ handleClose, open }: ModalAddCategoryParams) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<AutoCompleteProps | null>(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const { data: categories } = useGetCategories();

  const autocompleteOptions = categories?.map((item) => ({
    id: item.id,
    label: item.name,
  }));

  const mutationAdd = useAddProduct((oldData, newData) =>
    oldData ? [...oldData, newData] : [newData]
  );

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setBtnLoading(true);

    try {
      if (!category) {
        toast.error(`Please select a category`, {
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
        id: "...",
        name,
        category_id: category.id,
        category_name: category.label,
        quantity: 0,
        created_at: "...",
      });
      setName("");
      setCategory(null);
    } catch (e) {
      toast.error(`Error to add Product '${name}'.`, {
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
      handleClose();
    }
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalBoxStyle}>
        <Typography variant="h6" component="h2">
          Add Product
        </Typography>
        <form
          noValidate
          autoComplete="off"
          style={{ width: "100%" }}
          onSubmit={onSubmit}
        >
          <Box mt={2} mb={2}>
            <TextField
              fullWidth
              autoComplete="off"
              id="outlined-basic-name"
              label="Product Name"
              variant="outlined"
              name="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </Box>
          <Box mt={2} mb={2}>
            <Autocomplete
              disablePortal
              fullWidth
              value={category}
              onChange={(event: any, newValue: AutoCompleteProps | null) => {
                setCategory(newValue);
              }}
              id="combo-box-demo"
              options={autocompleteOptions ?? []}
              isOptionEqualToValue={() => true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  variant="outlined"
                  label="Category"
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
