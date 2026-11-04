const SITE_SETTINGS_KEY = 'vb_site_settings';
const LANG_KEY = 'vb_lang';
const DEFAULT_SETTINGS = {
    telegram: '',
    previewSeconds: 12
};

const I18N = {
    en: {
        pageTitle: 'Mega Content — Exclusive Catalog',
        logoTag: 'Exclusive catalog',
        navCatalog: 'Catalog',
        navPanel: 'Panel',
        navLogout: 'Log out',
        online: 'online',
        heroKicker: 'Private collection · Delivered via Telegram',
        heroTitle: 'Exclusive content,<br />selected for you.',
        heroLead: 'Browse the catalog, watch the preview and buy the original video directly from the owner.',
        viewCatalog: 'View catalog',
        talkTelegram: 'Talk on Telegram',
        statTitles: 'titles',
        statCats: 'categories',
        statOnline: 'online now',
        searchPlaceholder: 'Search title or category...',
        loadingCatalog: 'Loading catalog...',
        loadError: 'Could not load videos',
        emptyFilter: 'No videos in this filter',
        all: 'All',
        loginKicker: 'Restricted access',
        loginTitle: 'Management panel',
        loginLead: 'Owner only. Enter the password to manage the catalog.',
        adminPassword: 'Admin password',
        loginEnter: 'Enter panel',
        backCatalog: 'Back to catalog',
        adminKicker: 'Full management',
        adminTitle: 'Owner panel',
        tabDash: 'Overview',
        tabVideos: 'Videos',
        tabUpload: 'Publish',
        tabSettings: 'Settings',
        dashVideos: 'Videos in catalog',
        dashOnline: 'Visitors online',
        adminHint: 'Everything is managed here: prices, uploads, deletions and the Telegram contact. The public never sees this panel.',
        colTitle: 'Title',
        colCategory: 'Category',
        colPrice: 'Price',
        colSize: 'Size',
        colActions: 'Actions',
        noVideos: 'No videos published.',
        uploading: 'Uploading...',
        labelTitle: 'Video title',
        phTitle: 'Commercial title',
        labelDesc: 'Description',
        phDesc: 'Description shown in the catalog',
        labelCategory: 'Category',
        labelPrice: 'Price (MT)',
        labelFile: 'Video file',
        fileHint: 'Formats: MP4, WebM (max. 50MB). The public only sees a 12-second preview.',
        publish: 'Publish to catalog',
        labelTelegram: 'Telegram username or link',
        telegramHint: 'Anyone interested is redirected here with the video title and price.',
        labelPreview: 'Public preview length (seconds)',
        saveSettings: 'Save settings',
        previewEnded: 'Preview ended',
        buyFull: 'Get the full video',
        buyFullLead: 'The original file is delivered by the owner on Telegram.',
        imInterested: "I'm interested",
        buyNow: 'Buy now',
        buyCopy: 'Payment and original file delivery via Telegram. No download on this page.',
        pointPrice: 'Price set by the owner',
        pointNoDl: 'No public download',
        pointTg: 'Direct deal on Telegram',
        editVideo: 'Edit video',
        save: 'Save',
        cancel: 'Cancel',
        deleteVideo: 'Delete video',
        footerCopy: 'Private catalog. Videos for sale, delivered via Telegram.',
        footerNote: 'Protected content. Download disabled.',
        unknownSize: 'Size unknown',
        noTelegram: 'The owner has not set a Telegram contact yet.',
        notFound: 'Video not found!',
        wrongPassword: 'Incorrect password!',
        noPermission: 'No permission!',
        needTitle: 'Enter a title.',
        needFile: 'Select a file.',
        fileTooBig: 'File too large! Maximum 50MB.',
        badFormat: 'Invalid format! Use MP4 or WebM.',
        published: 'Video published!',
        settingsSaved: 'Settings saved.',
        saveError: 'Could not save: ',
        confirmDelete: 'Delete this video?',
        confirmLogout: 'Leave the panel?',
        telegramInterest: 'Hi, I am interested in the video "{title}" for {price}.',
        previewTag: '{n}s preview',
        noDesc: 'No description',
        categoryLabel: 'Category: ',
        notSet: 'Not set',
        edit: 'Edit',
        remove: 'Delete'
    },
    pt: {
        pageTitle: 'Mega Content — Catalogo Exclusivo',
        logoTag: 'Catalogo exclusivo',
        navCatalog: 'Catalogo',
        navPanel: 'Painel',
        navLogout: 'Sair',
        online: 'online',
        heroKicker: 'Colecao privada · Entrega via Telegram',
        heroTitle: 'Conteudo exclusivo,<br />selecionado para voce.',
        heroLead: 'Navegue o catalogo, veja o preview e adquira o video original diretamente com o proprietario.',
        viewCatalog: 'Ver catalogo',
        talkTelegram: 'Falar no Telegram',
        statTitles: 'titulos',
        statCats: 'categorias',
        statOnline: 'online agora',
        searchPlaceholder: 'Buscar titulo ou categoria...',
        loadingCatalog: 'A carregar catalogo...',
        loadError: 'Erro ao carregar videos',
        emptyFilter: 'Nenhum video neste filtro',
        all: 'Todos',
        loginKicker: 'Acesso restrito',
        loginTitle: 'Painel de gestao',
        loginLead: 'Apenas o proprietario. Digite a senha para gerir o catalogo.',
        adminPassword: 'Senha de administrador',
        loginEnter: 'Entrar no painel',
        backCatalog: 'Voltar ao catalogo',
        adminKicker: 'Gestao completa',
        adminTitle: 'Painel do proprietario',
        tabDash: 'Resumo',
        tabVideos: 'Videos',
        tabUpload: 'Publicar',
        tabSettings: 'Definicoes',
        dashVideos: 'Videos no catalogo',
        dashOnline: 'Visitantes online',
        adminHint: 'Tudo e gerido aqui: precos, publicacoes, exclusoes e o contacto do Telegram. O publico nao ve este painel.',
        colTitle: 'Titulo',
        colCategory: 'Categoria',
        colPrice: 'Preco',
        colSize: 'Tamanho',
        colActions: 'Acoes',
        noVideos: 'Nenhum video publicado.',
        uploading: 'A enviar...',
        labelTitle: 'Titulo do video',
        phTitle: 'Titulo comercial',
        labelDesc: 'Descricao',
        phDesc: 'Descricao visivel no catalogo',
        labelCategory: 'Categoria',
        labelPrice: 'Preco (MT)',
        labelFile: 'Arquivo de video',
        fileHint: 'Formatos: MP4, WebM (max. 50MB). O publico ve apenas um preview de 12 segundos.',
        publish: 'Publicar no catalogo',
        labelTelegram: 'Utilizador ou link do Telegram',
        telegramHint: 'Quem tiver interesse e redirecionado para este contacto, com o titulo e o preco do video.',
        labelPreview: 'Duracao do preview publico (segundos)',
        saveSettings: 'Guardar definicoes',
        previewEnded: 'Preview encerrado',
        buyFull: 'Adquira o video completo',
        buyFullLead: 'O ficheiro original e entregue pelo proprietario no Telegram.',
        imInterested: 'Tenho interesse',
        buyNow: 'Adquirir agora',
        buyCopy: 'Pagamento e entrega do ficheiro original via Telegram. Sem download nesta pagina.',
        pointPrice: 'Preco definido pelo proprietario',
        pointNoDl: 'Sem download publico',
        pointTg: 'Negociacao direta no Telegram',
        editVideo: 'Editar video',
        save: 'Guardar',
        cancel: 'Cancelar',
        deleteVideo: 'Excluir video',
        footerCopy: 'Catalogo privado. Videos a venda, entrega via Telegram.',
        footerNote: 'Conteudo protegido. Download desativado.',
        unknownSize: 'Tamanho desconhecido',
        noTelegram: 'O proprietario ainda nao definiu o Telegram no painel.',
        notFound: 'Video nao encontrado!',
        wrongPassword: 'Senha incorreta!',
        noPermission: 'Sem permissao!',
        needTitle: 'Digite um titulo.',
        needFile: 'Selecione um arquivo.',
        fileTooBig: 'Arquivo muito grande! Maximo 50MB.',
        badFormat: 'Formato invalido! Use MP4 ou WebM.',
        published: 'Video publicado!',
        settingsSaved: 'Definicoes guardadas.',
        saveError: 'Erro ao guardar: ',
        confirmDelete: 'Tem certeza que deseja excluir este video?',
        confirmLogout: 'Deseja sair do painel?',
        telegramInterest: 'Ola, tenho interesse no video "{title}" por {price}.',
        previewTag: 'Preview de {n}s',
        noDesc: 'Sem descricao',
        categoryLabel: 'Categoria: ',
        notSet: 'Nao definido',
        edit: 'Editar',
        remove: 'Excluir'
    }
};

