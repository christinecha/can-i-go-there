
const getRequirements = (country) => {
  return import(
    /* webpackChunkName: "[request]" */ 
    `../../../data/visa-requirements/${country.code}.json`
  ).then(module => {
    return module.default
  })
}

export default getRequirements

