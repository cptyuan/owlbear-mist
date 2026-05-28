OBR.onReady(() => {
  console.log('✅ 极简后台已启动');
  OBR.scene.canvas.draw((ctx, viewport) => {
    ctx.fillStyle = 'red';
    ctx.fillRect(viewport.width / 2 - 50, viewport.height / 2 - 50, 100, 100);
  });
});
