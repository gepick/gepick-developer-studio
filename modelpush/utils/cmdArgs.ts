import stdio from 'stdio'

interface Args {
  modelDir?: string
}

const ops: Args | null = stdio.getopt({
  modelDir: { key: 'd', args: 1, description: 'gepick prediction model directory' },
})

export default ops
