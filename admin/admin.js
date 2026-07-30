// ════════════════════════════════════════════
//  GLOBAL STATE VARIABLES
//  All shared variables used across the admin dashboard — orders, filters, tabs, and UI state.
// ════════════════════════════════════════════

let ALL = [];                     // All products loaded from Supabase
let allOrders = [];               // Full list of all orders loaded from Firestore
let filteredOrders = [];          // Orders currently visible based on active tab and search
let unsubscribe = null;           // Firestore real-time listener unsubscribe function
let currentOrderDetails = null;   // The order currently open in the detail modal
let lastCount = -1;               // Tracks active order count to detect new incoming orders
let activeTab = 'orders';         // Which main tab is currently shown: orders/products/tools
let activeOrderTab = 'Pending';   // Sub-tab within Orders: Pending/Confirmed/Rejected/Deleted
let activeProductTab = 'Active';  // Sub-tab within Catalogue: Active or Deleted (Trash)
let currentFilters = { category: [], type: [], scent: [], price: [] }; // Active product filter state
let selectedProductsToMerge = new Set(); // Tracks which product IDs are checked for bulk actions

// Popular product IDs for featured sections
const POPULAR_IDS = {
  "sec-latest": [3, 11, 13, 16, 55, 745, 740, 741, 742, 6, 7, 51, 29, 752, 768, 128, 12, 10, 9, 5, 2, 21, 1, 8, 4, 15, 14, 17, 30, 769, 756, 18, 19, 20, 22, 23, 24, 25, 26, 27, 28, 52, 53, 54, 56, 57, 58, 59, 60, 61],
  "sec-favorites": [172, 189, 182, 207, 174, 212, 58, 72, 233, 396, 68, 32, 117, 128, 102, 215, 56, 187, 62, 374, 116, 98, 145, 137, 106, 3, 162, 68, 59, 95, 67, 98, 3, 85, 183, 29, 71, 140, 88, 95],
  "sec-kings": [172, 189, 174, 212, 58, 72, 233, 396, 117, 102, 99, 135, 3, 81, 100, 171, 266, 297, 333, 138, 195, 55, 105, 61],
  "sec-queens": [215, 56, 187, 62, 374, 116, 145, 137, 106, 3, 162, 59, 95, 7, 97, 104, 5, 71, 127, 70, 32, 46, 91, 48, 20, 130, 167, 223, 401, 267, 82, 123, 13, 113, 165],
  "sec-unisex": [3, 85, 183, 29, 140, 88, 50, 81, 167],
  "sec-oud": [15, 25, 26, 33],
  "sec-fresh": [40, 16, 19, 9],
  "sec-sweet": [6, 27, 323, 161, 4, 2],
  "sec-designer": [43, 51, 42],
  "sec-sets": [41],
  "sec-doj": [15, 73, 235],
  "sec-shaik": [501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 512, 513, 514, 515, 516, 517, 518, 519, 520, 521, 522, 523, 524, 525, 526, 527, 528, 529, 530, 531, 532, 533, 534, 535, 536, 537, 538, 539, 540, 541, 542, 543, 544, 545, 546, 547, 548, 549, 550, 551, 552, 553, 554, 555, 556, 557, 558, 559, 560, 561, 562, 563, 564, 565, 566, 567, 568, 569, 570, 571, 572, 573, 574, 575, 576, 577, 578, 579, 580, 581, 582, 583, 584, 585, 586, 587, 588, 589, 590, 591, 592, 593, 594, 595, 596, 597, 598, 599, 600]
};

// ── UTILITY: FORMATTERS ────────────────────────────────────────
// Converts numbers/dates into human-readable strings used throughout the dashboard.

function formatPrice(n) {
  return Number(n).toLocaleString('en-ET') + ' Br';
}

function formatDate(fbTimestamp) {
  if (!fbTimestamp) return 'Just now';
  const d = fbTimestamp.toDate ? fbTimestamp.toDate() : new Date(fbTimestamp);
  return d.toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

// Returns a styled HTML badge span for a given order status.
// Used in the orders table to visually indicate Pending, Confirmed, Rejected, etc.
function getStatusBadge(status) {
  const s = (status || 'Pending').toLowerCase();
  return `<span class="badge ${s}">${s}</span>`;
}

// ── ORDER DATA LOADING (REAL-TIME) ────────────────────────────
// Opens a Supabase real-time listener on the 'orders' table.
// Auto-updates the dashboard whenever any order is added, changed, or deleted.
async function loadOrders() {
  const tbody = document.getElementById('ordersTableBody');
  tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 30px;">Loading orders...</td></tr>';

  if (!supabase) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 30px; color: #e68e9e;">Supabase is not configured correctly. Check supabase-config.js.</td></tr>';
    return;
  }

  // Fetch initial list
  await fetchOrders();

  if (unsubscribe) unsubscribe(); // Cancel any previous listener before starting a new one

  const subscription = supabase
    .channel('public:orders')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, async () => {
      await fetchOrders();
    })
    .subscribe();

  unsubscribe = () => supabase.removeChannel(subscription);
}

async function fetchOrders() {
  try {
    const { data: dbOrders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    allOrders = (dbOrders || []).map(row => {
      return {
        id: row.id,
        customerName: row.customer_name,
        customerPhone: row.customer_phone,
        customerSefer: row.customer_sefer,
        customerCoords: row.customer_coords,
        paymentMethod: row.payment_method,
        transactionId: row.transaction_id,
        deliveryNotes: row.delivery_notes,
        totalAmount: parseFloat(row.total_amount) || 0,
        status: row.status || 'Pending',
        items: row.items || [],
        deleted: row.deleted,
        refId: 'DGU-' + row.id.slice(-6).toUpperCase()
      };
    });

    let pendingCount = 0;
    let confirmedCount = 0;
    let revenue = 0;

    allOrders.forEach(data => {
      if (!data.deleted) {
        if (data.status === 'Pending') pendingCount++;
        if (data.status === 'Confirmed') { confirmedCount++; revenue += Number(data.totalAmount || 0); }
      }
    });

    const activeOrdersOnly = allOrders.filter(o => !o.deleted);
    if (lastCount !== -1 && activeOrdersOnly.length > lastCount) {
       playSuccessSound(); // Play alert sound when a new order arrives
    }
    lastCount = activeOrdersOnly.length;

    filterOrders();
    updateStatsDisplay(pendingCount, confirmedCount, revenue, activeOrdersOnly.length);
  } catch (error) {
    console.error("Error fetching orders:", error);
    const tbody = document.getElementById('ordersTableBody');
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 30px; color: #e68e9e;">Error fetching orders: ${error.message}</td></tr>`;
    }
  }
}

