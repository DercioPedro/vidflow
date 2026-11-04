const SITE_SETTINGS_KEY = 'vb_site_settings';
const DEFAULT_SETTINGS = {
    telegram: '',
    previewSeconds: 12
};

let isAdmin = false;
let currentVideoId = null;
let videos = [];
let comments = [];
let activeCategory = 'Todos';
let searchTerm = '';
let previewTimer = null;
let siteSettings = loadSettings();

const sb = window.supabase.createClient(
    'https://gnlixbzycebqvzxpcemx.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdubGl4Ynp5Y2VicXZ6eHBjZW14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyNzE4NTAsImV4cCI6MjEwMTg0Nzg1MH0.LndsCYcFyJdWPD6_25zjtLZSBkNdwRVk6fv6xl1UWJA'
);

function generateSessionId() {
    let sessionId = localStorage.getItem('visitor_session_id');
    if (!sessionId) {
        sessionId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
        localStorage.setItem('visitor_session_id', sessionId);
    }
    return sessionId;
}

const SESSION_ID = generateSessionId();
let lastVisitorUpdate = 0;
let visitorUpdateInterval = null;

function loadSettings() {
    try {
        const raw = localStorage.getItem(SITE_SETTINGS_KEY);
        if (!raw) return { ...DEFAULT_SETTINGS };
        return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch (error) {
        return { ...DEFAULT_SETTINGS };
    }
}

function saveSettingsLocal(next) {
    siteSettings = { ...siteSettings, ...next };
    localStorage.setItem(SITE_SETTINGS_KEY, JSON.stringify(siteSettings));
    applyTelegramLinks();
}

function telegramHref(video) {
    const contact = (siteSettings.telegram || '').trim();
    const base = normalizeTelegram(contact);
    if (!base) return '';
    if (!video) return base;
    const text = encodeURIComponent(
        'Ola, tenho interesse no video "' + video.title + '" por ' + formatPrice(video.price) + '.'
    );
    const sep = base.includes('?') ? '&' : '?';
    return base + sep + 'text=' + text;
}

function normalizeTelegram(value) {
    if (!value) return '';
    const trimmed = value.trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    const user = trimmed.replace(/^@/, '');
    if (!user) return '';
    return 'https://t.me/' + user;
}

function formatPrice(value) {
    const amount = Number(value);
    if (!Number.isFinite(amount) || amount < 0) return 'A consultar';
    return amount.toLocaleString('pt-MZ') + ' MT';
}

function generateSecureId() {
    return Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
}

function randomDate() {
    const now = new Date();
    const randomOffset = Math.floor(Math.random() * 86400000 * 7);
    const date = new Date(now.getTime() - randomOffset);
    return date.toLocaleDateString('pt-BR');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function cleanFileName(fileName) {
    const semAcentos = fileName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const limpo = semAcentos.replace(/[^a-zA-Z0-9_.-]/g, '_');
    return limpo.replace(/[^\w\-_.]/g, '').substring(0, 50);
}

function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

const pageHome = document.getElementById('pageHome');
const pageLogin = document.getElementById('pageLogin');
const pageAdmin = document.getElementById('pageAdmin');
const pagePlayer = document.getElementById('pagePlayer');
const videoGrid = document.getElementById('videoGrid');
const loadingIndicator = document.getElementById('loadingIndicator');
const uploadForm = document.getElementById('uploadForm');
const uploadFile = document.getElementById('uploadFile');
const uploadProgress = document.getElementById('uploadProgress');
const progressBar = document.getElementById('progressBar');
const progressPercent = document.getElementById('progressPercent');
const btnHome = document.getElementById('btnHome');
const btnAdminPanel = document.getElementById('btnAdminPanel');
const btnLogout = document.getElementById('btnLogout');
const btnBack = document.getElementById('btnBack');
const btnCancelLogin = document.getElementById('btnCancelLogin');
const btnDelete = document.getElementById('btnDelete');
const loginForm = document.getElementById('loginForm');
const adminPassword = document.getElementById('adminPassword');
const playerVideo = document.getElementById('playerVideo');
const playerTitle = document.getElementById('playerTitle');
const playerDesc = document.getElementById('playerDesc');
const playerCategory = document.getElementById('playerCategory');
const playerPrice = document.getElementById('playerPrice');
const commentInput = document.getElementById('commentInput');
const commentAnonymous = document.getElementById('commentAnonymous');
const btnSendComment = document.getElementById('btnSendComment');
const commentsList = document.getElementById('commentsList');
const lockOverlay = document.getElementById('lockOverlay');
const previewTag = document.getElementById('previewTag');
const searchInput = document.getElementById('searchInput');
const categoryFilters = document.getElementById('categoryFilters');
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');

function showPage(name) {
    pageHome.style.display = name === 'home' ? 'block' : 'none';
    pageLogin.style.display = name === 'login' ? 'block' : 'none';
    pageAdmin.style.display = name === 'admin' ? 'block' : 'none';
    pagePlayer.style.display = name === 'player' ? 'block' : 'none';
    btnHome.classList.toggle('is-active', name === 'home');
    if (name !== 'player') {
        playerVideo.pause();
        clearPreviewLock();
    }
}

async function registerVisitor(page, videoId = null) {
    try {
        const now = Date.now();
        if (now - lastVisitorUpdate < 10000) return;
        lastVisitorUpdate = now;
        const visitorData = {
            session_id: SESSION_ID,
            page: page,
            video_id: videoId,
            last_activity: new Date().toISOString(),
            user_agent: navigator.userAgent.substring(0, 200)
        };
        const { data: existing, error: findError } = await sb
            .from('live_visitors')
            .select('id')
            .eq('session_id', SESSION_ID)
            .limit(1);
        if (findError) throw findError;
        if (existing && existing.length > 0) {
            await sb.from('live_visitors')
                .update({
                    page: page,
                    video_id: videoId,
                    last_activity: new Date().toISOString()
                })
                .eq('session_id', SESSION_ID);
        } else {
            await sb.from('live_visitors').insert([visitorData]);
        }
    } catch (error) {
        return;
    }
}

async function getLiveVisitors() {
    try {
        const { data, error } = await sb.from('live_visitors').select('*').order('last_activity', { ascending: false });
        if (error) throw error;
        return data || [];
    } catch (error) {
        return [];
    }
}

async function updateLiveVisitors() {
    try {
        const visitors = await getLiveVisitors();
        const activeVisitors = visitors.filter(v => (new Date() - new Date(v.last_activity)) < 300000);
        const countEls = [
            document.getElementById('visitorCountGlobal'),
            document.getElementById('statOnline'),
            document.getElementById('dashOnlineCount')
        ];
        countEls.forEach(el => {
            if (el) el.textContent = activeVisitors.length;
        });
    } catch (error) {
        return;
    }
}

function startVisitorUpdates() {
    if (visitorUpdateInterval) clearInterval(visitorUpdateInterval);
    visitorUpdateInterval = setInterval(updateLiveVisitors, 10000);
    updateLiveVisitors();
}

async function loadRemoteSettings() {
    try {
        const { data, error } = await sb.from('admin_config').select('*').limit(1);
        if (error || !data || !data.length) return;
        const row = data[0];
        const next = {};
        if (row.telegram) next.telegram = row.telegram;
        if (row.preview_seconds) next.previewSeconds = Number(row.preview_seconds) || 12;
        saveSettingsLocal(next);
        fillSettingsForm();
    } catch (error) {
        fillSettingsForm();
    }
}

function fillSettingsForm() {
    const telegramInput = document.getElementById('telegramInput');
    const previewSeconds = document.getElementById('previewSeconds');
    if (telegramInput) telegramInput.value = siteSettings.telegram || '';
    if (previewSeconds) previewSeconds.value = siteSettings.previewSeconds || 12;
    applyTelegramLinks();
}

function applyTelegramLinks() {
    const href = telegramHref(null);
    ['headerTelegram', 'heroTelegram'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        if (href) {
            el.href = href;
            el.style.display = id === 'headerTelegram' ? 'inline-flex' : 'inline-flex';
        } else {
            el.style.display = 'none';
        }
    });
    const dashTelegram = document.getElementById('dashTelegram');
    if (dashTelegram) dashTelegram.textContent = siteSettings.telegram || 'Nao definido';
}

async function verifyAdminPassword(password) {
    try {
        const { data, error } = await sb.from('admin_config').select('password').limit(1);
        if (error) throw error;
        if (data && data.length > 0) {
            return data[0].password === password;
        }
        const defaultPassword = 'admin123';
        const { error: insertError } = await sb.from('admin_config').insert([{ password: defaultPassword }]);
        if (insertError) throw insertError;
        return password === defaultPassword;
    } catch (error) {
        return false;
    }
}

async function loadVideos() {
    try {
        loadingIndicator.style.display = 'block';
        const { data, error } = await sb.from('videos').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        videos = (data || []).map(video => ({
            id: video.id,
            title: video.title,
            description: video.description || 'Sem descricao',
            category: video.category || 'Geral',
            url: video.url,
            date: video.date || randomDate(),
            price: video.price != null ? Number(video.price) : 0
        }));
        renderFilters();
        renderVideos();
        renderAdminVideos();
        updateStats();
        loadingIndicator.style.display = 'none';
    } catch (error) {
        loadingIndicator.innerHTML = '<h3>Erro ao carregar videos</h3><p>' + escapeHtml(error.message) + '</p>';
    }
}

function updateStats() {
    const cats = new Set(videos.map(v => v.category).filter(Boolean));
    const statVideos = document.getElementById('statVideos');
    const statCats = document.getElementById('statCats');
    const dashVideoCount = document.getElementById('dashVideoCount');
    if (statVideos) statVideos.textContent = videos.length;
    if (statCats) statCats.textContent = cats.size;
    if (dashVideoCount) dashVideoCount.textContent = videos.length;
}

function filteredVideos() {
    return videos.filter(video => {
        const matchCat = activeCategory === 'Todos' || video.category === activeCategory;
        const q = searchTerm.trim().toLowerCase();
        const matchSearch = !q || video.title.toLowerCase().includes(q) || (video.category || '').toLowerCase().includes(q);
        return matchCat && matchSearch;
    });
}

function renderFilters() {
    const cats = ['Todos', ...Array.from(new Set(videos.map(v => v.category).filter(Boolean)))];
    categoryFilters.innerHTML = cats.map(cat =>
        '<button type="button" class="filter-chip' + (cat === activeCategory ? ' is-active' : '') + '" data-cat="' + escapeHtml(cat) + '">' + escapeHtml(cat) + '</button>'
    ).join('');
    categoryFilters.querySelectorAll('.filter-chip').forEach(btn => {
        btn.addEventListener('click', function() {
            activeCategory = this.dataset.cat;
            renderFilters();
            renderVideos();
        });
    });
}

function renderVideos() {
    const list = filteredVideos();
    if (list.length === 0) {
        videoGrid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><h3>Nenhum video neste filtro</h3></div>';
        return;
    }
    videoGrid.innerHTML = list.map((video, index) => `
        <article class="video-card" data-id="${video.id}" style="animation-delay:${index * 40}ms">
            <div class="thumb-wrap">
                <video src="${escapeHtml(video.url)}" muted preload="metadata" playsinline></video>
                <div class="thumb-overlay"></div>
                <span class="preview-badge">Preview</span>
                <span class="price-badge">${escapeHtml(formatPrice(video.price))}</span>
            </div>
            <div class="video-info">
                <h3>${escapeHtml(video.title)}</h3>
                <div class="meta">
                    <span>${escapeHtml(video.date)}</span>
                    <span class="category">${escapeHtml(video.category)}</span>
                </div>
            </div>
        </article>
    `).join('');
    document.querySelectorAll('.video-card').forEach(card => {
        card.addEventListener('click', function() {
            openPlayer(this.dataset.id);
        });
    });
}

function renderAdminVideos() {
    const body = document.getElementById('adminVideoList');
    if (!body) return;
    if (!videos.length) {
        body.innerHTML = '<tr><td colspan="4">Nenhum video publicado.</td></tr>';
        return;
    }
    body.innerHTML = videos.map(video => `
        <tr>
            <td>${escapeHtml(video.title)}</td>
            <td>${escapeHtml(video.category)}</td>
            <td>${escapeHtml(formatPrice(video.price))}</td>
            <td>
                <div class="table-actions">
                    <button type="button" data-edit="${video.id}">Editar</button>
                    <button type="button" data-del="${video.id}">Excluir</button>
                </div>
            </td>
        </tr>
    `).join('');
    body.querySelectorAll('[data-edit]').forEach(btn => {
        btn.addEventListener('click', function() {
            openEditModal(this.dataset.edit);
        });
    });
    body.querySelectorAll('[data-del]').forEach(btn => {
        btn.addEventListener('click', function() {
            deleteVideoFromSupabase(this.dataset.del);
        });
    });
}

async function saveVideoToSupabase(title, description, category, price, file) {
    uploadProgress.style.display = 'block';
    progressBar.style.width = '0%';
    progressPercent.textContent = '0%';
    const nomeLimpo = cleanFileName(file.name);
    const extensao = file.name.split('.').pop();
    const fileName = generateSecureId() + '_' + nomeLimpo + '.' + extensao;
    const { error: uploadError } = await sb.storage.from('videos').upload(fileName, file);
    if (uploadError) throw uploadError;
    progressBar.style.width = '70%';
    progressPercent.textContent = '70%';
    const { data: urlData } = sb.storage.from('videos').getPublicUrl(fileName);
    const videoData = {
        title: title,
        description: description || 'Sem descricao',
        category: category || 'Geral',
        url: urlData.publicUrl,
        date: randomDate(),
        price: Number(price) || 0
    };
    const { data: insertData, error: insertError } = await sb.from('videos').insert([videoData]).select();
    if (insertError) {
        const fallback = { ...videoData };
        delete fallback.price;
        const retry = await sb.from('videos').insert([fallback]).select();
        if (retry.error) throw retry.error;
        videos.unshift({ id: retry.data[0].id, ...videoData });
    } else {
        videos.unshift({ id: insertData[0].id, ...videoData });
    }
    progressBar.style.width = '100%';
    progressPercent.textContent = '100%';
    setTimeout(() => { uploadProgress.style.display = 'none'; }, 500);
}

async function updateVideoMeta(id, fields) {
    const payload = {
        title: fields.title,
        description: fields.description,
        category: fields.category,
        price: Number(fields.price) || 0
    };
    let { error } = await sb.from('videos').update(payload).eq('id', id);
    if (error) {
        const fallback = { title: payload.title, description: payload.description, category: payload.category };
        const retry = await sb.from('videos').update(fallback).eq('id', id);
        if (retry.error) throw retry.error;
    }
    const video = videos.find(v => String(v.id) === String(id));
    if (video) Object.assign(video, payload);
    renderVideos();
    renderAdminVideos();
    updateStats();
}

async function deleteVideoFromSupabase(videoId) {
    if (!confirm('Tem certeza que deseja excluir este video?')) return;
    const video = videos.find(v => String(v.id) === String(videoId));
    if (!video) return;
    const fileName = video.url.split('/').pop();
    if (fileName) await sb.storage.from('videos').remove([fileName]);
    await sb.from('videos').delete().eq('id', videoId);
    await sb.from('comments').delete().eq('video_id', videoId);
    videos = videos.filter(v => String(v.id) !== String(videoId));
    renderVideos();
    renderAdminVideos();
    updateStats();
    if (String(currentVideoId) === String(videoId)) {
        showPage('home');
        currentVideoId = null;
    }
}

async function loadComments(videoId) {
    try {
        const { data, error } = await sb.from('comments').select('*').eq('video_id', videoId).order('created_at', { ascending: true });
        if (error) throw error;
        comments = data || [];
        renderComments();
    } catch (error) {
        commentsList.innerHTML = '<p class="muted-center">Erro ao carregar comentarios</p>';
    }
}

function renderComments() {
    if (!comments.length) {
        commentsList.innerHTML = '<p class="muted-center">Nenhum comentario ainda.</p>';
        return;
    }
    commentsList.innerHTML = comments.map(comment => {
        const isAnonymous = comment.author === 'Anonimo' || comment.is_anonymous;
        const autor = isAnonymous ? 'Anonimo' : comment.author || 'Usuario';
        return `
            <div class="comment-item">
                <div class="comment-header">
                    <strong class="comment-author">${escapeHtml(autor)}</strong>
                    <span class="comment-date">${escapeHtml(formatDate(comment.created_at))}</span>
                    ${isAdmin ? '<button class="btn-delete-comment" data-id="' + comment.id + '">X</button>' : ''}
                </div>
                <p class="comment-text">${escapeHtml(comment.content)}</p>
            </div>
        `;
    }).join('');
    document.querySelectorAll('.btn-delete-comment').forEach(btn => {
        btn.addEventListener('click', function() {
            deleteComment(this.dataset.id);
        });
    });
}

async function sendComment(videoId, content, isAnonymous) {
    if (!content.trim()) {
        alert('Digite um comentario!');
        return;
    }
    const commentData = {
        video_id: videoId,
        content: content.trim(),
        author: isAnonymous ? 'Anonimo' : 'Usuario',
        is_anonymous: isAnonymous
    };
    const { error } = await sb.from('comments').insert([commentData]).select();
    if (error) {
        alert('Erro ao enviar comentario: ' + error.message);
        return;
    }
    await loadComments(videoId);
    commentInput.value = '';
    commentAnonymous.checked = false;
}

async function deleteComment(commentId) {
    if (!confirm('Excluir este comentario?')) return;
    await sb.from('comments').delete().eq('id', commentId);
    await loadComments(currentVideoId);
}

function clearPreviewLock() {
    if (previewTimer) {
        clearTimeout(previewTimer);
        previewTimer = null;
    }
    lockOverlay.classList.remove('is-visible');
    playerVideo.controls = true;
}

function armPreviewLock() {
    clearPreviewLock();
    const seconds = Number(siteSettings.previewSeconds) || 12;
    previewTag.textContent = 'Preview de ' + seconds + 's';
    const lockNow = function() {
        playerVideo.pause();
        playerVideo.controls = false;
        lockOverlay.classList.add('is-visible');
    };
    playerVideo.addEventListener('timeupdate', function onTime() {
        if (playerVideo.currentTime >= seconds) {
            playerVideo.removeEventListener('timeupdate', onTime);
            lockNow();
        }
    });
    previewTimer = setTimeout(lockNow, seconds * 1000 + 400);
}

function goToTelegram(video) {
    const href = telegramHref(video);
    if (!href) {
        alert('O proprietario ainda nao definiu o Telegram no painel.');
        return;
    }
    window.open(href, '_blank', 'noopener,noreferrer');
}

function openPlayer(id) {
    const video = videos.find(v => String(v.id) === String(id));
    if (!video) {
        alert('Video nao encontrado!');
        return;
    }
    currentVideoId = id;
    playerVideo.removeAttribute('src');
    playerVideo.src = video.url;
    playerVideo.controls = true;
    playerVideo.setAttribute('controlsList', 'nodownload noplaybackrate noremoteplayback');
    playerVideo.load();
    playerTitle.textContent = video.title;
    playerDesc.textContent = video.description || 'Sem descricao';
    playerCategory.innerHTML = 'Categoria: <span>' + escapeHtml(video.category) + '</span>';
    playerPrice.textContent = formatPrice(video.price);
    btnDelete.style.display = isAdmin ? 'inline-flex' : 'none';
    showPage('player');
    registerVisitor('player', id);
    loadComments(id);
    playerVideo.play().catch(() => {});
    armPreviewLock();
}

function loginAdmin() {
    isAdmin = true;
    btnAdminPanel.style.display = 'inline-flex';
    btnLogout.style.display = 'inline-flex';
    showPage('admin');
    switchTab('dash');
    renderAdminVideos();
    fillSettingsForm();
}

function logoutAdmin() {
    isAdmin = false;
    btnAdminPanel.style.display = 'none';
    btnLogout.style.display = 'none';
    showPage('home');
    renderVideos();
}

function switchTab(name) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('is-active', btn.dataset.tab === name);
    });
    document.getElementById('tabDash').style.display = name === 'dash' ? 'block' : 'none';
    document.getElementById('tabVideos').style.display = name === 'videos' ? 'block' : 'none';
    document.getElementById('tabUpload').style.display = name === 'upload' ? 'block' : 'none';
    document.getElementById('tabSettings').style.display = name === 'settings' ? 'block' : 'none';
}

