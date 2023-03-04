import {expect, test} from '@oclif/test'

describe('run', () => {
  test
  .stdout()
  .command(['help'])
  .it('run help cmd', ctx => {
    expect(ctx.stdout).to.contain('Run report')
  })
})