// ── ORDER FILTERING & TABLE RENDERING ─────────────────────────
// Filters allOrders based on active tab (Pending/Confirmed/etc.) and the search box.
// The result is stored in filteredOrders and immediately rendered to the table.
function filterOrders() {
  const q = document.getElementById('mainSearch')?.value.toLowerCase().trim() || '';
  
  filteredOrders = allOrders.filter(o => {
    // 1. Filter by Tab
    if (activeOrderTab === 'Deleted') {
      if (!o.deleted) return false;
    } else {
      if (o.deleted) return false;
      if (activeOrderTab === 'Pending' && o.status !== 'Pending') return false;
      if (activeOrderTab === 'Confirmed' && o.status !== 'Confirmed') return false;
      if (activeOrderTab === 'Rejected' && !(o.status === 'Rejected' || o.status === 'Cancelled')) return false;
    }

    // 2. Filter by Search Query
    if (q) {
      return o.refId.toLowerCase().includes(q) ||
        (o.customerName || '').toLowerCase().includes(q) ||
        (o.customerPhone || '').toLowerCase().includes(q) ||
        (o.transactionId || '').toLowerCase().includes(q);
    }
    return true;
  });

  renderTable();
}

// Switches the active order sub-tab (Pending, Confirmed, Rejected, Deleted).
// Updates the nav highlight and re-runs the filter to show the right orders.
function switchOrderTab(tab, el) {
  activeOrderTab = tab;
  document.querySelectorAll('.osn-item').forEach(item => item.classList.remove('active'));
  el.classList.add('active');
  filterOrders();
}

// Clears all orders in the currently visible tab.
// In Trash tab: permanently deletes them. In other tabs: soft-deletes (moves to Trash).
async function clearCurrentTab() {
  if (!filteredOrders.length) return;
  const count = filteredOrders.length;
  const msg = activeOrderTab === 'Deleted' 
    ? `Are you sure you want to PERMANENTLY delete all ${count} orders in the Trash? This cannot be undone.`
    : `Are you sure you want to move all ${count} orders in this tab to the Trash?`;
    
  if (!confirm(msg)) return;

  const batch = db.batch();
  for (const o of filteredOrders) {
    const ref = db.collection("orders").doc(o.id);
    if (activeOrderTab === 'Deleted') {
      batch.delete(ref);
    } else {
      batch.update(ref, { deleted: true });
    }
  }

  try {
    await batch.commit();
    showToast(`${count} orders cleared`);
  } catch (e) {
    alert("Batch operation failed: " + e.message);
  }
}

// Renders the filtered order list into the HTML table.
// Each row shows ref ID, date, customer, amount, status badge, and action buttons.
function renderTable() {
  const tbody = document.getElementById('ordersTableBody');
  if (filteredOrders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 30px;">No results match your criteria.</td></tr>';
    return;
  }

  tbody.innerHTML = filteredOrders.map((o, idx) => `
    <tr class="order-row reveal" style="--i: ${idx}">
      <td class="order-ref-col">
        <div class="o-ref">${o.refId}</div>
        <div class="o-id-sub">${o.id.slice(0, 8)}...</div>
      </td>
      <td class="order-date-col">${formatDate(o.timestamp)}</td>
      <td class="order-user-col">
        <div class="o-cust">${o.customerName || 'Anonymous'}</div>
        <div class="o-phone">${o.customerPhone || 'Silent'}</div>
      </td>
      <td class="order-amount-col">
        <div class="o-amt">${formatPrice(o.totalAmount || 0)}</div>
        <div class="o-method">${o.paymentMethod || '???'}</div>
      </td>
      <td class="order-status-col">${getStatusBadge(o.status)}</td>
      <td class="order-actions-col">
        <div class="quick-actions">
          <button class="qa-btn" onclick="viewOrder('${o.id}')" title="Full Intelligence">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          </button>
          
          ${o.deleted ? `
          <button class="qa-btn" onclick="restoreOrder('${o.id}')" title="Restore Order" style="color:#d4ca9d; border-color:rgba(212,202,157,0.3);">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
          </button>
          ` : `
            ${o.status === 'Pending' ? `<button class="qa-btn qa-approve" onclick="quickUpdate('${o.id}', 'Confirmed')" title="Instant Confirm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </button>` : ''}
            ${(o.status === 'Pending' || o.status === 'Confirmed') ? `<button class="qa-btn qa-cancel" onclick="quickUpdate('${o.id}', 'Rejected')" title="Reject Order">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>` : ''}
          `}

          <button class="qa-btn" onclick="deleteOrder('${o.id}', ${!!o.deleted})" title="${o.deleted ? 'Delete Permanently' : 'Move to Trash'}" style="color:#e68e9e; border-color:rgba(230,142,158,0.2);">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ── ORDER ACTIONS ──────────────────────────────────────
// Quick one-click status update directly from the orders table row.
// Instantly changes an order to Confirmed or Rejected without opening the modal.
async function quickUpdate(id, status) {
  try {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) throw error;
    showToast('Order status updated in real-time');
  } catch (e) {
    alert("Field update failed: " + e.message);
  }
}

// Restores a soft-deleted (trashed) order back to the active list.
// Sets the 'deleted' flag to false in Firestore, making it visible again.
async function restoreOrder(id) {
  try {
    const { error } = await supabase.from("orders").update({ deleted: false }).eq("id", id);
    if (error) throw error;
    showToast('Order restored to active list');
  } catch (error) {
    console.error("Error restoring order:", error);
    alert("Operation failed: " + error.message);
  }
}

// Soft-deletes an order (moves to Trash) or permanently removes it.
// isPermanent=true when the order is already in Trash and needs full removal.
async function deleteOrder(id, isPermanent) {
  const msg = isPermanent ? 'Are you absolutely sure you want to PERMANENTLY delete this order?' : 'Move this order to Trash?';
  if (!confirm(msg)) return;
  if (!supabase) return;

  try {
    if (isPermanent) {
      const { error } = await supabase.from("orders").delete().eq("id", id);
      if (error) throw error;
      showToast('Order permanently deleted');
    } else {
      const { error } = await supabase.from("orders").update({ deleted: true }).eq("id", id);
      if (error) throw error;
      showToast('Order moved to Trash');
    }
  } catch (error) {
    console.error("Error deleting order:", error);
    alert("Operation failed: " + error.message);
  }
}

// ── ORDER DETAIL MODAL ──────────────────────────────────
// Opens the full detail popup for a single order when the eye icon is tapped.
// Populates customer info, GPS coordinates, items list, delivery notes, and total.
function viewOrder(id) {
  const order = allOrders.find(o => o.id === id);
  if (!order) return;
  currentOrderDetails = order;

  document.getElementById('modalTitle').textContent = `Order ${order.refId}`;
  document.getElementById('modalCustomerName').textContent = order.customerName || '--';
  document.getElementById('modalCustomerPhone').textContent = order.customerPhone || '--';
  document.getElementById('modalTxId').textContent = order.transactionId || '--';
  document.getElementById('modalPayMethod').textContent = order.paymentMethod || '--';
  document.getElementById('modalDate').textContent = formatDate(order.timestamp);
  document.getElementById('modalSefer').textContent = order.customerSefer || '--';
  document.getElementById('modalDeliveryNotes').textContent = order.deliveryNotes || 'No specific instructions provided.';

  // Location / coordinates
  const coordText = document.getElementById('coordText');
  const btnMaps = document.getElementById('btnMaps');
  const coords = order.customerCoords;
  if (coords && coords.lat && coords.lon) {
    coordText.textContent = `${coords.lat.toFixed(6)}, ${coords.lon.toFixed(6)}`;
    btnMaps.style.display = 'inline-flex';
    btnMaps.href = `https://www.google.com/maps?q=${coords.lat},${coords.lon}`;
  } else {
    coordText.textContent = 'No coordinates shared.';
    btnMaps.style.display = 'none';
  }

  const select = document.getElementById('modalStatusSelect');
  select.value = order.status || 'Pending';

  // Render Items
  const itemsList = document.getElementById('modalItemsList');
  if (order.items && order.items.length > 0) {
    itemsList.innerHTML = order.items.map(i => {
      // Find image from ALL if possible
      const p = ALL.find(x => x.no === i.no);
      const imgSrc = p ? p.image : '';

      return `
      <div class="order-item-row">
        <div class="o-thumb">
          ${imgSrc ? `<img src="${imgSrc}" onerror="handleImgErr(this)">` : '<div class="o-no-img">?</div>'}
        </div>
        <div class="order-item-main">
          <div class="o-name">${i.brand} ${i.name}</div>
          <div class="o-meta">Size: ${i.size || 'N/A'} | Qty: ${i.qty}</div>
        </div>
        <div class="o-price">${formatPrice((i.price || 0) * (i.qty || 1))}</div>
      </div>`;
    }).join('');
  } else {
    itemsList.innerHTML = '<div style="color: rgba(255,255,255,0.5); font-size: 13px;">No items recorded.</div>';
  }

  document.getElementById('modalTotal').textContent = `Total: ${formatPrice(order.totalAmount || 0)}`;

  document.getElementById('orderModalBackdrop').classList.add('open');
  document.getElementById('orderModal').classList.add('open');
}