let currentLang = localStorage.getItem(LANG_KEY) || 'en';
if (currentLang !== 'pt') currentLang = 'en';

function t(key) {
    return (I18N[currentLang] && I18N[currentLang][key]) || I18N.en[key] || key;
}

function applyLanguage() {
    document.documentElement.lang = currentLang === 'pt' ? 'pt' : 'en';
    document.title = t('pageTitle');
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        el.innerHTML = t(el.getAttribute('data-i18n-html'));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
    });
    document.querySelectorAll('#langSwitch button').forEach(btn => {
        btn.classList.toggle('is-active', btn.dataset.lang === currentLang);
    });
    const seconds = Number(siteSettings.previewSeconds) || 12;
    if (previewTag) previewTag.textContent = t('previewTag').replace('{n}', seconds);
    renderFilters();
    renderVideos();
    renderAdminVideos();
    applyTelegramLinks();
}

let isAdmin = false;
let currentVideoId = null;
let videos = [];
let activeCategory = 'all';
let searchTerm = '';
let previewTimer = null;
let siteSettings = loadSettings();

const sb = window.supabase.createClient(
    'https://bqoouqqflpbjptjeajpo.supabase.co',
    'sb_publishable__Rg5iR8ICxeQZFtH01GMEw_9r9hD9Te'
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
        t('telegramInterest').replace('{title}', video.title).replace('{price}', formatPrice(video.price))
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
    if (!Number.isFinite(amount) || amount < 0) return '—';
    return amount.toLocaleString(currentLang === 'pt' ? 'pt-MZ' : 'en-US') + ' MT';
}

