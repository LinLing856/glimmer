/* ============================================================
 * app-lang.js — 微光集 中英双语切换层（外挂式，不改主逻辑）
 * 原理：
 *   - 维护一张「中文 → 英文」文案字典（覆盖全部界面文字）
 *   - 切到英文时遍历 DOM 翻译文本节点 + placeholder/title 属性
 *   - MutationObserver 监听动态渲染的内容（时间线卡片、提示气泡等）自动翻译
 *   - 切回中文时恢复原始文本（原文缓存在 WeakMap 里）
 *   - 日期格式 EN 模式下改为 Jun 15, 2000 风格（覆写 formatDate）
 *   - 你记录的事件内容（标题/描述/感言）不翻译，保持原样
 * ============================================================ */
(function () {
  var LANG_KEY = 'lt_lang_v1';
  var lang = 'zh';
  try { lang = localStorage.getItem(LANG_KEY) || 'zh'; } catch (e) {}

  var DICT = {
    // 品牌
    '微光集': 'Glimmer',
    // 头部 / 副标题
    '记录人生每一个值得铭记的瞬间': 'Record every moment worth remembering',
    '记录每一个瞬间': 'Record every moment',
    '开始使用': 'Get Started',
    // 主按钮 / 菜单
    '捕捉微光': 'Capture a Glimmer',
    '播放': 'Play',
    '导出视频': 'Export Video',
    '播放设置': 'Playback Settings',
    '退出播放': 'Exit Playback',
    '更多': 'More',
    '导出': 'Export',
    '导入': 'Import',
    '备份与恢复（换机迁移）': 'Backup & Restore (migration)',
    '备份与恢复': 'Backup & Restore',
    '备份': 'Backup',
    '刷新同步': 'Refresh Sync',
    '立即从云端刷新同步': 'Refresh from cloud now',
    '复制空间名，去另一台设备切换为相同名字即可同步': 'Copy the space name; switch to the same name on another device to sync',
    '复制空间名': 'Copy Space Name',
    '退出并切换空间（重新登录）': 'Sign out & switch space',
    '切换空间': 'Switch Space',
    '空间名：': 'Space: ',
    '空间名（请手动记下）：': 'Space name (please note it down): ',
    '已复制空间名：': 'Copied space name: ',
    '设置同步空间': 'Set sync space',
    '同步中': 'Syncing…',
    '已同步': 'Synced',
    '未设置': 'Not set',
    // 空间弹窗
    '给这个空间起个名字（这是你的私人空间）。': 'Name this space (it is your private space). ',
    '和网页填同一个名字，数据就能互通': ' and the web to sync data',
    '用不同名字即可数据隔离。可点': ' Use different names to keep data separate. Tap ',
    '把名字带到另一台设备。': ' to carry the name to another device.',
    '留空将自动生成随机空间名': 'Leave empty to auto-generate a random space name',
    '适合单设备使用）。': ' suitable for single device).',
    '在另一台设备点': 'On another device, tap ',
    '并输入相同名字，即可互通数据。': ' and enter the same name to sync data.',
    '例如：我的微光集': 'e.g. My Glimmer',
    '喜欢的角色名': 'a favorite character name',
    // 时间线
    '比如：我的时间线': 'e.g. My Timeline',
    '比如：考入理想大学': 'e.g. Got into my dream university',
    '小明的时间轴': 'Xiao Ming\u2019s Timeline',
    '请输入时间线名称': 'Please enter a timeline name',
    '编辑名称和图标': 'Edit name & icon',
    '编辑时间线': 'Edit Timeline',
    '编辑人生大事': 'Edit Life Moment',
    '新建时间线': 'New Timeline',
    '管理时间线': 'Manage Timelines',
    '时间线管理': 'Timeline Manager',
    '切换到此时间线': 'Switch to this timeline',
    '切换到': 'Switch to ',
    '至少保留一条时间线': 'At least one timeline must remain',
    '我的时间线': 'My Timeline',
    '全部时间线': 'All Timelines',
    '当前时间线数据将被替换。': 'Current timeline data will be replaced.',
    // 备份 / 恢复
    '恢复将替换当前全部数据，确定继续？': 'Restoring will replace ALL data. Continue?',
    '这是完整备份：包含': 'This is a full backup containing ',
    '当前时间线暂无数据可导出': 'No data on this timeline to export',
    '当前时间线还没有微光，先捕捉几缕吧': 'No glimmers on this timeline yet — capture a few!',
    '还没有微光': 'No glimmers yet',
    '捕捉第一缕微光': 'Capture your first glimmer',
    '开始捕捉微光吧': 'Start capturing glimmers',
    '按钮，记录第一个精彩瞬间': ' button to record your first moment',
    '点击': 'Tap the ',
    '请选择日期': 'Please pick a date',
    '请粘贴备份文本：': 'Please paste backup text: ',
    '剪贴板是空的': 'Clipboard is empty',
    '无法读取剪贴板，请用': 'Cannot read clipboard; use ',
    '当前浏览器不支持屏幕录制导出': 'This browser does not support screen-recording export',
    '已开始录制，播放结束或停止共享后自动保存': 'Recording started — saves automatically when playback ends or sharing stops',
    '录制中': 'Recording…',
    '录制取消': 'Recording cancelled',
    '视频已导出': 'Video exported',
    '世界很大，等你探索。': 'The world is vast, waiting for you to explore.',
    '岁月长如线，天地阔似笺。': 'Years long as a thread, the world wide as a page.',
    '无有效数据': 'No valid data',
    '格式错误': 'Invalid format',
    '导入失败：': 'Import failed: ',
    '导出失败：': 'Export failed: ',
    '备份失败：': 'Backup failed: ',
    '备份已保存': 'Backup saved',
    '备份文件已下载，请妥善保存': 'Backup file downloaded — keep it safe',
    '备份文本已复制，粘贴到微信收藏': 'Backup text copied — paste it into WeChat Favorites',
    '备忘录保存': 'save to Notes',
    '备忘录': 'Notes',
    '复制后粘贴到微信收藏': 'copy and paste into WeChat Favorites',
    '可存网盘': 'or a cloud drive',
    '备份包含': 'The backup contains ',
    '备份文件': ' backup file',
    '下载备份文件': 'Download backup file',
    '从剪贴板恢复': 'Restore from clipboard',
    '从文件恢复': 'Restore from file',
    '选择之前保存的': 'select a previously saved ',
    '粘贴之前复制的备份文本': 'paste the previously copied backup text',
    // 表单
    '标题': 'Title',
    '描述': 'Description',
    '详细描述这件大事': 'Describe this moment in detail',
    '当时的心情或感悟': 'Feelings or reflections at the time',
    '日期精度': 'Date Precision',
    '日期': 'Date',
    '分类': 'Category',
    '心情感言': 'Mood & Reflections',
    '名称': 'Name',
    '头像图标': 'Avatar icon',
    '表情图标': 'Emoji icon',
    '保存为': 'Save as ',
    '保存': 'Save',
    '取消': 'Cancel',
    '关闭': 'Close',
    '完成': 'Done',
    '编辑': 'Edit',
    '删除': 'Delete',
    // PWA 安装引导
    '添加到主屏幕': 'Add to Home Screen',
    '点浏览器菜单': 'open your browser menu',
    '手机': 'phone',
    '电脑': 'computer',
    '即可像': ' to use it like ',
    '一样使用': ' an app',
    '可安装 App 支持）': 'installable app support)',
    '换手机': 'Switch phones',
    '清缓存后一键恢复，数据不丢失。': 'One-tap restore after clearing cache — no data loss.',
    '想把它变成': 'want to turn it into ',
    // 播放设置
    '显示图标': 'Show icons',
    '显示日期': 'Show dates',
    '显示大标题': 'Show titles',
    '显示描述文字': 'Show descriptions',
    '显示分类标签': 'Show category tags',
    '显示心情感言': 'Show mood & reflections',
    // 计数
    '件大事': ' major moments',
    '条大事': ' major moments',
    '条时间线': ' timelines',
    '条记录到': ' records into ',
    '条记录': ' records',
    '当前）': ' (current)',
    // 结果提示
    '已创建': ' created',
    '已删除': 'Deleted',
    '已导入': 'Imported',
    '已导出': 'Exported',
    '已恢复': 'Restored',
    '已更新': 'Updated',
    '已添加': 'Added',
    // 分类
    '其他': 'Other',
    '事业': 'Career',
    '学业': 'Study',
    '健康': 'Health',
    '家庭': 'Family',
    '旅行': 'Travel',
    '成就': 'Achievement',
    // 主题
    '清新': 'Fresh',
    '可爱': 'Cute',
    '酷炫': 'Cool',
    '帅气': 'Sleek',
    '暗黑': 'Dark',
    '温暖': 'Warm',
    '优雅': 'Elegant',
    // 日期精度按钮
    '日': 'Day',
    '月': 'Month',
    '年': 'Year'
  };
  var KEYS = Object.keys(DICT).sort(function (a, b) { return b.length - a.length; });

  function t(s) {
    if (!s) return s;
    var out = s;
    for (var i = 0; i < KEYS.length; i++) {
      var k = KEYS[i];
      if (out.indexOf(k) !== -1) out = out.split(k).join(DICT[k]);
    }
    return out;
  }

  var origText = new WeakMap();   // 文本节点 -> 原文
  var origAttr = new WeakMap();  // 元素 -> {attr: 原值}

  function trTextNode(n) {
    if (!n || !n.nodeValue || !n.nodeValue.trim()) return;
    if (!origText.has(n)) origText.set(n, n.nodeValue);
    var orig = origText.get(n);
    var nv = (lang === 'en') ? t(orig) : orig;
    // 关键：内容没变就不要写入——写入相同值也会触发 MutationObserver，
    // 无条件写会造成「观察→写→再观察」死循环，把页面冻死
    if (n.nodeValue !== nv) n.nodeValue = nv;
  }
  function trEl(el) {
    if (!el || !el.hasAttribute) return;
    ['placeholder', 'title', 'aria-label'].forEach(function (a) {
      if (el.hasAttribute(a)) {
        var o = origAttr.get(el);
        if (!o) { o = {}; origAttr.set(el, o); }
        if (!(a in o)) o[a] = el.getAttribute(a);
        el.setAttribute(a, (lang === 'en') ? t(o[a]) : o[a]);
      }
    });
  }
  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) { trTextNode(root); return; }
    if (root.nodeType !== 1) return;
    trEl(root);
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = w.nextNode())) trTextNode(n);
    var els = root.querySelectorAll('*');
    for (var i = 0; i < els.length; i++) trEl(els[i]);
  }

  var applying = false;
  var mo = new MutationObserver(function (muts) {
    if (applying) return;
    for (var i = 0; i < muts.length; i++) {
      var m = muts[i];
      if (m.type === 'characterData') { trTextNode(m.target); continue; }
      for (var j = 0; j < m.addedNodes.length; j++) walk(m.addedNodes[j]);
    }
  });
  mo.observe(document.documentElement, { childList: true, subtree: true, characterData: true });

  function apply() {
    walk(document.body);
  }

  // 语言切换按钮：放在头部操作区（打开即可见）；找不到头部结构时兜底注入「更多」菜单
  function toggleLang() {
    lang = (lang === 'zh') ? 'en' : 'zh';
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    apply();
    var lbl = document.getElementById('lang-label');
    if (lbl) lbl.textContent = (lang === 'zh') ? 'EN' : '中';
    if (typeof showToast === 'function') showToast(lang === 'zh' ? '已切换为中文' : 'Switched to English');
  }

  function injectToggle() {
    if (document.getElementById('btn-lang')) return;
    var html = '<span class="btn-icon">🌐</span><span id="lang-label">' + (lang === 'zh' ? 'EN' : '中') + '</span>';

    // 1) 首选：头部操作区，插在「捕捉微光」主按钮之前
    var actions = document.querySelector('.header-actions');
    var anchor = document.getElementById('btn-add');
    if (actions && anchor) {
      var hb = document.createElement('button');
      hb.className = 'btn btn-ghost';
      hb.id = 'btn-lang';
      hb.title = '切换语言 / Switch language';
      hb.innerHTML = html;
      hb.onclick = toggleLang;
      actions.insertBefore(hb, anchor);
      return;
    }
    // 2) 兜底：注入「更多」菜单
    var menu = document.getElementById('more-dropdown');
    if (!menu) return;
    var b = document.createElement('button');
    b.className = 'btn btn-ghost dropdown-item';
    b.id = 'btn-lang';
    b.innerHTML = '<span class="btn-icon">🌐</span><span id="lang-label">' + (lang === 'zh' ? 'English' : '中文') + '</span>';
    b.onclick = toggleLang;
    menu.appendChild(b);
  }

  // EN 模式日期格式：Jun 15, 2000
  if (typeof window.formatDate === 'function') {
    var origFormatDate = window.formatDate;
    var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    window.formatDate = function (dateStr, precision) {
      if (lang !== 'en') return origFormatDate(dateStr, precision);
      if (!dateStr) return '';
      var d = new Date(dateStr);
      if (isNaN(d.getTime())) return '';
      var y = d.getFullYear(), m = d.getMonth(), day = d.getDate();
      if (precision === 'year') return String(y);
      if (precision === 'month') return MON[m] + ' ' + y;
      return MON[m] + ' ' + day + ', ' + y;
    };
  }

  injectToggle();
  apply();
})();
