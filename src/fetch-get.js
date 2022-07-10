'use strict'

const Benchmark = require('benchmark')
const fetch = require('node-fetch')

const { program } = require('commander')

program.parse()

const suite = new Benchmark.Suite()

suite
  .add('fetch:get', {
    defer: true,
    async fn (deferred) {
      await fetch('http://localhost:3001/api/album/get/GUb5qeQ1')
      deferred.resolve()
    }
  })
  .add('fetch:getpromise', {
    defer: true,
    async fn (deferred) {
      await fetch('http://localhost:3001/api/album/getpromise/GUb5qeQ1')
      deferred.resolve()
    }
  })
  .on('cycle', event => {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log(`Fastest: ${this.filter('fastest').map('name')}`)
  })
  .run()
