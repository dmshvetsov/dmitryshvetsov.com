const classLister = (styleObject: Record<string, unknown>) =>
  (...classList: string[]): string =>
    classList.reduce((list, myClass) => {
      let output = list
      if (styleObject[myClass]) {
        if (list) output += ' ' // appends a space if list is not empty
        output += styleObject[myClass]
      }
      console.log(output)
      return output
   }, '')

 export default classLister
