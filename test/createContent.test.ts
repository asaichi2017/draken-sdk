import { describe, expect, test, vi } from 'vitest'
import fs from 'fs'
import path from 'path'
import draken from '../src/sdk'

// DBをいじるのでこのテストを実行したい時はskipをonlyに変える
describe.skip('create content', () => {
  test('正常系', async () => {
    const onProgress = vi.fn((total, loaded) => {
      // console.log(total, loaded)
    })
    const file = fs.readFileSync(path.join(__dirname, 'test.mp4'))
    draken.configure({ endpoint: import.meta.env.VITE_ENDPOINT, adminToken: () => import.meta.env.VITE_ADMIN_TOKEN })
    const result = await draken.create(
      {
        name: 'テスト',
        quality: 'default',
        description: 'テスト説明文',
        privacy: 'private',
        fromTime: new Date().toISOString(),
        toTime: new Date().toISOString(),
      },
      file,
      onProgress as any,
    )
    expect(result.data.name).toEqual('テスト')
    // Bufferだと呼ばれない？
    // expect(onProgress).toHaveBeenCalled()
  })
})
