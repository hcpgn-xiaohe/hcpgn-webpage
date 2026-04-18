/**
 * 四周年庆祝动画模块
 */

const initAnniversaryAnimation = () => {
  console.log('[Anniversary] 初始化四周年动画');
  const style = document.createElement("style");
  style.id = "anniversary-styles";
  style.textContent = `
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    #celebration-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      background: #fafafa;
      z-index: 9999;
      font-family: MiSans, sans-serif;
      padding-top: 2rem;
    }
    #anniversary-title {
      font-size: 2rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      text-align: center;
      font-family: MiSans, sans-serif;
    }
    #anniversary-content {
      font-size: 1.2rem;
      text-align: center;
      margin: 0;
      font-family: MiSans, sans-serif;
    }
    .anniversary-cursor {
      display: inline-block;
      background-color: #333;
      margin-left: 4px;
      vertical-align: middle;
      animation: blink 1s infinite;
    }
    #anniversary-title-cursor {
      width: 4px;
      height: 2rem;
    }
    #anniversary-content-cursor {
      width: 4px;
      height: 1.2rem;
    }
  `;
  document.head.appendChild(style);

  const container = document.createElement("div");
  container.id = "celebration-container";

  const title = document.createElement("h1");
  title.id = "anniversary-title";
  const titleCursor = document.createElement("span");
  titleCursor.id = "anniversary-title-cursor";
  titleCursor.className = "anniversary-cursor";
  title.appendChild(titleCursor);

  const content = document.createElement("p");
  content.id = "anniversary-content";
  const contentCursor = document.createElement("span");
  contentCursor.id = "anniversary-content-cursor";
  contentCursor.className = "anniversary-cursor";
  content.appendChild(contentCursor);

  container.appendChild(title);
  container.appendChild(content);

  const contentArea = document.querySelector(".content") || document.querySelector("main") || document.body;
  const containerParent = contentArea === document.body ? document.body : contentArea;

  if (contentArea !== document.body) {
    contentArea.style.position = "relative";
    contentArea.appendChild(container);
  } else {
    container.style.position = "fixed";
    document.body.appendChild(container);
  }

  const isEnglishPage = window.location.pathname.includes("/en-us/");
  const titleText = isEnglishPage ? "Happy 4th Anniversary🎉" : "四周年快乐🎉";
  const contentText = "2022-2026";

  let titleIndex = 0;
  let contentIndex = 0;
  const typingSpeed = 150;

  const typeTitle = () => {
    if (titleIndex < titleText.length) {
      const titleEl = document.getElementById("anniversary-title");
      if (isEnglishPage && titleText.substring(titleIndex, titleIndex + 2) === "th") {
        const sup = document.createElement("sup");
        sup.textContent = "th";
        titleEl.insertBefore(sup, titleEl.lastChild);
        titleIndex += 2;
      } else {
        const char = document.createTextNode(titleText[titleIndex]);
        titleEl.insertBefore(char, titleEl.lastChild);
        titleIndex++;
      }
      setTimeout(typeTitle, typingSpeed);
    } else {
      setTimeout(typeContent, 500);
    }
  };

  const typeContent = () => {
    if (contentIndex < contentText.length) {
      const contentEl = document.getElementById("anniversary-content");
      const char = document.createTextNode(contentText[contentIndex]);
      contentEl.insertBefore(char, contentEl.lastChild);
      contentIndex++;
      setTimeout(typeContent, typingSpeed);
    } else {
      setTimeout(fadeOut, 5000);
    }
  };

  const fadeOut = () => {
    let opacity = 1;
    const fadeInterval = setInterval(() => {
      opacity -= 0.05;
      container.style.opacity = opacity;
      if (opacity <= 0) {
        clearInterval(fadeInterval);
        containerParent.removeChild(container);
        document.head.removeChild(style);
      }
    }, 50);
  };

  typeTitle();
};

window.addEventListener("DOMContentLoaded", () => {
  console.log('[Anniversary] DOM 已加载，开始动画');
  setTimeout(initAnniversaryAnimation, 1000);
});
