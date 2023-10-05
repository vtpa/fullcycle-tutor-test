/* eslint-disable prettier/prettier */
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { useGetCategories } from "../../api/categories";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

export function CategoriesTable() {
  const queryCategories = useGetCategories();

  return (
    <Box mb={6}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {queryCategories.isLoading
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
                </TableRow>
              ))
              : queryCategories.data?.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
