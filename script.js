const USERNAME = "srivathsanps-quantum";
const API_URL = `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`;

function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

async function loadRepos() {
  const statusEl = document.getElementById("repo-status");
  const listEl = document.getElementById("repo-list");

  try {
    const res = await fetch(API_URL, {
      headers: { "Accept": "application/vnd.github+json" }
    });

    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

    let repos = await res.json();

    // Optional: remove forks
    repos = repos.filter(r => !r.fork);

    // Clear status
    statusEl.textContent = repos.length ? "" : "No repositories found.";

    // Render repos
    repos.forEach(r => {
      const div = document.createElement("div");
      div.className = "repo";

      div.innerHTML = `
        <a href="${r.html_url}" target="_blank" rel="noreferrer">${r.name}</a>
        <div class="muted">${r.description ? r.description : ""}</div>
        <div class="meta">
          ${r.language ? `<span>🧠 ${r.language}</span>` : ""}
          <span>⭐ ${r.stargazers_count}</span>
          <span>⏱ Updated ${fmtDate(r.updated_at)}</span>
        </div>
      `;

      listEl.appendChild(div);
    });
  } catch (e) {
    statusEl.textContent = "Couldn’t load repositories right now (rate limit or network).";
    console.error(e);
  }
}

document.getElementById("year").textContent = new Date().getFullYear();
loadRepos();
