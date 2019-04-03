const { readFileSync, createReadStream, unlinkSync } = require('fs')
const { Readable, Writable } = require('stream')

const concat = require('concat-stream')
const tap = require('tap')

const { readable, writable } = require('./')

function readSync (file) {
  return readFileSync(file).toString()
}

tap.test('readable', t => {
  t.test('already a stream', t => {
    const read = new Readable()
    const write = new Writable()
    t.equal(readable(read), read, 'passthrough when already a readable stream')
    t.notOk(readable(write), 'should not passthrough non-readable streams')
    t.end()
  })

  t.test('support named input pipes', t => {
    t.equal(readable('stdin'), process.stdin, 'maps stdin')
    t.end()
  })

  t.test('support file paths', t => {
    readable(__filename).pipe(concat(result => {
      t.equal(result.toString(), readSync(__filename), 'maps strings other than named pipes to files')
      t.end()
    }))
  })

  t.end()
})

tap.test('writable', t => {
  t.test('already a stream', t => {
    const read = new Readable()
    const write = new Writable()
    t.equal(writable(write), write, 'passthrough when already a writable stream')
    t.notOk(writable(read), 'should not passthrough non-writable streams')
    t.end()
  })

  t.test('support named input pipes', t => {
    t.equal(writable('stdout'), process.stdout, 'maps stdout')
    t.equal(writable('stderr'), process.stderr, 'maps stderr')
    t.end()
  })

  t.test('support file paths', t => {
    const stream = writable(`${__filename}.backup`)
    t.on('end', () => unlinkSync(`${__filename}.backup`))

    createReadStream(__filename).pipe(stream).on('close', () => {
      t.equal(readSync(`${__filename}.backup`), readSync(__filename), 'maps strings other than named pipes to files')
      t.end()
    })
  })

  t.end()
})
