import React from 'react'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import Paper from '@material-ui/core/Paper'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormLabel from '@material-ui/core/FormLabel'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';
import {
  withStyles,
  createMuiTheme,
  responsiveFontSizes,
  ThemeProvider,
} from '@material-ui/core/styles'

import Logo from './components/Logo'
import Input from './components/Input'
import ArrowUp from './components/ArrowUp'


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
    paddingBottom: theme.spacing(2),
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
    width: '97%',
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
  settingsToggle: {
    position: 'relative',
    cursor: 'pointer',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    color: '#fefefe',
    width: '100%',
    userSelect: 'none',
    '@media (min-width:600px)': {
      marginTop: theme.spacing(3),
    },
  },
  settingsLabel: {
    color: '#fefefe',
    userSelect: 'none',
    '&.Mui-focused': {
      color: '#fefefe',
    },
  },
  settingsRadioGroup: {
    color: '#fefefe',
    userSelect: 'none',
  },
  alignedIcon: {
    verticalAlign: 'bottom',
  },
  cursor: {
    cursor: 'pointer',
  },
})


const StyledMenu = withStyles((theme) => ({
  paper: {
    backgroundColor: 'rgb(120, 136, 148)',
    borderRadius: 0,
  },
}))(Menu);

const CustomSwitch = withStyles({
  switchBase: {
    color: '#fefefe',
    '&$checked': {
      color: '#fefefe',
    },
    '&$checked + $track': {
      backgroundColor: '#fefefe',
    },
  },
  checked: {},
  track: {},
})(Switch);


const StyledMenuItem = withStyles((theme) => ({
  root: {
    color: '#fefefe',
    '&:hover': {
      backgroundColor: '#657382',
    },
    '&:focus': {
      backgroundColor: '#5a6773',
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: '#fefefe',
        userSelect: 'none',
      },
    },
  },
}))(MenuItem);


const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Russian' },
  { value: 'es', label: 'Spanish' },
  { value: 'zh-cn', label: 'Simplified Chinese' },
]


const QUERY_TYPE_OPTIONS = [
  { value: 'ngram', label: 'Autocompletion Search' },
  { value: 'exact_match', label: 'Exact Match Search' }

]

const ITEM_TYPE_OPTIONS = [
  { value: 'qnode', label: 'Qnode' },
  { value: 'property', label: 'Property' }
]


