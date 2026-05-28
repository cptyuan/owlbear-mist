import OBR from "https://esm.sh/@owlbear-rodeo/sdk";

OBR.onReady(() => {
  OBR.scene.canvas.draw((ctx, viewport) => {
    OBR.scene.items.getItems().then((items) => {
      const tokens = items.filter(item => item.layer === 'CHARACTER' || item.layer === 'MOUNT');
      
      for (const token of tokens) {
        const labels = token.metadata?.['com.cptyuan.token-labels'];
        if (!labels) continue;

        const { x: tokenX, y: tokenY } = token.position;
        const tokenWidth = token.size.width;
        const tokenHeight = token.size.height;
        const screenX = (tokenX - viewport.offset.x) * viewport.scale + viewport.width / 2;
        const screenY = (tokenY - viewport.offset.y) * viewport.scale + viewport.height / 2;
        const screenW = tokenWidth * viewport.scale;
        const screenH = tokenHeight * viewport.scale;

        drawLabels(ctx, labels.tags, '#FF9800', screenX, screenY, screenW, screenH, viewport.scale);
        drawStatuses(ctx, labels.statuses, '#8BC34A', screenX, screenY, screenW, screenH, viewport.scale);
        drawPowers(ctx, labels.powers, '#9C27B0', screenX, screenY, screenW, screenH, viewport.scale);
      }
    });
  });

  function drawRoundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
  }

  function drawLabels(ctx, tags, color, tokenCenterX, tokenCenterY, tokenW, tokenH, scale) {
    let offsetY = -10;
    tags.forEach(tag => {
      const text = tag.text;
      ctx.font = `${12 * scale}px sans-serif`;
      const metrics = ctx.measureText(text);
      const padding = 4 * scale;
      const boxWidth = metrics.width + padding * 2;
      const boxHeight = 16 * scale;
      const x = tokenCenterX + tokenW / 2 + 5 * scale;
      const y = tokenCenterY - tokenH / 2 + offsetY;

      ctx.fillStyle = color;
      drawRoundRect(ctx, x, y, boxWidth, boxHeight, 4 * scale);

      ctx.fillStyle = '#000';
      ctx.fillText(text, x + padding, y + boxHeight - 5 * scale);
      
      offsetY += boxHeight + 2 * scale;
    });
  }

  function drawStatuses(ctx, statuses, color, tokenCenterX, tokenCenterY, tokenW, tokenH, scale) {
    let offsetY = -10;
    statuses.forEach(status => {
      const levels = status.levels.sort((a,b) => a-b);
      if (levels.length === 0) return;
      const highest = levels[levels.length - 1];
      const lowerLevels = levels.slice(0, -1).join('');
      const namePrefix = status.name + '-';
      
      ctx.font = `${12 * scale}px sans-serif`;
      const nameWidth = ctx.measureText(namePrefix).width;
      
      let lowerWidth = 0;
      if (lowerLevels) {
        ctx.font = `${8 * scale}px sans-serif`;
        lowerWidth = ctx.measureText(lowerLevels).width;
      }
      ctx.font = `bold ${12 * scale}px sans-serif`;
      const highWidth = ctx.measureText(highest.toString()).width;
      
      const totalTextWidth = nameWidth + lowerWidth + highWidth;
      const padding = 4 * scale;
      const boxWidth = totalTextWidth + padding * 2;
      const boxHeight = 16 * scale;
      const x = tokenCenterX - tokenW / 2 - boxWidth - 5 * scale;
      const y = tokenCenterY - tokenH / 2 + offsetY;

      ctx.fillStyle = color;
      drawRoundRect(ctx, x, y, boxWidth, boxHeight, 4 * scale);

      ctx.fillStyle = '#000';
      ctx.font = `${12 * scale}px sans-serif`;
      ctx.fillText(namePrefix, x + padding, y + boxHeight - 5 * scale);
      
      let currentX = x + padding + nameWidth;
      if (lowerLevels) {
        ctx.font = `${8 * scale}px sans-serif`;
        ctx.fillStyle = '#555';
        ctx.fillText(lowerLevels, currentX, y + boxHeight - 5 * scale);
        currentX += lowerWidth;
      }
      ctx.font = `bold ${12 * scale}px sans-serif`;
      ctx.fillStyle = '#000';
      ctx.fillText(highest.toString(), currentX, y + boxHeight - 5 * scale);

      offsetY += boxHeight + 2 * scale;
    });
  }

  function drawPowers(ctx, powers, color, tokenCenterX, tokenCenterY, tokenW, tokenH, scale) {
    let offsetY = -10;
    powers.forEach(power => {
      const text = `${power.name}-${power.level}`;
      ctx.font = `${12 * scale}px sans-serif`;
      const metrics = ctx.measureText(text);
      const padding = 4 * scale;
      const boxWidth = metrics.width + padding * 2;
      const boxHeight = 16 * scale;
      const x = tokenCenterX + tokenW / 2 + 5 * scale;
      const y = tokenCenterY + tokenH / 2 + offsetY;

      ctx.fillStyle = color;
      drawRoundRect(ctx, x, y, boxWidth, boxHeight, 4 * scale);

      ctx.fillStyle = '#000';
      ctx.fillText(text, x + padding, y + boxHeight - 5 * scale);
      
      offsetY += boxHeight + 2 * scale;
    });
  }
});
