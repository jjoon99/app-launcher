const { app, BrowserWindow, globalShortcut, screen } = require("electron");
const args = process.argv.slice(2);

const config = {
  // url: "https://" + args[0] || "https://www.google.com", // 기본 URL 설정
  url: "https://" + args[0], //|| "https://www.google.com", // 기본 URL 설정
  monitor: parseInt(args[1], 10) || 0, // 모니터 번호, 기본값은 0
  fullscreen: args[2] === "true", // 전체 화면 여부, 문자열 "true"일 경우 true로 설정
  title: args[3] || "Electron" // 윈도우 타이틀
};

let win;
console.log(config);
function createWindow() {
  const displays = screen.getAllDisplays();
  const externalDisplay = displays[config.monitor];

  if (externalDisplay) {
    win = new BrowserWindow({
      title: config.title,
      x: externalDisplay.bounds.x,
      y: externalDisplay.bounds.y,
      width: externalDisplay.bounds.width,
      height: externalDisplay.bounds.height,
      // alwaysOnTop: true,
      titleBarStyle: config.fullscreen && "hidden",
      fullscreen: config.fullscreen, // 전체 화면 모드 활성화

      webPreferences: {
        devTools: true,
        nodeIntegration: true,
        webPreferences: "nativeWindowOpen",
        allowpopups: true
      }
    });
  } else {
    win = new BrowserWindow({
      width: 800,
      height: 600,
      // alwaysOnTop: true,
      webPreferences: {
        nodeIntegration: true
      }
    });
  }

  win.loadURL(config.url);

  win.webContents.on("did-finish-load", () => {
    win.setTitle(config.title);
  });
  win.on("page-title-updated", (event, title) => {
    // 페이지 타이틀이 변경되었을 때 실행되는 이벤트 핸들러
    win.setTitle(config.title); // 원래의 타이틀로 변경
    event.preventDefault(); // 기본 동작 막기
  });
}

// function toggleDevTools() {
//   win.webContents.toggleDevTools();
// }

// function createShortcuts() {
//   globalShortcut.register("CmdOrCtrl+J", toggleDevTools);
// }

app.whenReady().then(createWindow).then(createShortcuts);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
