/**
 * 进程执行工具模块
 * 提供异步执行 shell 命令的功能
 */

import { spawn } from 'child_process'
import consola from 'consola'
import { projRoot } from '@vue-table-touch-scroll/build-utils'

/**
 * 异步执行 shell 命令
 * @param command - 要执行的命令字符串（包含命令和参数）
 * @param cwd - 命令执行的工作目录，默认为项目根目录
 * @returns Promise<void> - 命令成功执行时 resolve，失败时 reject
 *
 * 功能说明：
 * - 使用 child_process.spawn 执行命令
 * - 继承父进程的标准输入输出 (stdio: 'inherit')
 * - 在 Windows 平台使用 shell 模式执行
 * - 输出命令执行信息到控制台
 * - 监听进程退出事件，确保子进程正确清理
 * - 命令执行失败时抛出包含错误码的异常
 *
 * 使用位置：
 * - internal/build/src/utils/gulp.ts (runTask 函数)
 * - internal/build/src/tasks/types-definitions.ts (generateTypesDefinitions 函数)
 * - internal/build/gulpfile.ts (clean 任务)
 * 导出状态：已使用
 */
export const run = async (command: string, cwd: string = projRoot) =>
  new Promise<void>((resolve, reject) => {
    const [cmd, ...args] = command.split(' ')
    consola.info(`run: ${cmd} ${args.join(' ')}`)
    const app = spawn(cmd, args, {
      cwd,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    })

    const onProcessExit = () => app.kill('SIGHUP')

    app.on('close', (code) => {
      process.removeListener('exit', onProcessExit)

      if (code === 0) resolve()
      else
        reject(
          new Error(`Command failed. \n Command: ${command} \n Code: ${code}`)
        )
    })
    process.on('exit', onProcessExit)
  })
