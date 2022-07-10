'use strict'

const Benchmark = require('benchmark')
const fs = require('fs')

const { program } = require('commander')

program
  .argument('<string>', 'input json filename')

program.parse()

const input = program.args[0]
const rawdata = fs.readFileSync(input)

const data = JSON.parse(rawdata)
console.log(`Input data has ${data.length} value(s), benchmarking\u2026`)

const suite = new Benchmark.Suite()

suite
  .add('parseInt', () => {
    return data.reduce((accumulator, value) => {
      return accumulator + parseInt(value)
    }, 0)
  })
  .add('Number', () => {
    return data.reduce((accumulator, value) => {
      return accumulator + Number(value)
    }, 0)
  })
  .add('+ operator', () => {
    return data.reduce((accumulator, value) => {
      return accumulator + (+value)
    }, 0)
  })
  .add('BigInt', () => {
    return data.reduce((accumulator, value) => {
      return accumulator + BigInt(value)
    }, 0n)
  })
  .on('cycle', event => {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log(`Fastest: ${this.filter('fastest').map('name')}`)
  })
  .run({ async: false })
