import React from 'react'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import {
  withStyles,
  createMuiTheme,
  responsiveFontSizes,
  ThemeProvider,
} from '@material-ui/core/styles'

import Logo from './components/Logo'
import Input from './components/Input'
import ArrowUp from './components/ArrowUp'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

let theme = createMuiTheme()
theme = responsiveFontSizes(theme)

const styles = theme => ({
  '@global': {
    body: {
      background: 'linear-gradient(150deg, #708090, #002133)',
      backgroundAttachment: 'fixed',
      backgroundSize: '100% 150%',
      padding: theme.spacing(3, 1),
      height: '100vh',
    },
  },
  header: {
    color: '#fefefe',
    marginTop: theme.spacing(3),
  },
  logo: {
    display: 'inline-block',
    verticalAlign: 'middle',
    width: theme.spacing(12),
    height: theme.spacing(12),
    marginRight: theme.spacing(2),
  },
  paper: {
    marginTop: theme.spacing(3),
    paddingTop: theme.spacing(6),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingBottom: theme.spacing(6),
    backgroundColor: 'rgba(254, 254, 254, 0.25)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  button: {
    color: 'white',
    borderColor: 'whitesmoke',
    marginTop: theme.spacing(3),
  },
  underlined: {
    textDecoration: 'underline',
  },
  result: {
    position: 'relative',
    marginTop: theme.spacing(3),
  },
  index: {
    color: '#fefefe',
    position: 'absolute',
    top: theme.spacing(1),
    left: theme.spacing(1),
  },
  link: {
    width: '100%',
    display: 'inline-block',
    padding: theme.spacing(1),
    marginLeft: theme.spacing(5),
    color: '#fefefe',
    transition: '0.2s background ease',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.1)',
      textDecoration: 'none',
      cursor: 'pointer',
    },
  },
  label: {
    color: '#fefefe',
    textDecoration: 'underline',
  },
  description: {
    color: '#fefefe',
    textDecoration: 'none',
  },
})

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Russian' },
  { value: 'es', label: 'Spanish' },
  { value: 'zh-cn', label: 'Simplified Chinese' },
]
const defaultLanguageOption = languageOptions[0]

const queryTypeOptions = [
  { value: 'ngram', label: 'Ngram Query' },
  { value: 'exact_match', label: 'Exact Match Query' },
]
const defaultQueryTypeOption = queryTypeOptions[0]

class App extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      query: '',
      results: [],
      language: { 'value': 'en', 'label': 'English' },
      type: { value: 'ngram', label: 'Ngram Query' },
    }
  }

  handleOnChange (query) {
    // this.setState({query})
    this.setState({ query }, () => {
      clearTimeout(this.timeoutID)
      this.timeoutID = setTimeout(() => {
        this.submit_es_query()
      }, 300)
    })
  }

  OnLanguageChange (language) {
    this.setState({ language })
  }

  OnTypeChange (type) {
    this.setState({ type })
  }

  submit_es_query () {
    const { query } = this.state
    const { language } = this.state
    const { type } = this.state
    if ( !query ) {
      this.setState({ results: [] })
    } else {
      return fetch(
        `/api/${ query }?extra_info=true&language=${ language.value }&type=${ type.value }`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((response) => response.json()).then((results) => {
        this.setState({ results })
      })
    }
  }

  submit (event) {
    event.preventDefault()
    this.submit_es_query()
  }

  renderResults () {
    const { classes } = this.props
    const { results } = this.state
    return results.map((result, i) => (
      <Grid item xs={ 12 } key={ i }
            className={ classes.result }>
        <Typography
          component="h5"
          variant="h5"
          className={ classes.index }>
          { i + 1 }.
        </Typography>
        <Link
          href={ `https://sqid.toolforge.org/#/view?id=${ result.qnode }` }
          target="_blank"
          className={ classes.link }>
          <Typography
            component="h5"
            variant="h5"
            className={ classes.label }>
            { result.label[0] } ({ result.qnode })
          </Typography>
          <Typography
            component="p"
            variant="body1"
            className={ classes.description }>
            <b>Description:</b> { result.description[0] }
          </Typography>
          { !!result.alias.length ? (
            <Typography
              component="span"
              variant="body1"
              className={ classes.description }>
              <b>Alias:</b> { result.alias.join(', ') }
            </Typography>
          ) : null }
        </Link>
      </Grid>
    ))
  }

  render () {
    const { classes } = this.props
    const { query } = this.state
    return (
      <ThemeProvider theme={ theme }>
        <Container maxWidth="xl">
          <div id="top"/>
          <CssBaseline/>
          <Typography
            component="h3"
            variant="h3"
            className={ classes.header }>
            <div className={ classes.logo }>
              <Logo/>
            </div>
            Knowledge Graph Text Search
          </Typography>
          <form className={ classes.form } noValidate
                onSubmit={ this.submit.bind(this) }>
            <Dropdown options={ languageOptions }
                      onChange={ this.OnLanguageChange.bind(this) }
                      value={ defaultLanguageOption }
                      placeholder="Select Language" wi/>
            <Dropdown options={ queryTypeOptions }
                      onChange={ this.OnTypeChange.bind(this) }
                      value={ defaultQueryTypeOption }
                      placeholder="Select Query Type" wi/>
            <Grid container spacing={ 3 }>
              <Grid item xs={ 12 }>
                <Paper component="div" className={ classes.paper } square>
                  <Grid container spacing={ 3 }>
                    <Grid item xs={ 12 }>
                      <Input
                        text={ query }
                        autoFocus={ true }
                        onChange={ this.handleOnChange.bind(this) }/>
                    </Grid>
                  </Grid>
                </Paper>
                { this.renderResults() }
              </Grid>
            </Grid>
          </form>
          <ArrowUp/>
        </Container>
      </ThemeProvider>
    )
  }
}

export default withStyles(styles)(App)
