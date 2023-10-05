/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { useGetProducts } from "../../api/products";

export function ProductsTable() {
  const [page] = useState(1);
  const { data: products, isLoading } = useGetProducts(page);

  return (
    <Box mb={6}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Qtt</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? Array.from([1, 2, 3, 4]).map((item) => (
                <TableRow
                  key={item}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Skeleton
                      animation="wave"
                      variant="rectangular"
                      height={15}
                      width={40}
                    />
                  </TableCell>
                  <TableCell>
                    <Skeleton
                      animation="wave"
                      variant="rectangular"
                      height={15}
                      width={100}
                    />
                  </TableCell>
                  <TableCell>
                    <Skeleton
                      animation="wave"
                      variant="rectangular"
                      height={15}
                      width={100}
                    />
                  </TableCell>
                </TableRow>
              ))
              : products?.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.quantity}
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.category_name}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
