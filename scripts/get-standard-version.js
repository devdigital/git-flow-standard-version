const intercept = require('intercept-stdout')
const standardVersion = require('standard-version')

const getStandardVersion = () => {
  return new Promise((resolve, reject) => {
    const messages = []

    const unhook = intercept(message => {
      messages.push(message)
    })

    standardVersion({
      dryRun: true,
    }).then(err => {
      if (err) {
        reject('There was an error')
        return
      }

      unhook()

      resolve('1.0.0')
    })
  })
}

getStandardVersion()
  .then(version => console.log(version))
  .catch(error => console.log(error))
