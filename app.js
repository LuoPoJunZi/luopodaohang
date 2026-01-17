(function () {
  const data = window.NAV_DATA;

  if (!data) {
    console.error("NAV_DATA 未加载");
    return;
  }

  const pad = (n) => String(n).padStart(2, "0");

  function formatDateTime(d){
    return `${d.getFullYear()}年${pad(d.getMonth()+1)}月${pad(d.getDate())}日 ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
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
    if (!wrap) return;

    data.apps.forEach(a => {
      const link = document.createElement("a");
      link.className = "app";
      link.href = a.url;
      link.target = "_blank";

      link.innerHTML = `
        <div class="appIcon">${a.icon}</div>
        <div class="appMeta">
          <div class="appTitle">${a.name}</div>
          <div class="appSub">${a.desc}</div>
        </div>
      `;

      wrap.appendChild(link);
    });
  }

  function renderBookmarks(){
    const wrap = document.getElementById("bookmarkCols");
    if (!wrap) return;

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
        a.textContent = it.name;

        li.appendChild(a);
        ul.appendChild(li);
      });

      col.appendChild(title);
      col.appendChild(ul);
      wrap.appendChild(col);
    });
  }

  function init(){
    setClock();
    renderApps();
    renderBookmarks();
  }

  init();
})();
