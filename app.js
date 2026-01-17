(function () {
  const data = window.NAV_DATA;

  if (!data) {
    console.error("NAV_DATA 未加载");
    return;
  }

  const pad = (n) => String(n).padStart(2, "0");

  function weekdayCN(d){ return "日一二三四五六"[d.getDay()]; }

  function formatDateTime(d){
    return `${d.getFullYear()}年${pad(d.getMonth()+1)}月${pad(d.getDate())}日 星期${weekdayCN(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  function greetingByHour(h){
    if (h < 5) return "凌晨好";
    if (h < 12) return "上午好";
    if (h < 18) return "下午好";
    return "晚上好";
  }

  function setClock(){
    const el = document.getElementById("dateLine");
    const g = document.getElementById("greeting");

    const tick = () => {
      const d = new Date();
      if (el) el.textContent = formatDateTime(d);
      if (g) g.textContent = greetingByHour(d.getHours());
    };

    tick();
    setInterval(tick, 1000);
  }

  function normalizeUrl(raw) {
    if (!raw) return null;
    const s = String(raw).trim();
    const cleaned = s.startsWith("view-source:") ? s.replace(/^view-source:/, "") : s;
    if (/^https?:\/\//i.test(cleaned)) return cleaned;
    if (/^[a-z0-9.-]+\.[a-z]{2,}/i.test(cleaned)) return "https://" + cleaned;
    return null;
  }

  function faviconFor(url){
    const u = normalizeUrl(url);
    if (!u) return "";
    try{
      const host = new URL(u).hostname;
      return `https://www.google.com/s2/favicons?domain=${host}&sz=64`;
    }catch{
      return "";
    }
  }

  // 博客区（apps 卡片）
  function renderApps(){
    const wrap = document.getElementById("apps");
    if (!wrap || !Array.isArray(data.apps)) return;

    wrap.innerHTML = "";

    data.apps.forEach(a => {
      const link = document.createElement("a");
      link.className = "app";
      link.href = a.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      link.innerHTML = `
        <div class="appIcon">${a.icon || "🔗"}</div>
        <div class="appMeta">
          <div class="appTitle">${a.name || ""}</div>
          <div class="appSub">${a.desc || ""}</div>
        </div>
      `;

      wrap.appendChild(link);
    });
  }

  // 书签区（带 favicon）
  function renderBookmarks(){
    const wrap = document.getElementById("bookmarkCols");
    if (!wrap || !Array.isArray(data.bookmarks)) return;

    wrap.innerHTML = "";

    data.bookmarks.forEach(group => {
      const col = document.createElement("div");

      const title = document.createElement("div");
      title.className = "colTitle";
      title.textContent = group.title || "";

      const ul = document.createElement("ul");
      ul.className = "list";

      (group.items || []).forEach(it => {
        const li = document.createElement("li");
        li.className = "item";

        const a = document.createElement("a");
        a.href = normalizeUrl(it.url) || it.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";

        const fav = faviconFor(it.url);

        a.innerHTML = fav
          ? `<img class="favicon" src="${fav}" alt="" /><span>${it.name || ""}</span>`
          : `<span>${it.name || ""}</span>`;

        li.appendChild(a);
        ul.appendChild(li);
      });

      col.appendChild(title);
      col.appendChild(ul);
      wrap.appendChild(col);
    });
  }

  function init(){
    const footer = document.getElementById("footerText");
    if (footer) footer.textContent = data.footer || "";

    setClock();
    renderApps();
    renderBookmarks();
  }

  init();
})();