function openEditModal(id) {
    const video = videos.find(v => String(v.id) === String(id));
    if (!video) return;
    document.getElementById('editVideoId').value = video.id;
    document.getElementById('editTitle').value = video.title;
    document.getElementById('editDesc').value = video.description || '';
    document.getElementById('editCategory').value = video.category;
    document.getElementById('editPrice').value = video.price || 0;
    editModal.style.display = 'grid';
}

function closeEditModal() {
    editModal.style.display = 'none';
}

document.getElementById('logoHome').addEventListener('click', () => {
    showPage('home');
    registerVisitor('home', null);
});

btnHome.addEventListener('click', () => {
    showPage('home');
    registerVisitor('home', null);
    loadVideos();
});

btnAdminPanel.addEventListener('click', () => {
    if (isAdmin) showPage('admin');
});

btnLogout.addEventListener('click', () => {
    if (confirm('Deseja sair do painel?')) logoutAdmin();
});

btnCancelLogin.addEventListener('click', () => showPage('home'));

btnBack.addEventListener('click', () => {
    showPage('home');
    registerVisitor('home', null);
});

btnDelete.addEventListener('click', function() {
    if (!currentVideoId) return;
    deleteVideoFromSupabase(currentVideoId);
});

btnSendComment.addEventListener('click', function() {
    if (!currentVideoId) return;
    sendComment(currentVideoId, commentInput.value, commentAnonymous.checked);
});

commentInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        btnSendComment.click();
    }
});

loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const isValid = await verifyAdminPassword(adminPassword.value);
    if (isValid) {
        loginAdmin();
        uploadForm.reset();
        uploadFile.value = '';
    } else {
        alert('Senha incorreta!');
        adminPassword.value = '';
    }
});

uploadForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    if (!isAdmin) {
        alert('Sem permissao!');
        return;
    }
    const title = document.getElementById('videoTitle').value.trim();
    const description = document.getElementById('videoDesc').value.trim();
    const category = document.getElementById('videoCategory').value;
    const price = document.getElementById('videoPrice').value;
    const file = uploadFile.files[0];
    if (!title) { alert('Digite um titulo.'); return; }
    if (!file) { alert('Selecione um arquivo.'); return; }
    if (file.size > 50 * 1024 * 1024) { alert('Arquivo muito grande! Maximo 50MB.'); return; }
    if (!file.type.startsWith('video/')) { alert('Formato invalido! Use MP4 ou WebM.'); return; }
    try {
        await saveVideoToSupabase(title, description, category, price, file);
        uploadForm.reset();
        uploadFile.value = '';
        await loadVideos();
        switchTab('videos');
        alert('Video publicado!');
    } catch (error) {
        alert('Erro: ' + error.message);
    }
});

