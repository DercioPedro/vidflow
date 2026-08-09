// ============================================
//  CONFIGURAÇÕES
// ============================================
const ADMIN_PASSWORD = 'admin123';
let isAdmin = false;
let currentVideoId = null;
let videos = [];

console.log('📄 script.js carregado!');

// ============================================
//  REFERÊNCIAS DO SUPABASE
// ============================================
const supabase = window.supabase.createClient(
    'https://gnlixbzycebqvzxpcemx.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdubGl4Ynp5Y2VicXZ6eHBjZW14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyNzE4NTAsImV4cCI6MjEwMTg0Nzg1MH0.LndsCYcFyJdWPD6_25zjtLZSBkNdwRVk6fv6xl1UWJA'
);

console.log('🔷 Supabase conectado no script!');

// ============================================
//  ELEMENTOS DOM
// ============================================
const pageHome = document.getElementById('pageHome');
const pageLogin = document.getElementById('pageLogin');
const pageUpload = document.getElementById('pageUpload');
const pagePlayer = document.getElementById('pagePlayer');

const videoGrid = document.getElementById('videoGrid');
const loadingIndicator = document.getElementById('loadingIndicator');
const uploadForm = document.getElementById('uploadForm');
const uploadFile = document.getElementById('uploadFile');
const uploadProgress = document.getElementById('uploadProgress');
const progressBar = document.getElementById('progressBar');
const progressPercent = document.getElementById('progressPercent');
const btnHome = document.getElementById('btnHome');
const btnAdmin = document.getElementById('btnAdmin');
const btnLogout = document.getElementById('btnLogout');
const btnCancel = document.getElementById('btnCancel');
const btnBack = document.getElementById('btnBack');
const btnCancelLogin = document.getElementById('btnCancelLogin');
const btnDownload = document.getElementById('btnDownload');
const btnDelete = document.getElementById('btnDelete');
const loginForm = document.getElementById('loginForm');
const adminPassword = document.getElementById('adminPassword');

const playerVideo = document.getElementById('playerVideo');
const playerTitle = document.getElementById('playerTitle');
const playerDesc = document.getElementById('playerDesc');
const playerCategory = document.getElementById('playerCategory');

console.log('✅ Elementos DOM carregados');

// ============================================
//  FUNÇÕES
// ============================================

function generateSecureId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function randomDate() {
    const now = new Date();
    const randomOffset = Math.floor(Math.random() * 86400000 * 7);
    const date = new Date(now.getTime() - randomOffset);
    return date.toLocaleDateString('pt-BR');
}

// ============================================
//  CARREGAR VÍDEOS
// ============================================

async function loadVideos() {
    try {
        console.log('📥 Carregando vídeos...');
        loadingIndicator.style.display = 'block';
        
        const { data, error } = await supabase
            .from('videos')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('❌ Erro Supabase:', error);
            throw error;
        }
        
        console.log('📊 Dados recebidos:', data);
        
        videos = data.map(video => ({
            id: video.id,
            title: video.title,
            description: video.description || 'Sem descrição',
            category: video.category || 'Geral',
            url: video.url,
            date: video.date || randomDate()
        }));
        
        renderVideos();
        loadingIndicator.style.display = 'none';
        console.log(`✅ ${videos.length} vídeos carregados`);
    } catch (error) {
        console.error('❌ Erro:', error);
        loadingIndicator.innerHTML = `
            <h3>❌ Erro ao carregar vídeos</h3>
            <p style="color: #888;">${error.message}</p>
            <button onclick="loadVideos()" style="margin-top: 20px; padding: 10px 30px; background: #ff0033; color: #fff; border: none; border-radius: 30px; cursor: pointer;">Tentar novamente</button>
        `;
    }
}

// ============================================
//  RENDERIZAR VÍDEOS
// ============================================

