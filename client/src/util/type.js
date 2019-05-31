const type = (str = '', el) => {
  const prop = el.tagName === 'INPUT' ? 'value' : 'textContent'

  return new Promise(resolve => {
    var original = el[prop].toLowerCase()
    var left = str.toLowerCase()
  
    const interval = setInterval(() => {
      if (left.length === 0) {
        clearInterval(interval)
        resolve()
        return
      }

      if (original && left.indexOf(original) !== 0) {
        original = original.substr(0,original.length - 1)
        el[prop] = original
        return
      }

      if (original && left.indexOf(original) === 0) {
        const newLeft = left.substr(original.length)
        original = ''
        el[prop] += newLeft[0]
        left = newLeft.substr(1)
        return
      }
  
      el[prop] += left[0] 
      left = left.substr(1)
    }, 80)
  })
}

export default type