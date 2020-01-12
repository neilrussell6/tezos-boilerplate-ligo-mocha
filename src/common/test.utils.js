const Bluebird = require('bluebird')
const exec = Bluebird.promisify(require("child_process").exec)

const contractCompile = (path) => () => {
  const _path = `src/contracts/${path}`
  const ligoPath = `${_path}.ligo`
  // const tzPath = `${_path}.tz`
  const entrypoint = 'main'
  const command = `ligo compile-contract "${ligoPath}" "${entrypoint}" --michelson-format="text"`
  return exec(command)
}

const contractCall = (path, storage) => (param, options) => {
  const _path = `src/contracts/${path}`
  const ligoPath = `${_path}.ligo`
  const entrypoint = 'main'
  const _options = `--sender ${options.sender} --amount ${options.amount} --format=dev`
  const command = `ligo dry-run ${ligoPath} ${entrypoint} '${param}' '${storage}' ${_options}`
  return exec(command)
    .then(x => x.replace(/\r?\n|\r/g, ''))
}

const contract = (...config) => ({
  compile: contractCompile(...config),
  call: contractCall(...config),
})

module.exports.contract = contract
