document.addEventListener("DOMContentLoaded", function() {
    // ヘッダーを読み込む
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            
            // 現在のページに応じてナビゲーションリンクに 'current' クラスを設定
            const currentPage = window.location.pathname.split('/').pop();
            const navLinks = document.querySelectorAll('.main-nav a');
            navLinks.forEach(link => {
                if (link.getAttribute('href') === currentPage) {
                    link.classList.add('current');
                }
            });
        });

    // フッターを読み込む
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        });
});