// Closes the order detail modal and clears the currentOrderDetails reference.
// Called by the ✕ button or clicking the backdrop overlay.
function closeOrderModal() {
  document.getElementById('orderModalBackdrop').classList.remove('open');
  document.getElementById('orderModal').classList.remove('open');
  currentOrderDetails = null;
}

// Updates the four top stat cards: total active orders, pending, confirmed, and revenue.
// Only counts non-deleted orders to keep the dashboard numbers accurate.
function updateStatsDisplay(pending, completed, revenue, totalActive) {
  document.getElementById('statTotal').textContent = totalActive;
  document.getElementById('statPending').textContent = pending;
  document.getElementById('statCompleted').textContent = completed;
  document.getElementById('statRevenue').textContent = formatPrice(revenue);
}

function handleSearch() {
  filterOrders();
}

// Plays a short audio notification alert when a new order is detected.
// Only triggers when the active order count increases — not on restores or deletions.
function playSuccessSound() {
  const audio = document.getElementById('notifSound');
  if (audio) {
    audio.currentTime = 0;
    audio.play().catch(e => console.log('Audio wait for user', e));
  }
}

function showToast(msg) {
  console.log(msg);
}

// Saves a new status to Supabase for the order currently open in the detail modal.
// The Supabase realtime listener will auto-refresh the table when the save completes.
async function updateOrderStatus() {
  if (!currentOrderDetails) return;
  const newStatus = document.getElementById('modalStatusSelect').value;
  const orderId = currentOrderDetails.id;

  try {
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    if (error) throw error;
  } catch (error) {
    console.error("Error updating status:", error);
    alert("Failed to update status. Please try again.");
  }
}

// ── INITIALIZATION ────────────────────────────────────
// App initialization after page load without authentication.

document.addEventListener("DOMContentLoaded", async () => {
  // Initial data load
  loadOrders();
  loadSavedNotes();
  await initProducts();
  renderProducts();
  initReveal();

  console.log("Admin Dashboard Loaded");
});



// ── IMAGE ERROR FALLBACK ──────────────────────────────
// Handles broken product image URLs by trying the alternate photo folder path.
// If both paths fail, the image is dimmed instead of showing a broken icon.
function handleImgErr(img) {
  if (img.dataset.triedFallback) {
    img.style.opacity = '0.1'; // Dim instead of hiding in admin
    return;
  }
  img.dataset.triedFallback = "true";
  const current = img.src;
  if (current.includes('Perfume%20Photos%201')) {
    img.src = current.replace('Perfume%20Photos%201', 'Perfume%20Photos');
  } else if (current.includes('Perfume%20Photos')) {
    img.src = current.replace('Perfume%20Photos', 'Perfume%20Photos%201');
  }
}

// ── SCROLL REVEAL ANIMATION ───────────────────────────
// Uses IntersectionObserver to fade in order rows as they appear on screen.
// Gives the orders table a smooth animated entrance when content loads.
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });

  // Removed .reveal from prod-item to ensure visibility in admin
  document.querySelectorAll('.order-row.reveal').forEach(el => observer.observe(el));
}

// ── SIDEBAR TOGGLE ────────────────────────────────────
// Opens or closes the left navigation sidebar when the hamburger button is tapped.
// Adds/removes CSS classes on the body and sidebar element to drive the animation.
function toggleSidebar() {
  const sidebar = document.getElementById('dotSidebar');
  const isOpen = sidebar.classList.contains('open');
  if (isOpen) {
    sidebar.classList.remove('open');
    document.body.classList.remove('sidebar-open');
  } else {
    sidebar.classList.add('open');
    document.body.classList.add('sidebar-open');
  }
}

// Silently closes the sidebar without toggling — used after selecting a nav item.
// Ensures the sidebar auto-hides on mobile after navigation without needing another tap.
function closeSidebar() {
  const sidebar = document.getElementById('dotSidebar');
  if (sidebar && sidebar.classList.contains('open')) {
    sidebar.classList.remove('open');
    document.body.classList.remove('sidebar-open');
  }
}

// ── PRODUCT FILTERS ──────────────────────────────────
// Toggles the active category filter (e.g. Kings, Queens, Unisex).
// Only one category can be active at a time — clicking the same one resets it.
function toggleCategory(cat, el) {
  const isActive = currentFilters.category.includes(cat);
  currentFilters.category = isActive ? [] : [cat];
  document.querySelectorAll('[onclick^="toggleCategory"]').forEach(btn => btn.classList.remove('active'));
  if (!isActive) el.classList.add('active');
  updateResetBtn();
  renderProducts();
}

// Toggles a scent filter (e.g. Oud, Fresh) and syncs all matching buttons across the UI.
// Any button anywhere that targets the same scent gets highlighted simultaneously.
function toggleScent(scnt, el) {
  const isActive = currentFilters.scent.includes(scnt);
  currentFilters.scent = isActive ? [] : [scnt];
  
  // Sync all buttons for the same scent across different UI areas
  document.querySelectorAll(`[onclick^="toggleScent"]`).forEach(btn => btn.classList.remove('active'));
  
  if (!isActive) {
    // Highlight all buttons that target this scent
    document.querySelectorAll(`[onclick*="'${scnt}'"]`).forEach(btn => btn.classList.add('active'));
  }
  
  updateResetBtn();
  renderProducts();
}

