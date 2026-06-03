document.addEventListener('DOMContentLoaded', () => {
    // ===== Sidebar Toggles & Dynamic Category View =====
    const navItems = document.querySelectorAll('.nav-item');
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    const welcomeContainer = document.getElementById('welcomeContainer');
    const productsGrid = document.getElementById('productsGrid');
    const productCards = document.querySelectorAll('.product-card');

    // العودة للشاشة الترحيبية عند الضغط على "أقسام المتجر"
    const backToHome = document.getElementById('backToHome');
    if (backToHome) {
        backToHome.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 1. إزالة حالة النشاط الفعالة عن كل الأزرار
            navItems.forEach(item => item.classList.remove('active'));
            
            // 2. تصفير وإخفاء شبكة المنتجات وإظهار لوحة الترحيب
            if (productsGrid) productsGrid.style.display = 'none';
            if (welcomeContainer) welcomeContainer.style.display = 'flex';

            // 3. إغلاق القائمة في الموبايل
            if (window.innerWidth <= 1024) {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // إدارة حدث الضغط على الأقسام الجانبية للفلترة
    navItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            navItems.forEach(otherItem => otherItem.classList.remove('active'));
            item.classList.add('active');

            if (welcomeContainer) welcomeContainer.style.display = 'none';
            if (productsGrid) productsGrid.style.display = 'grid';

            const selectedCategoryIndex = link.getAttribute('data-index');

            productCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (cardCategory === selectedCategoryIndex) {
                    card.style.display = 'flex';
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                }
            });

            if (window.innerWidth <= 1024) {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Mobile Sidebar Toggles
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.add('open');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        cartDrawer.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            sidebar.classList.remove('open');
            cartDrawer.classList.remove('open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ===== Shopping Cart Logic =====
    const cartDrawer = document.getElementById('cartDrawer');
    const cartToggle = document.getElementById('cartToggle');
    const closeCart = document.getElementById('closeCart');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const cartCount = document.getElementById('cartCount');
    let cart = [];

    cartToggle.addEventListener('click', () => {
        cartDrawer.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    closeCart.addEventListener('click', () => {
        cartDrawer.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });

    productCards.forEach(card => {
        const addBtn = card.querySelector('.add-to-cart-btn');
        const id = card.getAttribute('data-id');
        const title = card.querySelector('.product-title').textContent;
        
        const mediaContainer = card.querySelector('.product-img-container');
        const imgElement = mediaContainer.querySelector('img');
        const imgContent = imgElement ? imgElement.outerHTML : '';
        
        addBtn.addEventListener('click', () => {
            addToCart(id, title, imgContent);
            addBtn.textContent = 'تمت الإضافة! ✓';
            addBtn.style.background = '#10b981';
            addBtn.style.color = '#fff';
            setTimeout(() => {
                addBtn.textContent = 'أضف للسلة';
                addBtn.style.background = '';
                addBtn.style.color = '';
            }, 1000);
        });
    });

    function addToCart(id, title, imgContent) {
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, title, imgContent, quantity: 1 });
        }
        updateCartUI();
    }

    function updateCartUI() {
        const cartItemsList = cartItemsContainer.querySelectorAll('.cart-item');
        cartItemsList.forEach(item => item.remove());
        
        if (cart.length === 0) {
            emptyCartMessage.style.display = 'flex';
            checkoutBtn.disabled = true;
            checkoutBtn.style.opacity = '0.5';
        } else {
            emptyCartMessage.style.display = 'none';
            checkoutBtn.disabled = false;
            checkoutBtn.style.opacity = '1';
            cart.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'cart-item';
                itemDiv.innerHTML = `
                    <div class="cart-item-img">${item.imgContent}</div>
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-qty">
                            <button class="qty-btn dec-qty" data-id="${item.id}">-</button>
                            <span class="qty-val">${item.quantity}</span>
                            <button class="qty-btn inc-qty" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <button class="remove-item-btn" data-id="${item.id}" aria-label="حذف">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                    </button>
                `;
                itemDiv.querySelector('.inc-qty').addEventListener('click', () => changeQty(item.id, 1));
                itemDiv.querySelector('.dec-qty').addEventListener('click', () => changeQty(item.id, -1));
                itemDiv.querySelector('.remove-item-btn').addEventListener('click', () => removeFromCart(item.id));
                cartItemsContainer.appendChild(itemDiv);
            });
        }
        const totalItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
        if(cartCount) cartCount.textContent = totalItemsCount;
    }

    function changeQty(id, delta) {
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                removeFromCart(id);
            } else {
                updateCartUI();
            }
        }
    }

    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        updateCartUI();
    }

    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            showToast('تمت عملية الشراء بنجاح! شكراً لك 🎉');
            cart = [];
            updateCartUI();
            cartDrawer.classList.remove('open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-alert';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            font-family: 'Cairo', sans-serif;
            font-weight: 700;
            box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4);
            z-index: 1000;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 100);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    }

    // Ripple Effects
    document.querySelectorAll('.add-to-cart-btn, .checkout-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.25);
                border-radius: 50%;
                transform: scale(0);
                animation: rippleEffect 0.6s ease-out forwards;
                pointer-events: none;
                z-index: 0;
            `;
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
});