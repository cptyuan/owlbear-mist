console.log('🚀 background.js 已开始执行');
console.log('OBR 类型:', typeof OBR);

if (typeof OBR === 'undefined') {
  console.error('❌ OBR 未定义');
} else {
  OBR.onReady(() => {
    console.log('✅ OBR.onReady 回调触发');
    
    // 测试通知
    try {
      OBR.notification.show('后台运行成功！', 'info');
      console.log('🔔 通知已发送');
    } catch (e) {
      console.error('❌ 通知失败:', e.message);
    }
    
    // 测试绘制 API
    if (OBR.scene && OBR.scene.canvas && typeof OBR.scene.canvas.draw === 'function') {
      console.log('🎨 注册绘制测试');
      OBR.scene.canvas.draw((ctx, viewport) => {
        ctx.fillStyle = 'rgba(0, 200, 0, 0.7)';
        ctx.fillRect(viewport.width / 2 - 40, viewport.height / 2 - 40, 80, 80);
        console.log('🟢 测试矩形已绘制');
      });
    } else {
      console.warn('⚠️ canvas.draw 不可用');
    }
  });
}
