// 后台脚本：模拟 obr-suite 的状态显示方式
OBR.onReady(() => {
  console.log('✅ 后台脚本已启动（obr-suite 模式）');

  // 获取画布的父容器（用于放置 HTML 标签）
  const canvas = document.querySelector('canvas');
  if (!canvas) {
    console.error('❌ 找不到 canvas 元素');
    return;
  }
  const container = canvas.parentElement;
  if (!container) {
    console.error('❌ 找不到 canvas 父容器');
    return;
  }

  // 存储当前活跃的覆盖层元素，key 为 "tokenId:labelId"
  const overlayElements = new Map();

  // 颜色配置
  const COLORS = {
    tag: '#FF9800',
    status: '#8BC34A',
    power: '#9C27B0'
  };

  // 获取标注文本（与面板保持一致）
  function getLabelText(type, data) {
    if (type === 'tag') return data.text;
    if (type === 'power') return `${data.name}-${data.level}`;
    if (type === 'status') {
      const levels = data.levels.slice().sort((a, b) => a - b);
      if (levels.length === 0) return data.name;
      const highest = levels[levels.length - 1];
      const lower = levels.slice(0, -1).join('');
      let text = `${data.name}-`;
      if (lower) text += `${lower}`;
      text += `${highest}`; // 简单显示，后续可优化大小字
      return text;
    }
    return '';
  }

  // 计算标签相对于 token 的位置（自动排列，避免重叠）
  function getLabelPosition(index, total, tokenWidth, tokenHeight) {
    // 全部放在 token 右侧，垂直错开
    const startY = -tokenHeight / 2 + 10;
    const step = 25; // 每个标签的高度间距
    return {
      x: tokenWidth / 2 + 15,
      y: startY + index * step
    };
  }

  // 更新所有活跃覆盖层
  async function updateOverlays() {
    try {
      // 获取所有 token（角色和坐骑）
      const items = await OBR.scene.items.getItems();
      const tokens = items.filter(item => item.layer === 'CHARACTER' || item.layer === 'MOUNT');

      // 获取当前视口信息，用于坐标转换
      const viewport = await OBR.scene.viewport.get();

      // 遍历每个 token，检查其 metadata 中是否有我们的标注
      for (const token of tokens) {
        const labels = token.metadata?.['com.cptyuan.token-labels'];
        if (!labels) continue;

        const tokenId = token.id;
        const worldX = token.position.x;
        const worldY = token.position.y;
        const tokenWidth = token.size.width;
        const tokenHeight = token.size.height;

        // 转换到屏幕坐标
        const screenX = (worldX - viewport.offset.x) * viewport.scale + viewport.width / 2;
        const screenY = (worldY - viewport.offset.y) * viewport.scale + viewport.height / 2;
        const screenW = tokenWidth * viewport.scale;
        const screenH = tokenHeight * viewport.scale;

        // 收集该 token 上所有可见的标注
        const visibleItems = [];
        if (labels.tags) {
          labels.tags.forEach(tag => {
            if (tag.visible) visibleItems.push({ type: 'tag', data: tag, id: tag.id });
          });
        }
        if (labels.statuses) {
          labels.statuses.forEach(status => {
            if (status.visible) visibleItems.push({ type: 'status', data: status, id: status.id });
          });
        }
        if (labels.powers) {
          labels.powers.forEach(power => {
            if (power.visible) visibleItems.push({ type: 'power', data: power, id: power.id });
          });
        }

        // 为该 token 创建/更新覆盖层
        for (let i = 0; i < visibleItems.length; i++) {
          const item = visibleItems[i];
          const key = `${tokenId}:${item.id}`;
          let div = overlayElements.get(key);

          if (!div) {
            // 创建新的 div
            div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.zIndex = '1000';
            div.style.padding = '2px 6px';
            div.style.borderRadius = '4px';
            div.style.fontSize = '14px';
            div.style.fontWeight = 'normal';
            div.style.color = '#000';
            div.style.whiteSpace = 'nowrap';
            div.style.pointerEvents = 'none'; // 避免遮挡交互
            container.appendChild(div);
            overlayElements.set(key, div);
          }

          // 更新样式和内容
          div.style.backgroundColor = COLORS[item.type];
          div.textContent = getLabelText(item.type, item.data);

          // 计算位置并应用
          const pos = getLabelPosition(i, visibleItems.length, screenW, screenH);
          div.style.left = (screenX + pos.x) + 'px';
          div.style.top = (screenY + pos.y) + 'px';
        }
      }

      // 删除不再需要的覆盖层（token 被删除或标注被移除/隐藏）
      const currentKeys = new Set();
      for (const token of tokens) {
        const labels = token.metadata?.['com.cptyuan.token-labels'];
        if (!labels) continue;
        // 收集当前所有可见标注的 key
        const visibleItems = [];
        if (labels.tags) {
          labels.tags.forEach(tag => {
            if (tag.visible) visibleItems.push({ id: tag.id });
          });
        }
        if (labels.statuses) {
          labels.statuses.forEach(status => {
            if (status.visible) visibleItems.push({ id: status.id });
          });
        }
        if (labels.powers) {
          labels.powers.forEach(power => {
            if (power.visible) visibleItems.push({ id: power.id });
          });
        }
        for (const item of visibleItems) {
          currentKeys.add(`${token.id}:${item.id}`);
        }
      }

      // 移除过期元素
      for (const [key, div] of overlayElements.entries()) {
        if (!currentKeys.has(key)) {
          div.remove();
          overlayElements.delete(key);
        }
      }
    } catch (error) {
      console.error('更新覆盖层失败:', error);
    }
  }

  // 启动定时器，每 200ms 刷新一次显示（obr-suite 也使用类似的轮询机制）
  setInterval(updateOverlays, 200);
  console.log('✅ 覆盖层刷新定时器已启动');
});
