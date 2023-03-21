#!/usr/bin/env node

import fs from 'fs/promises'
// why isn't this synchronous
import { existsSync } from 'fs'
import url from 'url'
import pth from 'path'
import child_process from 'child_process'

import prompts from 'prompts'
import kleur from 'kleur'
import cliSpinners from 'cli-spinners'

const dirname = url.fileURLToPath(import.meta.url + '/..')
const argv = process.argv.slice(2)

const projectName =
  argv[0] ||
  (
    await prompts(
      {
        type: 'text',
        message: 'Project name:',
        name: 'projectName'
      },
      {
        onCancel: () => {
          process.exit(0)
        }
      }
    )
  ).projectName

const templates = [
  {
    title: 'React',
    value: 'react'
  },
  {
    title: 'React + React Router',
    value: 'reactrouter'
  },
  {
    title: 'Express',
    value: 'express'
  }
]

const selected =
  argv[1] ||
  (
    await prompts(
      {
        type: 'select',
        name: 'selected',
        message: 'Choose a template...',
        choices: templates
      },
      {
        onCancel: () => {
          process.exit(0)
        }
      }
    )
  ).selected

if (!templates.find(a => a.value === selected)) {
  console.log(`${kleur.red('×')} Template ${selected} was not found.`)
  process.exit(0)
}

const src = pth.join(dirname, 'templates', selected)
const dest = pth.join(process.cwd(), projectName)

if ((await dirExists(dest)) && projectName !== '.') {
  const { overwrite } = await prompts({
    message: 'Directory exists. Overwrite?',
    type: 'confirm',
    initial: false,
    name: 'overwrite'
  })
  if (overwrite) {
    await removeDir(dest)
  } else {
    process.exit(0)
  }
}

if (projectName === '.' && (await fs.readdir(dest)).length !== 0) {
  const { overwrite } = await prompts({
    message: 'Current directory has contents. Overwrite?',
    type: 'confirm',
    initial: false,
    name: 'overwrite'
  })
  if (overwrite) {
    for (const file of await fs.readdir(dest)) {
      if (file === '.git') continue
      await fs.rm(pth.join(dest, file), { recursive: true })
    }
  } else {
    process.exit(0)
  }
}

await makeLoader('Copying files...', async () => {
  await fs.cp(src, dest, {
    recursive: true
  })
  return 'Copied files!'
})

await makeLoader('Modifying package.json...', async () => {
  await editPackage()
  return 'Modified package.json!'
})

const { install } = await prompts({
  message: 'Would you like to install dependencies?',
  type: 'confirm',
  initial: true,
  name: 'install'
})

if (install) {
  await new Promise(r => {
    const stopLoader = makeLoader('Installing dependencies...')
    const cmd = child_process.exec('npm install', {
      cwd: dest
    })
    cmd.on('exit', () => {
      stopLoader('Installed dependencies!')
      r()
    })
  })
}

console.log(`\nTo run your project, please execute ${projectName === '.' && install ? 'this command' : 'these commands'}:\n`)
console.log(`${projectName !== '.' ? `  cd ${projectName}\n` : ''}${!install ? '  npm install\n' : ''}  npm run dev\n`)

async function dirExists(path) {
  if (!existsSync(path)) return false
  if ((await fs.lstat(path)).isFile()) return false
  return true
}

async function removeDir(path) {
  return await fs.rm(path, { recursive: true })
}

async function editPackage() {
  const pkg = JSON.parse(await fs.readFile(pth.join(dest, 'package.json')))
  if (projectName === '.') {
    pkg.name = pth.parse(dest).name
  } else {
    pkg.name = projectName
  }
  await fs.writeFile(pth.join(dest, 'package.json'), JSON.stringify(pkg, null, 2))
}

function makeLoader(text, func = null) {
  let current = 0
  const loader = setInterval(() => {
    if (cliSpinners.dots.frames.length <= current) current = 0
    process.stdout.clearLine(0)
    process.stdout.cursorTo(0)
    process.stdout.write(`${cliSpinners.dots.frames[current]} ${kleur.bold(text)}`)
    current++
  }, cliSpinners.dots.interval)
  if (func) {
    return new Promise(async r => {
      const doneText = await func()
      clearInterval(loader)
      process.stdout.clearLine(0)
      process.stdout.cursorTo(0)
      console.log(`${kleur.green('√')} ${kleur.bold(doneText)}`)
      r()
    })
  } else
    return doneText => {
      clearInterval(loader)
      process.stdout.clearLine(0)
      process.stdout.cursorTo(0)
      console.log(`${kleur.green('√')} ${kleur.bold(doneText)}`)
    }
}