function renderVideos() {
    if (videos.length === 0) {
        videoGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: #666; padding: 60px 0;">
                <h3>📭 Nenhum vídeo disponível</h3>
                <p>Clique em "Admin" para publicar!</p>
            </div>
        `;
        return;
    }

    const shuffledVideos = [...videos].sort(() => Math.random() - 0.5);

    videoGrid.innerHTML = shuffledVideos.map((video) => `
        <div class="video-card" data-id="${video.id}">
            <video src="${video.url}" muted preload="metadata"></video>
            <div class="video-info">
                <h3>${video.title}</h3>
                <div class="meta">
                    <span>${video.date}</span>
                    <span class="category">${video.category}</span>
                </div>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.video-card').forEach(card => {
        card.addEventListener('click', function() {
            const id = this.dataset.id;
            openPlayer(id);
        });
    });
}

// ============================================
//  ABRIR PLAYER
// ============================================

function openPlayer(id) {
    const video = videos.find(v => v.id === id);
    if (!video) {
        alert('❌ Vídeo não encontrado!');
        return;
    }

    currentVideoId = id;
    playerVideo.src = video.url;
    playerVideo.load();
    playerVideo.play();
    playerTitle.textContent = video.title;
    playerDesc.textContent = video.description || 'Sem descrição';
    playerCategory.innerHTML = `<span>${video.category}</span>`;

    btnDownload.style.display = 'block';
    btnDelete.style.display = isAdmin ? 'block' : 'none';

    pageHome.style.display = 'none';
    pageLogin.style.display = 'none';
    pageUpload.style.display = 'none';
    pagePlayer.style.display = 'block';
}

// ============================================
//  SALVAR VÍDEO
// ============================================

async function saveVideoToSupabase(title, description, category, file) {
    try {
        uploadProgress.style.display = 'block';
        progressBar.style.width = '0%';
        progressPercent.textContent = '0%';
        
        const fileName = `${generateSecureId()}_${file.name}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('videos')
            .upload(fileName, file);
        
        if (uploadError) throw uploadError;
        
        progressBar.style.width = '70%';
        progressPercent.textContent = '70%';
        
        const { data: urlData } = supabase.storage.from('videos').getPublicUrl(fileName);
        const downloadURL = urlData.publicUrl;
        
        const videoData = {
            title: title,
            description: description || 'Sem descrição',
            category: category || 'Geral',
            url: downloadURL,
            date: randomDate()
        };
        
        const { data: insertData, error: insertError } = await supabase
            .from('videos')
            .insert([videoData])
            .select();
        
        if (insertError) throw insertError;
        
        const newVideo = insertData[0];
        videos.unshift({ id: newVideo.id, ...videoData });
        renderVideos();
        
        progressBar.style.width = '100%';
        progressPercent.textContent = '100%';
        
        setTimeout(() => {
            uploadProgress.style.display = 'none';
        }, 500);
        
        return newVideo.id;
    } catch (error) {
        console.error('Erro:', error);
        uploadProgress.style.display = 'none';
        throw error;
    }
}

// ============================================
//  EXCLUIR VÍDEO
// ============================================

async function deleteVideoFromSupabase(videoId) {
    if (!confirm('🗑️ Tem certeza que deseja excluir este vídeo?')) return;
    
    const video = videos.find(v => v.id === videoId);
    if (!video) {
        alert('❌ Vídeo não encontrado!');
        return;
    }
    
    const urlParts = video.url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    
    if (fileName) {
        await supabase.storage.from('videos').remove([fileName]);
    }
    
    await supabase.from('videos').delete().eq('id', videoId);
    
    videos = videos.filter(v => v.id !== videoId);
    renderVideos();
    
    pagePlayer.style.display = 'none';
    btnDownload.style.display = 'none';
    btnDelete.style.display = 'none';
    pageHome.style.display = 'block';
    
    alert('✅ Vídeo excluído!');
}

// ============================================
//  ADMIN
// ============================================

function loginAdmin() {
    isAdmin = true;
    btnAdmin.textContent = '📝 Publicar';
    btnAdmin.classList.add('admin-logged');
    btnLogout.style.display = 'inline-block';
    pageLogin.style.display = 'none';
    pageUpload.style.display = 'block';
}

function logoutAdmin() {
    isAdmin = false;
    btnAdmin.textContent = '🔒 Admin';
    btnAdmin.classList.remove('admin-logged');
    btnLogout.style.display = 'none';
    pageUpload.style.display = 'none';
    pageLogin.style.display = 'none';
    pageHome.style.display = 'block';
    renderVideos();
}

// ============================================
//  EVENTOS
// ============================================

btnHome.addEventListener('click', () => {
    pageHome.style.display = 'block';
    pageLogin.style.display = 'none';
    pageUpload.style.display = 'none';
    pagePlayer.style.display = 'none';
    btnDownload.style.display = 'none';
    btnDelete.style.display = 'none';
    playerVideo.pause();
    loadVideos();
});

btnAdmin.addEventListener('click', () => {
    if (isAdmin) {
        pageHome.style.display = 'none';
        pageLogin.style.display = 'none';
        pageUpload.style.display = 'block';
        pagePlayer.style.display = 'none';
    } else {
        pageHome.style.display = 'none';
        pageLogin.style.display = 'block';
        pageUpload.style.display = 'none';
        pagePlayer.style.display = 'none';
        adminPassword.value = '';
    }
});

btnLogout.addEventListener('click', () => {
    if (confirm('Deseja sair?')) logoutAdmin();
});

btnCancelLogin.addEventListener('click', () => {
    pageHome.style.display = 'block';
    pageLogin.style.display = 'none';
});

btnCancel.addEventListener('click', () => {
    if (isAdmin) {
        pageHome.style.display = 'block';
        pageUpload.style.display = 'none';
        loadVideos();
    }
});

btnBack.addEventListener('click', () => {
    pageHome.style.display = 'block';
    pagePlayer.style.display = 'none';
    btnDownload.style.display = 'none';
    btnDelete.style.display = 'none';
    playerVideo.pause();
    loadVideos();
});

btnDownload.addEventListener('click', function() {
    if (!currentVideoId) {
        alert('❌ Nenhum vídeo selecionado.');
        return;
    }
    const video = videos.find(v => v.id === currentVideoId);
    if (!video) {
        alert('❌ Vídeo não encontrado.');
        return;
    }
    if (confirm(`⬇️ Baixar "${video.title}"?`)) {
        const link = document.createElement('a');
        link.href = video.url;
        link.download = `${video.title.replace(/[^a-zA-Z0-9]/g, '_')}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});

