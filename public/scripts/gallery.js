// 相册功能脚本
// 使用事件委托处理照片点击

(function() {
    'use strict';

    console.log('[Gallery] Script loaded');

    let currentPhotoIndex = 0;
    let currentAlbumPhotos = [];

    function openPhotoModal(photoElement) {
        const modal = document.getElementById('photo-modal');
        const modalImage = document.getElementById('modal-image');
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');
        const modalDate = document.getElementById('modal-date');
        const modalLocation = document.getElementById('modal-location');
        const modalAlbum = document.getElementById('modal-album');

        console.log('[Gallery] openPhotoModal called, modal:', !!modal, 'modalImage:', !!modalImage);

        if (!modal || !modalImage) {
            console.error('[Gallery] Modal elements not found!');
            return;
        }

        // 获取当前相册的所有照片
        const parentAlbum = photoElement.closest('.album-section');
        currentAlbumPhotos = Array.from(parentAlbum?.querySelectorAll('.gallery-photo') || []);

        // 获取当前照片的索引
        currentPhotoIndex = currentAlbumPhotos.indexOf(photoElement);

        // 获取照片数据
        const title = photoElement.dataset.title || '';
        const description = photoElement.dataset.description || '';
        const date = photoElement.dataset.date || '';
        const location = photoElement.dataset.location || '';
        const album = photoElement.dataset.album || '';

        // 获取实际的图片 URL
        const imgElement = photoElement.querySelector('img');
        const imgSrc = imgElement?.src || '';

        console.log('[Gallery] Opening photo:', title, 'src:', imgSrc);

        // 填充数据
        modalImage.src = imgSrc;
        modalImage.alt = title;
        modalTitle.textContent = title;
        modalDescription.textContent = description;
        modalDate.textContent = date;
        modalLocation.textContent = location;
        modalAlbum.textContent = album === 'default' ? '未分类' : album;

        // 显示/隐藏元素
        if (description) {
            modalDescription.parentElement.style.display = 'block';
            modalDescription.style.display = 'block';
        } else {
            modalDescription.parentElement.style.display = 'block';
            modalDescription.style.display = 'none';
        }

        const dateWrapper = modalDate.closest('#modal-date-wrapper');
        const locationWrapper = modalLocation.closest('#modal-location-wrapper');
        const albumWrapper = modalAlbum.closest('#modal-album-wrapper');

        if (date && dateWrapper) {
            dateWrapper.style.display = 'flex';
        } else if (dateWrapper) {
            dateWrapper.style.display = 'none';
        }

        if (location && locationWrapper) {
            locationWrapper.style.display = 'flex';
        } else if (locationWrapper) {
            locationWrapper.style.display = 'none';
        }

        if (album && album !== 'default' && albumWrapper) {
            albumWrapper.style.display = 'flex';
        } else if (albumWrapper) {
            albumWrapper.style.display = 'none';
        }

        // 显示模态框
        console.log('[Gallery] Before show - modal classes:', modal.className);
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        console.log('[Gallery] After show - modal classes:', modal.className);
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

    // 使用事件委托 - 在 document 上监听点击
    document.addEventListener('click', function(e) {
        // 查找是否点击了照片或照片的子元素
        const photo = e.target.closest('.gallery-photo');
        if (photo) {
            console.log('[Gallery] Photo clicked via delegation!');
            e.preventDefault();
            openPhotoModal(photo);
            return;
        }

        // 关闭按钮
        const closeBtn = e.target.closest('#modal-close');
        if (closeBtn) {
            closePhotoModal();
            return;
        }

        // 背景点击关闭
        const backdrop = e.target.closest('#modal-backdrop');
        if (backdrop) {
            closePhotoModal();
            return;
        }
    }, true); // 使用捕获阶段以确保优先处理

    // ESC 键和方向键
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

    console.log('[Gallery] Event delegation setup complete');
})();
