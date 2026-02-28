# Tauri 拖放处理

出于安全性考虑，默认情况下 Tauri 会劫持 webview 上的拖放事件，走它自己的事件（`tauri://drag` 等）。这会导致页面上由 JS 定义的拖放处理代码失效。

Tauri 提供了这样一个选项：

```jsonc
{
  "app": {
    "windows": [
      {
        "dragDropEnabled": true,
        // Default to true
        // Whether the drag and drop is enabled or not on the webview. By default it is enabled.
        // Disabling it is required to use HTML5 drag and drop on the frontend on Windows.
      },
    ],
  },
}
```

默认为 `true`，即劫持。设置为 `false` 后 Tauri 不再劫持拖拽事件，页面上的拖放可以正常工作。但代价是如果用户从文件系统中拖拽文件并释放到 webview 上，程序只能走网页 API 读取文件内容，无法像原生应用那样获取文件路径或写入。

在目前版本（[2.10.2](https://github.com/tauri-apps/tauri/releases/tag/tauri-v2.10.2)）这二者是不可调和的，即只有两种选项：

- `"dragDropEnabled": true`：放弃网页内拖放 API，完全使用 Tauri 提供的拖放事件；获得原生文件拖放能力，拖入的文件可读写；
- `"dragDropEnabled": false`：放弃原生文件拖放能力，拖入的文件只能读不可写；保留网页拖放能力。

不过看到了一个 workaround：设置 `"dragDropEnabled": false` 使用网页拖放 API，但在发现拖入文件时，新建一个透明窗口，大小位置与原窗口保持一致，即一个覆盖原窗口的透明浮层。该浮层设置 `"dragDropEnabled": true`，则可以使用 Tauri API 获取到文件路径。拖拽完成后移除该浮层。