function formatBytes(bytes) {
    const size = Number(bytes);
    if (!Number.isFinite(size) || size <= 0) return t('unknownSize');
    if (size < 1024) return size + ' B';
    if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
    return (size / (1024 * 1024)).toFixed(1) + ' MB';
}

function generateSecureId() {
    return Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
}

function randomDate() {
    const now = new Date();
    const randomOffset = Math.floor(Math.random() * 86400000 * 7);
    const date = new Date(now.getTime() - randomOffset);
    return date.toLocaleDateString(currentLang === 'pt' ? 'pt-BR' : 'en-US');
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
const playerPriceInline = document.getElementById('playerPriceInline');
const playerSize = document.getElementById('playerSize');
const buySize = document.getElementById('buySize');
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
        el.style.display = href ? 'inline-flex' : 'none';
        if (href) el.href = href;
    });
    const dashTelegram = document.getElementById('dashTelegram');
    if (dashTelegram) dashTelegram.textContent = siteSettings.telegram || t('notSet');
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

async function fetchVideoSize(url) {
    try {
        const res = await fetch(url, { method: 'HEAD' });
        const len = res.headers.get('content-length');
        const size = Number(len);
        return Number.isFinite(size) && size > 0 ? size : 0;
    } catch (error) {
        return 0;
    }
}

