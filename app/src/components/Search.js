import React from 'react'
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
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import Switch from '@material-ui/core/Switch'
import { withStyles } from '@material-ui/core/styles'

import Input from './Input'
import WikidataLogo from './WikidataLogo'
import InstanceOfSearch from './InstanceOfSearch'


const styles = theme => ({
  paper: {
    marginTop: theme.spacing(3),
    paddingTop: theme.spacing(3),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  result: {
    position: 'relative',
    marginTop: theme.spacing(3),
  },
  index: {
    color: '#333',
    position: 'absolute',
    top: theme.spacing(1),
    left: theme.spacing(1),
  },
  link: {
    color: '#333',
    width: '97%',
    display: 'inline-block',
    padding: theme.spacing(1),
    marginLeft: theme.spacing(5),
    transition: '0.2s background ease',
    '&:hover': {
      color: '#111',
      background: 'rgba(253, 214, 0, 0.25)',
      textDecoration: 'none',
      cursor: 'pointer',
    },
  },
  label: {
    color: '#0077ea',
    textDecoration: 'underline',
  },
  description: {
    color: '#333',
    textDecoration: 'none',
  },
  settingsToggle: {
    position: 'relative',
    cursor: 'pointer',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    color: '#333',
    width: '100%',
    userSelect: 'none',
    '@media (min-width:600px)': {
      marginTop: theme.spacing(3),
    },
  },
  settingsLabel: {
    color: '#333',
    userSelect: 'none',
    '&.Mui-focused': {
      color: '#333',
    },
  },
  settingsRadioGroup: {
    color: '#333',
    userSelect: 'none',
  },
  languageSetting: {
    color: '#333',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: theme.spacing(2),
  },
  alignedIcon: {
    verticalAlign: 'bottom',
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
})


const StyledMenu = withStyles((theme) => ({
  paper: {
    backgroundColor: '#fefefe',
    borderRadius: 0,
  },
}))(Menu)


const CustomSwitch = withStyles({
  switchBase: {
    color: '#777',
    '&$checked': {
      color: '#555',
    },
    '&$checked + $track': {
      backgroundColor: '#111',
    },
  },
  checked: {},
  track: {},
})(Switch)


const StyledMenuItem = withStyles((theme) => ({
  root: {
    color: '#333',
    '&:hover': {
      backgroundColor: '#fefefe',
    },
    '&:focus': {
      backgroundColor: '#eee',
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: '#111',
        userSelect: 'none',
      },
    },
  },
}))(MenuItem)


const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'de', label: 'German' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'it', label: 'Italian' },
  { value: 'nl', label: 'Dutch' },
  { value: 'pl', label: 'Polish' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ru', label: 'Russian' },
  { value: 'sv', label: 'Swedish' },
  { value: 'zh-cn',label: 'Simplified Chinese' },
]


const QUERY_TYPE_OPTIONS = [
  { value: 'ngram', label: 'Autocompletion Search' },
  { value: 'exact_match', label: 'Exact Match Search' },
]


const ITEM_TYPE_OPTIONS = [
  { value: 'qnode', label: 'Qnode' },
  { value: 'property', label: 'Property' },
]


