// ============================================
//  CONFIGURAÇÕES
// ============================================
const ADMIN_PASSWORD = 'admin123';
let isAdmin = false;
let currentVideoId = null;
let videos = [];

// ============================================
//  REFERÊNCIAS DO SUPABASE
// ============================================
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

// ============================================
//  FUNÇÕES DE ANONIMATO
// ============================================

function generateSecureId() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
}

function randomDate() {
    const now = new Date();
    const randomOffset = Math.floor(Math.random() * 86400000 * 7);
    const date = new Date(now.getTime() - randomOffset);
    return date.toLocaleDateString('pt-BR');
}

// ============================================
//  BANCO DE DADOS - OPERAÇÕES
// ============================================

// Carregar vídeos do Supabase
async function loadVideos() {
    try {
        loadingIndicator.style.display = 'block';
        
        const { data, error } = await supabase
            .from('videos')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        videos = data.map(video => ({
            id: video.id,
            title: video.title,
            description: video.description || 'Sem descrição',
            category: video.category || 'Geral',
            url: video.url,
            date: video.date || randomDate(),
            created_at: video.created_at
        }));
        
        renderVideos();
        loadingIndicator.style.display = 'none';
        
        console.log(`📹 ${videos.length} vídeos carregados do Supabase`);
    } catch (error) {
        console.error('Erro ao carregar vídeos:', error);
        loadingIndicator.innerHTML = `
            <h3>❌ Erro ao carregar vídeos</h3>
            <p style="color: #888;">${error.message}</p>
            <button onclick="loadVideos()" style="margin-top: 20px; padding: 10px 30px; background: #ff0033; color: #fff; border: none; border-radius: 30px; cursor: pointer;">Tentar novamente</button>
        `;
    }
}

// Salvar vídeo no Supabase
async function saveVideoToSupabase(title, description, category, file) {
    try {
        // 1. Mostrar progresso
        uploadProgress.style.display = 'block';
        progressBar.style.width = '0%';
        progressPercent.textContent = '0%';
        
        // 2. Gerar nome único para o arquivo
        const fileName = `${generateSecureId()}_${file.name}`;
        
        // 3. Upload do vídeo para o Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('videos')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });
        
        if (uploadError) throw uploadError;
        
        // 4. Atualizar progresso
        progressBar.style.width = '70%';
        progressPercent.textContent = '70%';
        
        // 5. Obter URL pública do vídeo
        const { data: urlData } = supabase.storage
            .from('videos')
            .getPublicUrl(fileName);
        
        const downloadURL = urlData.publicUrl;
        
        // 6. Salvar dados no banco
        const videoData = {
            title: title,
            description: description || 'Sem descrição',
            category: category || 'Geral',
            url: downloadURL,
            date: randomDate(),
            created_at: new Date().toISOString()
        };
        
        const { data: insertData, error: insertError } = await supabase
            .from('videos')
            .insert([videoData])
            .select();
        
        if (insertError) throw insertError;
        
        // 7. Adicionar à lista local
        const newVideo = insertData[0];
        videos.unshift({
            id: newVideo.id,
            ...videoData
        });
        
        renderVideos();
        
        // 8. Progresso 100%
        progressBar.style.width = '100%';
        progressPercent.textContent = '100%';
        
        setTimeout(() => {
            uploadProgress.style.display = 'none';
        }, 500);
        
        return newVideo.id;
    } catch (error) {
        console.error('Erro ao salvar vídeo:', error);
        uploadProgress.style.display = 'none';
        throw error;
    }
}