class App extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      query: '',
      results: [],
      showSettings: false,
      language: LANGUAGE_OPTIONS[0].value,
      queryType: QUERY_TYPE_OPTIONS[0].value,
      itemType: ITEM_TYPE_OPTIONS[0].value,
      instanceOfTypeMenu: false,
      instanceOfTypeResults: [],
      instanceOfTypeQuery: '',
      instanceOfType: '',
      debugSwitchState: false,
      classesSwitchState: false
    }
  }

  handleOnChange (query) {
    this.setState({ query }, () => {
      if ( !query ) {
        this.setState({results: []})
      } else {
        clearTimeout(this.timeoutID)
        this.timeoutID = setTimeout(() => {
          this.submitQuery()
        }, 500)
      }
    })
  }

  handleOnChangeLanguage (language) {
    this.setState({ language }, () => {
      this.submitQuery()
    })
  }

  handleOnChangeQueryType (queryType) {
    this.setState({ queryType }, () => {
      this.submitQuery()
    })
  }

  handleOnChangeItemType (itemType) {
    this.setState({ itemType }, () => {
      this.submitQuery()
    })
  }

  handleOnChangeInstanceOfType(instanceOfTypeQuery) {
    this.setState({
      instanceOfTypeQuery,
      instanceOfType: ''
    }, () => {
      if ( !instanceOfTypeQuery ) {
        this.setState({
          instanceOfType: '',
          instanceOfTypeMenu: false,
          instanceOfTypeResults: [],
        }, () => {
          this.submitQuery()
        })
      } else {
        clearTimeout(this.timeoutID)
        this.timeoutID = setTimeout(() => {
          this.submitQuery(true)
        }, 500)
      }
    })
  }

  handleDebugSwitchChange (debugSwitchState) {
    this.setState({ debugSwitchState })
  }

  handleClassesSwitchChange (classesSwitchState) {
    this.setState({ classesSwitchState }, () => {
      if (this.state.query) {
        this.submitQuery()
      }
    })
  }

  submitQuery(isClass=false) {
    const { query } = this.state
    const { language } = this.state
    const { queryType } = this.state
    const { itemType } = this.state
    const { instanceOfType } = this.state
    const { instanceOfTypeQuery } = this.state
    const { classesSwitchState } = this.state

    // Construct the url with correct parameters
    let url = `/api/`
    if ( instanceOfTypeQuery && isClass ) {
      url += `${instanceOfTypeQuery}?`
      url += `&is_class=true`
      url += `&type=ngram`
      url += `&size=5`
    } else if ( query ) {
      url += `${query}?`
      url += `&type=${queryType}`
    }
    url += `&extra_info=true&language=${language}&item=${itemType}`
    if ( instanceOfType ) {
      url += `&instance_of=${instanceOfType}`
    }

    if ( classesSwitchState ) {
      if ( !url.includes(`&is_class=true`) ) {
          url += `&is_class=true`
        }
      }



    if ( query || instanceOfTypeQuery ) {
      return fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.json())
      .then((results) => {
        if ( instanceOfTypeQuery && isClass ) {
          this.setState({
            instanceOfTypeResults: results,
            instanceOfTypeMenu: !!results.length,
          })
        } else {
          this.setState({ results })
        }
      })
    }
  }

  submit (event) {
    event.preventDefault()
    this.submitQuery()
  }


  renderResults () {
    const { classes } = this.props
    const { results } = this.state
    const { debugSwitchState } = this.state
    return results.map((result, i) => (
      <Grid item xs={ 12 } key={ i } className={ classes.result }>
        <Typography
          component="h5"
          variant="h5"
          className={ classes.index }>
          { i + 1 }.
        </Typography>
        <Link
          href={`https://ringgaard.com/kb/${result.qnode}`}
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
            <b>Description:</b> { !!result.description[0] ? result.description[0] : 'No Description'}
          </Typography>
          { !!result.alias.length ? (
            <Typography
              component="p"
              variant="body1"
              className={ classes.description }>
              <b>Alias:</b> { result.alias.join(', ') }
            </Typography>
          ) : null }
          { !!debugSwitchState ? (
          <Typography
              component="p"
              variant="body1"
              className={ classes.description }>
              <b>Pagerank:</b> { result.pagerank }
            </Typography>
            ) : null }
          { !!debugSwitchState ? (
          <Typography
              component="p"
              variant="body1"
              className={ classes.description }>
              <b>Statements:</b> { result.statements }
            </Typography>
            ) : null }
          { !!result.data_type ? (
            <Typography
              component="p"
              variant="body1"
              className={ classes.description }>
              <b>Data type:</b> { result.data_type }
            </Typography>
          ) : null }
        </Link>
      </Grid>
    ))
  }

  toggleSettings() {
    const { showSettings } = this.state
    this.setState({ showSettings: !showSettings })
  }

  renderSettingsToggle() {
    const { showSettings } = this.state
    const { classes } = this.props
    return (
      <Typography variant="button"
        className={classes.settingsToggle}
        onClick={this.toggleSettings.bind(this)}>
        { showSettings ? (
          <span>
            <ExpandLessIcon className={classes.alignedIcon} /> Hide settings
          </span>
        ) : (
          <span>
            <ExpandMoreIcon className={classes.alignedIcon} /> Show settings
          </span>
        )}
      </Typography>
    )
  }

  openInstanceOfTypeMenu() {
    const { instanceOfTypeResults } = this.state
    if ( instanceOfTypeResults.length ) {
      if ( !!this.clickTimeoutID ) {
        clearTimeout(this.clickTimeoutID)
        delete this.clickTimeoutID
      } else {
        this.clickTimeoutID = setTimeout(() => {
          this.setState({instanceOfTypeMenu: true}, () => {
            delete this.clickTimeoutID
          })
        }, 250)
      }
    }
  }

  closeInstanceOfTypeMenu() {
    this.setState({instanceOfTypeMenu: false})
  }

  selectInstanceOfType(result) {
    this.setState({
      instanceOfType: result.qnode,
      instanceOfTypeQuery: result.label[0] + ` (${result.qnode})`
    }, () => {
      this.closeInstanceOfTypeMenu()
      this.submitQuery()
    })
  }

  renderInstanceOfTypeResults() {
    const { instanceOfTypeResults, instanceOfTypeMenu } = this.state
    const { classes } = this.props
    return (
      <StyledMenu
        id="simple-menu"
        anchorEl={this.instanceOfTypeInput}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={instanceOfTypeMenu}
        onClose={() => this.closeInstanceOfTypeMenu()}
        keepMounted>
        {instanceOfTypeResults.map((result, index) => (
          <StyledMenuItem key={index} onClick={() => this.selectInstanceOfType(result)}>
            <ListItemText className={classes.cursor}>
              {result.label[0]} ({result.qnode})
            </ListItemText>
          </StyledMenuItem>
        ))}
      </StyledMenu>
    )
  }

  renderSettings() {
    const { language, queryType, itemType, showSettings, debugSwitchState, classesSwitchState } = this.state
    const { classes } = this.props
    if ( showSettings ) {
      return (
        <Grid container spacing={ 3 }>
          <Grid item xs={ 12 } lg={ 3 }>
            <FormControl component="fieldset">
              <FormLabel component="legend" className={classes.settingsLabel}>
                Language
              </FormLabel>
              <RadioGroup aria-label="query-type" name="query-type"
                value={ language }
                className={classes.settingsRadioGroup}
                onChange={(event, option) => this.handleOnChangeLanguage(option)}>
                { LANGUAGE_OPTIONS.map((option, index) => (
                  <FormControlLabel
                    key={ index }
                    value={ option.value }
                    control={ <Radio color="default" /> }
                    label={ option.label } />
                )) }
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={ 12 } lg={ 3 }>
            <FormControl component="fieldset">
              <FormLabel component="legend" className={classes.settingsLabel}>
                Query Type
              </FormLabel>
              <RadioGroup aria-label="query-type" name="query-type"
                value={ queryType }
                className={classes.settingsRadioGroup}
                onChange={(event, option) => this.handleOnChangeQueryType(option)}>
                { QUERY_TYPE_OPTIONS.map((option, index) => (
                  <FormControlLabel
                    key={ index }
                    value={ option.value }
                    control={ <Radio color="default" /> }
                    label={ option.label } />
                )) }
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={ 12 } lg={ 3 }>
            <FormControl component="fieldset">
              <FormLabel component="legend" className={classes.settingsLabel}>
                Search
              </FormLabel>
              <RadioGroup aria-label="search-qnode" name="search-qnode"
                value={ itemType }
                className={classes.settingsRadioGroup}
                onChange={(event, option) => this.handleOnChangeItemType(option)}>
                { ITEM_TYPE_OPTIONS.map((option, index) => (
                  <FormControlLabel
                    key={ index }
                    value={ option.value }
                    control={ <Radio color="default" /> }
                    label={ option.label } />
                )) }
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={ 12 } lg={ 3 }>
             <FormLabel component="legend" className={classes.settingsLabel}>
                Other Settings
              </FormLabel>
             <FormControlLabel
              control={
                    <CustomSwitch
                        checked={classesSwitchState}
                        onChange={(event, checked) => this.handleClassesSwitchChange(checked)}
                        label="Classes"
                        name="classesSwitch"
                        color="primary"
                    />}
              label="Search Classes only"
              className={ classes.description }
              labelPlacement="end"
            />
            <br/>
            <FormControlLabel
              control={
                    <CustomSwitch
                        checked={debugSwitchState}
                        onChange={(event, checked) => this.handleDebugSwitchChange(checked)}
                        label="Debug"
                        name="debugSwitch"
                        color="primary"
                    />}
              label="Debug"
              className={ classes.description }
              labelPlacement="end"
            />
          </Grid>
        </Grid>
      )
    }
  }

  render () {
    const { classes } = this.props
    const { instanceOfTypeQuery } = this.state
    return (
      <ThemeProvider theme={ theme }>
        <Container maxWidth="xl">
          <div id="top"/>
          <CssBaseline/>
          <Typography
            component="h3"
            variant="h3"
            className={ classes.header }>
            <a href="https://github.com/usc-isi-i2/kgtk" title="Knowledge Graph Toolkit" rel="noopener noreferrer nofollow" target="_blank">
              <div className={ classes.logo }>
                <Logo/>
              </div>
            </a>
            Knowledge Graph Text Search
          </Typography>

          <form className={ classes.form } noValidate
            onSubmit={ this.submit.bind(this) }>
            <Grid container spacing={ 3 }>
              <Grid item xs={ 12 }>
                <Paper component="div" className={ classes.paper } square>
                  <Grid container spacing={ 3 }>
                    <Grid item xs={ 8 }>
                      <Input autoFocus={ true } label={'Search'}
                        onChange={ this.handleOnChange.bind(this) }/>
                    </Grid>
                    <Grid item xs={ 4 }>
                        <Input
                          query={instanceOfTypeQuery}
                          label={'Instance of'}
                          onClick={this.openInstanceOfTypeMenu.bind(this)}
                          passInputRef={(element) => this.instanceOfTypeInput = element}
                          onChange={ this.handleOnChangeInstanceOfType.bind(this) }
                        />
                        {this.renderInstanceOfTypeResults()}
                    </Grid>
                  </Grid>
                  {this.renderSettingsToggle()}
                  {this.renderSettings()}
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
