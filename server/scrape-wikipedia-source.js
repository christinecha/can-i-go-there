const axios = require('axios')
const cheerio = require('cheerio')

const countriesJSON = require('../shared/countries.json')

const HEADINGS = [
  { 
    name: 'destination_country', 
    formatter: (str) => {
      const match = countriesJSON.find(c => (
        [c.name, ...(c.aliases || [])].indexOf(str) > -1
      ))
      
      return match && match.code
    },
    aliases: [ 'country', 'countries' ],
    isRequired: true,
  },
  { 
    name: 'visa_requirement', 
    aliases: [ 'visa requirement' ],
    isRequired: true,
  },
  { 
    name: 'allowed_stay', 
    aliases: [ 'allowed stay' ] 
  },
  { 
    name: 'notes', 
    aliases: [ 'notes' ] 
  }
]

const validateHeadings = headings => {
  return !headings.find((h, i) => {
    if (!HEADINGS[i]) return true

    const cleanHeading = h.trim().toLowerCase()
    return !HEADINGS[i].aliases.find(n => {
      return cleanHeading.indexOf(n) > -1
    })
  })
}

const getVisaRequirementsFor = country => {
  if (!country.wikipediaSource) {
    return
  }

  axios.get(country.wikipediaSource)
  .then(response => {
    const $ = cheerio.load(response.data)
    const tables = Array.from($('body').find('table'))
  
    const sanitizedTables = []
  
    tables.forEach(table => {
      const headings = Array.from($(table).find('th')).map(h => {
        return $(h).text()
      })
      
      const isValid = validateHeadings(headings)
  
      if (!isValid) {
        // Ignore invalid tables.
        return
      }
  
      const rows = Array.from($(table).find('tr'))
      const sanitized = []
      
      rows.forEach(r => {
        const sanitizedRow = { 'passport_country': country.code }

        Array.from($(r).find('td')).forEach((col, n) => {
          const heading = HEADINGS[n]
          const value = $(col).text().trim()
          const formattedValue = heading.formatter
            ? heading.formatter(value)
            : value
          
          sanitizedRow[heading.name] = formattedValue
        })

        const isMissingRequiredFields = HEADINGS.find(h => (
          h.isRequired && !sanitizedRow[h.name]
        ))

        if (!isMissingRequiredFields) {
          sanitized.push(sanitizedRow)
        }
      })
  
      console.log(sanitized)
    })
  
    console.log(sanitizedTables)
  })
}

countriesJSON.forEach(getVisaRequirementsFor)