// 后台测试脚本：验证 DOM 操作是否可行
OBR.onReady(() => {
    // 获取画布的父容器（所有覆盖层都放在这里）
    const canvas = document.querySelector('canvas');
    if (!canvas) {
        console.error('找不到 canvas 元素');
        return;
    }
    const container = canvas.parentElement;
    
    // 创建一个红色测试方块
    const testDiv = document.createElement('div');
    testDiv.style.position = 'absolute';
    testDiv.style.left = '100px';
    testDiv.style.top = '100px';
    testDiv.style.width = '60px';
    testDiv.style.height = '60px';
    testDiv.style.backgroundColor = 'red';
    testDiv.style.zIndex = '9999';
    testDiv.style.borderRadius = '8px';
    container.appendChild(testDiv);
    
    console.log('红色测试方块已添加');
});
