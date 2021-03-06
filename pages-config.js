// const path = require('path')
// const fs = require('fs-extra')
const countries = require('./shared/countries.json')

// const JSON_DIR = path.resolve(__dirname, 'data/visa-requirements')
// const getCountryPath = (country) => path.resolve(JSON_DIR, `${country.code}.json`)
// const getCountry = code => countries.find(c => c.code === code)

const shared = {
  template: './template.ejs',
  seoContent: 'Check the visa requirements for citizens of any passport traveling anywhere in the\u00A0world.',
  meta: {
    description: 'Do I need a visa to travel? Check the visa requirements for your passport to any destination country.',
    'og:title': 'Can I Go There?',
    'og:description': 'Do I need a visa to travel? Check the visa requirements for your passport to any destination country.',
    'og:image': 'https://can-i-go-there.com/assets/us-fr-preview.jpg',
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
      const adjectiveForm = passport.adjectiveForm || passport.name

      const seoContent = `Check out all the visa requirements for ${adjectiveForm} citizens traveling anywhere in the\u00A0world.`

      return {
        ...shared,
        title: `Visa Requirements for ${adjectiveForm} Citizens`,
        INITIAL_PASSPORT: passport.code,
        filename: `${passport.code.toLowerCase()}.html`,
        seoContent,
        meta: {
          ...shared.meta,
          description: seoContent,
          'og:description': seoContent,
          'og:title': `Can I Go There? Visa Requirements for ${adjectiveForm} Citizens`,
        },
      }
    }),
]

module.exports = pages
