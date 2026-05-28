(function() {
  if (typeof window.OBR === 'undefined') {
    console.error('❌ OBR 全局对象不存在，扩展加载失败');
    return;
  }

  window.OBR.onReady(() => {
    try {
      OBR.tool.createAction({
        id: "com.cptyuan.token-labels.action.v4",
        tooltips: "Token 标注 - 鼠标悬停此处",
        // 使用一个极其简单的内嵌 SVG，无需任何外部请求
        icons: ["data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' rx='4' fill='%23FF9800'/%3E%3Ctext x='12' y='17' font-family='Arial' font-size='10' font-weight='bold' fill='%23000' text-anchor='middle'%3ETA%3C/text%3E%3C/svg%3E"],
        onClick: () => {
          OBR.notification.show("✅ 按钮已点击！扩展运行正常。", "info");
        },
      });
      console.log('✅ Token 标注按钮已成功创建');
    } catch (e) {
      console.error('❌ 创建按钮时出错:', e);
    }
  });
})();
