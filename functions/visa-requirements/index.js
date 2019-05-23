const axios = require('axios')
const cheerio = require('cheerio')

const countriesJSON = require('../../shared/countries.json')
const HEADINGS = require('./HEADINGS')

const validateHeadings = headings => {
  return !headings.find((h, i) => {
    if (!HEADINGS[i]) return true

    const cleanHeading = h.trim().toLowerCase()
    return !HEADINGS[i].aliases.find(n => {
      return cleanHeading.indexOf(n) > -1
    })
  })
}

const getVisaRequirements = country => {
  if (!country.wikipediaSource) {
    return Promise.resolve()
  }

  return axios.get(country.wikipediaSource)
  .then(response => {
    const $ = cheerio.load(response.data)
    const tables = Array.from($('body').find('table'))
  
    const sanitizedData = []
  
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
      
      rows.forEach(r => {
        const sanitizedRow = { 'passport_country': country.code }

        Array.from($(r).find('td')).forEach((col, n) => {
          const heading = HEADINGS[n]
          if (!heading) { return }
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
          sanitizedData.push(sanitizedRow)
        }
      })
    })
    
    return sanitizedData
  })
}

module.exports = getVisaRequirements