document.getElementById('settingsForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const telegram = document.getElementById('telegramInput').value.trim();
    const previewSeconds = Number(document.getElementById('previewSeconds').value) || 12;
    saveSettingsLocal({ telegram, previewSeconds });
    try {
        const { data } = await sb.from('admin_config').select('id').limit(1);
        if (data && data.length) {
            await sb.from('admin_config').update({ telegram, preview_seconds: previewSeconds }).eq('id', data[0].id);
        }
    } catch (error) {
        // settings stay local if extra columns do not exist yet
    }
    alert('Definicoes guardadas.');
});

editForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const id = document.getElementById('editVideoId').value;
    try {
        await updateVideoMeta(id, {
            title: document.getElementById('editTitle').value.trim(),
            description: document.getElementById('editDesc').value.trim(),
            category: document.getElementById('editCategory').value,
            price: document.getElementById('editPrice').value
        });
        closeEditModal();
    } catch (error) {
        alert('Erro ao guardar: ' + error.message);
    }
});

document.getElementById('btnCancelEdit').addEventListener('click', closeEditModal);

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        switchTab(this.dataset.tab);
    });
});

document.getElementById('btnInterest').addEventListener('click', function() {
    const video = videos.find(v => String(v.id) === String(currentVideoId));
    goToTelegram(video);
});

document.getElementById('btnLockTelegram').addEventListener('click', function() {
    const video = videos.find(v => String(v.id) === String(currentVideoId));
    goToTelegram(video);
});

searchInput.addEventListener('input', function() {
    searchTerm = this.value;
    renderVideos();
});

playerVideo.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        if (isAdmin) {
            showPage('admin');
        } else {
            showPage('login');
            adminPassword.value = '';
            adminPassword.focus();
        }
    }
});

window.addEventListener('beforeunload', function() {
    sb.from('live_visitors').delete().eq('session_id', SESSION_ID).then(() => {}).catch(() => {});
});

function maybeOpenSecretAdmin() {
    const hash = (location.hash || '').toLowerCase();
    const query = new URLSearchParams(location.search);
    if (hash === '#painel' || query.get('painel') === '1') {
        if (isAdmin) showPage('admin');
        else {
            showPage('login');
            adminPassword.focus();
        }
    }
}

window.addEventListener('hashchange', maybeOpenSecretAdmin);
maybeOpenSecretAdmin();

applyTelegramLinks();
registerVisitor('home', null);
startVisitorUpdates();
loadRemoteSettings();
loadVideos();
