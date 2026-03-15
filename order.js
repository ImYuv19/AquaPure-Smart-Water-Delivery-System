document.addEventListener('DOMContentLoaded', () => {
    
    // --- Navbar & Mobile Menu ---
    const hamburger = document.getElementById("hamburgerBtn");
    const navList = document.querySelector(".nav-list");
    const navLinks = document.querySelectorAll(".nav-link");

    if(hamburger) {
        hamburger.addEventListener("click", () => navList.classList.toggle("show"));
    }
    navLinks.forEach(link => {
        link.addEventListener("click", () => navList.classList.remove("show"));
    });

    // --- State & Selectors ---
    let selectedPrice = 0;
    let selectedJar = "Not Selected";
    let couponApplied = false;
    const businessPhone = "919987594619"; 

    const jarCards = document.querySelectorAll(".jar-card");
    const qtyInput = document.getElementById("quantity");
    const subscriptionRadios = document.querySelectorAll("input[name='subscription']");
    const dispenserCheck = document.getElementById("dispenser-rental");
    
    const guestForm = document.getElementById('guest-checkout-form');
    const loggedInCard = document.getElementById('logged-in-address-card');
    const editBtn = document.getElementById('edit-address-btn');

    // --- CONNECT PLANS PAGE TO ORDER PAGE (THE FULL BRIDGE) ---
    const urlParams = new URLSearchParams(window.location.search);
    const preSelectedPlan = urlParams.get('plan');
    const preSelectedJar = urlParams.get('jar');
    const preSelectedQty = urlParams.get('qty');

    // 1. Auto-select Subscription (Weekly/Monthly)
    if (preSelectedPlan) {
        const targetRadio = document.querySelector(`input[name='subscription'][value='${preSelectedPlan}']`);
        if (targetRadio) {
            targetRadio.checked = true;
        }
    }

    // 2. Auto-fill Quantity
    if (preSelectedQty) {
        qtyInput.value = preSelectedQty;
    }

    // 3. Auto-select Jar Size and Price
    if (preSelectedJar) {
        jarCards.forEach(card => {
            if (card.dataset.size === preSelectedJar) {
                jarCards.forEach(c => c.classList.remove("active"));
                card.classList.add("active");
                selectedPrice = parseInt(card.dataset.price);
                selectedJar = card.dataset.size;
            }
        });
    }

    // --- 1. Identity Check (Amazon-style Card) ---
    function checkUserStatus() {
        const activeUserEmail = localStorage.getItem('activeUser');
        if (activeUserEmail && guestForm && loggedInCard) {
            const userData = JSON.parse(localStorage.getItem('user_' + activeUserEmail));
            guestForm.style.display = 'none';
            loggedInCard.style.display = 'block';
            
            document.getElementById('saved-name-display').textContent = userData.name;
            document.getElementById('saved-address-display').textContent = userData.address;
            document.getElementById('saved-phone-display').textContent = userData.phone;
        }
    }

    if (editBtn) {
        editBtn.addEventListener('click', () => {
            guestForm.style.display = 'block';
            loggedInCard.style.display = 'none';
        });
    }

    checkUserStatus();

    // --- 2. Promo Code Logic ---
    document.getElementById("apply-coupon").addEventListener("click", () => {
        const code = document.getElementById("coupon-input").value.trim().toLowerCase();
        const msg = document.getElementById("coupon-msg");
        
        if (code === "uvraj") {
            couponApplied = true;
            msg.textContent = "Coupon 'uvraj' applied! 20% off added.";
            msg.style.color = "#10b981";
        } else {
            couponApplied = false;
            msg.textContent = "Invalid coupon code.";
            msg.style.color = "#ef4444";
        }
        updateSummary(); 
    });

    // --- 3. The Math Engine ---
    function updateSummary() {
        // Validation: Capping at 20 jars
        let qty = parseInt(qtyInput.value) || 1;
        if (qty > 20) {
            alert("For bulk orders over 20 jars, please contact support!");
            qty = 20;
            qtyInput.value = 20;
        }

        let subtotal = selectedPrice * qty;
        let subtotalDiscount = 0;

        // Check plan type
        const subRadio = document.querySelector("input[name='subscription']:checked");
        const subType = subRadio ? subRadio.value : "onetime";

        // Smart Dispenser: Lockout for one-time orders
        const dispenserWrapper = dispenserCheck.parentElement;
        if (subType === "onetime") {
            dispenserCheck.checked = false;
            dispenserCheck.disabled = true;
            dispenserWrapper.style.opacity = "0.5";
            dispenserWrapper.style.cursor = "not-allowed";
        } else {
            dispenserCheck.disabled = false;
            dispenserWrapper.style.opacity = "1";
            dispenserWrapper.style.cursor = "pointer";
        }

        let dispenserFee = (dispenserCheck && dispenserCheck.checked) ? 150 : 0;

        // 5% Monthly Discount
        if (subType === "monthly") {
            subtotalDiscount = subtotal * 0.05;
        }

        // 20% "uvraj" Coupon
        let couponDiscount = 0;
        if (couponApplied) {
            couponDiscount = (subtotal - subtotalDiscount) * 0.20;
        }

        let totalVal = (subtotal - subtotalDiscount - couponDiscount) + dispenserFee;

        // Sync with Summary UI
        document.getElementById("sum-jar").textContent = selectedJar;
        document.getElementById("sum-qty").textContent = qty;
        document.getElementById("sum-price").textContent = "₹" + selectedPrice;
        document.getElementById("sum-subtotal").textContent = "₹" + subtotal;
        
        let totalSavings = subtotalDiscount + couponDiscount;
        document.getElementById("sum-discount").textContent = totalSavings > 0 ? "-₹" + totalSavings.toFixed(2) : "—";
        document.getElementById("sum-total").textContent = "₹" + totalVal.toFixed(2);
    }

    // --- 4. Event Listeners ---
    jarCards.forEach(card => {
        card.addEventListener("click", () => {
            jarCards.forEach(c => c.classList.remove("active"));
            card.classList.add("active");
            selectedPrice = parseInt(card.dataset.price);
            selectedJar = card.dataset.size;
            updateSummary();
        });
    });

    qtyInput.addEventListener("input", updateSummary);
    if(dispenserCheck) dispenserCheck.addEventListener("change", updateSummary);
    subscriptionRadios.forEach(r => r.addEventListener("change", updateSummary));
    
    document.getElementById("qty-inc").addEventListener("click", () => { qtyInput.value++; updateSummary(); });
    document.getElementById("qty-dec").addEventListener("click", () => { if(qtyInput.value > 1) qtyInput.value--; updateSummary(); });

    // Run the math once on load in case a plan was auto-selected
    updateSummary();
    
    // --- 5. Checkout & History Recording ---
    function sendWhatsAppOrder() {
        const qty = qtyInput.value;
        const subRadio = document.querySelector("input[name='subscription']:checked");
        const subTypeLabel = subRadio ? subRadio.parentElement.textContent.trim() : "One Time";
        const date = document.getElementById("delivery-date").value;
        const slot = document.getElementById("delivery-slot").value;
        const total = document.getElementById("sum-total").textContent;
        const dispenser = (dispenserCheck && dispenserCheck.checked) ? "Yes" : "No";

        let name, phone, address;
        const activeUserEmail = localStorage.getItem('activeUser');

        if (activeUserEmail && loggedInCard.style.display !== 'none') {
            const userData = JSON.parse(localStorage.getItem('user_' + activeUserEmail));
            name = userData.name;
            phone = userData.phone;
            address = userData.address;
        } else {
            name = document.getElementById('cust-name').value.trim();
            phone = document.getElementById('cust-phone').value.trim();
            address = document.getElementById('cust-address').value.trim();
        }

        if (!name || !phone || !address || !date || !slot) {
            alert("Please fill in all delivery details first!");
            return;
        }

        // --- NEW: LOG ORDER INTO PROFILE HISTORY ---
        if (activeUserEmail) {
            const userData = JSON.parse(localStorage.getItem('user_' + activeUserEmail));
            
            const newOrderEntry = {
                date: new Date().toLocaleDateString('en-IN'), // Indian Date Format
                jar: selectedJar,
                qty: qty,
                type: subTypeLabel,
                total: total
            };

            // Initialize orders array if empty
            if (!userData.orders) userData.orders = [];
            
            // Add to list and save back to localstorage
            userData.orders.push(newOrderEntry);
            localStorage.setItem('user_' + activeUserEmail, JSON.stringify(userData));
        }

        // Format WhatsApp Link
        const message = `*New Order: AquaPure Delivery*%0A` +
                        `------------------------------%0A` +
                        `*Customer:* ${name}%0A` +
                        `*Phone:* ${phone}%0A` +
                        `*Jar Size:* ${selectedJar}%0A` +
                        `*Quantity:* ${qty}%0A` +
                        `*Type:* ${subTypeLabel}%0A` +
                        `*Dispenser Rental:* ${dispenser}%0A` +
                        `*Delivery Date:* ${date}%0A` +
                        `*Time Slot:* ${slot}%0A` +
                        `------------------------------%0A` +
                        `*Total Amount:* ${total}%0A` +
                        `*Address:* ${address}`;

        window.open(`https://wa.me/${businessPhone}?text=${message}`, '_blank');
        startTracking();
    }

    document.querySelector(".place-order").addEventListener("click", () => {
        if (selectedJar === "Not Selected") return alert("Please select a jar size first!");
        sendWhatsAppOrder();
    });
});

// --- Tracking Animation ---
function startTracking(){
    const steps = [
        document.getElementById("step1"),
        document.getElementById("step2"),
        document.getElementById("step3"),
        document.getElementById("step4")
    ];
    const progress = document.getElementById("progress-bar");
    const truck = document.getElementById("delivery-truck");
    let currentStep = 0;

    const interval = setInterval(() => {
        currentStep++;
        if(currentStep < steps.length){
            steps[currentStep].classList.add("active");
            let progressPercent = (currentStep / (steps.length - 1)) * 100;
            progress.style.width = progressPercent + "%";
            truck.style.left = progressPercent + "%";
        }
        if(currentStep === steps.length - 1) clearInterval(interval);
    }, 3000);
}