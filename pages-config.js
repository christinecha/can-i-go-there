// const path = require('path')
// const fs = require('fs-extra')
const countries = require('./shared/countries.json')

// const JSON_DIR = path.resolve(__dirname, 'data/visa-requirements')
// const getCountryPath = (country) => path.resolve(JSON_DIR, `${country.code}.json`)
// const getCountry = code => countries.find(c => c.code === code)

const shared = {
  template: './template.ejs',
  meta: {
    description: 'Check the visa requirements for your passport to any destination country.',
    'og:title': 'Can I Go There?',
    'og:description': 'Check the visa requirements for your passport to any destination country.',
    'og:image': 'https://can-i-go-there.com/assets/preview.jpeg',
    'og:url': 'https://can-i-go-there.com',
    'twitter:card': 'summary_large_image',
  },
}

// const countryCombinations = countries
//   .filter(country => {
//     return fs.existsSync(getCountryPath(country))
//   })
//   .reduce((arr, country) => {
//     const requirements = require(getCountryPath(country))
//     const destinations = Object.keys(requirements)
    
//     const combos = destinations.map(destination => {
//       return { 
//         passport: country,
//         destination: getCountry(destination),
//         info: requirements[destination]
//       }
//     })

//     return [...arr, ...combos]
//   }, [])

const pages = [
  {
    ...shared,
    title: 'Can I Go There?',
    filename: 'index.html',
  },
  ...countries
    .filter(c => !!c.wikipediaSource)
    .map(passport => {
      return {
        ...shared,
        title: `Visa Requirements: Citizens of ${passport.name}`,
        INITIAL_PASSPORT: passport.code,
        filename: `${passport.code.toLowerCase()}.html`,
        meta: {
          ...shared.meta,
          description: `Visa requirements for citizens of ${passport.name} traveling anywhere in the world.`,
          'og:description': `Can I go there? Check out the visa requirements for citizens of ${passport.name} traveling anywhere in the world.`,
          'og:title': `Can I Go There? Visa Requirements for Citizens of ${passport.name}`,
        },
      }
    }),
]

module.exports = pages
