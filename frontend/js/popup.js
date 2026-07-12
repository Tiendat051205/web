(function() {
    const popup = document.getElementById('adPopup');
    const closeBtn = document.getElementById('closeAdBtn');

    // Đọc cookie
    function getCookie(name) {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? match[2] : null;
    }

    // Lưu cookie (30 ngày)
    function setCookie(name, value, days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = name + '=' + value + '; expires=' + date.toUTCString() + '; path=/';
    }

    // Kiểm tra đã đóng popup chưa
    function isPopupClosed() {
      return getCookie('popup_closed') === 'true';
    }

    // Đóng popup + lưu cookie
    function closePopup() {
      popup.style.display = 'none';
      setCookie('popup_closed', 'true', 30); // Lưu 30 ngày
    }

    // Hiển thị popup sau 1.5 giây nếu chưa đóng
    setTimeout(function() {
      if (!isPopupClosed()) {
        // 1. Khai báo danh sách 4 ảnh trong thư mục images/
        const adImages = [
          'images/Modern.jpeg',
          'images/Tranditional.jpeg',
          'images/Professional.jpeg',
          'images/Simple.jpeg'
        ];

        // 2. Chọn ngẫu nhiên 1 ảnh từ mảng
        const randomIndex = Math.floor(Math.random() * adImages.length);
        const selectedImage = adImages[randomIndex];

        // 3. Gán đường dẫn ảnh ngẫu nhiên vào thẻ <img>
        const imgElement = document.getElementById('adImage');
        if (imgElement) {
          imgElement.src = selectedImage;
        }

        // 4. Hiển thị popup
        popup.style.display = 'flex';
      }
    }, 1500);

    // Sự kiện đóng
    closeBtn.addEventListener('click', closePopup);

    // Click ra ngoài nội dung cũng đóng
    popup.addEventListener('click', function(e) {
      if (e.target === this) {
        closePopup();
      }
    });

  })();