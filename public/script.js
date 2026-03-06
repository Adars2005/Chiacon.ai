// ══════════════════════════════════════════════════════════════════
//  Chiacon.ai — Frontend Logic
// ══════════════════════════════════════════════════════════════════

// ── Tab switching ───────────────────────────────────────────────
function switchTab(tab) {
    // Update tab buttons
    document.querySelectorAll(".tab").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.tab === tab);
    });
    // Update tab panels
    document.querySelectorAll(".tab-panel").forEach((panel) => {
        panel.classList.toggle("active", panel.id === `tab-${tab}`);
    });
}

// ══════════════════════════════════════════════════════════════════
//  1. AI Opportunity Generator
// ══════════════════════════════════════════════════════════════════

const problemInput = document.getElementById("problemInput");
const generateBtn = document.getElementById("generateBtn");
const btnText = generateBtn.querySelector(".btn-text");
const btnLoader = document.getElementById("btnLoader");
const resultContainer = document.getElementById("resultContainer");
const resultEl = document.getElementById("result");
const errorContainer = document.getElementById("errorContainer");
const errorText = document.getElementById("errorText");

problemInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") generateAI();
});

async function generateAI() {
    const problem = problemInput.value.trim();
    if (!problem) {
        showError("errorContainer", "errorText", "Please enter a business problem first.");
        return;
    }

    setButtonLoading(generateBtn, btnLoader, true);
    hideEl(errorContainer);
    hideEl(resultContainer);

    try {
        const res = await fetch("/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ problem }),
        });
        const data = await res.json();
        if (!res.ok) {
            showError("errorContainer", "errorText", data.error || "Something went wrong.");
            return;
        }
        resultEl.innerHTML = renderMarkdown(data.output);
        showEl(resultContainer);
    } catch {
        showError("errorContainer", "errorText", "Network error — could not reach the server.");
    } finally {
        setButtonLoading(generateBtn, btnLoader, false);
    }
}

// ══════════════════════════════════════════════════════════════════
//  2. AI Email Generator
// ══════════════════════════════════════════════════════════════════

const companyInput = document.getElementById("companyInput");
const industryInput = document.getElementById("industryInput");
const roleInput = document.getElementById("roleInput");
const emailBtn = document.getElementById("emailBtn");
const emailBtnLoader = document.getElementById("emailBtnLoader");
const emailResultContainer = document.getElementById("emailResultContainer");
const emailResultEl = document.getElementById("emailResult");
const emailErrorContainer = document.getElementById("emailErrorContainer");
const emailErrorText = document.getElementById("emailErrorText");

// Allow Enter in any email field to trigger
[companyInput, industryInput, roleInput].forEach((input) => {
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") generateEmail();
    });
});

async function generateEmail() {
    const companyName = companyInput.value.trim();
    const industry = industryInput.value.trim();
    const role = roleInput.value.trim();

    if (!companyName || !industry || !role) {
        showError("emailErrorContainer", "emailErrorText", "Please fill in all three fields.");
        return;
    }

    setButtonLoading(emailBtn, emailBtnLoader, true, "Generating…", "Generate Email");
    hideEl(emailErrorContainer);
    hideEl(emailResultContainer);

    try {
        const res = await fetch("/generate-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ companyName, industry, role }),
        });
        const data = await res.json();
        if (!res.ok) {
            showError("emailErrorContainer", "emailErrorText", data.error || "Something went wrong.");
            return;
        }
        emailResultEl.innerHTML = renderMarkdown(data.output);
        showEl(emailResultContainer);
    } catch {
        showError("emailErrorContainer", "emailErrorText", "Network error — could not reach the server.");
    } finally {
        setButtonLoading(emailBtn, emailBtnLoader, false, "Generating…", "Generate Email");
    }
}

// Copy email to clipboard
function copyEmail() {
    const text = emailResultEl.innerText;
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.querySelector(".copy-btn");
        btn.textContent = "✅ Copied!";
        setTimeout(() => (btn.textContent = "📋 Copy"), 2000);
    });
}

// ══════════════════════════════════════════════════════════════════
//  Shared Helpers
// ══════════════════════════════════════════════════════════════════

/** Lightweight markdown → HTML */
function renderMarkdown(text) {
    return text
        .replace(/^## (.+)$/gm, "<h2>$1</h2>")
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/^\d+\.\s+(.+)$/gm, "<li>$1</li>")
        .replace(/^[-•]\s+(.+)$/gm, "<li>$1</li>")
        .replace(/((?:<li>.*<\/li>\n?)+)/g, "<ul>$1</ul>")
        .replace(/^(?!<[hulo])((?!<).+)$/gm, "<p>$1</p>")
        .replace(/<p>\s*<\/p>/g, "");
}

function showError(containerId, textId, msg) {
    const container = document.getElementById(containerId);
    const el = document.getElementById(textId);
    el.textContent = msg;
    showEl(container);
}

function showEl(el) { el.classList.remove("hidden"); }
function hideEl(el) { el.classList.add("hidden"); }

function setButtonLoading(btn, loader, on, loadingText = "Generating…", defaultText = "Generate") {
    btn.disabled = on;
    btn.querySelector(".btn-text").textContent = on ? loadingText : defaultText;
    loader.classList.toggle("hidden", !on);
}