// Clears all active filters and re-renders the full unfiltered product list.
// Also hides the reset button and re-initialises the scroll reveal animation.
function resetCategories() {
  currentFilters = { category: [], type: [], scent: [], price: [] };
  document.querySelectorAll('.sel-btn, .topbar-filter-btn').forEach(btn => btn.classList.remove('active'));
  updateResetBtn();
  renderProducts();
  initReveal();
}

// Shows or hides the 'Reset Filters' button based on whether any filter is currently active.
function updateResetBtn() {
  const isAnyActive = currentFilters.category.length > 0 || currentFilters.scent.length > 0;
  document.getElementById('secResetBtn').classList.toggle('show', isAnyActive);
}

// ── MAIN TAB SWITCHING ────────────────────────────────
// Switches between the three main sections: Orders, Catalogue, and Tools.
// Updates the sidebar nav highlight, search placeholder, and shows/hides action buttons.
function switchTab(tabId) {
  activeTab = tabId;
  const sections = document.querySelectorAll('.tab-content');
  const dsItems = document.querySelectorAll('.ds-item');

  sections.forEach(s => s.classList.remove('active'));
  dsItems.forEach(n => n.classList.remove('active'));

  document.getElementById(tabId + 'Section').classList.add('active');
  const navId = 'navItem' + tabId.charAt(0).toUpperCase() + tabId.slice(1);
  if (document.getElementById(navId)) document.getElementById(navId).classList.add('active');
  
  const searchInput = document.getElementById('mainSearch');
  if (searchInput) {
    if (tabId === 'orders') searchInput.placeholder = 'Search orders, customers, refs...';
    else if (tabId === 'products') searchInput.placeholder = 'Filter catalogue...';
    else searchInput.placeholder = 'Search...';
    searchInput.value = '';
  }

  const addBtn = document.getElementById('btnAddProductTop');
  if (addBtn) addBtn.style.display = (tabId === 'products') ? 'block' : 'none';
  
  const mergeBtn = document.getElementById('btnMergeSelected');
  const delBtn = document.getElementById('btnDeleteSelected');
  const uncheckBtn = document.getElementById('btnUncheck');
  
  if (tabId === 'products') {
    if (uncheckBtn) uncheckBtn.style.display = (selectedProductsToMerge.size > 0) ? 'flex' : 'none';
    if (mergeBtn) mergeBtn.style.display = (selectedProductsToMerge.size > 1) ? 'flex' : 'none';
    if (delBtn) delBtn.style.display = (selectedProductsToMerge.size > 0) ? 'flex' : 'none';
    renderProducts();
  } else {
    if (uncheckBtn) uncheckBtn.style.display = 'none';
    if (mergeBtn) mergeBtn.style.display = 'none';
    if (delBtn) delBtn.style.display = 'none';
    if (tabId === 'orders') filterOrders();
  }

  closeSidebar();
}

// Routes the global search box to filter either orders or products based on which tab is open.
function handleGlobalSearch() {
  if (activeTab === 'orders') filterOrders();
  else if (activeTab === 'products') renderProducts();
}

// Switches between Active and Trash sub-tabs within the Catalogue section.
function switchProductTab(tab, el) {
  activeProductTab = tab;
  document.querySelectorAll('#productsSection .osn-item').forEach(item => item.classList.remove('active'));
  el.classList.add('active');
  renderProducts();
}

// ── PRODUCT CATALOGUE: INIT + RENDER ──────────────────────
// Loads all products directly from Supabase (no local data anymore).
// Also deduplicates products that share the same brand+name by merging their images.
async function initProducts() {
  // Load all products from Supabase
  if (typeof supabase !== 'undefined' && supabase) {
    try {
      const { data: prodData, error } = await supabase.from("products").select("*");
      if (error) throw error;
      
      // Replace ALL array with Supabase data
      ALL.length = 0;  // Clear array
      ALL.push(...(prodData || []));  // Add all Supabase products
      
    } catch (e) { 
      console.warn("Could not load products from Supabase", e); 
      ALL = [];  // Initialize as empty if error
    }
  } else {
    ALL = [];  // Initialize as empty if no Supabase
  }

  // ── MERGE DUPLICATES (Sync with Website) ──
  const mergedMap = new Map();
  const cleaned = [];

  ALL.forEach(p => {
    const key = `${(p.brand || '').trim()}|${(p.name || '').trim()}`.toLowerCase();
    if (mergedMap.has(key)) {
      const existing = mergedMap.get(key);
      if (!existing.images) existing.images = [existing.image];
      if (p.image && !existing.images.includes(p.image)) {
        existing.images.push(p.image);
      }
    } else {
      mergedMap.set(key, p);
      cleaned.push(p);
    }
  });

  ALL.length = 0;
  ALL.push(...cleaned);
}

