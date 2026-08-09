// ============================================
//  CONFIGURACOES
// ============================================
const ADMIN_PASSWORD = 'admin123';
let isAdmin = false;
let currentVideoId = null;
let videos = [];
let comments = [];

console.log('script.js carregado!');

// ============================================
//  SUPABASE
// ============================================
const sb = window.supabase.createClient(
    'https://gnlixbzycebqvzxpcemx.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdubGl4Ynp5Y2VicXZ6eHBjZW14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyNzE4NTAsImV4cCI6MjEwMTg0Nzg1MH0.LndsCYcFyJdWPD6_25zjtLZSBkNdwRVk6fv6xl1UWJA'
);

console.log('Supabase conectado!');

// ============================================
//  FUNCAO PARA LIMPAR NOME DO ARQUIVO
// ============================================

function cleanFileName(fileName) {
    const semAcentos = fileName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const limpo = semAcentos.replace(/[^a-zA-Z0-9_.-]/g, '_');
    return limpo.replace(/[^\w\-_.]/g, '').substring(0, 50);
}

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

const commentInput = document.getElementById('commentInput');
const commentAnonymous = document.getElementById('commentAnonymous');
const btnSendComment = document.getElementById('btnSendComment');
const commentsList = document.getElementById('commentsList');

console.log('Elementos DOM carregados');

// ============================================
//  FUNCOES GERAIS
// ============================================

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

// ============================================
//  VIDEOS - CRUD
// ============================================

async function loadVideos() {
    try {
        console.log('Carregando videos...');
        loadingIndicator.style.display = 'block';
        
        const { data, error } = await sb
            .from('videos')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        videos = data.map(video => ({
            id: video.id,
            title: video.title,
            description: video.description || 'Sem descricao',
            category: video.category || 'Geral',
            url: video.url,
            date: video.date || randomDate()
        }));
        
        renderVideos();
        loadingIndicator.style.display = 'none';
        console.log(videos.length + ' videos carregados');
    } catch (error) {
        console.error('Erro:', error);
        loadingIndicator.innerHTML = `
            <h3>Erro ao carregar videos</h3>
            <p style="color: #888;">${error.message}</p>
            <button onclick="loadVideos()" style="margin-top: 20px; padding: 10px 30px; background: #ff0033; color: #fff; border: none; border-radius: 30px; cursor: pointer;">Tentar novamente</button>
        `;
    }
}

