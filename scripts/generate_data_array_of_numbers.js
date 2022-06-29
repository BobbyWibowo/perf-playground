'use strict'

const fs = require('fs')
// const util = require('util')

const { program } = require('commander')

program
  .argument('<string>', 'output json filename')
  .option('-c, --count <number>', 'amount of data to generate')
  .option('--min <number>', 'minimum number')
  .option('--max <number>', 'maximum number')
  .option('-n, --negative', 'include negative numbers (if --min is unset)')
  .option('-s, --string', 'cast number to string')

program.parse()

const options = program.opts()
const count = options.count || 100
const min = options.min || (options.negative
  ? Number.MIN_SAFE_INTEGER
  : 0)
const max = options.max || Number.MAX_SAFE_INTEGER

const data = []
for (let i = 0; i < count; i++) {
  const num = Math.floor(Math.random() * (max - min + 1) + min)
  data.push(options.string ? String(num) : num)
}

const output = program.args[0]
fs.writeFileSync(output, JSON.stringify(data))
console.log(`Successfully written random data into ${output}.`)
