import OBR from "https://esm.sh/@owlbear-rodeo/sdk";

OBR.onReady(async () => {
  OBR.tool.createAction({
    id: "com.cptyuan.token-labels.action",
    icons: ["🔥"],
    tooltips: "Token 标注",
    onClick: () => {
      OBR.popover.open({
        id: "com.cptyuan.token-labels.panel",
        url: "about:blank",
        height: 600,
        width: 300,
      });
    },
  });
});