class Search extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      query: '',
      results: [],
      showSettings: false,
      openLanguageSettings: false,
      language: LANGUAGE_OPTIONS[0].value,
      queryType: QUERY_TYPE_OPTIONS[0].value,
      itemType: ITEM_TYPE_OPTIONS[0].value,
      instanceOfTypeResults: [],
      instanceOfTypeQuery: '',
      instanceOfType: '',
      debugSwitchState: false,
      classesSwitchState: false,
      mouseDown: false,
      selecting: false,
    }
  }

  handleOnChange(query) {
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

  handleOnChangeLanguage(option) {
    this.setState({
      language: option.value,
      openLanguageSettings: false,
    }, () => {
      this.submitQuery()
    })
  }

  handleOnChangeQueryType(queryType) {
    this.setState({ queryType }, () => {
      this.submitQuery()
    })
  }

  handleOnChangeItemType(itemType) {
    this.setState({ itemType }, () => {
      this.submitQuery()
    })
  }

  handleDebugSwitchChange(debugSwitchState) {
    this.setState({ debugSwitchState })
  }

  handleClassesSwitchChange(classesSwitchState) {
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
    let url = `/api?`
    if ( instanceOfTypeQuery && isClass ) {
      url += `&q=${instanceOfTypeQuery}`
      url += `&is_class=true`
      url += `&type=ngram`
      url += `&size=5`
    } else if ( query ) {
      url += `&q=${query}`
      url += `&type=${queryType}`
    } else {
      return false
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
          })
        } else {
          this.setState({ results })
        }
      })
    }
  }

  submit(event) {
    event.preventDefault()
    this.submitQuery()
  }

  handleOnMouseDown() {
    this.setState({mouseDown: true})
  }

  handleOnMouseMove() {
    if ( this.state.mouseDown ) {
      const selection = window.getSelection()
      if ( !!selection.toString() ) {
        this.setState({selecting: true})
      }
    }
  }

  handleOnMouseUp(event, result) {

    // check if users clicked on the wikidata logo
    if ( event.target.nodeName === 'svg' || event.target.parentElement.nodeName === 'svg' ) {
      if ( result.qnode[0] === 'Q' ) {
        window.open(`https://www.wikidata.org/wiki/${result.qnode}`, '_blank')
      } else {
        window.open(`https://www.wikidata.org/wiki/Property:${result.qnode}`, '_blank')
      }
    }

    // else redirect to the ringgaard knowledge base
    if ( this.state.mouseDown && !this.state.selecting ) {
      clearTimeout(this.timeoutID)
      this.timeoutID = setTimeout(() => {
        window.open(`https://ringgaard.com/kb/${result.qnode}`, '_blank')
      }, 100)
    }

    // reset selecting and mouseDown state setttings
    this.setState({selecting: false, mouseDown: false})
  }

  renderResults() {
    const { classes } = this.props
    const { results } = this.state
    const { debugSwitchState } = this.state
    return results.map((result, i) => (
      <Grid item xs={12} key={i} className={classes.result}>
        <Typography
          component="h5"
          variant="h5"
          className={classes.index}>
          {i + 1}.
        </Typography>
        <Link
          component="div"
          className={classes.link}
          onMouseDown={() => this.handleOnMouseDown()}
          onMouseMove={() => this.handleOnMouseMove()}
          onMouseUp={(event) => this.handleOnMouseUp(event, result)}>
          <Typography
            component="h5"
            variant="h5"
            className={classes.label}>
            {result.label[0]} ({result.qnode})
            <WikidataLogo />
          </Typography>
          <Typography
            component="p"
            variant="body1"
            className={classes.description}>
            <b>Description:</b> {!!result.description[0] ? result.description[0] : 'No Description'}
          </Typography>
          { !!result.alias.length ? (
            <Typography
              component="p"
              variant="body1"
              className={classes.description}>
              <b>Alias:</b> {result.alias.join(', ')}
            </Typography>
          ) : null }
          { !!debugSwitchState ? (
          <Typography
              component="p"
              variant="body1"
              className={classes.description}>
              <b>Pagerank:</b> {result.pagerank}
            </Typography>
            ) : null }
          { !!debugSwitchState ? (
          <Typography
              component="p"
              variant="body1"
              className={classes.description}>
              <b>Statements:</b> {result.statements}
            </Typography>
            ) : null }
          { !!result.data_type ? (
            <Typography
              component="p"
              variant="body1"
              className={classes.description}>
              <b>Data type:</b> {result.data_type}
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

  selectInstanceOfType(result) {
    if ( !result ) {
      this.setState({
        instanceOfTypeQuery: '',
        instanceOfType: '',
      }, () => {
        this.submitQuery()
      })
    } else {
      this.setState({
        instanceOfType: result.qnode,
        instanceOfTypeQuery: result.label[0] + ` (${result.qnode})`
      }, () => {
        this.submitQuery()
      })
    }
  }

  openLanguageSettings() {
    this.setState({openLanguageSettings: true})
  }

  closeLanguageSettings() {
    this.setState({openLanguageSettings: false})
  }

  renderLanguageSettings() {
    const { openLanguageSettings } = this.state
    const { classes } = this.props
    return (
      <StyledMenu
        id="language-settings"
        anchorEl={this.languageSettingRef}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={openLanguageSettings}
        onClose={() => this.closeLanguageSettings()}
        keepMounted>
        {LANGUAGE_OPTIONS.map((option, index) => (
          <StyledMenuItem key={index}
            onClick={() => this.handleOnChangeLanguage(option)}>
            <ListItemText className={classes.listItem}>
              {option.label}
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
        <Grid container spacing={3}>
          <Grid item xs={12} lg={3}>
            <FormControl component="fieldset">
              <FormLabel component="legend" className={classes.settingsLabel}
                ref={(element) => this.languageSettingRef = element}>
                Language
              </FormLabel>
              <p className={classes.languageSetting}
                onClick={() => this.openLanguageSettings()}>
                {LANGUAGE_OPTIONS.find(option => option.value === language).label}
              </p>
              {this.renderLanguageSettings()}
            </FormControl>
          </Grid>
          <Grid item xs={12} lg={3}>
            <FormControl component="fieldset">
              <FormLabel component="legend" className={classes.settingsLabel}>
                Query Type
              </FormLabel>
              <RadioGroup aria-label="query-type" name="query-type"
                value={queryType}
                className={classes.settingsRadioGroup}
                onChange={(event, option) => this.handleOnChangeQueryType(option)}>
                { QUERY_TYPE_OPTIONS.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={option.value}
                    control={<Radio color="default" />}
                    label={option.label} />
                )) }
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} lg={3}>
            <FormControl component="fieldset">
              <FormLabel component="legend" className={classes.settingsLabel}>
                Search
              </FormLabel>
              <RadioGroup aria-label="search-qnode" name="search-qnode"
                value={itemType}
                className={classes.settingsRadioGroup}
                onChange={(event, option) => this.handleOnChangeItemType(option)}>
                { ITEM_TYPE_OPTIONS.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={option.value}
                    control={<Radio color="default" />}
                    label={option.label} />
                )) }
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} lg={3}>
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
                  color="primary" />
              }
              label="Search Classes only"
              className={classes.description}
              labelPlacement="end" />
            <br/>
            <FormControlLabel
              control={
                <CustomSwitch
                  checked={debugSwitchState}
                  onChange={(event, checked) => this.handleDebugSwitchChange(checked)}
                  label="Debug"
                  name="debugSwitch"
                  color="primary" />
              }
              label="Debug"
              className={classes.description}
              labelPlacement="end" />
          </Grid>
        </Grid>
      )
    }
  }

  renderSearchBar() {
    return (
      <Grid item xs={8}>
        <Input autoFocus={ true } label={'Search'}
          onChange={ this.handleOnChange.bind(this) }/>
      </Grid>
    )
  }

  renderInstanceOfSearch() {
    return (
      <Grid item xs={4}>
        <InstanceOfSearch
          onSelect={result => this.selectInstanceOfType(result)} />
      </Grid>
    )
  }

  renderSearchForm() {
    const { classes } = this.props
    return (
      <form className={classes.form} noValidate
        onSubmit={this.submit.bind(this)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper component="div" className={classes.paper} square>
              <Grid container spacing={3}>
                {this.renderSearchBar()}
                {this.renderInstanceOfSearch()}
              </Grid>
              {this.renderSettingsToggle()}
              {this.renderSettings()}
            </Paper>
            {this.renderResults()}
          </Grid>
        </Grid>
      </form>
    )
  }

  render() {
    const { classes } = this.props
    return (
      <form className={classes.form} noValidate
        onSubmit={this.submit.bind(this)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper component="div" className={classes.paper} square>
              <Grid container spacing={3}>
                {this.renderSearchBar()}
                {this.renderInstanceOfSearch()}
              </Grid>
              {this.renderSettingsToggle()}
              {this.renderSettings()}
            </Paper>
            {this.renderResults()}
          </Grid>
        </Grid>
      </form>
    )
  }
}


export default withStyles(styles)(Search)
