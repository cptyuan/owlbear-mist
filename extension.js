const OBR = window.OBR;

OBR.onReady(() => {
    OBR.tool.createAction({
        id: "com.cptyuan.token-labels.action",
        icons: ["https://raw.githubusercontent.com/google/material-design-icons/master/src/action/label/svg/production/ic_label_24px.svg"],
        tooltips: "Token 标注",
        onClick: () => {
            OBR.notification.show("按钮已点击！", "info");
        },
    });
});
