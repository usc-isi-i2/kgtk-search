import React, { useEffect, useRef, useState }from 'react'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Autocomplete from '@material-ui/lab/Autocomplete'
import ListItemText from '@material-ui/core/ListItemText'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/core/styles'


const useStyles = makeStyles(theme => ({
  listItem: {
    cursor: 'pointer',
    '& .MuiTypography-body1': {
      maxWidth: '500px',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
  },
}))


const InstanceOfSearch = () => {

  const classes = useStyles()

  const timeoutID = useRef(null)

  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')

  React.useEffect(() => {

    clearTimeout(timeoutID.current)
    timeoutID.current = setTimeout(() => {

      setLoading(true)

      let url = `/api?`
      url += `&q=${inputValue}`
      url += `&extra_info=true`
      url += `&is_class=true`
      url += `&language=en`
      url += `&type=ngram`
      url += `&item=qnode`
      url += `&size=5`

      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.json())
      .then((results) => {
        setLoading(false)
        setOptions(results)
      })
    }, 500)

  }, [inputValue]);

  useEffect(() => {
    if (!open) {
      setOptions([])
    }
  }, [open])

  return (
    <Autocomplete
      id="instance-of-search"
      style={{ width: 300 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionSelected={(option, value) => option.label[0] === value.name}
      getOptionLabel={(option) => option.label[0]}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue)
      }}
      renderOption={(option, { selected }) => (
        <ListItemText className={classes.listItem}>
          {option.label[0]} ({option.qnode})
          {!!option.description && !!option.description.length && (
            <Typography variant="body1">
              {option.description[0]}
            </Typography>
          )}
        </ListItemText>
      )}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          fullWidth
          {...params}
          label="Instance Of"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}

export default InstanceOfSearch
