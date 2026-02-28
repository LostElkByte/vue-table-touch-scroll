/**
 * 构建工具模块入口文件
 * 统一导出所有构建相关的工具函数和常量
 *
 * 使用位置：
 * - internal/build/src/build-info.ts
 * - internal/build/src/tasks/types-definitions.ts
 * - internal/build/src/utils/gulp.ts
 * - internal/build/src/utils/process.ts
 * - internal/build/src/utils/rollup.ts
 * - internal/build/gulpfile.ts
 * - scripts/gen-version.ts
 * - scripts/update-version.ts
 * 导出状态：已使用
 */

export * from './fs'
export * from './log'
export * from './paths'
export * from './pkg'