// Renders the product grid based on current filters, search query, and active sub-tab.
// Groups products by section (Kings, Queens, Oud, etc.) with section headers and counts.
function renderProducts() {
  const grid = document.getElementById('prodGrid');
  if (!grid) return;

  const q = document.getElementById('mainSearch')?.value.toLowerCase() || '';
  const { category, scent } = currentFilters;
  const isSelectorActive = category.length > 0 || scent.length > 0;

  // Helper function to match product against current filters
  const matchFilter = (p) => {
    if (!p) return false;
    
    // Always filter by Trash vs Active (Products section now shows all unless deleted)
    // Actually, in the new simplified view, let's just show active items.
    if (p.deleted) return false;

    const name = (p.name || '').toLowerCase();
    const brand = (p.brand || '').toLowerCase();
    const no = String(p.no || '');
    
    const matchesSearch = name.includes(q) || brand.includes(q) || no.includes(q);

    if (!matchesSearch) return false;

    if (isSelectorActive) {
      const gCode = p.g || 'u';
      const pSecs = p.sections || [p.sec || 'misc'];

      let genderMatch = category.length === 0;
      if (category.includes('men') && gCode === 'm') genderMatch = true;
      if (category.includes('women') && gCode === 'w') genderMatch = true;
      if (category.includes('unisex') && gCode === 'u') genderMatch = true;

      let scentMatch = scent.length === 0;
      if (scent.includes('oud') && pSecs.includes('sec-oud')) scentMatch = true;
      if (scent.includes('fresh') && pSecs.includes('sec-fresh')) scentMatch = true;
      if (scent.includes('latest') && POPULAR_IDS['sec-latest'].includes(p.no)) scentMatch = true;
      if (scent.includes('favorites') && POPULAR_IDS['sec-favorites'].includes(p.no)) scentMatch = true;

      return genderMatch && scentMatch;
    }

    return true;
  };

  const SECTIONS_CONFIG = [
    { id: 'sec-unisex', title: 'Unified Collection (Unisex)' },
    { id: 'sec-kings', title: 'For Men (Kings)' },
    { id: 'sec-queens', title: 'For Women (Queens)' },
    { id: 'sec-latest', title: 'Latest & Trending Scents' },
    { id: 'sec-favorites', title: "Most People's Favorites" },
    { id: 'sec-oud', title: 'Oud & Arabian Treasures' },
    { id: 'sec-fresh', title: 'Fresh & Aquatic Collection' },
    { id: 'sec-sweet', title: 'Sweet & Gourmand' },
    { id: 'sec-woody', title: 'Woody & Intense' },
    { id: 'sec-designer', title: 'Designer Masterpieces' },
    { id: 'sec-sets', title: 'Curated Sets & Splashes' },
    { id: 'sec-other', title: 'Other Essentials' },
    { id: 'sec-misc', title: 'Miscellaneous' }
  ];

  let html = '';

  SECTIONS_CONFIG.forEach(sec => {
    let items = [];
    if (sec.id === 'sec-latest') {
      const latestIds = (typeof POPULAR_IDS !== 'undefined' && POPULAR_IDS['sec-latest']) || [];
      items = ALL.filter(p => latestIds.includes(p.no) && matchFilter(p));
    } else if (sec.id === 'sec-favorites') {
      const favIds = (typeof POPULAR_IDS !== 'undefined' && POPULAR_IDS['sec-favorites']) || [];
      items = ALL.filter(p => favIds.includes(p.no) && matchFilter(p));
    } else {
      items = ALL.filter(p => (p.sections || [p.sec || 'misc']).includes(sec.id) && matchFilter(p));
    }

    // Sort items by created_at timestamp (newest first)
    items.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA; // Descending order (newest first)
    });

    if (items.length === 0) return;

    html += `
      <div class="sec-group-title" style="grid-column: 1 / -1; margin-top: 30px; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: var(--gold); border-bottom: 1px solid rgba(200,160,80,0.2); padding-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
        <span>${sec.title}</span>
        <span style="font-size: 11px; opacity: 0.5;">${items.length} Products</span>
      </div>`;

    html += (items || []).map((p, idx) => `
      <div class="prod-item" style="--i: ${idx}; position: relative;">
        <div class="prod-checkbox-wrap" style="position: absolute; top: 12px; right: 12px; z-index: 10; background: rgba(0,0,0,0.4); border-radius: 6px; padding: 4px; display: flex;" onclick="event.stopPropagation()">
          <input type="checkbox" class="prod-checkbox" style="width: 16px; height: 16px; cursor: pointer; accent-color: var(--gold);" value="${p.no}" id="chk_${p.no}" onchange="handleProdSelect()" ${selectedProductsToMerge.has(p.no) ? 'checked' : ''}>
        </div>
        <div class="p-ico">
          ${p.image ? `<img src="${p.image}" onerror="handleImgErr(this)" style="width:100%; height:100%; object-fit:cover; border-radius:6px;">` : getEmoji(p.tags || [], p.g)}
        </div>
        <div class="p-info">
          <div class="p-name">${p.name || 'Unknown'} <span class="p-id-pill">#${p.no || '??'}</span></div>
          <div class="p-brand">${p.brand || 'Exclusive'}</div>
          <div class="p-price">${p.price === 'N/A' ? 'Request' : (p.price || '0') + ' Br'}</div>
          <div class="p-secs-row">
            ${(p.sections || [p.sec || 'misc']).map(s => `<span class="p-sec-tag">${String(s).replace('sec-', '')}</span>`).join('')}
          </div>
        </div>
        <div class="p-actions">
          <button class="qa-btn" onclick="openProductModal(${p.no})" title="Edit Details">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon></svg>
          </button>
        </div>
      </div>
    `).join('');
  });

  grid.innerHTML = html || '<div style="padding:80px; text-align:center; color:rgba(255,255,255,0.2); grid-column: 1 / -1;">No products found matching the Store catalogue.</div>';
}

// Triggers a product re-render when the search box input changes.
function handleProdSearch() {
  renderProducts();
}

// ── PRODUCT EDIT MODAL ────────────────────────────────
// Opens the product edit/add modal and pre-fills all fields from the product data.
// When called with no argument, it opens as a blank 'Add New Product' form.
function openProductModal(no) {
  const isNew = typeof no === 'undefined' || no === null;
  const p = isNew ? null : ALL.find(x => x.no === no);

  if (!isNew && !p) return;

  // Reset uploaded images array for new session
  currentUploadedImages = [];
  primaryImageIndex = 0;
  
  // If editing existing product, load its images
  if (!isNew && p) {
    if (p.images && p.images.length > 0) {
      currentUploadedImages = [...p.images];
      // Find which image is the primary one (matches p.image)
      if (p.image) {
        const primaryIdx = currentUploadedImages.indexOf(p.image);
        primaryImageIndex = primaryIdx >= 0 ? primaryIdx : 0;
      }
    } else if (p.image) {
      currentUploadedImages = [p.image];
      primaryImageIndex = 0;
    }
  }

  document.getElementById('prodModalTitle').textContent = isNew ? 'Add New Product' : 'Edit Product';
  document.getElementById('prodNo').value = isNew ? '' : p.no;
  document.getElementById('prodBrand').value = isNew ? '' : p.brand;
  document.getElementById('prodName').value = isNew ? '' : p.name;
  document.getElementById('prodPrice').value = isNew ? '' : p.price;

  // Set primary section
  document.getElementById('prodSec').value = isNew ? 'sec-unisex' : (p.sections ? p.sections[0] : p.sec);

  document.getElementById('prodSize').value = isNew ? '100ml' : p.size;
  document.getElementById('prodGender').value = isNew ? 'u' : p.g;
  document.getElementById('prodOrig').value = isNew ? 'false' : (p.orig ? 'true' : 'false');
  document.getElementById('prodImg').value = isNew ? '' : (p.image || '');
  
  // Reset image upload file input and status text
  const fileInput = document.getElementById('prodImgFile');
  if (fileInput) fileInput.value = '';
  const statusSpan = document.getElementById('uploadStatus');
  if (statusSpan) {
    if (currentUploadedImages.length > 0) {
      statusSpan.textContent = `${currentUploadedImages.length} photo(s) loaded`;
      statusSpan.style.color = 'rgba(255,255,255,0.5)';
    } else {
      statusSpan.textContent = 'No file selected';
      statusSpan.style.color = 'rgba(255,255,255,0.5)';
    }
  }

  // Render uploaded images gallery
  renderUploadedImagesGallery();

  // Set scent checkboxes in dropdown active states
  const existingTags = isNew ? [] : (p.tags || []);
  const checkboxes = document.querySelectorAll('#scentDropdown input[type="checkbox"]');
  checkboxes.forEach(cb => {
    cb.checked = existingTags.includes(cb.value);
  });
  syncScentSelection();

  document.getElementById('prodVibe').value = isNew ? '' : (p.vibe || '');

  document.getElementById('prodModalBackdrop').classList.add('open');
  document.getElementById('prodModal').classList.add('open');

  // Hide the old gallery row since we now use the upload preview area
  const galleryRow = document.getElementById('prodGalleryRow');
  if (galleryRow) galleryRow.style.display = 'none';
  
  // Handle delete button visibility
  const delBtn = document.getElementById('modalDelBtn');
  if (isNew) {
    delBtn.style.display = 'none';
  } else {
    delBtn.style.display = 'flex';
    delBtn.title = p.deleted ? 'Restore Product' : 'Delete Product';
    delBtn.innerHTML = p.deleted 
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>';
  }
}