async function hydrateVideoSizes() {
    await Promise.all(videos.map(async video => {
        if (video.size) return;
        video.size = await fetchVideoSize(video.url);
    }));
    renderVideos();
    renderAdminVideos();
}

async function loadVideos() {
    try {
        loadingIndicator.style.display = 'block';
        const { data, error } = await sb.from('videos').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        videos = (data || []).map(video => ({
            id: video.id,
            title: video.title,
            description: video.description || t('noDesc'),
            category: video.category || 'Geral',
            url: video.url,
            date: video.date || randomDate(),
            price: video.price != null ? Number(video.price) : 0,
            size: video.size != null ? Number(video.size) : 0
        }));
        renderFilters();
        renderVideos();
        renderAdminVideos();
        updateStats();
        loadingIndicator.style.display = 'none';
        hydrateVideoSizes();
    } catch (error) {
        loadingIndicator.innerHTML = '<h3>' + t('loadError') + '</h3><p>' + escapeHtml(error.message) + '</p>';
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
        const matchCat = activeCategory === 'all' || video.category === activeCategory;
        const q = searchTerm.trim().toLowerCase();
        const matchSearch = !q || video.title.toLowerCase().includes(q) || (video.category || '').toLowerCase().includes(q);
        return matchCat && matchSearch;
    });
}

function renderFilters() {
    if (!categoryFilters) return;
    const cats = ['all', ...Array.from(new Set(videos.map(v => v.category).filter(Boolean)))];
    categoryFilters.innerHTML = cats.map(cat => {
        const label = cat === 'all' ? t('all') : cat;
        return '<button type="button" class="filter-chip' + (cat === activeCategory ? ' is-active' : '') + '" data-cat="' + escapeHtml(cat) + '">' + escapeHtml(label) + '</button>';
    }).join('');
    categoryFilters.querySelectorAll('.filter-chip').forEach(btn => {
        btn.addEventListener('click', function() {
            activeCategory = this.dataset.cat;
            renderFilters();
            renderVideos();
        });
    });
}

function renderVideos() {
    if (!videoGrid) return;
    const list = filteredVideos();
    if (list.length === 0) {
        videoGrid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><h3>' + t('emptyFilter') + '</h3></div>';
        return;
    }
    videoGrid.innerHTML = list.map((video, index) => `
        <article class="video-card" data-id="${video.id}" style="animation-delay:${index * 40}ms">
            <div class="thumb-wrap">
                <video src="${escapeHtml(video.url)}" muted preload="metadata" playsinline></video>
                <div class="thumb-overlay"></div>
                <span class="preview-badge">Preview</span>
            </div>
            <div class="video-info">
                <h3>${escapeHtml(video.title)}</h3>
                <div class="card-price">${escapeHtml(formatPrice(video.price))}</div>
                <div class="card-size">${escapeHtml(formatBytes(video.size))}</div>
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
        body.innerHTML = '<tr><td colspan="5">' + t('noVideos') + '</td></tr>';
        return;
    }
    body.innerHTML = videos.map(video => `
        <tr>
            <td>${escapeHtml(video.title)}</td>
            <td>${escapeHtml(video.category)}</td>
            <td>${escapeHtml(formatPrice(video.price))}</td>
            <td>${escapeHtml(formatBytes(video.size))}</td>
            <td>
                <div class="table-actions">
                    <button type="button" data-edit="${video.id}">${t('edit')}</button>
                    <button type="button" data-del="${video.id}">${t('remove')}</button>
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
        description: description || t('noDesc'),
        category: category || 'Geral',
        url: urlData.publicUrl,
        date: randomDate(),
        price: Number(price) || 0,
        size: file.size || 0
    };
    const { data: insertData, error: insertError } = await sb.from('videos').insert([videoData]).select();
    if (insertError) {
        const fallback = { ...videoData };
        delete fallback.price;
        delete fallback.size;
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
    if (!confirm(t('confirmDelete'))) return;
    const video = videos.find(v => String(v.id) === String(videoId));
    if (!video) return;
    const fileName = video.url.split('/').pop();
    if (fileName) await sb.storage.from('videos').remove([fileName]);
    await sb.from('videos').delete().eq('id', videoId);
    videos = videos.filter(v => String(v.id) !== String(videoId));
    renderVideos();
    renderAdminVideos();
    updateStats();
    if (String(currentVideoId) === String(videoId)) {
        showPage('home');
        currentVideoId = null;
    }
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
    previewTag.textContent = t('previewTag').replace('{n}', seconds);
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
        alert(t('noTelegram'));
        return;
    }
    window.open(href, '_blank', 'noopener,noreferrer');
}