function renderVideos() {
    if (videos.length === 0) {
        videoGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: #666; padding: 60px 0;">
                <h3>Nenhum video disponivel</h3>
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

async function saveVideoToSupabase(title, description, category, file) {
    try {
        uploadProgress.style.display = 'block';
        progressBar.style.width = '0%';
        progressPercent.textContent = '0%';
        
        const nomeLimpo = cleanFileName(file.name);
        const extensao = file.name.split('.').pop();
        const fileName = generateSecureId() + '_' + nomeLimpo + '.' + extensao;
        
        const { error: uploadError } = await sb.storage
            .from('videos')
            .upload(fileName, file);
        
        if (uploadError) throw uploadError;
        
        progressBar.style.width = '70%';
        progressPercent.textContent = '70%';
        
        const { data: urlData } = sb.storage.from('videos').getPublicUrl(fileName);
        const downloadURL = urlData.publicUrl;
        
        const videoData = {
            title: title,
            description: description || 'Sem descricao',
            category: category || 'Geral',
            url: downloadURL,
            date: randomDate()
        };
        
        const { data: insertData, error: insertError } = await sb
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
        console.error('Erro ao salvar:', error);
        uploadProgress.style.display = 'none';
        throw error;
    }
}

async function deleteVideoFromSupabase(videoId) {
    if (!confirm('Tem certeza que deseja excluir este video?')) return;
    
    const video = videos.find(v => v.id === videoId);
    if (!video) {
        alert('Video nao encontrado!');
        return;
    }
    
    const urlParts = video.url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    
    if (fileName) {
        await sb.storage.from('videos').remove([fileName]);
    }
    
    await sb.from('videos').delete().eq('id', videoId);
    await sb.from('comments').delete().eq('video_id', videoId);
    
    videos = videos.filter(v => v.id !== videoId);
    renderVideos();
    
    pagePlayer.style.display = 'none';
    btnDownload.style.display = 'none';
    btnDelete.style.display = 'none';
    pageHome.style.display = 'block';
    
    alert('Video excluido!');
}

// ============================================
//  COMENTARIOS - CRUD
// ============================================

async function loadComments(videoId) {
    try {
        const { data, error } = await sb
            .from('comments')
            .select('*')
            .eq('video_id', videoId)
            .order('created_at', { ascending: true });
        
        if (error) throw error;
        
        comments = data;
        renderComments();
    } catch (error) {
        console.error('Erro ao carregar comentarios:', error);
        commentsList.innerHTML = '<p style="color: #888;">Erro ao carregar comentarios</p>';
    }
}

function renderComments() {
    if (comments.length === 0) {
        commentsList.innerHTML = `
            <p style="color: #666; text-align: center; padding: 20px;">
                Nenhum comentario ainda. Seja o primeiro!
            </p>
        `;
        return;
    }

    commentsList.innerHTML = comments.map(comment => {
        const isAnonymous = comment.author === 'Anonimo' || comment.is_anonymous;
        const autor = isAnonymous ? 'Anonimo' : comment.author || 'Usuario';
        const data = formatDate(comment.created_at);
        
        return `
            <div class="comment-item">
                <div class="comment-header">
                    <strong class="comment-author">${autor}</strong>
                    <span class="comment-date">${data}</span>
                    ${isAdmin ? `<button class="btn-delete-comment" data-id="${comment.id}">X</button>` : ''}
                </div>
                <p class="comment-text">${comment.content}</p>
            </div>
        `;
    }).join('');

    document.querySelectorAll('.btn-delete-comment').forEach(btn => {
        btn.addEventListener('click', function() {
            const commentId = this.dataset.id;
            deleteComment(commentId);
        });
    });
}

async function sendComment(videoId, content, isAnonymous) {
    if (!content.trim()) {
        alert('Digite um comentario!');
        return;
    }

    try {
        const commentData = {
            video_id: videoId,
            content: content.trim(),
            author: isAnonymous ? 'Anonimo' : 'Usuario',
            is_anonymous: isAnonymous
        };

        const { data, error } = await sb
            .from('comments')
            .insert([commentData])
            .select();

        if (error) throw error;

        await loadComments(videoId);
        commentInput.value = '';
        commentAnonymous.checked = false;
        
        console.log('Comentario enviado!');
    } catch (error) {
        console.error('Erro ao enviar comentario:', error);
        alert('Erro ao enviar comentario: ' + error.message);
    }
}

async function deleteComment(commentId) {
    if (!confirm('Excluir este comentario?')) return;
    
    try {
        await sb.from('comments').delete().eq('id', commentId);
        await loadComments(currentVideoId);
        console.log('Comentario excluido!');
    } catch (error) {
        console.error('Erro ao excluir comentario:', error);
        alert('Erro ao excluir comentario');
    }
}

// ============================================
//  ABRIR PLAYER
// ============================================

function openPlayer(id) {
    const video = videos.find(v => v.id === id);
    if (!video) {
        alert('Video nao encontrado!');
        return;
    }

    currentVideoId = id;
    playerVideo.src = video.url;
    playerVideo.load();
    playerVideo.play();
    playerTitle.textContent = video.title;
    playerDesc.textContent = video.description || 'Sem descricao';
    playerCategory.innerHTML = '<span>' + video.category + '</span>';

    btnDownload.style.display = 'block';
    btnDelete.style.display = isAdmin ? 'block' : 'none';

    pageHome.style.display = 'none';
    pageLogin.style.display = 'none';
    pageUpload.style.display = 'none';
    pagePlayer.style.display = 'block';

    loadComments(id);
}

// ============================================
//  ADMIN
// ============================================

function loginAdmin() {
    isAdmin = true;
    btnAdmin.textContent = 'Publicar';
    btnAdmin.classList.add('admin-logged');
    btnLogout.style.display = 'inline-block';
    pageLogin.style.display = 'none';
    pageUpload.style.display = 'block';
}

function logoutAdmin() {
    isAdmin = false;
    btnAdmin.textContent = 'Admin';
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
        alert('Nenhum video selecionado.');
        return;
    }
    const video = videos.find(v => v.id === currentVideoId);
    if (!video) {
        alert('Video nao encontrado.');
        return;
    }
    if (confirm('Baixar "' + video.title + '"?')) {
        const link = document.createElement('a');
        link.href = video.url;
        link.download = video.title.replace(/[^a-zA-Z0-9]/g, '_') + '.mp4';
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
//  EVENTOS DE COMENTARIOS
// ============================================

btnSendComment.addEventListener('click', function() {
    if (!currentVideoId) {
        alert('Nenhum video selecionado.');
        return;
    }
    const content = commentInput.value;
    const isAnonymous = commentAnonymous.checked;
    sendComment(currentVideoId, content, isAnonymous);
});

commentInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        btnSendComment.click();
    }
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
        alert('Senha incorreta!');
        adminPassword.value = '';
    }
});

// ============================================
//  UPLOAD
// ============================================

uploadForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    if (!isAdmin) {
        alert('Sem permissao!');
        return;
    }

    const title = document.getElementById('videoTitle').value.trim();
    const description = document.getElementById('videoDesc').value.trim();
    const category = document.getElementById('videoCategory').value;
    const file = uploadFile.files[0];

    if (!title) {
        alert('Digite um titulo.');
        return;
    }
    if (!file) {
        alert('Selecione um arquivo.');
        return;
    }
    if (file.size > 50 * 1024 * 1024) {
        alert('Arquivo muito grande! Maximo 50MB.');
        return;
    }
    if (!file.type.startsWith('video/')) {
        alert('Formato invalido! Use MP4 ou WebM.');
        return;
    }

    try {
        await saveVideoToSupabase(title, description, category, file);
        pageHome.style.display = 'block';
        pageUpload.style.display = 'none';
        uploadForm.reset();
        uploadFile.value = '';
        await loadVideos();
        alert('Video publicado!');
    } catch (error) {
        alert('Erro: ' + error.message);
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

console.log('Inicializando VidFlow...');
loadVideos();
console.log('VidFlow pronto!');
console.log('Pressione Ctrl+Shift+A para acessar o admin');
