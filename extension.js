import OBR from "https://esm.sh/@owlbear-rodeo/sdk";

OBR.onReady(() => {
    OBR.tool.createAction({
        id: "com.cptyuan.token-labels.action",
        icon: "tag",
        tooltips: "Token 标注",
        onClick: () => {
            OBR.notification.show("按钮已点击！", "info");
        },
    });
});
