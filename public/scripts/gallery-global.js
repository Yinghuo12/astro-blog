// 全局相册功能脚本 - 在所有页面加载
// 使用事件委托处理照片点击

(function() {
    'use strict';

    console.log('[Gallery Global] Script loaded');

    let currentPhotoIndex = 0;
    let currentAlbumPhotos = [];

    function openPhotoModal(photoElement, retryCount = 0) {
        console.log('[Gallery Global] openPhotoModal called, retry:', retryCount);

        // 每次都重新获取模态框元素
        const modal = document.getElementById('photo-modal');
        const modalImage = document.getElementById('modal-image');
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');
        const modalDate = document.getElementById('modal-date');
        const modalLocation = document.getElementById('modal-location');
        const modalAlbum = document.getElementById('modal-album');

        console.log('[Gallery Global] Elements found:', {
            modal: !!modal,
            modalImage: !!modalImage,
            modalTitle: !!modalTitle,
            modalDescription: !!modalDescription
        });

        if (!modal || !modalImage) {
            if (retryCount < 10) {
                console.log('[Gallery Global] Modal not found, retrying...');
                requestAnimationFrame(() => {
                    setTimeout(() => openPhotoModal(photoElement, retryCount + 1), 50);
                });
            } else {
                console.error('[Gallery Global] Modal not found after retries');
            }
            return;
        }

        const parentAlbum = photoElement.closest('.album-section');
        currentAlbumPhotos = Array.from(parentAlbum?.querySelectorAll('.gallery-photo') || []);
        currentPhotoIndex = currentAlbumPhotos.indexOf(photoElement);

        const title = photoElement.dataset.title || '';
        const description = photoElement.dataset.description || '';
        const date = photoElement.dataset.date || '';
        const location = photoElement.dataset.location || '';
        const album = photoElement.dataset.album || '';

        const imgElement = photoElement.querySelector('img');
        const imgSrc = imgElement?.src || '';

        console.log('[Gallery Global] Opening photo:', title, 'desc:', description, 'date:', date);

        modalImage.src = imgSrc;
        modalImage.alt = title;
        modalTitle.textContent = title;
        modalDescription.textContent = description;
        modalDate.textContent = date;
        modalLocation.textContent = location;
        modalAlbum.textContent = album === 'default' ? '未分类' : album;

        console.log('[Gallery Global] Set content - title:', modalTitle.textContent, 'desc:', modalDescription.textContent);

        const modalInfo = document.getElementById('modal-info');
        if (modalInfo) {
            modalInfo.style.display = 'block';
            console.log('[Gallery Global] modal-info displayed');
        }

        const descP = document.getElementById('modal-description');
        if (description && descP) {
            descP.style.display = 'block';
            descP.parentElement.style.display = 'block';
        } else if (descP) {
            descP.style.display = 'none';
        }

        const dateWrapper = modalDate?.closest('#modal-date-wrapper');
        const locationWrapper = modalLocation?.closest('#modal-location-wrapper');
        const albumWrapper = modalAlbum?.closest('#modal-album-wrapper');

        if (date && dateWrapper) dateWrapper.style.display = 'flex';
        else if (dateWrapper) dateWrapper.style.display = 'none';

        if (location && locationWrapper) locationWrapper.style.display = 'flex';
        else if (locationWrapper) locationWrapper.style.display = 'none';

        if (album && album !== 'default' && albumWrapper) albumWrapper.style.display = 'flex';
        else if (albumWrapper) albumWrapper.style.display = 'none';

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        console.log('[Gallery Global] Modal shown');
    }

    function closePhotoModal() {
        const modal = document.getElementById('photo-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    function showPreviousPhoto() {
        if (currentAlbumPhotos.length === 0) return;
        currentPhotoIndex = (currentPhotoIndex - 1 + currentAlbumPhotos.length) % currentAlbumPhotos.length;
        openPhotoModal(currentAlbumPhotos[currentPhotoIndex]);
    }

    function showNextPhoto() {
        if (currentAlbumPhotos.length === 0) return;
        currentPhotoIndex = (currentPhotoIndex + 1) % currentAlbumPhotos.length;
        openPhotoModal(currentAlbumPhotos[currentPhotoIndex]);
    }

    // 使用事件委托 - 在 document 上监听所有点击
    if (!window.__galleryGlobalEventsBound) {
        window.__galleryGlobalEventsBound = true;

        document.addEventListener('click', function(e) {
            // 查找是否点击了照片
            const photo = e.target.closest('.gallery-photo');
            if (photo) {
                console.log('[Gallery Global] Photo clicked!');
                e.preventDefault();
                e.stopPropagation();
                openPhotoModal(photo);
                return;
            }

            // 关闭按钮
            if (e.target.closest('#modal-close')) {
                closePhotoModal();
                return;
            }

            // 背景点击关闭
            if (e.target.closest('#modal-backdrop')) {
                closePhotoModal();
                return;
            }
        }, true);

        // 键盘事件
        document.addEventListener('keydown', function(e) {
            const modal = document.getElementById('photo-modal');
            if (!modal || modal.classList.contains('hidden')) return;

            if (e.key === 'Escape') {
                closePhotoModal();
            } else if (e.key === 'ArrowLeft') {
                showPreviousPhoto();
            } else if (e.key === 'ArrowRight') {
                showNextPhoto();
            }
        });

        console.log('[Gallery Global] Events bound');
    }
})();
