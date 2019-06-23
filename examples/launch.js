const { readdirSync, statSync } = require('fs')
const { fork } = require('child_process')
const { prompt } = require('inquirer')

const examples = readdirSync('examples').filter(
  i =>
    !i.startsWith('.') &&
    statSync(`${process.cwd()}/examples/${i}`).isDirectory(),
)

async function launch() {
  const { target } = await prompt([
    {
      name: 'target',
      message: 'Select a example',
      type: 'list',
      choices: examples,
    },
  ])

  // const { command } = await prompt([
  //   {
  //     name: 'command',
  //     message: 'Select a command',
  //     type: 'list',
  //     choices: [
  //       'dev',
  //       'view-info',
  //     ]
  //   }
  // ])

  fork(
    require.resolve('vuepress/cli.js'),
    [
      process.argv[2],
      `${process.cwd()}/examples/${target}`,
      '--temp',
      `examples/${target}/.temp`,
      ...process.argv.slice(3),
    ],
    { stdio: 'inherit' },
  )
}

launch()
