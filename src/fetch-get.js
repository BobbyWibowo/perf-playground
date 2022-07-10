'use strict'

const Benchmark = require('benchmark')
const fetch = require('node-fetch')

const { program } = require('commander')

program.parse()

const hosts = {
  'hyper-express': 'http://localhost:3001',
  express: 'http://localhost:3002'
}

const paths = [
  '/',
  '/api/check',
  '/api/uploads/0',
  '/api/albums/0',
  '/api/album/get/GUb5qeQ1'
]

const fetchOpts = {
  method: 'GET',
  headers: {
    token: process.env.FETCH_TOKEN
  }
}

const suites = []

for (const path of paths) {
  const suite = new Benchmark.Suite()
  for (const hostname of Object.keys(hosts)) {
    suite.add(hostname, {
      defer: true,
      async fn (deferred) {
        await fetch(`${hosts[hostname]}${path}`, fetchOpts)
        deferred.resolve()
      }
    })
  }
  suite.on('cycle', event => console.log(String(event.target)))
  suite.on('start', event => console.log(path))
  suites.push(suite)
}

const awaitPromises = async () => {
  for (const suite of suites) {
    await new Promise(resolve => {
      suite.on('error', error => {
        console.log(error)
        resolve()
      })
      suite.on('complete', function () {
        console.log(`Fastest: ${this.filter('fastest').map('name')}\n`)
        resolve()
      })
      suite.run()
    })
  }
}

awaitPromises()