function closeProductModal() {
  document.getElementById('prodModalBackdrop').classList.remove('open');
  document.getElementById('prodModal').classList.remove('open');
}

async function saveProduct() {
  if (!supabase) {
    alert("Supabase database not initialized! Cannot save.");
    return;
  }

  const btn = document.querySelector('#prodModal .btn-primary');
  btn.textContent = 'Saving...';
  btn.disabled = true;

  try {
    let noStr = document.getElementById('prodNo').value;
    let no;
    let isNewProduct = false;

    if (!noStr) {
      // Find a new ID. Max existing ID + 1.
      const currentMax = ALL.reduce((max, item) => Math.max(max, item.no), 0);
      no = currentMax + 1;
      isNewProduct = true;
    } else {
      no = parseInt(noStr, 10);
    }

    // Prepare images array and primary image
    let primaryImage = '';
    let imagesArray = [];
    
    if (currentUploadedImages.length > 0) {
      // Reorder array so primary image is first
      imagesArray = [...currentUploadedImages];
      if (primaryImageIndex > 0 && primaryImageIndex < imagesArray.length) {
        // Move primary image to the front
        const primaryImg = imagesArray[primaryImageIndex];
        imagesArray.splice(primaryImageIndex, 1);
        imagesArray.unshift(primaryImg);
      }
      primaryImage = imagesArray[0]; // First image (after reordering) is primary
    }

    const data = {
      no: no,
      brand: document.getElementById('prodBrand').value.trim(),
      name: document.getElementById('prodName').value.trim(),
      price: document.getElementById('prodPrice').value.trim(),
      sections: [document.getElementById('prodSec').value], // Simplified for admin edit
      size: document.getElementById('prodSize').value.trim(),
      g: document.getElementById('prodGender').value,
      orig: document.getElementById('prodOrig').value === 'true',
      image: primaryImage,
      images: imagesArray,
      tags: Array.from(document.querySelectorAll('#scentDropdown input[type="checkbox"]:checked')).map(cb => cb.value),
      vibe: document.getElementById('prodVibe').value.trim()
    };

    // Save to Supabase (upsert)
    const { error } = await supabase.from("products").upsert(data);
    if (error) throw error;

    // Update local memory
    const existingIdx = ALL.findIndex(p => p.no === no);
    if (existingIdx >= 0) {
      ALL[existingIdx] = { ...ALL[existingIdx], ...data };
    } else {
      // Add new product at the beginning of the array
      ALL.unshift({ ...data });
    }

    renderProducts();
    closeProductModal();
    showToast(`Product ${no} saved successfully`);

  } catch (e) {
    console.error("Error saving product:", e);
    alert("Failed to save product: " + e.message);
  } finally {
    btn.textContent = 'Save Product Details';
    btn.disabled = false;
  }
}

// Soft-deletes (trash) or restores a product directly from the product edit modal.
// The trash button changes to a restore icon when the product is already deleted.
async function removeProductFromModal() {
  const no = parseInt(document.getElementById('prodNo').value);
  if (isNaN(no)) return;
  const p = ALL.find(x => x.no === no);
  if (!p) return;

  const isRestoring = !!p.deleted;
  const msg = isRestoring ? `Restore Product #${no}?` : `Move Product #${no} to Trash?`;
  if (!confirm(msg)) return;

  try {
    const newVal = isRestoring ? false : true;
    const { error } = await supabase.from("products").update({ deleted: newVal }).eq("no", no);
    if (error) throw error;

    // Update local memory
    p.deleted = newVal;

    renderProducts();
    closeProductModal();
    showToast(isRestoring ? 'Product restored' : 'Product moved to Trash');
  } catch (e) {
    alert("Operation failed: " + e.message);
  }
}

// Permanently purges all products currently in the Trash (Deleted sub-tab).
// Only available in the Deleted tab — this action cannot be undone.
async function clearCurrentProductTab() {
  if (activeProductTab !== 'Deleted') {
    alert("Purging is only available in the Trash tab.");
    return;
  }
  const trashItems = ALL.filter(p => p.deleted);
  if (!trashItems.length) return;

  if (!confirm(`Permanently delete all ${trashItems.length} products in Trash? This cannot be undone.`)) return;

  try {
    const { error } = await supabase.from("products").delete().eq("deleted", true);
    if (error) throw error;

    // Local remove
    trashItems.forEach(p => {
      const idx = ALL.findIndex(x => x.no === p.no);
      if (idx >= 0) ALL.splice(idx, 1);
    });
    renderProducts();
    showToast("Trash purged successfully");
  } catch (e) {
    alert("Purge failed: " + e.message);
  }
}

// ── FALLBACK EMOJI HELPER ─────────────────────────────
// Returns a generic bottle SVG when a product has no photo image set.
// Used only in the admin product grid as a placeholder thumbnail.
function getEmoji(tags, gender) {
  // Return generic SVG instead of emoji
  return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.5;"><path d="M7 7.5c0-2 1.5-4 4.5-4s4.5 2 4.5 4v2c2 1 3 3 3 5v3c0 1.5-1 3-3 3H8c-2 0-3-1.5-3-3v-3c0-2 1-4 3-5v-2z"></path><line x1="12" y1="3.5" x2="12" y2="1.5"></line><line x1="10" y1="1.5" x2="14" y2="1.5"></line></svg>`;
}

// ── BULK PRODUCT SELECTION & ACTIONS ──────────────────────
// Clears all selected checkboxes at once using the Deselect topbar button.
// Resets the Set and unchecks every visible checkbox in the product grid.
function uncheckAllProducts() {
  selectedProductsToMerge.clear();
  document.querySelectorAll('.prod-checkbox').forEach(cb => cb.checked = false);
  handleProdSelect();
}

// Called whenever a product checkbox changes state. Re-reads all checked boxes.
// Shows/hides the Deselect, Remove Selected, and Merge Selected topbar buttons accordingly.
function handleProdSelect() {
  const checkboxes = document.querySelectorAll('.prod-checkbox');
  selectedProductsToMerge.clear();
  checkboxes.forEach(cb => {
    if (cb.checked) selectedProductsToMerge.add(parseInt(cb.value));
  });
  
  const mergeBtn = document.getElementById('btnMergeSelected');
  const delBtn = document.getElementById('btnDeleteSelected');
  const uncheckBtn = document.getElementById('btnUncheck');
  
  if (selectedProductsToMerge.size > 0) {
    if (delBtn) delBtn.style.display = 'flex';
    if (uncheckBtn) uncheckBtn.style.display = 'flex';
    if (selectedProductsToMerge.size > 1) {
      if (mergeBtn) mergeBtn.style.display = 'flex';
    } else {
      if (mergeBtn) mergeBtn.style.display = 'none';
    }
  } else {
    if (delBtn) delBtn.style.display = 'none';
    if (mergeBtn) mergeBtn.style.display = 'none';
    if (uncheckBtn) uncheckBtn.style.display = 'none';
  }
}

