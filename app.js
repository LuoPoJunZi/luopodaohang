const data = window.NAV_DATA;

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
    el.textContent = formatDateTime(d);
    g.textContent = greetingByHour(d.getHours());
  };
  tick();
  setInterval(tick, 1000);
}

function renderApps(){
  const wrap = document.getElementById("apps");
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
        <div class="appTitle">${a.name}</div>
        <div class="appSub">${a.desc || ""}</div>
      </div>
    `;
    wrap.appendChild(link);
  });
}

function faviconFor(url){
  try{
    const u = new URL(url.replace(/^view-source:/, "https://"));
    return `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=64`;
  }catch{
    return "";
  }
}

function renderBookmarks(){
  const wrap = document.getElementById("bookmarkCols");
  wrap.innerHTML = "";
  data.bookmarks.forEach(group => {
    const col = document.createElement("div");
    const title = document.createElement("div");
    title.className = "colTitle";
    title.textContent = group.title;

    const ul = document.createElement("ul");
    ul.className = "list";

    group.items.forEach(it => {
      const li = document.createElement("li");
      li.className = "item";
      const a = document.createElement("a");
      a.href = it.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";

      const fav = faviconFor(it.url);
      a.innerHTML = fav
        ? `<img class="favicon" src="${fav}" alt="" /><span>${it.name}</span>`
        : `<span>${it.name}</span>`;

      li.appendChild(a);
      ul.appendChild(li);
    });

    col.appendChild(title);
    col.appendChild(ul);
    wrap.appendChild(col);
  });
}

function init(){
  document.getElementById("footerText").textContent = data.footer || "";
  setClock();
  renderApps();
  renderBookmarks();
}
init();
