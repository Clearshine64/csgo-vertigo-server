import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';

const MatchState = ({match}) => {
  return (
    <>
      <Helmet>
        <title>Client Management | Vertigo Boost</title>
      </Helmet>
      <PerfectScrollbar>
        <Table>
            <TableHead>
                <TableRow>
                <TableCell sx={{height:8}} width="45%">
                    First Group
                </TableCell>
                <TableCell width="45%">
                    Second Group
                </TableCell>
                <TableCell width="10%">
                    Score
                </TableCell>
                </TableRow> 
            </TableHead>
            <TableBody>
                {match.map((row) => (
                <TableRow
                    hover
                    key={row.firstgroup.toString()}
                >
                    <TableCell>
                        *{row.firstgroup.toString().replaceAll(",", ", ")}
                    </TableCell>
                    <TableCell>
                        *{row.secondgroup.toString().replaceAll(",", ", ")}
                    </TableCell>
                    <TableCell>
                        {row.score.firstgroup}:{row.score.secondgroup}
                    </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </PerfectScrollbar>
    </>
  );
};

export default MatchState;
