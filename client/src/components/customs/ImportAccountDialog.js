import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import EventEmitter from 'reactjs-eventemitter';
import axios from 'axios';

axios.defaults.baseURL = "http://" + location.hostname + ":4000";

export default function ImportAccountDialog(props) {
  const [ open, setOpen ] = React.useState(false);
  const [ delimiter, setDelimiter ] = React.useState('----');
  const [ fileinput, setFileInput ] = React.useState('');
  const [ err, setErr ] = React.useState('');
  const [ wait, setWait ] = React.useState(false);

  let fileReader;

  const handleClickOpen = () => {
    setErr('');
    setDelimiter('----');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleImport = async () => {
    let arr = fileinput.split('\n').map((item) => {
      return (item.split(delimiter));
    });

    if(arr[0][0] == '')
    {
      setErr("File path is empty!");
      return;
    }
    if(arr[0].length != 2)
    {
      setErr("Delimit Error!");
    }
    else
    {
      setErr('');
      setDelimiter('----');
      // for(let i=0; i<arr.length; i++)
      // {
        setWait(true);
        let temp = [];
        for(let i=0; i<arr.length; i++){
          temp.push(arr[i]);
          if(i % 1000 == 0) {
            await axios.post('/api/accounts/import', {
              data: temp,
              matchmode: props.matchmode.matchmode
            }).catch(error => {
              setErr(error.response.data.error);
            }).catch(err => {
              console.log(err);
            });
            temp = [];
          }
        }
        await axios.post('/api/accounts/import', {
          data: temp,
          matchmode: props.matchmode.matchmode
        }).catch(error => {
          setErr(error.response.data.error);
        }).catch(err => {
          console.log(err);
        });
        setWait(false);
        setOpen(false);
        // if(i % 200 == 0) EventEmitter.dispatch('ADD_ACCOUNT');
    // }
      setErr('');
      EventEmitter.dispatch('ADD_ACCOUNT');
    }
  };

  const handleFileChosen = (e) => {
    fileReader = new FileReader();
    fileReader.onloadend = function() {
      setFileInput(fileReader.result);
    }
    if(e.target.files[0] != undefined) 
    {
      fileReader.readAsText(e.target.files[0]);
    }
    else
    {
      setFileInput('');
    }
  }

  const handleChange = (e) => {
    setDelimiter(e.target.value);
  }

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Import
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Import accounts</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To import accounts from file, please enter delimiter and filepath here.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="delimiter"
            label="Delimiter"
            type="text"
            value={delimiter}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            id="filepath"
            type="file"
            onChange={(e) => handleFileChosen(e)}
            fullWidth
          />
          <p style={{color: 'red'}}>{err}</p>
        </DialogContent>
        <DialogActions>
          <p style={{color:'red', margin:'5px'}}>{wait == false ? '' : 'Please wait ...'}</p>
          <Button onClick={handleImport} color="primary">
            Import
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
