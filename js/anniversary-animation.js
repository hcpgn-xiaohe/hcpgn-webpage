// 四周年庆祝动画
function initAnniversaryAnimation() {
  // 创建庆祝容器
  const celebrationContainer = document.createElement("div");
  celebrationContainer.id = "celebration-container";
  celebrationContainer.style.position = "absolute";
  celebrationContainer.style.top = "0";
  celebrationContainer.style.left = "0";
  celebrationContainer.style.width = "100%";
  celebrationContainer.style.height = "100%";
  celebrationContainer.style.display = "flex";
  celebrationContainer.style.flexDirection = "column";
  celebrationContainer.style.justifyContent = "flex-start";
  celebrationContainer.style.alignItems = "center";
  celebrationContainer.style.background = "#fafafa";
  celebrationContainer.style.zIndex = "9999";
  celebrationContainer.style.fontFamily = "MiSans, sans-serif";
  celebrationContainer.style.paddingTop = "2rem";

  // 找到内容区域
  let contentArea = document.querySelector(".content");
  // 如果没有找到.content，尝试找到<main>标签
  if (!contentArea) {
    contentArea = document.querySelector("main");
  }
  let containerParent;

  // 创建标题元素
  const title = document.createElement("h1");
  title.id = "anniversary-title";
  title.style.fontSize = "2rem";
  title.style.fontWeight = "600";
  title.style.marginBottom = "1.5rem";
  title.style.textAlign = "center";
  title.style.fontFamily = "MiSans, sans-serif";

  // 创建正文元素
  const content = document.createElement("p");
  content.id = "anniversary-content";
  content.style.fontSize = "1.2rem";
  content.style.textAlign = "center";
  content.style.margin = "0";
  content.style.fontFamily = "MiSans, sans-serif";

  // 创建标题光标元素
  const titleCursor = document.createElement("span");
  titleCursor.id = "anniversary-title-cursor";
  titleCursor.style.display = "inline-block";
  titleCursor.style.width = "4px";
  titleCursor.style.height = "2rem";
  titleCursor.style.backgroundColor = "#333";
  titleCursor.style.marginLeft = "4px";
  titleCursor.style.verticalAlign = "middle";
  titleCursor.style.animation = "blink 1s infinite";

  // 创建内容光标元素
  const contentCursor = document.createElement("span");
  contentCursor.id = "anniversary-content-cursor";
  contentCursor.style.display = "inline-block";
  contentCursor.style.width = "4px";
  contentCursor.style.height = "1.2rem";
  contentCursor.style.backgroundColor = "#333";
  contentCursor.style.marginLeft = "4px";
  contentCursor.style.verticalAlign = "middle";
  contentCursor.style.animation = "blink 1s infinite";

  // 添加光标样式
  const style = document.createElement("style");
  style.textContent = `
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  // 组合元素
  title.appendChild(titleCursor);
  celebrationContainer.appendChild(title);
  content.appendChild(contentCursor);
  celebrationContainer.appendChild(content);

  // 找到内容区域并设置相对定位
  if (contentArea) {
    contentArea.style.position = "relative";
    contentArea.appendChild(celebrationContainer);
    containerParent = contentArea;
  } else {
    // 如果没有找到内容区域，则添加到body
    celebrationContainer.style.position = "fixed";
    document.body.appendChild(celebrationContainer);
    containerParent = document.body;
  }

  // 检测页面语言
  let titleText, contentText;
  const isEnglishPage = window.location.pathname.includes("/en-us/");

  if (isEnglishPage) {
    // 英文页面
    titleText = "Happy 4 Anniversary🎉";
    contentText = "2022-2026";
  } else {
    // 中文页面
    titleText = "四周年快乐🎉";
    contentText = "2022-2026";
  }

  let titleIndex = 0;
  let contentIndex = 0;
  const typingSpeed = 150; // 打字速度（毫秒）

  function typeTitle() {
    if (titleIndex < titleText.length) {
      const titleElement = document.getElementById("anniversary-title");

      // 特殊处理英文页面的"4th"，将"th"设置为上标
      if (isEnglishPage && titleIndex === 6) {
        // 添加"4"
        const charNode = document.createTextNode("4");
        titleElement.insertBefore(charNode, titleElement.lastChild);
        // 创建上标元素并添加"th"
        const supElement = document.createElement("sup");
        supElement.textContent = "th";
        titleElement.insertBefore(supElement, titleElement.lastChild);
        titleIndex += 1; // 跳过空格
      } else {
        // 普通字符
        const charNode = document.createTextNode(titleText.charAt(titleIndex));
        titleElement.insertBefore(charNode, titleElement.lastChild);
        titleIndex++;
      }

      setTimeout(typeTitle, typingSpeed);
    } else {
      // 标题打字完成后，开始内容打字
      setTimeout(typeContent, 500);
    }
  }

  function typeContent() {
    if (contentIndex < contentText.length) {
      const contentElement = document.getElementById("anniversary-content");
      // 添加文本
      const charNode = document.createTextNode(
        contentText.charAt(contentIndex),
      );
      contentElement.insertBefore(charNode, contentElement.lastChild);
      contentIndex++;
      setTimeout(typeContent, typingSpeed);
    } else {
      // 等待5秒然后渐隐
      setTimeout(() => {
        let opacity = 1;
        const fadeSpeed = 50; // 渐隐速度（毫秒）

        function fadeOut() {
          if (opacity > 0) {
            opacity -= 0.05;
            celebrationContainer.style.opacity = opacity;
            setTimeout(fadeOut, fadeSpeed);
          } else {
            // 完全消失后，移除庆祝容器
            if (
              containerParent &&
              containerParent.contains(celebrationContainer)
            ) {
              containerParent.removeChild(celebrationContainer);
            }
            // 移除光标样式
            document.head.removeChild(style);
          }
        }

        fadeOut();
      }, 5000); // 5秒后开始渐隐
    }
  }

  // 开始打字动画
  typeTitle();
}

// 页面加载完成后执行，添加1秒延迟
window.addEventListener("DOMContentLoaded", function () {
  console.log("Anniversary animation script loaded");
  setTimeout(initAnniversaryAnimation, 1000); // 1000毫秒延迟
});
