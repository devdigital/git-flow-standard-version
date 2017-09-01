const getStandardVersion = require('./scripts/standard-version-utils')
  .getStandardVersion

module.exports = {
  scripts: {
    'get-standard-version': getStandardVersion(),
  },
}
