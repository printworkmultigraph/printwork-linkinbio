/* ============================================
   PRINTWORK — Dashboard App Script
   Supabase Integration + Tab Management
   ============================================ */

(function () {
    'use strict';

    // ─── Supabase Configuration ───
    const SUPABASE_URL = 'https://fjlngiuspkyxqvuzeoyu.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqbG5naXVzcGt5eHF2dXplb3l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NjAwMDQsImV4cCI6MjA4ODUzNjAwNH0.nE2ORrdkCus92mDcOMvXbzaRyluqci4SeNyW48t1qTE';

    let supabaseClient = null;

    // ─── Link ID → Friendly Name Map ───
    const LINK_NAMES = {
        'link-tokopedia': { name: 'Order via Tokopedia', icon: '🛒', color: '#84CC16' },
        'link-catalog': { name: 'Download Pricelist', icon: '📋', color: '#0EA5E9' },
        'link-cs': { name: 'Customer Service (WA)', icon: '📱', color: '#F59E0B' },
        'social-instagram': { name: 'Instagram', icon: '📸', color: '#EC4899' }
    };

    // ─── Init Supabase with retry ───
    function initSupabase(retries = 3) {
        return new Promise((resolve, reject) => {
            function attempt(n) {
                if (window.supabase && window.supabase.createClient) {
                    try {
                        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                        console.log('[Dashboard] Supabase connected ✓');
                        resolve(supabaseClient);
                    } catch (err) {
                        console.error('[Dashboard] Supabase init error:', err);
                        reject(err);
                    }
                } else if (n > 0) {
                    console.log('[Dashboard] Waiting for Supabase CDN... retries left:', n);
                    setTimeout(() => attempt(n - 1), 2000);
                } else {
                    console.error('[Dashboard] Supabase CDN failed to load');
                    reject(new Error('Supabase CDN not loaded'));
                }
            }
            attempt(retries);
        });
    }

    // ─── Tab Switching ───
    window.switchTab = function (tabId) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
        // Show target
        const target = document.getElementById(tabId);
        if (target) target.classList.add('active');

        // Update nav active state
        document.querySelectorAll('.nav-item[data-tab]').forEach(ni => ni.classList.remove('active'));
        const navBtn = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
        if (navBtn) navBtn.classList.add('active');

        // Auto-refresh data
        if (tabId === 'tab-analytics') refreshAnalytics();
        if (tabId === 'tab-leads') refreshLeads();

        // Close mobile sidebar
        closeMobileSidebar();
    };

    // ─── Refresh Analytics ───
    window.refreshAnalytics = async function () {
        const grid = document.getElementById('analytics-grid');
        const breakdownBody = document.getElementById('breakdown-body');
        const btn = document.getElementById('btn-refresh-analytics');

        if (btn) btn.classList.add('spinning');

        if (!supabaseClient) {
            grid.innerHTML = renderState('⚠️', 'Supabase not connected. Please refresh the page.');
            breakdownBody.innerHTML = renderState('⚠️', 'Connection error.');
            if (btn) btn.classList.remove('spinning');
            return;
        }

        try {
            // Fetch counts
            const [ordersRes, clicksRes, clickBreakdownRes] = await Promise.all([
                supabaseClient.from('orders').select('id', { count: 'exact', head: true }),
                supabaseClient.from('click_events').select('id', { count: 'exact', head: true }),
                supabaseClient.from('click_events').select('link_id')
            ]);

            if (ordersRes.error) throw ordersRes.error;
            if (clicksRes.error) throw clicksRes.error;
            if (clickBreakdownRes.error) throw clickBreakdownRes.error;

            const totalLeads = ordersRes.count || 0;
            const totalClicks = clicksRes.count || 0;

            // Render analytics cards
            grid.innerHTML = `
                <div class="analytics-card">
                    <div class="card-icon">🤝</div>
                    <div class="card-value">${totalLeads}</div>
                    <div class="card-label">Total Leads</div>
                </div>
                <div class="analytics-card">
                    <div class="card-icon">🖱️</div>
                    <div class="card-value">${totalClicks}</div>
                    <div class="card-label">Total Clicks</div>
                </div>
            `;

            // Per-link breakdown
            const breakdown = {};
            (clickBreakdownRes.data || []).forEach(row => {
                const lid = row.link_id;
                breakdown[lid] = (breakdown[lid] || 0) + 1;
            });

            if (Object.keys(breakdown).length === 0) {
                breakdownBody.innerHTML = renderState('📭', 'No click data yet.');
            } else {
                let html = '';
                for (const [linkId, count] of Object.entries(breakdown).sort((a, b) => b[1] - a[1])) {
                    const info = LINK_NAMES[linkId] || { name: linkId, icon: '🔗', color: '#64748B' };
                    html += `
                        <div class="breakdown-row">
                            <span class="breakdown-label">
                                <span class="link-dot" style="background:${info.color};"></span>
                                ${info.icon} ${info.name}
                            </span>
                            <span class="breakdown-count">${count}</span>
                        </div>
                    `;
                }
                breakdownBody.innerHTML = html;
            }

        } catch (err) {
            console.error('[Dashboard] Analytics error:', err);
            grid.innerHTML = renderState('⚠️', 'Error loading analytics: ' + (err.message || 'Unknown error'));
            breakdownBody.innerHTML = renderState('⚠️', 'Error loading breakdown.');
        }

        if (btn) btn.classList.remove('spinning');
    };

    // ─── Refresh Leads ───
    window.refreshLeads = async function () {
        const tbody = document.getElementById('leads-tbody');
        const btn = document.getElementById('btn-refresh-leads');

        if (btn) btn.classList.add('spinning');

        if (!supabaseClient) {
            tbody.innerHTML = `<tr><td colspan="6">${renderState('⚠️', 'Supabase not connected. Please refresh the page.')}</td></tr>`;
            if (btn) btn.classList.remove('spinning');
            return;
        }

        try {
            const { data, error } = await supabaseClient
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (!data || data.length === 0) {
                tbody.innerHTML = `<tr><td colspan="6">${renderState('📭', 'No leads yet. Inquiries from your Link-in-Bio will appear here.')}</td></tr>`;
            } else {
                tbody.innerHTML = data.map(order => {
                    const date = new Date(order.created_at).toLocaleDateString('id-ID', {
                        day: '2-digit', month: 'short', year: 'numeric'
                    });
                    const status = order.status || 'pending';
                    const waClean = cleanWhatsApp(order.whatsapp_number || '');

                    return `
                        <tr>
                            <td>${date}</td>
                            <td>${escapeHtml(order.customer_name || '—')}</td>
                            <td>${escapeHtml(order.whatsapp_number || '—')}</td>
                            <td>${escapeHtml(order.product_type || '—')}</td>
                            <td><span class="status-badge ${status}">${status}</span></td>
                            <td>
                                <div class="action-btns">
                                    <button class="btn-action btn-paid" onclick="updateStatus(${order.id}, 'paid')" title="Mark as Paid">✅</button>
                                    <button class="btn-action btn-cancel" onclick="updateStatus(${order.id}, 'cancelled')" title="Cancel">❌</button>
                                    ${waClean ? `<a class="btn-action btn-chat" href="https://wa.me/${waClean}" target="_blank" rel="noopener" title="Chat on WhatsApp">💬</a>` : ''}
                                </div>
                            </td>
                        </tr>
                    `;
                }).join('');
            }

        } catch (err) {
            console.error('[Dashboard] Leads error:', err);
            tbody.innerHTML = `<tr><td colspan="6">${renderState('⚠️', 'Error loading leads: ' + (err.message || 'Unknown error'))}</td></tr>`;
        }

        if (btn) btn.classList.remove('spinning');
    };

    // ─── Update Order Status ───
    window.updateStatus = async function (id, status) {
        if (!supabaseClient) {
            showToast('⚠️ Connection error. Please refresh.');
            return;
        }

        try {
            const { error } = await supabaseClient
                .from('orders')
                .update({ status: status })
                .eq('id', id);

            if (error) throw error;

            showToast(`✅ Order #${id} marked as ${status}`);
            refreshLeads();
        } catch (err) {
            console.error('[Dashboard] Status update error:', err);
            showToast('❌ Failed to update status: ' + (err.message || 'Unknown error'));
        }
    };

    // ─── Toast Notifications ───
    window.showToast = function (message) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 3000);
    };

    // ─── Utility Functions ───
    function cleanWhatsApp(number) {
        if (!number) return '';
        let cleaned = number.replace(/\D/g, '');
        if (cleaned.startsWith('0')) {
            cleaned = '62' + cleaned.substring(1);
        }
        return cleaned;
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function renderState(icon, text) {
        return `<div class="state-message"><span class="state-icon">${icon}</span><span class="state-text">${text}</span></div>`;
    }

    // ─── Mobile Sidebar ───
    function closeMobileSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
    }

    function initMobileSidebar() {
        const hamburger = document.getElementById('hamburger-btn');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');

        if (hamburger) {
            hamburger.addEventListener('click', () => {
                sidebar.classList.toggle('open');
                overlay.classList.toggle('active');
            });
        }

        if (overlay) {
            overlay.addEventListener('click', closeMobileSidebar);
        }
    }

    // ─── Nav Item Clicks ───
    function initNavigation() {
        document.querySelectorAll('.nav-item[data-tab]').forEach(btn => {
            btn.addEventListener('click', () => {
                switchTab(btn.getAttribute('data-tab'));
            });
        });

        // Logout
        const logoutBtn = document.getElementById('nav-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                sessionStorage.removeItem('printwork_admin_auth');
                window.location.replace('../linkinbio/index.html');
            });
        }
    }

    // ─── Boot ───
    window.addEventListener('load', async () => {
        initMobileSidebar();
        initNavigation();

        try {
            await initSupabase();
            // Load default tab data
            refreshLeads();
        } catch (err) {
            console.error('[Dashboard] Boot error:', err);
            showToast('⚠️ Failed to connect to database. Retrying...');
            // Retry once more after 3s
            setTimeout(async () => {
                try {
                    await initSupabase(2);
                    refreshLeads();
                } catch (e) {
                    const tbody = document.getElementById('leads-tbody');
                    if (tbody) {
                        tbody.innerHTML = `<tr><td colspan="6">${renderState('⚠️', 'Database connection failed. Please check your internet and refresh.')}</td></tr>`;
                    }
                }
            }, 3000);
        }
    });

})();