// Soft-deletes (moves to Trash) all currently selected products as a batch.
// Updates Firestore and local memory in one batch write, then clears the selection.
async function deleteSelectedProducts() {
  if (selectedProductsToMerge.size === 0) return;
  const count = selectedProductsToMerge.size;
  if (!confirm(`Move ${count} selected products to Trash?`)) return;

  const ids = Array.from(selectedProductsToMerge);

  try {
    const { error } = await supabase.from("products").update({ deleted: true }).in("no", ids);
    if (error) throw error;

    ids.forEach(no => {
      const p = ALL.find(x => x.no === no);
      if (p) p.deleted = true;
    });

    showToast(`${count} products moved to Trash`);
    selectedProductsToMerge.clear();
    handleProdSelect();
    renderProducts();
  } catch (e) {
    alert("Delete failed: " + e.message);
  }
}

function openMergeModal() {
  if (selectedProductsToMerge.size < 2) return;
  
  const select = document.getElementById('mergePrimarySelect');
  select.innerHTML = '';
  
  selectedProductsToMerge.forEach(no => {
    const p = ALL.find(x => x.no === no);
    if (p) {
      select.innerHTML += `<option value="${p.no}" style="background: #140a0f;">${p.brand || ''} ${p.name} (#${p.no}) - ${formatPrice(p.price || 0)}</option>`;
    }
  });
  
  document.getElementById('mergeCount').textContent = selectedProductsToMerge.size;
  document.getElementById('mergeModalBackdrop').classList.add('open');
  document.getElementById('mergeModal').classList.add('open');
}

function closeMergeModal() {
  document.getElementById('mergeModalBackdrop').classList.remove('open');
  document.getElementById('mergeModal').classList.remove('open');
}

async function executeMerge() {
  if (!supabase) {
    alert("Supabase database not initialized! Cannot save.");
    return;
  }
  
  const primaryNoStr = document.getElementById('mergePrimarySelect').value;
  if (!primaryNoStr) return;
  
  const primaryNo = parseInt(primaryNoStr);
  const others = Array.from(selectedProductsToMerge).filter(n => n !== primaryNo);
  
  const pObj = ALL.find(x => x.no === primaryNo);
  if (!pObj) return;
  
  const btn = document.getElementById('btnConfirmMerge');
  btn.textContent = 'Merging Data...';
  btn.disabled = true;
  
  if (!pObj.images) pObj.images = pObj.image ? [pObj.image] : [];
  if (!pObj.sections) pObj.sections = [pObj.sec || 'sec-misc'];
  if (!pObj.tags) pObj.tags = [];
  
  try {
    if (others.length > 0) {
      const { error: delError } = await supabase
        .from("products")
        .update({ deleted: true })
        .in("no", others);
      if (delError) throw delError;

      others.forEach(oNo => {
         let oObj = ALL.find(x => x.no === oNo);
         if (!oObj) return;
         
         // merge images
         let oImgs = oObj.images || (oObj.image ? [oObj.image] : []);
         oImgs.forEach(img => {
             if (!pObj.images.includes(img) && img.trim()) pObj.images.push(img.trim());
         });
         if (!pObj.image && oObj.image) pObj.image = oObj.image;
         
         // merge sections
         let oSecs = oObj.sections || (oObj.sec ? [oObj.sec] : []);
         oSecs.forEach(sec => {
             if (!pObj.sections.includes(sec)) pObj.sections.push(sec);
         });
         
         // merge tags
         let oTags = oObj.tags || [];
         oTags.forEach(tag => {
             if (!pObj.tags.includes(tag)) pObj.tags.push(tag);
         });
         
         oObj.deleted = true;
      });
    }
    
    // update primary
    const { error: updateError } = await supabase
      .from("products")
      .update({ 
        images: pObj.images,
        image: pObj.image || '',
        sections: pObj.sections,
        tags: pObj.tags
      })
      .eq("no", primaryNo);
      
    if (updateError) throw updateError;
    
    showToast("Successfully merged perfumes");
    
    selectedProductsToMerge.clear();
    const mergeBtn = document.getElementById('btnMergeSelected');
    if (mergeBtn) mergeBtn.style.display = 'none';
    
    closeMergeModal();
    renderProducts();
  } catch (e) {
    alert("Merge failed: " + e.message);
  } finally {
    btn.textContent = 'Confirm & Merge Data';
    btn.disabled = false;
  }
}

// ── GOD MODE TOOLS ──────────────────────────────────────────────
function runCalc() {
  const cost = parseFloat(document.getElementById('calcCost').value) || 0;
  const sale = parseFloat(document.getElementById('calcSale').value) || 0;

  const profit = sale - cost;
  const margin = sale !== 0 ? (profit / sale) * 100 : 0;

  document.getElementById('resProfit').textContent = formatPrice(profit);
  document.getElementById('resMargin').textContent = margin.toFixed(1) + '%';

  if (margin < 15) document.getElementById('resMargin').style.color = '#e68e9e';
  else if (margin > 35) document.getElementById('resMargin').style.color = '#8fd19e';
  else document.getElementById('resMargin').style.color = '#c8a050';
}

function setAsDefaultPhoto(url, el) {
  // Update the input field
  document.getElementById('prodImg').value = url;
  
  // Update UI active state
  document.querySelectorAll('.gallery-item').forEach(item => item.classList.remove('active'));
  el.classList.add('active');
  
  // Update the hints
  document.querySelectorAll('.gallery-item .set-default-hint').forEach(h => h.textContent = 'SET AS DEFAULT');
  el.querySelector('.set-default-hint').textContent = 'CURRENT DEFAULT';

  showToast('Default photo selected (Save to apply)');
}

function saveNotes() {
  const val = document.getElementById('adminNotes').value;
  localStorage.setItem('dagu_admin_notes', val);
}

function loadSavedNotes() {
  const val = localStorage.getItem('dagu_admin_notes');
  if (val) document.getElementById('adminNotes').value = val;
}

// Handles uploading selected product image file to Supabase Storage
// Track uploaded images in current session for multi-photo support
let currentUploadedImages = [];
let primaryImageIndex = 0; // Track which image is primary

async function uploadProductImage(input) {
  const files = input.files;
  if (!files || files.length === 0) return;

  const statusSpan = document.getElementById('uploadStatus');
  const saveBtn = document.querySelector('#prodModal .btn-primary');

  if (!supabase) {
    alert("Supabase Storage is not initialized correctly. Check supabase-config.js.");
    return;
  }

  // Visual feedback during upload starting
  statusSpan.textContent = 'Preparing upload...';
  statusSpan.style.color = 'var(--gold)';
  if (saveBtn) saveBtn.disabled = true;

  try {
    // Upload all selected files
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Generate a unique filename using timestamp
      const ext = file.name.split('.').pop();
      const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `product_${Date.now()}_${i}_${cleanName}.${ext}`;
      
      statusSpan.textContent = `Uploading ${i + 1}/${files.length}...`;
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('product-photos')
        .upload(filename, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (error) throw error;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('product-photos')
        .getPublicUrl(filename);
        
      if (!urlData || !urlData.publicUrl) {
        throw new Error("Could not retrieve public URL from storage.");
      }
      
      // Add to uploaded images array
      currentUploadedImages.push(urlData.publicUrl);
    }
    
    statusSpan.textContent = `✓ ${files.length} photo(s) uploaded`;
    statusSpan.style.color = '#8fd19e';

    // Render the uploaded images gallery
    renderUploadedImagesGallery();
    
  } catch (error) {
    console.error("Storage upload failed:", error);
    statusSpan.textContent = '✗ Upload failed';
    statusSpan.style.color = '#e68e9e';
    alert("Photo upload failed: " + error.message);
  } finally {
    if (saveBtn) saveBtn.disabled = false;
    // Clear file input so same files can be selected again
    input.value = '';
  }
}

