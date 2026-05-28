// 第一步：立即向控制台写日志，确认脚本被加载
console.log('🚀 后台脚本已加载');

// 第二步：检查 OBR 全局对象是否存在
if (typeof OBR !== 'undefined') {
  console.log('✅ OBR 全局对象存在');
  
  OBR.onReady(() => {
    console.log('✅ OBR.onReady 回调执行');
    
    // 测试通知
    try {
      OBR.notification.show('后台脚本运行成功！', 'info');
      console.log('🔔 通知已发送');
    } catch (e) {
      console.error('❌ 通知失败:', e.message);
    }
    
    // 测试 Canvas API
    if (OBR.scene && OBR.scene.canvas && typeof OBR.scene.canvas.draw === 'function') {
      console.log('🎨 Canvas 绘制 API 可用，尝试绘制测试矩形');
      try {
        OBR.scene.canvas.draw((ctx, viewport) => {
          ctx.fillStyle = 'lime';
          ctx.fillRect(viewport.width / 2 - 30, viewport.height / 2 - 30, 60, 60);
        });
        console.log('🎨 绘制回调已注册');
      } catch (e) {
        console.error('❌ 绘制注册失败:', e.message);
      }
    } else {
      console.warn('⚠️ Canvas 绘制 API 不可用');
    }
  });
} else {
  console.error('❌ OBR 全局对象不存在，后台脚本无法初始化');
}
