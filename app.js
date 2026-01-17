(function () {
  const data = window.NAV_DATA;

  // 若 data.js 未加载/报错，直接提示，避免空白无反馈
  if (!data || !Array.isArray(data.nav) || !Array.isArray(data.bookmarks)) {
    console.error("NAV_DATA missing or invalid. Check data.js loading and syntax.");
    const footer = document.getElementById("footerText");
    if (footer) footer.textContent = "NAV_DATA 加载失败：请检查 data.js 是否正确部署/无语法错误。";
    return;
  }

  const pad = (n) => String(n).padStart(2, "0");

  function weekdayCN(d) { return "日一二三四五六"[d.getDay()]; }

  function formatDateTime(d) {
    return `${d.getFullYear()}年${pad(d.getMonth() + 1)}月${pad(d.getDate())}日 星期${weekdayCN(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  function greetingByHour(h) {
    if (h < 5) return "凌晨好";
    if (h < 12) return "上午好";
    if (h < 18) return "下午好";
    return "晚上好";
  }

  function setClock() {
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

  // 支持 view-source: / 无协议等情况，保证不会抛异常中断渲染
  function normalizeUrl(raw) {
    if (!raw) return null;
    const s = String(raw).trim();

    // 处理 view-source:
    const cleaned = s.startsWith("view-source:") ? s.replace(/^view-source:/, "") : s;

    // 已经是 http(s)
    if (/^https?:\/\//i.test(cleaned)) return cleaned;

    // 纯域名/路径：补 https://
    if (/^[a-z0-9.-]+\.[a-z]{2,}/i.test(cleaned)) return "https://" + cleaned;

    // 其它无法识别
    return null;
  }

  function faviconFor(url) {
    const u = normalizeUrl(url);
    if (!u) return "";
    try {
      const host = new URL(u).hostname;
      return `https://www.google.com/s2/favicons?domain=${host}&sz=64`;
    } catch {
      return "";
    }
  }

  function renderSection(containerId, groups) {
    const wrap = document.getElementById(containerId);
    if (!wrap) return;

    wrap.innerHTML = "";

    groups.forEach(group => {
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
        const href = normalizeUrl(it.url) || it.url;
        a.href = href;
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

  // 真实 IP 定位天气：IP → 经纬度 → Open-Meteo
  async function loadWeather() {
    try {
      const ipRes = await fetch("https://ipapi.co/json/");
      const ipData = await ipRes.json();

      const city = ipData.city || ipData.region || "未知";
      const lat = ipData.latitude;
      const lon = ipData.longitude;

      const cityEl = document.getElementById("weatherCity");
      if (cityEl) cityEl.textContent = city;

      if (typeof lat !== "number" || typeof lon !== "number") {
        throw new Error("IP geo missing lat/lon");
      }

      const weatherUrl =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`;

      const wRes = await fetch(weatherUrl);
      const wData = await wRes.json();

      const temp = Math.round(wData.current.temperature_2m);
      const code = wData.current.weather_code;

      const tempEl = document.getElementById("weatherTemp");
      if (tempEl) tempEl.textContent = temp + "℃";

      let icon = "⛅";
      if (code === 0) icon = "☀️";
      else if ([1, 2, 3].includes(code)) icon = "🌤️";
      else if ([45, 48].includes(code)) icon = "🌫️";
      else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) icon = "🌧️";
      else if ([71, 73, 75, 77, 85, 86].includes(code)) icon = "❄️";

      const iconEl = document.getElementById("weatherIcon");
      if (iconEl) iconEl.textContent = icon;

    } catch (e) {
      console.warn("Weather load failed:", e);
      const cityEl = document.getElementById("weatherCity");
      if (cityEl) cityEl.textContent = "天气加载失败";
    }
  }

  function init() {
    const footer = document.getElementById("footerText");
    if (footer) footer.textContent = data.footer || "";

    setClock();
    renderSection("navCols", data.nav);
    renderSection("bookmarkCols", data.bookmarks);
    loadWeather();
  }

  init();
})();
