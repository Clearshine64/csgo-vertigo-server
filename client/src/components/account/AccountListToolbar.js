import { Box } from '@material-ui/core';
import AddAccountDialog from '../customs/AddAccountDialog';
import ImportAccountDialog from '../customs/ImportAccountDialog';

const AccountListToolbar = (props) => (
  <Box {...props}>
    <h2 style={{color: 'grey'}}>{props.matchmode.matchmode}</h2>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginRight: 1
        }}
      >
        <ImportAccountDialog matchmode={ props.matchmode }/>
      </Box>
      <Box>
        <AddAccountDialog matchmode={ props.matchmode } />
      </Box>
    </Box>
  </Box>
);

export default AccountListToolbar;
