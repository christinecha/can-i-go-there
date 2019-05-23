const countriesJSON = require('../../shared/countries.json')

module.exports = [
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