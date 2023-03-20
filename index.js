#!/usr/bin/env node

import fs from 'fs'
import url from 'url'
import pth from 'path'

import prompts from 'prompts'
import minimist from 'minimist'
import kleur from 'kleur'

const dirname = url.fileURLToPath(import.meta.url + '/..')
const argv = minimist(process.argv.slice(2))

const projectName =
  argv._[0] ||
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
  argv._[1] ||
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

if (dirExists(dest) && argv._[0] !== '.') {
  const { overwrite } = await prompts({
    message: 'Directory exists. Overwrite?',
    type: 'confirm',
    initial: false,
    name: 'overwrite'
  })
  if (overwrite) {
    removeDir(dest)
  } else {
    process.exit(0)
  }
}

if (argv._[0] === '.' && fs.readdirSync(dest).length !== 0) {
  const { overwrite } = await prompts({
    message: 'Current directory has contents. Overwrite?',
    type: 'confirm',
    initial: false,
    name: 'overwrite'
  })
  if (overwrite) {
    for (const file of fs.readdirSync(dest)) {
      if (file === '.git') continue
      fs.rmSync(pth.join(dest, file), { recursive: true })
    }
  } else {
    process.exit(0)
  }
}

fs.cpSync(src, dest, {
  recursive: true
})

editPackage()

console.log(`${kleur.green('√')} Done!`)
console.log('To run your project, please execute these commands:\n')
console.log(`  cd ${projectName}\n  npm install\n  npm run dev\n`)

function dirExists(path) {
  if (!fs.existsSync(path)) return false
  if (fs.lstatSync(path).isFile()) return false
  return true
}

function removeDir(path) {
  return fs.rmSync(path, { recursive: true })
}

function editPackage() {
  const pkg = JSON.parse(fs.readFileSync(pth.join(dest, 'package.json')))
  if (projectName === '.') {
    pkg.name = pth.parse(dest).name
  } else {
    pkg.name = projectName
  }
  fs.writeFileSync(pth.join(dest, 'package.json'), JSON.stringify(pkg, null, 2))
}
