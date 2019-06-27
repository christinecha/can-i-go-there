import countriesJSON from '../../shared/countries.json'
import initDOM from './initDOM'
import render from './render'
import onCountrySelect from './onCountrySelect'
import checkRequirements from './checkRequirements'

const AVAILABLE_PASSPORTS = countriesJSON.filter(n => n.wikipediaSource).map(n => n.code)
const COUNTRIES_BY_CODE = countriesJSON.reduce((obj, c) => ({
  ...obj, 
  [c.code]: c
}), {})

const App = () => {
  return {
    COUNTRIES_BY_CODE, 
    AVAILABLE_PASSPORTS,
    REQUIREMENTS_CACHE: {},

    state: {
      typeaheadValue: '',
      passport: '',
      destination: '',
      preselect: 0,
    },

    setState(obj) {
      this.state = { ...this.state, ...obj }
      this.render()
    },

    init() {
      this.initDOM()
      this.render()
      this.refs.typeahead.focus()
      
      document.addEventListener('keydown', this.onDocumentKeyDown.bind(this))
      this.refs.typeahead.addEventListener('keydown', this.onInput.bind(this))

      document.addEventListener('keydown', (e) => {
        const activeOptions = this.refs.options.filter(o => o.dataset.isActive === "true")

        // ENTER
        if (e.keyCode === 13) {
          const option = activeOptions[this.state.preselect]

          if (option) {
            const country = this.COUNTRIES_BY_CODE[option.dataset.countryCode]
            this.onCountrySelect(country)
          }

          return 
        }

        let requestedPreselect = this.state.preselect

        // DOWN
        if (e.keyCode === 40) {
          requestedPreselect += 1
        }

        // UP
        if (e.keyCode === 38) {
          requestedPreselect -= 1
        }

        const preselect = Math.min(Math.max(0, requestedPreselect), activeOptions.length - 1)
        this.setState({ preselect })
      })

      this.refs.options.forEach($option => {
        $option.addEventListener('click', () => {
          const countryCode = $option.dataset.countryCode
          const country = this.COUNTRIES_BY_CODE[countryCode] || {}

          this.onCountrySelect(country)
        })
      })

      this.refs.passport.addEventListener('click', () => {
        this.setState({ 
          passport: '',
          destination: '',
        })
      })

      this.refs.destination.addEventListener('click', () => {
        this.setState({ 
          destination: '',
        })
      })
    },

    onInput(e) {
      const typeaheadValue = (e.target.value || '').toLowerCase()
      this.setState({ 
        typeaheadValue,
      })
    },

    onDocumentKeyDown() {
      this.refs.typeahead.focus()
    },
    
    onCountrySelect,
    checkRequirements,
    initDOM, 
    render
  }
}

const app = App()
app.init()