// Excluir vídeo do Supabase
async function deleteVideoFromSupabase(videoId) {
    try {
        if (!confirm('🗑️ Tem certeza que deseja excluir este vídeo?')) {
            return;
        }
        
        // 1. Buscar o vídeo
        const video = videos.find(v => v.id === videoId);
        if (!video) {
            alert('❌ Vídeo não encontrado!');
            return;
        }
        
        // 2. Extrair nome do arquivo da URL
        const urlParts = video.url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        
        // 3. Excluir do Storage
        if (fileName) {
            const { error: storageError } = await supabase.storage
                .from('videos')
                .remove([fileName]);
            
            if (storageError) {
                console.log('⚠️ Erro ao excluir do Storage:', storageError);
            }
        }
        
        // 4. Excluir do banco de dados
        const { error: dbError } = await supabase
            .from('videos')
            .delete()
            .eq('id', videoId);
        
        if (dbError) throw dbError;
        
        // 5. Remover da lista local
        videos = videos.filter(v => v.id !== videoId);
        renderVideos();
        
        // 6. Fechar player
        pagePlayer.style.display = 'none';
        btnDownload.style.display = 'none';
        btnDelete.style.display = 'none';
        pageHome.style.display = 'block';
        
        alert('✅ Vídeo excluído com sucesso!');
    } catch (error) {
        console.error('Erro ao excluir vídeo:', error);
        alert('❌ Erro ao excluir vídeo: ' + error.message);
    }
}

// ============================================
//  FUNÇÕES PRINCIPAIS
// ============================================

function renderVideos() {
    if (videos.length === 0) {
        videoGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: #666; padding: 60px 0;">
                <h3>📭 Nenhum vídeo disponível</h3>
                <p style="margin-top: 10px;">Clique em "Admin" para publicar!</p>
            </div>
        `;
        return;
    }

    // Embaralhar para não mostrar padrão
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

function openPlayer(id) {
    const video = videos.find(v => v.id === id);
    if (!video) {
        alert('❌ Vídeo não encontrado!');
        return;
    }

    currentVideoId = id;

    // CARREGAR O VÍDEO
    playerVideo.src = video.url;
    playerVideo.load();
    playerVideo.play();

    // ATUALIZAR INFORMAÇÕES
    playerTitle.textContent = video.title;
    playerDesc.textContent = video.description || 'Sem descrição';
    playerCategory.innerHTML = `<span>${video.category}</span>`;

    // MOSTRAR BOTÕES
    btnDownload.style.display = 'block';
    btnDelete.style.display = isAdmin ? 'block' : 'none';

    // MOSTRAR PLAYER
    pageHome.style.display = 'none';
    pageLogin.style.display = 'none';
    pageUpload.style.display = 'none';
    pagePlayer.style.display = 'block';
}

// ============================================
//  DOWNLOAD
// ============================================

function downloadVideo(videoUrl, videoTitle) {
    const link = document.createElement('a');
    link.href = videoUrl;
    const safeName = videoTitle.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
    link.download = `${safeName}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log('⬇️ Download realizado');
}

// ============================================
//  ADMIN
// ============================================

function loginAdmin() {
    isAdmin = true;
    btnAdmin.textContent = '📝 Publicar';
    btnAdmin.classList.add('admin-logged');
    btnLogout.style.display = 'inline-block';
    
    const logo = document.querySelector('.logo');
    if (!document.querySelector('.admin-badge')) {
        const badge = document.createElement('span');
        badge.className = 'admin-badge';
        badge.textContent = '⚡';
        logo.appendChild(badge);
    }
    
    pageLogin.style.display = 'none';
    pageUpload.style.display = 'block';
}

function logoutAdmin() {
    isAdmin = false;
    btnAdmin.textContent = '🔒 Admin';
    btnAdmin.classList.remove('admin-logged');
    btnLogout.style.display = 'none';
    
    const badge = document.querySelector('.admin-badge');
    if (badge) badge.remove();
    
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
        adminPassword.focus();
    }
});

btnLogout.addEventListener('click', () => {
    if (confirm('Deseja sair?')) {
        logoutAdmin();
    }
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

// ============================================
//  DOWNLOAD
// ============================================

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
        downloadVideo(video.url, video.title);
    }
});

// ============================================
//  EXCLUIR VÍDEO
// ============================================

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
        adminPassword.focus();
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
        alert('Selecione um arquivo de vídeo.');
        return;
    }

    if (file.size > 50 * 1024 * 1024) {
        alert('Arquivo muito grande! Máximo 50MB no plano gratuito do Supabase.');
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
        
        alert('✅ Vídeo publicado com sucesso!');
    } catch (error) {
        alert('❌ Erro ao publicar: ' + error.message);
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

loadVideos();
console.log('🎬 VidFlow com Supabase!');
console.log('🔐 Pressione Ctrl+Shift+A para acessar o admin');
console.log('🔷 Supabase conectado!');