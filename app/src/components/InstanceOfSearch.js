import React, { useEffect, useRef, useState }from 'react'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Autocomplete from '@material-ui/lab/Autocomplete'
import ListItemText from '@material-ui/core/ListItemText'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles, withStyles} from '@material-ui/core/styles'


const useStyles = makeStyles(theme => ({
  paper: {
    backgroundColor: 'rgb(120, 136, 148)',
    borderRadius: 0,
    '& > div': {
      color: '#fefefe',
    },
    '& > ul': {
      color: '#fefefe',
      padding: 0,
    },
  },
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


const StyledTextField = withStyles({
  root: {
    '& .MuiFormLabel-root': {
      '@media (min-width:600px)': {
        fontSize: '1.25rem',
        opacity: 0.85,
      },
      color: '#fefefe',
    },
    '&.small .MuiFormLabel-root': {
      '@media (min-width:600px)': {
        fontSize: '1rem',
      }
    },
    '& .MuiInput-input': {
      '@media (min-width:600px)': {
        fontSize: '2rem',
      },
      color: '#fefefe',
      transition: 'background 0.3s ease',
    },
    '&.small .MuiInput-input': {
      '@media (min-width:600px)': {
        fontSize: '1.5rem'
      }
    },
    '& label.Mui-focused': {
      color: '#fefefe',
    },
    '&:hover .MuiInput-input': {
      background: 'rgba(255, 255, 255, 0.1)',
    },
    '&:hover .MuiInput-underline:before': {
      borderBottomColor: '#fefefe',
      borderBottom: '3px solid',
    },
    '& .MuiInput-underline:before': {
      borderBottomColor: '#fefefe',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#fefefe',
    },
    '& .MuiInputLabel-shrink': {
      transform: 'translate(0px, -10px)',
    },
    '& .MuiCircularProgress-root': {
      color: '#fefefe',
    },
    '& .MuiAutocomplete-endAdornment': {
      '& button': {
        color: '#fefefe',
      },
    },
  },
})(TextField)


const InstanceOfSearch = ({ onSelect }) => {

  const classes = useStyles()

  const timeoutID = useRef(null)

  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')

  React.useEffect(() => {
    if ( !inputValue ) { return }

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

  }, [inputValue])

  useEffect(() => {
    if (!open) {
      setOptions([])
    }
  }, [open])

  return (
    <Autocomplete
      id="instance-of-search"
      open={open}
      onOpen={() => {
        setOpen(true)
      }}
      onClose={() => {
        setOpen(false)
      }}
      onChange={(event, value) => onSelect(value)}
      getOptionSelected={(option, value) => option.label[0] === value.name}
      getOptionLabel={(option) => option.label[0]}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue)
      }}
      classes={{
        paper: classes.paper,
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
        <StyledTextField
          fullWidth
          {...params}
          label="Instance Of"
          autoCorrect="off"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
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
  )
}

export default InstanceOfSearch