// Render the uploaded images in a gallery with remove buttons
function renderUploadedImagesGallery() {
  const previewWrap = document.getElementById('imgPreviewWrap');
  const prompt = document.getElementById('imgUploadPrompt');
  
  if (currentUploadedImages.length === 0) {
    // Show upload prompt, hide gallery
    previewWrap.style.display = 'none';
    prompt.style.display = 'block';
    return;
  }
  
  // Hide upload prompt, show gallery
  prompt.style.display = 'none';
  previewWrap.style.display = 'block';
  
  previewWrap.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px;">
      ${currentUploadedImages.map((url, idx) => `
        <div style="position: relative; border-radius: 8px; overflow: hidden; border: 3px solid ${idx === primaryImageIndex ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}; cursor: pointer; transition: all 0.3s;" ondblclick="setPrimaryImage(${idx})" title="Double-click to set as primary photo">
          <img src="${url}" style="width: 100%; height: 100px; object-fit: cover; display: block; pointer-events: none;">
          <button onclick="event.stopPropagation(); removeUploadedImage(${idx})" style="position: absolute; top: 4px; right: 4px; background: rgba(230,142,158,0.9); border: none; color: white; width: 24px; height: 24px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; line-height: 1; padding: 0; z-index: 10;" title="Remove this photo">×</button>
          ${idx === primaryImageIndex ? '<div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(200,160,80,0.95); color: #000; font-size: 9px; padding: 4px; text-align: center; font-weight: 600; letter-spacing: 1px; pointer-events: none;">★ PRIMARY</div>' : '<div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.7); color: rgba(255,255,255,0.5); font-size: 8px; padding: 3px; text-align: center; letter-spacing: 0.5px; pointer-events: none;">Double-click to set primary</div>'}
        </div>
      `).join('')}
      <div onclick="document.getElementById('prodImgFile').click()" style="position: relative; border-radius: 8px; overflow: hidden; border: 2px dashed rgba(200,160,80,0.5); cursor: pointer; transition: all 0.3s; background: rgba(200,160,80,0.05); display: flex; align-items: center; justify-content: center; min-height: 100px;" onmouseover="this.style.borderColor='var(--gold)'; this.style.background='rgba(200,160,80,0.1)'; this.style.transform='scale(1.05)'" onmouseout="this.style.borderColor='rgba(200,160,80,0.5)'; this.style.background='rgba(200,160,80,0.05)'; this.style.transform='scale(1)'" title="Add more photos">
        <div style="text-align: center; color: var(--gold); pointer-events: none;">
          <div style="font-size: 32px; line-height: 1; margin-bottom: 4px;">+</div>
          <div style="font-size: 9px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.8;">Add More</div>
        </div>
      </div>
    </div>
  `;
}

// Set primary image by double-clicking
function setPrimaryImage(index) {
  if (index >= 0 && index < currentUploadedImages.length) {
    primaryImageIndex = index;
    renderUploadedImagesGallery();
    
    const statusSpan = document.getElementById('uploadStatus');
    statusSpan.textContent = `Photo #${index + 1} set as primary`;
    statusSpan.style.color = 'var(--gold)';
    
    // Fade back to normal status after 2 seconds
    setTimeout(() => {
      statusSpan.textContent = `${currentUploadedImages.length} photo(s) ready`;
      statusSpan.style.color = '#8fd19e';
    }, 2000);
  }
}

// Remove an uploaded image from the current session
function removeUploadedImage(index) {
  if (index >= 0 && index < currentUploadedImages.length) {
    currentUploadedImages.splice(index, 1);
    
    // Adjust primary index if necessary
    if (primaryImageIndex >= currentUploadedImages.length) {
      primaryImageIndex = Math.max(0, currentUploadedImages.length - 1);
    }
    if (index < primaryImageIndex) {
      primaryImageIndex--;
    }
    
    renderUploadedImagesGallery();
    
    const statusSpan = document.getElementById('uploadStatus');
    if (currentUploadedImages.length === 0) {
      statusSpan.textContent = 'No file selected';
      statusSpan.style.color = 'rgba(255,255,255,0.4)';
      primaryImageIndex = 0;
    } else {
      statusSpan.textContent = `${currentUploadedImages.length} photo(s) ready`;
      statusSpan.style.color = '#8fd19e';
    }
  }
}

// ── SCENT PROFILE MULTISELECT DROPDOWN ─────────────────────────────────────
// Toggles visibility of the scent profile dropdown checklist.
function toggleMultiselectDropdown(e) {
  if (e) e.stopPropagation();
  const dropdown = document.getElementById('scentDropdown');
  if (!dropdown) return;
  const isHidden = dropdown.style.display === 'none' || dropdown.style.display === '';
  dropdown.style.display = isHidden ? 'block' : 'none';
}

// Syncs scent checkbox selections to the custom dropdown display placeholder.
function syncScentSelection() {
  const checkboxes = document.querySelectorAll('#scentDropdown input[type="checkbox"]');
  const selected = [];
  checkboxes.forEach(cb => {
    if (cb.checked) {
      const labelText = cb.parentElement.textContent.trim();
      selected.push(labelText);
    }
  });

  const placeholder = document.getElementById('multiselectPlaceholder');
  if (placeholder) {
    if (selected.length > 0) {
      placeholder.textContent = selected.join(', ');
      placeholder.style.color = '#fff';
    } else {
      placeholder.textContent = 'Select scent profiles...';
      placeholder.style.color = 'rgba(255,255,255,0.5)';
    }
  }
}

// Auto-close dropdown when clicking outside
window.addEventListener('click', (e) => {
  const multiselect = document.getElementById('scentMultiselect');
  const dropdown = document.getElementById('scentDropdown');
  if (multiselect && dropdown && !multiselect.contains(e.target)) {
    dropdown.style.display = 'none';
  }
});

// ── DRAG & DROP IMAGE HANDLER ──────────────────────────────────────
// Called when a file is dropped onto the image upload zone.
function handleImgDrop(event) {
  event.preventDefault();
  document.getElementById('imgUploadZone').style.borderColor = 'rgba(200,160,80,0.3)';
  
  const files = event.dataTransfer.files;
  if (!files || files.length === 0) return;
  
  // Filter only image files
  const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
  if (imageFiles.length === 0) return;
  
  // Create a new DataTransfer object with all image files
  const dt = new DataTransfer();
  imageFiles.forEach(file => dt.items.add(file));
  
  const fileInput = document.getElementById('prodImgFile');
  fileInput.files = dt.files;
  uploadProductImage(fileInput);
}
