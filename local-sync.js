/* local-sync.js — 纯本地版同步层（空转）
 * 公开版不含云端同步：所有云端接口以空实现代替，保证主程序无感运行。
 * 数据只存浏览器本地（localStorage + IndexedDB），可用「备份」功能导出/导入 JSON 迁移。
 */
(function () {
  function noop() {}
  function setStatus() {}
  function syncFromCloud() {
    if (typeof updateSyncStatus === 'function') updateSyncStatus('off', '本地存储');
    return Promise.resolve();
  }
  window.pushCloud = noop;
  window.syncFromCloud = syncFromCloud;
  window.refreshSync = syncFromCloud;
  window.markDeleted = noop;
  window.unmarkDeleted = noop;
  window.clearSpaceName = noop;
  window.getOwnerId = function () { return null; };
})();