btnDelete.addEventListener('click', function() {
    if (!currentVideoId) return;
    deleteVideoFromSupabase(currentVideoId);
});

// ============================================
//  LOGIN
// ============================================

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const password = adminPassword.value;
    if (password === ADMIN_PASSWORD) {
        loginAdmin();
        document.getElementById('uploadForm').reset();
        uploadFile.value = '';
    } else {
        alert('❌ Senha incorreta!');
        adminPassword.value = '';
    }
});

// ============================================
//  UPLOAD
// ============================================

uploadForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    if (!isAdmin) {
        alert('⛔ Sem permissão!');
        return;
    }

    const title = document.getElementById('videoTitle').value.trim();
    const description = document.getElementById('videoDesc').value.trim();
    const category = document.getElementById('videoCategory').value;
    const file = uploadFile.files[0];

    if (!title) {
        alert('Digite um título.');
        return;
    }
    if (!file) {
        alert('Selecione um arquivo.');
        return;
    }
    if (file.size > 50 * 1024 * 1024) {
        alert('Arquivo muito grande! Máximo 50MB.');
        return;
    }
    if (!file.type.startsWith('video/')) {
        alert('Formato inválido! Use MP4 ou WebM.');
        return;
    }

    try {
        await saveVideoToSupabase(title, description, category, file);
        pageHome.style.display = 'block';
        pageUpload.style.display = 'none';
        uploadForm.reset();
        uploadFile.value = '';
        await loadVideos();
        alert('✅ Vídeo publicado!');
    } catch (error) {
        alert('❌ Erro: ' + error.message);
    }
});

// ============================================
//  ATALHO ADMIN
// ============================================

document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        btnAdmin.click();
    }
});

// ============================================
//  INICIALIZAR
// ============================================

console.log('🚀 Inicializando VidFlow...');
loadVideos();
console.log('🎬 VidFlow pronto!');
console.log('🔐 Pressione Ctrl+Shift+A para acessar o admin');
