const type = (str = '', el) => {
  const prop = el.tagName === 'INPUT' ? 'value' : 'textContent'

  return new Promise(resolve => {
    var left = str
  
    const interval = setInterval(() => {
      if (left.length === 0) {
        clearInterval(interval)
        resolve()
        return
      }
  
      el[prop] += left[0] 
      left = left.substr(1)
    }, 80)
  })
}

export default type