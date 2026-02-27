// 日记密码验证脚本
// 这个文件处理私密日记的密码验证功能

(function() {
    'use strict';

    console.log('[DiaryPassword] Script loaded');

    // 从 DOM 元素获取配置
    function getConfig() {
        const configEl = document.getElementById('diary-config');
        if (!configEl) {
            return null;
        }
        return {
            password: configEl.getAttribute('data-password') || '',
            slug: configEl.getAttribute('data-slug') || ''
        };
    }

    // 检查解锁状态
    function checkUnlockStatus() {
        const config = getConfig();
        if (!config) return;

        const storageKey = 'diary_unlocked_' + config.slug;
        const isUnlocked = sessionStorage.getItem(storageKey) === 'true';

        const lockEl = document.getElementById('diary-lock');
        const contentEl = document.getElementById('diary-content');
        const tocContainer = document.getElementById('toc-container-private');

        if (isUnlocked) {
            if (lockEl) lockEl.classList.add('hidden');
            if (contentEl) contentEl.classList.remove('hidden');
            if (tocContainer) {
                tocContainer.classList.remove('hidden');
                tocContainer.style.display = 'block';
                console.log('[DiaryPassword] TOC container revealed on load');
            }
        } else {
            if (lockEl) lockEl.classList.remove('hidden');
            if (contentEl) contentEl.classList.add('hidden');
            if (tocContainer) {
                tocContainer.classList.add('hidden');
                tocContainer.style.display = 'none';
            }
        }
    }

    // 验证密码
    function unlockDiary() {
        const config = getConfig();
        if (!config) return;

        const passwordInput = document.getElementById('diary-password');
        const errorMsg = document.getElementById('diary-error');
        const errorText = document.getElementById('error-text');

        const inputVal = passwordInput ? passwordInput.value.trim() : '';

        if (!inputVal) {
            if (errorText) errorText.textContent = '密码不能为空';
            if (errorMsg) errorMsg.classList.remove('hidden');
            if (passwordInput) {
                passwordInput.focus();
                passwordInput.classList.add('animate-shake');
                setTimeout(() => passwordInput.classList.remove('animate-shake'), 500);
            }
            return;
        }

        if (inputVal === config.password) {
            const storageKey = 'diary_unlocked_' + config.slug;
            sessionStorage.setItem(storageKey, 'true');

            const lockEl = document.getElementById('diary-lock');
            const contentEl = document.getElementById('diary-content');
            const tocContainer = document.getElementById('toc-container-private');

            if (lockEl) lockEl.classList.add('hidden');
            if (contentEl) contentEl.classList.remove('hidden');
            if (tocContainer) {
                tocContainer.classList.remove('hidden');
                tocContainer.style.display = 'block';
                console.log('[DiaryPassword] TOC container revealed');
            }
        } else {
            if (errorText) errorText.textContent = '密码错误，请重新输入';
            if (errorMsg) errorMsg.classList.remove('hidden');
            if (passwordInput) {
                passwordInput.value = '';
                passwordInput.focus();
                passwordInput.classList.add('animate-shake');
                setTimeout(() => passwordInput.classList.remove('animate-shake'), 500);
            }
        }
    }

    // 绑定事件
    function bindEvents() {
        // 绑定解锁按钮
        const unlockBtn = document.getElementById('unlock-btn');
        if (unlockBtn && !unlockBtn.hasAttribute('data-bound')) {
            unlockBtn.addEventListener('click', unlockDiary);
            unlockBtn.setAttribute('data-bound', 'true');
            console.log('[DiaryPassword] Unlock button bound');
        }

        // 绑定回车键
        const passwordInput = document.getElementById('diary-password');
        if (passwordInput && !passwordInput.hasAttribute('data-bound')) {
            passwordInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    unlockDiary();
                }
            });
            passwordInput.setAttribute('data-bound', 'true');
            console.log('[DiaryPassword] Enter key bound');
        }
    }

    // 初始化
    function init() {
        // 只处理有日记配置的页面
        if (!getConfig()) return;

        console.log('[DiaryPassword] Initializing...');
        checkUnlockStatus();
        bindEvents();
        console.log('[DiaryPassword] Initialized');
    }

    // 暴露全局函数
    window.unlockDiary = unlockDiary;

    // 页面加载时初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                init();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 监听页面切换事件
    const events = ['astro:after-swap', 'swup:contentReplaced', 'astro:page-load'];
    events.forEach(function(eventName) {
        document.addEventListener(eventName, function() {
            console.log('[DiaryPassword] Event:', eventName);
            setTimeout(init, 50);
        });
    });

    console.log('[DiaryPassword] Setup complete');
})();
