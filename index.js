const fs = require('fs')

const isStream = require('is-stream')

module.exports = {
  readable (stream) {
    if (stream === 'stdin') return process.stdin
    if (typeof stream === 'string') return fs.createReadStream(stream)
    if (isStream.readable(stream)) return stream
  },

  writable (stream) {
    if (stream === 'stdout') return process.stdout
    if (stream === 'stderr') return process.stderr
    if (typeof stream === 'string') return fs.createWriteStream(stream)
    if (isStream.writable(stream)) return stream
  }
}
