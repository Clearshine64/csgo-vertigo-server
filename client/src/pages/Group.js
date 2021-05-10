import React, { useEffect } from 'react';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  Box,
  Button,
  Container,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@material-ui/core';
import GroupListResults from 'src/components/group/GroupListResults';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

axios.defaults.baseURL = "http://" + location.hostname + ":4000";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));




const Group = () => {
  const groupids =  [
    {
        "teamleader": [
            "m8tufm"
        ],
        "accountids": [
            "m8tufm, ",
            "m5vbgr, ",
            "mbej6t, ",
            "tjsncq, ",
            "tmfdhd"
        ],
        "_id": "60829889863713107c578ed3",
        "useful": true,
        "__v": 0
    },
    {
        "teamleader": [
            "qdqu4f"
        ],
        "accountids": [
            "qdqu4f, ",
            "yh7vqk, ",
            "nw6mre, ",
            "fjstrq, ",
            "n6f84x"
        ],
        "_id": "60829889863713107c578ed4",
        "useful": true,
        "__v": 0
    },
    {
        "teamleader": [
            "585ay3"
        ],
        "accountids": [
            "585ay3, ",
            "xrtc25, ",
            "hukgdn, ",
            "bed6vj, ",
            "ympxb2"
        ],
        "_id": "60829889863713107c578ed5",
        "useful": true,
        "__v": 0
    },
    {
        "teamleader": [
            "2jprvc"
        ],
        "accountids": [
            "2jprvc, ",
            "cvutjb, ",
            "4cryhs, ",
            "6vjkd7, ",
            "5tffha"
        ],
        "_id": "60829889863713107c578ed6",
        "useful": false,
        "__v": 0
    }
];
  const classes = useStyles();
  // const [ groupids, setgroupids ] = useState([]);
  const [mode, setMode] = React.useState('');
  const handleChange = (event) => {
    setMode(event.target.value);
    axios.put('/api/group', {
      grouptype: event.target.value
    });
  };
  const handleGenClick = () => {

  };

  return (
    <>
      <Helmet>
        <title>Group | Vertigo Boost</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end'
            }}
          >
            <FormControl variant="outlined" style={{ margin: '6px' }} className={classes.formControl}>
              <InputLabel shrink htmlFor="circle" id="demo-simple-select-outlined-label">Mode</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={mode}
                displayEmpty
                onChange={handleChange}
                label="mode"
              >
                <MenuItem disabled value="">
                  <em>Select Mode</em>
                </MenuItem>
                <MenuItem value="competitive">Competitive</MenuItem>
                <MenuItem value="wingman">Wingman</MenuItem>
              </Select>
            </FormControl>
            <Button
              style={{ margin: '6px' }}
              color="primary"
              variant="contained"
              onClick={handleGenClick}
            >
              Generate
            </Button>
          </Box>
          <Box sx={{ pt: 3 }}>
            <GroupListResults groupids={groupids} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Group;
