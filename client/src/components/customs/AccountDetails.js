import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline';
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField
} from '@material-ui/core';

const rankType = [
  'NON',
  'SILVER 1',
  'SILVER 2',
  'SILVER 3',
  'SILVER 4',
  'SIVER ELITE',
  'SILVER ELITE MASTER',
  'GOLD NOVA 1',
  'GOLD NOVA 2',
  'GOLD NOVA 3',
  'GOLD NOVA MASTER',
  'MASTER GUAROIAN 1',
  'MASTER GUAROIAN 2',
  'MASTER GUAROIAN ELITE',
  'DISTINGUISHED MASTER GUAROIAN',
  'LEGENDARY EAGLE',
  'LEGENDARY EAGLE MASTER',
  'SUPREME MASTER FIRST CLASS',
  'THE GLOVAL ELITE'
];

export default function AccountDetails({ account, ...props}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      {/* <Button margin="dense" variant="contained" color="primary" onClick={handleClickOpen}>
        Add
      </Button> */}
      
      <Tooltip title="Detail" arrow>
        <IconButton aria-label="edit" onClick={handleClickOpen}>
          <ViewHeadlineIcon />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Account details</DialogTitle>
        <DialogContent>
          <DialogContentText>
          </DialogContentText>
          <form
      autoComplete="off"
      noValidate
      {...props}
    >
      <Box>
      <Card>
      <CardHeader title="Origin information"></CardHeader>
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Level"
                name="player_level"
                value={account && account.profile_before && account.profile_before.player_level ? account.profile_before.player_level : 0}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Current Experience"
                name="player_cur_xp"
                value={account && account.profile_before && account.profile_before.player_cur_xp ? account.profile_before.player_cur_xp : 0}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Rank ID"
                name="rank_id"
                value={account && account.profile_before && account.profile_before.ranking && account.profile_before.ranking.rank_id && rankType && rankType[account.profile_before.ranking.rank_id] ? rankType[account.profile_before.ranking.rank_id] : 0}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Wins"
                name="wins"
                value={account && account.profile_before && account.profile_before.ranking && account.profile_before.ranking.wins ? account.profile_before.ranking.wins : 0}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="VAC Banned"
                name="vac_banned"
                value={account && account.profile_before && account.profile_before.vac_banned ? account.profile_before.vac_banned : 0}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Penalty"
                name="penalty_reason"
                value={account && account.profile_before && account.profile_before.penalty_reason ? account.profile_before.penalty_reason : 0}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
              >
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
      </Card>
      </Box>
      <Box>
      <Card>
      <CardHeader title="Processed information"></CardHeader>
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Level"
                name="player_level"
                value={account && account.profile_after && account.profile_after.player_level ? account.profile_after.player_level : 0}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Current Experience"
                name="player_cur_xp"
                value={account && account.profile_after && account.profile_after.player_cur_xp ? account.profile_after.player_cur_xp : 0}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Rank ID"
                name="rank_id"
                value={account && account.profile_after && account.profile_after.ranking && account.profile_after.ranking.rank_id && rankType && rankType[account.profile_after.ranking.rank_id] ? rankType[account.profile_after.ranking.rank_id] : 0}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Wins"
                name="wins"
                value={account && account.profile_after && account.profile_after.ranking && account.profile_after.ranking.wins ? account.profile_after.ranking.wins : 0}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="VAC Banned"
                name="vac_banned"
                value={account && account.profile_after && account.profile_after.vac_banned ? account.profile_after.vac_banned : 0}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Penalty"
                name="penalty_reason"
                value={account && account.profile_after && account.profile_after.penalty_reason ? account.profile_after.penalty_reason : 0}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
              >
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
      </Card>
      </Box>
    </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
