import { useState } from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@material-ui/core';

const MatchListResults = ({ matchInfo, ...rest }) => {
  const [selectedMatchIds, setSelectedMatchIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [batch, setBatch] = useState(0);

  const handleSelectAll = (event) => {
    let newSelectedMatchIds;

    if (event.target.checked) {
      newSelectedMatchIds = matchInfo.map((match) => match.id);
    } else {
      newSelectedMatchIds = [];
    }

    setSelectedMatchIds(newSelectedMatchIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedMatchIds.indexOf(id);
    let newSelectedMatchIds = [];

    if (selectedIndex === -1) {
      newSelectedMatchIds = newSelectedMatchIds.concat(selectedMatchIds, id);
    } else if (selectedIndex === 0) {
      newSelectedMatchIds = newSelectedMatchIds.concat(selectedMatchIds.slice(1));
    } else if (selectedIndex === selectedMatchIds.length - 1) {
      newSelectedMatchIds = newSelectedMatchIds.concat(selectedMatchIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedMatchIds = newSelectedMatchIds.concat(
        selectedMatchIds.slice(0, selectedIndex),
        selectedMatchIds.slice(selectedIndex + 1)
      );
    }

    setSelectedMatchIds(newSelectedMatchIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Card {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedMatchIds.length === matchInfo.length}
                    color="primary"
                    indeterminate={
                      selectedMatchIds.length > 0
                      && selectedMatchIds.length < matchInfo.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  Match ID
                </TableCell>
                <TableCell>
                  First Group ID
                </TableCell>
                <TableCell>
                  Second Group ID
                </TableCell>
                <TableCell>
                  Score
                </TableCell>
                <TableCell>
                  Map
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {matchInfo.slice(0, limit).map((match) => (
                <TableRow
                  hover
                  key={match.id}
                  selected={selectedMatchIds.indexOf(match.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedMatchIds.indexOf(match.id) !== -1}
                      onChange={(event) => handleSelectOne(event, match.id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      color="textPrimary"
                      variant="body1"
                    >
                      {match.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {match.firstgroup}
                  </TableCell>
                  <TableCell>
                    {match.secondgroup}
                  </TableCell>
                  <TableCell>
                    {match.score}
                  </TableCell>
                  <TableCell>
                    {match.map}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={matchInfo.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[10, 100, 500]}
      />
    </Card>
  );
};

MatchListResults.propTypes = {
  matchInfo: PropTypes.array.isRequired
};

export default MatchListResults;
