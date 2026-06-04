// 后台服务：持续同步标注数据到 token 上的文本标签
OBR.onReady(() => {
  console.log('✅ 后台服务已启动');

  // 存储已创建的标签 ID，key 为 "tokenId:labelId"
  const createdLabels = new Map();

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
      text += `${highest}`;
      return text;
    }
    return '';
  }

  // 核心同步函数
  async function syncLabels() {
    try {
      // 获取所有角色和坐骑 token
      const items = await OBR.scene.items.getItems();
      const tokens = items.filter(item => item.layer === 'CHARACTER' || item.layer === 'MOUNT');

      // 记录本次同步过程中需要保留的标签 key
      const currentKeys = new Set();

      for (const token of tokens) {
        const labels = token.metadata?.['com.cptyuan.token-labels'];
        if (!labels) continue;

        const visibleItems = [];
        // 收集所有可见标注
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

        for (let i = 0; i < visibleItems.length; i++) {
          const item = visibleItems[i];
          const key = `${token.id}:${item.id}`;
          currentKeys.add(key);

          if (createdLabels.has(key)) {
            // 已存在：检查是否需要更新文本
            const existingLabelId = createdLabels.get(key);
            const newText = getLabelText(item.type, item.data);
            // 更新文本（如果不同）
            try {
              await OBR.scene.items.updateItems([existingLabelId], (updateItems) => {
                if (updateItems[0]) {
                  updateItems[0].text = newText;
                  updateItems[0].style = {
                    backgroundColor: COLORS[item.type],
                    color: '#000',
                    fontSize: '14px',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  };
                }
              });
            } catch (e) {
              // 更新失败，可能标签已被手动删除，移除记录
              createdLabels.delete(key);
            }
          } else {
            // 不存在：创建新文本标签
            try {
              const newLabel = await OBR.scene.items.addItems([{
                type: 'LABEL',
                text: getLabelText(item.type, item.data),
                style: {
                  backgroundColor: COLORS[item.type],
                  color: '#000',
                  fontSize: '14px',
                  padding: '2px 6px',
                  borderRadius: '4px'
                },
                position: {
                  x: token.position.x + 60,
                  y: token.position.y - 20 + i * 25
                },
                parent: token.id
              }]);
              if (newLabel && newLabel.length > 0) {
                createdLabels.set(key, newLabel[0].id);
              }
            } catch (e) {
              console.error('创建标签失败:', e);
            }
          }
        }
      }

      // 删除不再需要的标签
      for (const [key, labelId] of createdLabels.entries()) {
        if (!currentKeys.has(key)) {
          try {
            await OBR.scene.items.deleteItems([labelId]);
          } catch (e) {
            // 删除失败，忽略
          }
          createdLabels.delete(key);
        }
      }
    } catch (error) {
      console.error('同步标签失败:', error);
    }
  }

  // 启动定时同步（每 500ms 刷新一次）
  setInterval(syncLabels, 500);
  console.log('✅ 标签同步定时器已启动');
});