function openPlayer(id) {
    const video = videos.find(v => String(v.id) === String(id));
    if (!video) {
        alert(t('notFound'));
        return;
    }
    currentVideoId = id;
    playerVideo.removeAttribute('src');
    playerVideo.src = video.url;
    playerVideo.controls = true;
    playerVideo.setAttribute('controlsList', 'nodownload noplaybackrate noremoteplayback');
    playerVideo.load();
    playerTitle.textContent = video.title;
    playerDesc.textContent = video.description || t('noDesc');
    playerCategory.innerHTML = t('categoryLabel') + '<span>' + escapeHtml(video.category) + '</span>';
    const priceText = formatPrice(video.price);
    const sizeText = formatBytes(video.size);
    playerPrice.textContent = priceText;
    if (playerPriceInline) playerPriceInline.textContent = priceText;
    if (playerSize) playerSize.textContent = sizeText;
    if (buySize) buySize.textContent = sizeText;
    btnDelete.style.display = isAdmin ? 'inline-flex' : 'none';
    showPage('player');
    registerVisitor('player', id);
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
    if (confirm(t('confirmLogout'))) logoutAdmin();
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

loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const isValid = await verifyAdminPassword(adminPassword.value);
    if (isValid) {
        loginAdmin();
        uploadForm.reset();
        uploadFile.value = '';
    } else {
        alert(t('wrongPassword'));
        adminPassword.value = '';
    }
});

uploadForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    if (!isAdmin) {
        alert(t('noPermission'));
        return;
    }
    const title = document.getElementById('videoTitle').value.trim();
    const description = document.getElementById('videoDesc').value.trim();
    const category = document.getElementById('videoCategory').value;
    const price = document.getElementById('videoPrice').value;
    const file = uploadFile.files[0];
    if (!title) { alert(t('needTitle')); return; }
    if (!file) { alert(t('needFile')); return; }
    if (file.size > 50 * 1024 * 1024) { alert(t('fileTooBig')); return; }
    if (!file.type.startsWith('video/')) { alert(t('badFormat')); return; }
    try {
        await saveVideoToSupabase(title, description, category, price, file);
        uploadForm.reset();
        uploadFile.value = '';
        await loadVideos();
        switchTab('videos');
        alert(t('published'));
    } catch (error) {
        alert(error.message);
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
    alert(t('settingsSaved'));
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
        alert(t('saveError') + error.message);
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

document.getElementById('langSwitch').addEventListener('click', function(e) {
    const btn = e.target.closest('button[data-lang]');
    if (!btn) return;
    currentLang = btn.dataset.lang === 'pt' ? 'pt' : 'en';
    localStorage.setItem(LANG_KEY, currentLang);
    applyLanguage();
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

applyLanguage();
applyTelegramLinks();
registerVisitor('home', null);
startVisitorUpdates();
loadRemoteSettings();
loadVideos();
