找不同 15+ 完整版（GitHub Pages）
================================

內容：
- 10 關
- 20 張 PNG 圖片
- 每關 7 個差異
- 90 秒倒數
- 雙指縮放與拖曳
- 進度自動保存
- iPhone 安全區
- GitHub Pages 可直接使用

上傳時請保留原始資料夾結構：
index.html
style.css
app.js
levels.js
manifest.webmanifest
sw.js
assets/
  level01_a.png
  level01_b.png
  ...
  level10_b.png

手機上傳 GitHub：
1. 在 iPhone「檔案」App 解壓縮 ZIP。
2. 進入 GitHub 網頁版 repository。
3. 點 Add file → Upload files。
4. 先上傳外層六個檔案。
5. 在 repository 點 Add file → Create new file。
6. 檔名輸入 assets/.gitkeep，提交後就會建立 assets 資料夾。
7. 點進 assets，再點 Add file → Upload files。
8. 從 iPhone「檔案」選取 assets 裡的 20 張 PNG，一次全部上傳。
9. Settings → Pages → Deploy from a branch → main / root。
