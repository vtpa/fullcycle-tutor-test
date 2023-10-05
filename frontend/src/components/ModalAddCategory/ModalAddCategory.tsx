import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { modalBoxStyle } from "./ModalAddCategory.styles";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { AddCircleOutline, HourglassBottom } from "@mui/icons-material";
import { useAddCategory } from "../../api/categories";
import { toast } from "react-toastify";

interface ModalAddCategoryParams {
  open: boolean;
  handleClose: () => void;
}

export function ModalAddCategory({
  handleClose,
  open,
}: ModalAddCategoryParams) {
  const [name, setName] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const mutationAdd = useAddCategory((oldData, newData) => [
    ...oldData,
    newData,
  ]);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setBtnLoading(true);

    try {
      await mutationAdd.mutateAsync({
        id: "...",
        name,
        created_at: "...",
      });
      setName("");
    } catch (e) {
      toast.error(`Error to add Category '${name}'.`, {
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
          Add Category
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
              label="Category Name"
              variant="outlined"
              name="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
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
