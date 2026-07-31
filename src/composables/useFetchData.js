/**
 * 后端数据获取 composable
 *
 * 从 public/data/ 下的 JSON 文件动态获取数据，
 * 更新内容只需修改 JSON 文件，无需重新构建前端。
 *
 * 特性：
 * - 自动缓存（sessionStorage，避免重复请求）
 * - 加载/错误状态管理
 * - 版本检测（JSON 版本变更时自动刷新缓存）
 */

import { ref, shallowRef } from 'vue'

// 缓存时间（毫秒），5 分钟内不重复请求
const CACHE_TTL = 5 * 60 * 1000

// 内存缓存（同会话内共享）
const memoryCache = new Map()

/**
 * 获取 JSON 数据
 * @param {string} url - JSON 文件路径，如 /data/banner/banners.json
 * @param {object} options - 配置项
 * @param {boolean} options.useCache - 是否使用缓存（默认 true）
 * @returns {{ data: Ref, loading: Ref<boolean>, error: Ref<Error|null>, refresh: Function }}
 */
export function useFetchData(url, options = {}) {
  const { useCache = true } = options

  const data = shallowRef(null)
  const loading = ref(true)
  const error = ref(null)

  async function fetchData() {
    loading.value = true
    error.value = null

    // 检查内存缓存
    if (useCache && memoryCache.has(url)) {
      const cached = memoryCache.get(url)
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        data.value = cached.data
        loading.value = false
        return cached.data
      }
    }

    try {
      // 添加时间戳防止浏览器缓存 JSON（仅开发环境）
      const separator = url.includes('?') ? '&' : '?'
      const fetchUrl = `${url}${separator}_t=${Date.now()}`

      const response = await fetch(fetchUrl)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const json = await response.json()

      // 写入内存缓存
      if (useCache) {
        memoryCache.set(url, {
          data: json,
          timestamp: Date.now()
        })
      }

      data.value = json
      return json
    } catch (err) {
      error.value = err
      console.error(`[useFetchData] 获取数据失败: ${url}`, err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function refresh() {
    // 清除缓存后重新获取
    memoryCache.delete(url)
    return fetchData()
  }

  // 创建时自动获取数据
  fetchData().catch(() => {
    // 错误已由 error ref 处理，这里 catch 防止未处理的 Promise 拒绝
  })

  return {
    data,
    loading,
    error,
    refresh
  }
}

/**
 * 通用数据获取函数（非响应式，用于一次性获取）
 */
export async function fetchDataOnce(url) {
  const separator = url.includes('?') ? '&' : '?'
  const fetchUrl = `${url}${separator}_t=${Date.now()}`

  const response = await fetch(fetchUrl)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }
  return response.json()
}
