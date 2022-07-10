'use strict'

const Benchmark = require('benchmark')
const fetch = require('node-fetch')
const fs = require('fs')
const FormData = require('form-data')
const path = require('path')

const { program } = require('commander')

program
  .argument('<file>', 'path to file that will be uploaded')

program.parse()

const input = program.args[0]
const file = fs.readFileSync(input)

const hosts = {
  'hyper-express': 'http://localhost:3001',
  express: 'http://localhost:3002'
}

const suite = new Benchmark.Suite()

for (const hostname of Object.keys(hosts)) {
  suite.add(hostname, {
    defer: true,
    async fn (deferred) {
      // Generate FormData (this can only be used once, so we always re-generate)
      const form = new FormData()
      form.append('files[]', file, { filename: path.basename(input) })

      // Upload file
      const upload = await fetch(`${hosts[hostname]}/api/upload`,
        {
          method: 'POST',
          headers: {
            token: process.env.FETCH_TOKEN
          },
          body: form
        }
      ).then(res => res.json())

      // Delete file by name
      await fetch(`${hosts[hostname]}/api/upload/bulkdelete`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            token: process.env.FETCH_TOKEN
          },
          body: JSON.stringify({
            field: 'name',
            values: [upload.files[0].name]
          })
        }
      )

      deferred.resolve()
    }
  })
}

suite.on('cycle', event => console.log(String(event.target)))
suite.on('error', console.error)
suite.on('complete', function () {
  console.log(`Fastest: ${this.filter('fastest').map('name')}\n`)
})

suite.run({ async: false })
