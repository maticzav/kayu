const fs = require('fs')
const path = require('path')

const chalk = require('chalk')
const execa = require('execa')

/* Publish checks */

if (!process.env.NPM_TOKEN) {
  throw new Error(`No NPM_TOKEN!`)
}

/* Constants */

const PACKAGES_DIR = path.resolve(__dirname, '../packages')

/* Find all packages */

const packages = fs
  .readdirSync(PACKAGES_DIR)
  .map((file) => path.resolve(PACKAGES_DIR, file))
  .filter((f) => fs.lstatSync(path.resolve(f)).isDirectory())
  .filter((p) => fs.existsSync(path.resolve(p, 'package.json')))
  .filter((p) => !require(path.resolve(p, 'package.json')).private)

/* Publish packages */

console.log(`${chalk.reset.inverse.bold.cyan(' PUBLISHING ')}`)

for (const package of packages) {
  console.log(` - ${package}`)

  try {
    // First, create .npmrc file.
    const npmrcPath = path.resolve(package, './.npmrc')
    const npmrc = `//registry.npmjs.org/:_authToken=${process.env.NPM_TOKEN}`

    fs.writeFileSync(npmrcPath, npmrc)
    console.log(`Created .npmrc in ${npmrcPath}...`)

    // Publish using Yarn NPM publish.
    execa.sync(
      'yarn',
      ['npm', 'publish', '--tolerate-republish', ...process.argv.slice(2)],
      { cwd: package, stdio: 'inherit' },
    )

    process.stdout.write(`${chalk.reset.bold.green(' DONE ')}\n`)
  } catch (e) {
    process.stdout.write('\n')
    console.error(chalk.inverse.red(`Unable to publish package ${package}`))
    console.error(e.stack)
    process.exitCode = 1
  }
}
