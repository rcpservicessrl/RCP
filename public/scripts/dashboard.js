    (function() {
      // Helper function to prevent XSS
      function escapeHTML(str) {
        if (str === null || str === undefined) return '';
        return str.toString()
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
      }

      // Initialize Supabase Client (auto-detect local vs cloud)
      const isLocal = ['localhost', '127.0.0.1', ''].includes(window.location.hostname);
      const supabaseUrl = isLocal
        ? 'http://127.0.0.1:54321'
        : 'https://wpfovxgbennpgydbellw.supabase.co';
      const supabaseKey = isLocal
        ? 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH'
        : 'sb_publishable_wQHzaXkyhbfuOdDkMAWAKQ_VOE14bfO';
      let supabase = null;
      try {
        if (window.supabase) {
          supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
        }
      } catch (e) {
        console.error("Error initializing Supabase client in dashboard:", e);
      }

      // Check Session & Access Control
      let activeEmail = sessionStorage.getItem('active_user_email');
      let activeName = sessionStorage.getItem('active_user_name');
      let activeCompany = sessionStorage.getItem('active_user_company');
      // Rol resuelto server-side vía RPC (effective_role). Se hydrata en
      // initializeDashboard(). Mientras tanto, valor defensivo 'unknown'
      // para que ninguna rama admin se ejecute antes de la verificación.
      let activeRole = 'unknown';

      // Setup language dictionary & translation helper
      const isEN = document.documentElement.lang === 'en';

      const trans = {
        es: {
          loading: "Consultando base de datos blindada...",
          noTxns: "No se encontraron transacciones.",
          txnSynced: "ERP Sincronizado",
          txnPending: "Buffer Nube (Pendiente)",
          statusActive: "Activo",
          statusInactive: "Inactivo",
          statusPending: "Pendiente Activación",
          clientCode: "Código Acceso",
          statusCompleted: "Completado",
          statusProcess: "En Proceso",
          statusReview: "En Verificación",
          descOnapi: "Certificado de nombre comercial expedido y registrado a favor de la entidad. Activos protegidos legalmente.",
          descRm: "Documentación revisada y depositada ante la Cámara de Comercio. En espera de emisión del Registro Mercantil final (3-5 días hábiles).",
          descDgii: "Formulario de registro nacional de contribuyente depositado vía Oficina Virtual de DGII. En proceso de verificación y generación de clave accesoria.",
          confirmDelete: "¿Estás seguro de que deseas eliminar este cliente?",
          deleteSuccess: "Cliente eliminado correctamente.",
          saveSuccess: "Cliente guardado correctamente.",
          formAdd: "Registrar Cliente Real",
          formEdit: "Editar Cliente Real",
          btnSave: "💾 Guardar Cliente",
          btnSaving: "Guardando...",
          globalView: "Vista Global (Consolidado)",
          noClients: "No hay clientes registrados."
        },
        en: {
          loading: "Querying secured database...",
          noTxns: "No transactions found.",
          txnSynced: "ERP Synced",
          txnPending: "Cloud Buffer (Pending)",
          statusActive: "Active",
          statusInactive: "Inactive",
          statusPending: "Pending Activation",
          clientCode: "Access Code",
          statusCompleted: "Completed",
          statusProcess: "In Progress",
          statusReview: "Under Review",
          descOnapi: "Commercial name certificate issued and registered in favor of the entity. Assets legally protected.",
          descRm: "Documentation reviewed and deposited at the Chamber of Commerce. Awaiting final Mercantile Registry emission (3-5 business days).",
          descDgii: "National taxpayer registry form deposited via DGII Virtual Office. In verification process and secondary key generation.",
          confirmDelete: "Are you sure you want to delete this client?",
          deleteSuccess: "Client deleted successfully.",
          saveSuccess: "Client saved successfully.",
          formAdd: "Register Real Client",
          formEdit: "Edit Real Client",
          btnSave: "💾 Save Client",
          btnSaving: "Saving...",
          globalView: "Global View (Simulation)",
          noClients: "No registered clients found."
        }
      };

      const t = isEN ? trans.en : trans.es;

      // Update basic profile info in sidebar
      const profileName = document.getElementById('profileName');
      const profileCompany = document.getElementById('profileCompany');
      const profileAvatar = document.getElementById('profileAvatar');
      
      if (profileName && activeName) profileName.textContent = activeName;
      if (profileCompany && activeCompany) profileCompany.textContent = activeCompany;
      if (profileAvatar && activeName) profileAvatar.textContent = activeName.charAt(0).toUpperCase();

      // Sidebar Navigation Tab switching
      const navItems = document.querySelectorAll('.nav-item[data-tab]');
      const panels = document.querySelectorAll('.dashboard-panel');
      const menuToggle = document.getElementById('menuToggle');
      const sidebar = document.getElementById('sidebar');

      navItems.forEach(item => {
        item.addEventListener('click', () => {
          const tab = item.dataset.tab;
          navItems.forEach(i => i.classList.remove('active'));
          panels.forEach(p => p.classList.remove('active'));
          
          item.classList.add('active');
          const panel = document.getElementById('view-' + tab);
          if (panel) panel.classList.add('active');
          
          if (sidebar && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
          }
        });
      });

      // Shortcut triggers for tabs
      document.querySelectorAll('[data-tab-nav]').forEach(el => {
        el.addEventListener('click', () => {
          const tab = el.dataset.tabNav;
          const targetNavItem = document.querySelector(`.nav-item[data-tab="${tab}"]`);
          if (targetNavItem) targetNavItem.click();
        });
      });

      if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
          sidebar.classList.toggle('open');
        });
      }

      // Logout handler
      const btnLogout = document.getElementById('btnLogout');
      if (btnLogout) {
        btnLogout.addEventListener('click', async (e) => {
          e.preventDefault();
          try {
            if (supabase) {
              await supabase.auth.signOut();
            }
          } catch (err) {
            console.error("Error signing out from Supabase:", err);
          }
          sessionStorage.clear();
          window.location.href = '/portal';
        });
      }

      // GLOBAL SIMULATED METRICS BUFFER
      const defaultMetrics = {
        company_name: 'Vista Global',
        owner_name: 'Resumen',
        ventas: 0,
        ventas_trend: '▲ +0%',
        cpl: 0,
        cpl_trend: '▼ -0%',
        roas: 0,
        roas_trend: '▲ +0x',
        ltv: 0,
        ltv_trend: '▲ +0%',
        tramite_onapi: 0,
        tramite_camara: 0,
        tramite_dgii: 0,
        chart_data: [0, 0, 0, 0, 0, 0, 0],
        pagos: []
      };

      // FUNCTION TO LOAD REAL PRODUCTO AVANCES FROM SUPABASE
      async function loadProductoAvances(clienteId) {
        if (!supabase || !clienteId) return;
        try {
          const { data: avances, error } = await supabase
            .from('producto_avances')
            .select(`
              *,
              orden_items (
                producto_id,
                productos ( name_es, name_en, sku, icon, category )
              )
            `)
            .eq('cliente_id', clienteId)
            .order('created_at', { ascending: false });

          if (error) throw error;
          if (!avances || avances.length === 0) return;

          // Build dynamic avances panel in the tramites section
          const tramitesPanel = document.getElementById('view-tramites');
          if (!tramitesPanel) return;

          // Create or find the avances container
          let avancesContainer = document.getElementById('avancesContainer');
          if (!avancesContainer) {
            avancesContainer = document.createElement('div');
            avancesContainer.id = 'avancesContainer';
            avancesContainer.className = 'card-workspace';
            avancesContainer.style.marginTop = '30px';
            tramitesPanel.appendChild(avancesContainer);
          }

          // Render avances
          const title = isEN ? 'Service Progress Tracking' : 'Progreso de Servicios Contratados';
          let html = `<div class="card-title-row" style="margin-bottom:20px;"><h3>${title}</h3></div>`;

          avances.forEach(avance => {
            const productName = avance.orden_items?.productos 
              ? (isEN ? (avance.orden_items.productos.name_en || avance.orden_items.productos.name_es) : avance.orden_items.productos.name_es)
              : avance.title;
            const pct = avance.progress_percent || 0;
            let badgeClass = 'review';
            let badgeText = (isEN ? 'Pending' : 'Pendiente') + ` (${pct}%)`;
            if (pct >= 100) { badgeClass = 'completed'; badgeText = isEN ? 'Completed' : 'Completado'; }
            else if (pct >= 40) { badgeClass = 'process'; badgeText = (isEN ? 'In Progress' : 'En Progreso') + ` (${pct}%)`; }

            html += `
              <div class="tramite-progress-card">
                <div class="tramite-header">
                  <span class="tramite-name">${productName}</span>
                  <span class="tramite-badge ${badgeClass}">${badgeText}</span>
                </div>
                <div class="progress-bar-track" style="margin-bottom:8px;">
                  <div class="progress-bar-fill" style="width:${pct}%;"></div>
                </div>
                ${avance.description ? `<p style="font-size:0.8rem; color:var(--text-muted);">${avance.description}</p>` : ''}
              </div>
            `;
          });

          avancesContainer.innerHTML = html;

          // Subscribe to realtime avances updates
          supabase.channel('avances-channel')
            .on(
              'postgres_changes',
              { event: '*', schema: 'public', table: 'producto_avances', filter: 'cliente_id=eq.' + clienteId },
              () => { loadProductoAvances(clienteId); }
            )
            .subscribe();

        } catch (err) {
          console.error('Error loading producto_avances:', err);
        }
      }

      // FUNCTION TO RENDER ALL METRICS & GRAPHS FOR A CLIENT
      function renderClientDashboard(client) {
        // Render KPIs
        document.getElementById('kpiSales').textContent = 'RD$ ' + (client.ventas || 0).toLocaleString();
        document.querySelector('#view-overview .kpi-card:nth-child(1) .kpi-change').innerHTML = 
          `${client.ventas_trend || '▲ +0%'} <span style="color:var(--text-muted); margin-left:4px;">${isEN ? 'vs last mo.' : 'vs mes ant.'}</span>`;

        document.getElementById('kpiCac').textContent = 'RD$ ' + (client.cpl || 0).toLocaleString();
        document.querySelector('#view-overview .kpi-card:nth-child(2) .kpi-change').innerHTML = 
          `${client.cpl_trend || '▼ -0%'} <span style="color:var(--text-muted); margin-left:4px;">${isEN ? 'vs last mo.' : 'vs mes ant.'}</span>`;

        // Handle numeric format differences for ROAS (Postgres REST float/object parsing)
        let roasVal = 0.0;
        if (typeof client.roas === 'number') {
          roasVal = client.roas;
        } else if (client.roas && typeof client.roas === 'object' && client.roas.Int !== undefined) {
          roasVal = client.roas.Int / 10;
        } else if (client.roas) {
          roasVal = parseFloat(client.roas) || 0.0;
        }
        document.getElementById('kpiRoas').textContent = roasVal.toFixed(1) + 'x';
        document.querySelector('#view-overview .kpi-card:nth-child(3) .kpi-change').innerHTML = 
          `${client.roas_trend || '▲ +0.0x'} <span style="color:var(--text-muted); margin-left:4px;">${isEN ? 'vs last mo.' : 'vs mes ant.'}</span>`;

        document.getElementById('kpiLtv').textContent = 'RD$ ' + (client.ltv || 0).toLocaleString();
        document.querySelector('#view-overview .kpi-card:nth-child(4) .kpi-change').innerHTML = 
          `${client.ltv_trend || '▲ +0%'} <span style="color:var(--text-muted); margin-left:4px;">${isEN ? 'vs last mo.' : 'vs mes ant.'}</span>`;

        // Render Dynamic SVG Sales Projection Graph
        const chartData = Array.isArray(client.chart_data) ? client.chart_data : [0, 0, 0, 0, 0, 0, 0];
        const yMax = Math.ceil(Math.max(...chartData, 600000) / 100000) * 100000;

        // Update Y axis labels dynamically
        const yLabel1 = document.querySelector('.chart-svg text[y="154"]');
        const yLabel2 = document.querySelector('.chart-svg text[y="104"]');
        const yLabel3 = document.querySelector('.chart-svg text[y="54"]');
        if (yLabel1) yLabel1.textContent = (yMax / 3 >= 1000) ? (yMax / 3 / 1000) + 'k' : (yMax / 3);
        if (yLabel2) yLabel2.textContent = (yMax * 2 / 3 >= 1000) ? Math.round(yMax * 2 / 3 / 1000) + 'k' : Math.round(yMax * 2 / 3);
        if (yLabel3) yLabel3.textContent = (yMax >= 1000) ? (yMax / 1000) + 'k' : yMax;

        const points = chartData.map((val, idx) => {
          const x = 50 + idx * 83.33; // 50 to 550 divides nicely into 6 intervals
          const y = 200 - (val / yMax) * 150; // Coordinates 50 to 200 (150px height)
          return { x, y };
        });

        const pathD = `M${points.map(p => `${p.x} ${p.y}`).join(' L')}`;
        const areaD = `${pathD} L550 200 L50 200 Z`;

        const chartPath = document.querySelector('.chart-path');
        const chartArea = document.querySelector('.chart-area');
        if (chartPath) chartPath.setAttribute('d', pathD);
        if (chartArea) chartArea.setAttribute('d', areaD);

        const circles = document.querySelectorAll('.chart-svg circle');
        points.forEach((p, idx) => {
          if (circles[idx]) {
            circles[idx].setAttribute('cx', p.x);
            circles[idx].setAttribute('cy', p.y);
          }
        });

        // Render Legal Progress Bars & Badges
        // Fase 3: los % provienen de client.tramites[] (RPC client_tramites),
        // con fallback a columnas legacy clientes.tramite_* si el origen fuera
        // una fila de clientes directa (CRUD admin).
        const tramiteMap = {};
        if (Array.isArray(client.tramites)) {
          client.tramites.forEach(tr => { tramiteMap[tr.tipo] = parseInt(tr.progress_percent) || 0; });
        }
        const onapi  = tramiteMap.onapi  ?? (parseInt(client.tramite_onapi)  || 0);
        const camara = tramiteMap.camara ?? (parseInt(client.tramite_camara) || 0);
        const dgii   = tramiteMap.dgii   ?? (parseInt(client.tramite_dgii)   || 0);

        // Progress bar fills
        document.querySelectorAll('#overBarOnapi, #mainBarOnapi').forEach(el => el.style.width = onapi + '%');
        document.querySelectorAll('#overBarCamara, #mainBarCamara').forEach(el => el.style.width = camara + '%');
        document.querySelectorAll('#overBarDgii, #mainBarDgii').forEach(el => el.style.width = dgii + '%');

        // Main status badges & descriptions
        const badgeOnapi = document.getElementById('mainBadgeOnapi');
        const badgeCamara = document.getElementById('mainBadgeCamara');
        const badgeDgii = document.getElementById('mainBadgeDgii');

        const updateBadge = (badge, pct) => {
          if (!badge) return;
          badge.className = 'tramite-badge';
          if (pct >= 100) {
            badge.classList.add('completed');
            badge.textContent = t.statusCompleted;
          } else if (pct >= 40) {
            badge.classList.add('process');
            badge.textContent = t.statusProcess + ` (${pct}%)`;
          } else {
            badge.classList.add('review');
            badge.textContent = t.statusReview + ` (${pct}%)`;
          }
        };
        updateBadge(badgeOnapi, onapi);
        updateBadge(badgeCamara, camara);
        updateBadge(badgeDgii, dgii);

        // Render Transaction History (Pagos)
        const tableBody = document.getElementById('paymentsTableBody');
        const erpSyncBadge = document.getElementById('erpSyncBadge');
        if (tableBody) {
          tableBody.innerHTML = '';
          const payments = Array.isArray(client.pagos) ? client.pagos : [];
          if (payments.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px; color:var(--text-muted);">${t.noTxns}</td></tr>`;
          } else {
            payments.forEach(txn => {
              const tr = document.createElement('tr');
              const isSynced = txn.sync === 'sync' || txn.sincronizado_odoo === true || txn.sincronizado_odoo === 'true';
              tr.innerHTML = `
                <td><strong>#${escapeHTML(txn.id || txn.transactionId)}</strong></td>
                <td>${escapeHTML(txn.date)}</td>
                <td>${escapeHTML(txn.items)}</td>
                <td><strong style="color:var(--accent);">${escapeHTML(txn.amount)}</strong></td>
                <td>${escapeHTML(txn.method)}</td>
                <td>
                  <span class="sync-badge ${isSynced ? 'online' : 'offline'}">
                    ✓ ${isSynced ? escapeHTML(t.txnSynced) : escapeHTML(t.txnPending)}
                  </span>
                </td>
              `;
              tableBody.appendChild(tr);
            });
          }
        }
        // ERP sync badge basado en estado real (Fase 3): si la última orden
        // pagada tiene sale_order_id → sincronizado; si no, pendiente.
        if (erpSyncBadge) {
          const erpOk = (client.erp_synced === true);
          erpSyncBadge.className = 'sync-badge ' + (erpOk ? 'online' : 'offline');
          erpSyncBadge.textContent = erpOk
            ? (isEN ? '🟢 ERP Online (Connected)' : '🟢 ERP Online (Sincronizado)')
            : (isEN ? '🟠 ERP Pending Sync' : '🟠 ERP Pendiente de sincronizar');
        }

        // ─── Trámites: pintar también las DESCRIPCIONES dinámicas ───
        // Antes solo se actualizaban barras y badges; los <p> eran hardcoded.
        const tramitesMap = {};
        if (Array.isArray(client.tramites)) {
          client.tramites.forEach(tr => { tramitesMap[tr.tipo] = tr; });
        }
        const setTramiteDesc = (id, fallback) => {
          const el = document.getElementById(id);
          if (el) el.textContent = fallback;
        };
        if (tramitesMap.onapi)  setTramiteDesc('descOnapi',  tramitesMap.onapi.description  || 'Documentación ONAPI.');
        if (tramitesMap.camara) setTramiteDesc('descCamara', tramitesMap.camara.description || 'Registro en Cámara.');
        if (tramitesMap.dgii)   setTramiteDesc('descDgii',   tramitesMap.dgii.description   || 'Inscripción DGII.');
      }

      // ─── renderMarketing(m) — pinta el panel de marketing desde datos reales ───
      // Si m es null (sin datos de campañas), muestra "—" / placeholders.
      function renderMarketing(m) {
        const fmtMoney = (v) => (typeof v === 'number' && v > 0) ? ('RD$ ' + v.toLocaleString()) : '—';
        const fmtNum   = (v) => (typeof v === 'number' && v > 0) ? (v >= 1_000_000 ? (v/1_000_000).toFixed(1)+'M' : v.toLocaleString()) : '—';
        const fmtPct   = (v) => (typeof v === 'number' && v > 0) ? (v.toFixed(1) + '%') : '—';

        const adSpend = document.getElementById('kpiAdSpend');
        const impr    = document.getElementById('kpiImpressions');
        const leads   = document.getElementById('kpiLeads');
        const conv    = document.getElementById('kpiConversion');

        if (m && typeof m === 'object') {
          // CPL, ROAS, conversión se calculan aquí (no se almacenan)
          const cpl        = (m.leads > 0) ? m.ad_spend / m.leads : 0;
          const conversion = (m.leads > 0) ? (m.conversions / m.leads) * 100 : 0;

          if (adSpend) adSpend.textContent = fmtMoney(m.ad_spend);
          if (impr)    impr.textContent    = fmtNum(m.impressions);
          if (leads)   leads.textContent   = (m.leads > 0) ? m.leads.toLocaleString() : '—';
          if (conv)    conv.textContent    = fmtPct(conversion);
        } else {
          // Sin datos de campañas: estado vacío honesto
          if (adSpend) adSpend.textContent = '—';
          if (impr)    impr.textContent    = '—';
          if (leads)   leads.textContent   = '—';
          if (conv)    conv.textContent    = '—';
        }
        // El SVG de tendencia CPL queda en placeholder (sin granularidad semanal).
      }

      // INITIAL DATABASE DATA FETCH FOR ROLE ACCESS
      let clientList = [];

      async function initializeDashboard() {
        // Recover session from Supabase if empty (e.g. direct page entry or refresh)
        if (!activeEmail && supabase) {
          try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
              const email = session.user.email;
              const name = session.user.user_metadata?.full_name || email.split('@')[0];
              const company = session.user.user_metadata?.company || '';
              sessionStorage.setItem('active_user_email', email);
              sessionStorage.setItem('active_user_name', name);
              sessionStorage.setItem('active_user_company', company);
              activeEmail = email;
              activeName = name;
              activeCompany = company;
            }
          } catch (e) {
            console.error("Error restoring session from Supabase:", e);
          }
        }

        if (!activeEmail) {
          window.location.href = '/portal';
          return;
        }

        // Hydrate sidebar profile values
        if (profileName) profileName.textContent = activeName;
        if (profileCompany) profileCompany.textContent = activeCompany || '—';
        if (profileAvatar) profileAvatar.textContent = activeName.charAt(0).toUpperCase();

        // ─── Resolver rol desde el servidor (RBAC) ───
        // Antes: hardcoded por email. Ahora: RPC effective_role(p_email) que
        // consulta la tabla user_roles en Supabase. Migrado en Fase 2.
        try {
          const { data, error } = await supabase
            .rpc('get_user_role', { p_email: activeEmail });
          if (error) throw error;
          activeRole = (data || 'client').toLowerCase();
        } catch (e) {
          console.warn('[RBAC] No se pudo resolver el rol via RPC, asumiendo client:', e);
          activeRole = 'client';
        }
        // Mapear rol del backend a clases que entiende la UI legada.
        // 'admin' clásico del dashboard == super_admin | admin del RBAC.
        const isAdminLike = (activeRole === 'super_admin' || activeRole === 'admin');
        sessionStorage.setItem('active_user_role', activeRole);

        if (isAdminLike) {
          // ADMIN FLOW
          const navClientesLink = document.getElementById('navClientesLink');
          const navProductosLink = document.getElementById('navProductosLink');
          const adminSelectorRow = document.getElementById('adminSelectorRow');
          const adminClientSelect = document.getElementById('adminClientSelect');

          if (navClientesLink) navClientesLink.style.display = 'flex';
          if (navProductosLink) navProductosLink.style.display = 'flex';
          if (adminSelectorRow) adminSelectorRow.style.display = 'flex';

          // Set sidebar admin profile visual (resolved from session, not hardcoded)
          if (profileName) profileName.textContent = activeName || 'Administrador';
          if (profileCompany) profileCompany.textContent = (activeCompany || 'RCP Services') + ' (Admin)';

          // Load GLOBAL consolidated view via RPC (Fase 3) — reemplaza defaultMetrics
          if (supabase) {
            try {
              const { data: globalData } = await supabase
                .rpc('dashboard_overview', { p_email: activeEmail, p_global: true });
              renderClientDashboard(globalData || defaultMetrics);
              renderMarketing(globalData ? globalData.marketing : null);
            } catch (e) {
              console.error('[RPC global] fallo, usando defaults:', e);
              renderClientDashboard(defaultMetrics);
              renderMarketing(null);
            }

            // Load real clients from Supabase DB to populate selector & management CRUD
            await loadAdminClients();
            // Load real products from Supabase DB
            await loadAdminProducts();
          } else {
            renderClientDashboard(defaultMetrics);
            renderMarketing(null);
          }

          // Listener for Admin client dropdown select view change
          if (adminClientSelect) {
            adminClientSelect.addEventListener('change', async () => {
              const selectedVal = adminClientSelect.value;
              if (selectedVal === 'default') {
                // Vista global consolidada
                const { data: gd } = await supabase
                  .rpc('dashboard_overview', { p_email: activeEmail, p_global: true });
                renderClientDashboard(gd || defaultMetrics);
                renderMarketing(gd ? gd.marketing : null);
              } else {
                // Vista de un cliente específico vía RPC
                const client = clientList.find(c => c.id === selectedVal);
                if (client && client.email) {
                  const { data: cd } = await supabase
                    .rpc('dashboard_overview', { p_email: client.email, p_global: false });
                  renderClientDashboard(cd || defaultMetrics);
                  renderMarketing(cd ? cd.marketing : null);
                } else if (client) {
                  renderClientDashboard(client);
                  renderMarketing(null);
                }
              }
            });
          }

          // Hook CRUD actions
          setupAdminCRUD();
          setupProductCRUD();

        } else {
          // CLIENT FLOW (LOAD OWN METRICS)
          const navClientesLink = document.getElementById('navClientesLink');
          const navProductosLink = document.getElementById('navProductosLink');
          const adminSelectorRow = document.getElementById('adminSelectorRow');
          if (navClientesLink) navClientesLink.style.display = 'none';
          if (navProductosLink) navProductosLink.style.display = 'none';
          if (adminSelectorRow) adminSelectorRow.style.display = 'none';

          let loaded = false;
          if (supabase) {
            try {
              // ─── Cargar datos consolidados vía RPC (Fase 3) ───
              // Reemplaza la lectura directa de clientes + simClient + defaultMetrics.
              // dashboard_overview devuelve KPIs, chart_data (de ordenes paid),
              // pagos reales, trámites y marketing en una sola llamada.
              const { data: rpcData, error: rpcError } = await supabase
                .rpc('dashboard_overview', { p_email: activeEmail, p_global: false });
              if (rpcError) throw rpcError;

                const data = rpcData || {};

                if (data.status === 'onboarding') {
                  window.location.href = '/onboarding';
                  return;
                }

                if (data.status === 'pending_activation') {
                  window.location.href = '/portal';
                  return;
                }

                if (data.status === 'review') {
                  document.getElementById('reviewOverlay').style.display = 'block';
                  document.querySelectorAll('.dashboard-panel').forEach(p => p.style.display = 'none');
                  const sNav = document.querySelector('.sidebar-nav');
                  if (sNav) sNav.style.display = 'none';
                  const wHeader = document.querySelector('.workspace-header');
                  if (wHeader) wHeader.style.display = 'none';

                  if (profileName) profileName.textContent = data.owner_name;
                  if (profileCompany) profileCompany.textContent = data.company_name;

                  const btnExitReview = document.getElementById('btnExitReview');
                  if (btnExitReview) {
                    btnExitReview.addEventListener('click', async (e) => {
                      e.preventDefault();
                      try {
                        if (supabase) await supabase.auth.signOut();
                      } catch (err) { console.error(err); }
                      sessionStorage.clear();
                      window.location.href = '/portal';
                    });
                  }
                  return;
                }

                renderClientDashboard(data);
                renderMarketing(data.marketing);
                if (profileName) profileName.textContent = data.owner_name || '—';
                if (profileCompany) profileCompany.textContent = data.company_name || '—';
                loaded = true;

                // Subscribe to real-time changes (recarga el RPC al cambiar clientes/ordenes)
                if (supabase) {
                  supabase.channel('custom-client-channel')
                    .on(
                      'postgres_changes',
                      { event: '*', schema: 'public', table: 'clientes', filter: 'email=eq.' + activeEmail },
                      async () => {
                        const { data: fresh } = await supabase
                          .rpc('dashboard_overview', { p_email: activeEmail, p_global: false });
                        if (fresh) {
                          renderClientDashboard(fresh);
                          renderMarketing(fresh.marketing);
                        }
                      }
                    )
                    .subscribe();

                  // Necesitamos el cliente_id para los avances: lo obtenemos rápido.
                  const { data: cRow } = await supabase
                    .from('clientes').select('id').eq('email', activeEmail).maybeSingle();
                  if (cRow && cRow.id) loadProductoAvances(cRow.id);
                }
            } catch (err) {
              console.error("Failed to load dashboard via RPC:", err);
            }
          }

          // Si el RPC falla o el cliente no tiene fila, mostramos estado "sin datos"
          // en lugar del simClient con chart_data inventado.
          if (!loaded) {
            const localUsers = JSON.parse(localStorage.getItem('portal_users') || '[]');
            const localData = localUsers.find(u => u.email === activeEmail);
            // Solo usamos localStorage para identidad (nombre/empresa) y redirects de status;
            // NUNCA para inventar métricas.
            const identityName = (localData && (localData.name || localData.owner_name)) || activeEmail;
            const identityCompany = (localData && (localData.company || localData.company_name)) || '—';

            if (localData && localData.status === 'onboarding') {
              window.location.href = '/onboarding';
              return;
            }
            if (localData && localData.status === 'pending_activation') {
              window.location.href = '/portal';
              return;
            }
            if (localData && localData.status === 'review') {
              document.getElementById('reviewOverlay').style.display = 'block';
              document.querySelectorAll('.dashboard-panel').forEach(p => p.style.display = 'none');
              const sNav = document.querySelector('.sidebar-nav');
              if (sNav) sNav.style.display = 'none';
              const wHeader = document.querySelector('.workspace-header');
              if (wHeader) wHeader.style.display = 'none';

              if (profileName) profileName.textContent = identityName;
              if (profileCompany) profileCompany.textContent = identityCompany;

              const btnExitReview = document.getElementById('btnExitReview');
              if (btnExitReview) {
                btnExitReview.addEventListener('click', (e) => {
                  e.preventDefault();
                  sessionStorage.clear();
                  window.location.href = '/portal';
                });
              }
              return;
            }

            // Render estructural con ceros + identidad real. Sin simulación.
            const emptyData = Object.assign({}, defaultMetrics, {
              company_name: identityCompany,
              owner_name: identityName
            });
            renderClientDashboard(emptyData);
            renderMarketing(null);
            if (profileName) profileName.textContent = identityName;
            if (profileCompany) profileCompany.textContent = identityCompany;
          }
        }
      }

      // LOAD ADMIN CLIENTS LIST
      async function loadAdminClients() {
        try {
          const { data, error } = await supabase
            .from('clientes')
            .select('*')
            .order('company_name', { ascending: true });

          if (error) throw error;

          clientList = data || [];
          populateAdminSelectors();
          renderClientsTable();
        } catch (err) {
          console.error("Error loading admin clients:", err);
        }
      }

      // POPULATE DROPDOWNS
      function populateAdminSelectors() {
        const adminClientSelect = document.getElementById('adminClientSelect');
        if (!adminClientSelect) return;

        // Keep default option
        adminClientSelect.innerHTML = `<option value="default">${t.globalView}</option>`;
        clientList.forEach(c => {
          const opt = document.createElement('option');
          opt.value = c.id;
          opt.textContent = `${c.company_name} (${c.owner_name})`;
          adminClientSelect.appendChild(opt);
        });
      }

      // RENDER CLIENTS CRUD TABLE
      function renderClientsTable() {
        const tbody = document.getElementById('clientesTableBody');
        const filterVal = document.getElementById('clientStatusFilter')?.value || 'all';
        if (!tbody) return;

        tbody.innerHTML = '';
        const filtered = clientList.filter(c => {
          if (filterVal === 'all') return true;
          return c.status === filterVal;
        });

        if (filtered.length === 0) {
          tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:var(--text-muted);">${t.noClients}</td></tr>`;
          return;
        }

        filtered.forEach(c => {
          const waPhone = c.phone ? c.phone.replace(/[^0-9]/g, '') : '';
          let waPrefilled = waPhone;
          if (waPhone.length === 10 && (waPhone.startsWith('809') || waPhone.startsWith('829') || waPhone.startsWith('849'))) {
            waPrefilled = '1' + waPhone;
          }
          const portalUrl = window.location.origin + '/portal';
          const waMsg = encodeURIComponent(`Hola ${c.owner_name}, tu código de acceso secreto para activar tu portal de RCP Services es: ${c.access_code || 'N/A'}\n\nIngresa aquí para activar tu cuenta: ${portalUrl}`);
          const waLink = `https://wa.me/${waPrefilled}?text=${waMsg}`;
          const codeDisplay = c.access_code || 'N/A';

          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td><strong>${escapeHTML(c.company_name)}</strong></td>
            <td>${escapeHTML(c.legal_id)}</td>
            <td>${escapeHTML(c.owner_name)}</td>
            <td>
              <div style="font-size:0.75rem; color:var(--text-muted);">${escapeHTML(c.email)}</div>
              <div style="font-size:0.75rem; color:var(--text-muted);">${escapeHTML(c.phone)}</div>
            </td>
            <td>
              <div style="display:flex; align-items:center; gap:6px;">
                <code style="background:rgba(255,255,255,0.05); padding:3px 6px; border-radius:4px; font-weight:700; color:var(--accent); font-family:monospace; font-size:0.9rem;">${escapeHTML(codeDisplay)}</code>
                ${c.access_code ? `
                  <button class="btn-action-sm btn-copy-code" data-code="${escapeHTML(c.access_code)}" style="padding:4px 6px; font-size:0.75rem;" title="Copiar código">📋</button>
                  <a href="${escapeHTML(waLink)}" target="_blank" class="btn-action-sm" style="padding:4px 6px; font-size:0.75rem; text-decoration:none; display:inline-flex; align-items:center;" title="Compartir por WhatsApp">💬</a>
                ` : ''}
              </div>
            </td>
            <td>
              <span class="sync-badge ${c.status === 'active' ? 'online' : (c.status === 'review' ? 'online' : (c.status === 'pending_activation' ? 'pending' : 'offline'))}">
                ${c.status === 'active' ? t.statusActive : (c.status === 'review' ? (isEN ? 'Under Review' : 'En Revisión') : (c.status === 'onboarding' ? 'Onboarding' : (c.status === 'pending_activation' ? t.statusPending : t.statusInactive)))}
              </span>
            </td>
            <td>
              <button class="btn-action-sm btn-view-diag" data-id="${c.id}" style="margin-right:5px; padding:6px 10px;" title="Ver Diagnóstico 360">📄</button>
              <button class="btn-action-sm btn-edit-client" data-id="${c.id}" style="margin-right:5px; padding:6px 10px;" title="Editar">✏️</button>
              <button class="btn-action-sm btn-delete-client" data-id="${c.id}" style="padding:6px 10px; border-color:#ef4444; color:#ef4444;" title="Eliminar">🗑️</button>
            </td>
          `;
          tbody.appendChild(tr);
        });

        // Add event listeners on action buttons
        tbody.querySelectorAll('.btn-copy-code').forEach(btn => {
          btn.addEventListener('click', () => {
            const code = btn.dataset.code;
            navigator.clipboard.writeText(code).then(() => {
              const originalText = btn.textContent;
              btn.textContent = 'Copied!';
              btn.style.color = '#22c55e';
              setTimeout(() => {
                btn.textContent = originalText;
                btn.style.color = '';
              }, 1200);
            }).catch(err => {
              console.error('Could not copy text: ', err);
            });
          });
        });

        tbody.querySelectorAll('.btn-view-diag').forEach(btn => {
          btn.addEventListener('click', () => {
            const client = clientList.find(c => c.id === btn.dataset.id);
            if (client) {
              const diag = client.diagnostico_360 || {};
              alert(`Diagnóstico 360 de ${client.company_name}:\n\n1. Etapa de negocio:\n${diag.q1_etapa || 'No respondido'}\n\n2. Desafíos:\n${diag.q2_desafios || 'No respondido'}\n\n3. Intereses:\n${diag.q3_intereses || 'No respondido'}`);
            }
          });
        });
        tbody.querySelectorAll('.btn-edit-client').forEach(btn => {
          btn.addEventListener('click', () => {
            const client = clientList.find(c => c.id === btn.dataset.id);
            if (client) startEditClient(client);
          });
        });

        tbody.querySelectorAll('.btn-delete-client').forEach(btn => {
          btn.addEventListener('click', () => {
            deleteClient(btn.dataset.id);
          });
        });
      }

      // EDIT MODE SET
      function startEditClient(c) {
        document.getElementById('clientIdInput').value = c.id;
        document.getElementById('clientCompanyName').value = c.company_name;
        document.getElementById('clientLegalId').value = c.legal_id;
        document.getElementById('clientOwnerName').value = c.owner_name;
        document.getElementById('clientEmail').value = c.email;
        document.getElementById('clientPassword').value = c.password || '';
        document.getElementById('clientPhone').value = c.phone;
        document.getElementById('clientAddress').value = c.address || '';
        document.getElementById('clientAccessCode').value = c.access_code || '';
        
        // Business Metrics
        document.getElementById('clientVentas').value = c.ventas || 0;
        document.getElementById('clientVentasTrend').value = c.ventas_trend || '▲ +0%';
        document.getElementById('clientCac').value = c.cpl || 0;
        document.getElementById('clientCacTrend').value = c.cpl_trend || '▼ -0%';

        let roasVal = 0.0;
        if (typeof c.roas === 'number') {
          roasVal = c.roas;
        } else if (c.roas && typeof c.roas === 'object' && c.roas.Int !== undefined) {
          roasVal = c.roas.Int / 10;
        } else if (c.roas) {
          roasVal = parseFloat(c.roas) || 0.0;
        }
        document.getElementById('clientRoas').value = roasVal;
        document.getElementById('clientRoasTrend').value = c.roas_trend || '▲ +0.0x';
        document.getElementById('clientLtv').value = c.ltv || 0;
        document.getElementById('clientLtvTrend').value = c.ltv_trend || '▲ +0%';

        // Legal Progress
        document.getElementById('clientOnapi').value = c.tramite_onapi || 0;
        document.getElementById('clientCamara').value = c.tramite_camara || 0;
        document.getElementById('clientDgii').value = c.tramite_dgii || 0;
        
        document.getElementById('clientStatus').value = c.status;

        // Visual states
        document.getElementById('clientFormTitle').textContent = t.formEdit;
        document.getElementById('clientFormBadge').style.display = 'inline-block';
        document.getElementById('btnCancelEdit').style.display = 'inline-block';
        
        // Scroll to form
        const formCard = document.getElementById('clientFormCard');
        if (formCard) formCard.scrollIntoView({ behavior: 'smooth' });
      }

      // RESET FORM & EDIT STATE
      function resetClientForm() {
        document.getElementById('clientForm').reset();
        document.getElementById('clientIdInput').value = '';
        document.getElementById('clientFormTitle').textContent = t.formAdd;
        document.getElementById('clientFormBadge').style.display = 'none';
        document.getElementById('btnCancelEdit').style.display = 'none';
      }

      // PRODUCT CRUD LOGIC
      let productList = [];

      async function loadAdminProducts() {
        if (!supabase) return;
        try {
          const { data, error } = await supabase
            .from('productos')
            .select('*')
            .order('sort_order', { ascending: true });

          if (error) throw error;

          productList = data || [];
          renderProductsTable();
        } catch (err) {
          console.error("Error loading admin products:", err);
        }
      }

      function renderProductsTable() {
        const tbody = document.getElementById('productosTableBody');
        const categoryFilter = document.getElementById('productCategoryFilter')?.value || 'all';
        if (!tbody) return;

        tbody.innerHTML = '';
        const filtered = productList.filter(p => {
          if (categoryFilter === 'all') return true;
          return p.category === categoryFilter;
        });

        if (filtered.length === 0) {
          tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:var(--text-muted);">No hay productos registrados.</td></tr>`;
          return;
        }

        filtered.forEach(p => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td><code>${escapeHTML(p.sku)}</code></td>
            <td><strong>${escapeHTML(p.name_es)}</strong></td>
            <td>${escapeHTML(p.name_en || '—')}</td>
            <td>${escapeHTML(getCatLabel(p.category))}</td>
            <td><strong style="color:var(--accent);">RD$ ${(p.price_min || 0).toLocaleString()}</strong></td>
            <td>
              <span class="sync-badge ${p.is_active ? 'online' : 'offline'}">
                ${p.is_active ? (isEN ? 'Active' : 'Activo') : (isEN ? 'Inactive' : 'Inactivo')}
              </span>
            </td>
            <td>
              <button class="btn-action-sm btn-edit-product" data-id="${p.id}" style="margin-right:5px; padding:6px 10px;" title="Editar">✏️</button>
              <button class="btn-action-sm btn-delete-product" data-id="${p.id}" style="padding:6px 10px; border-color:#ef4444; color:#ef4444;" title="Eliminar">🗑️</button>
            </td>
          `;

          tr.querySelector('.btn-edit-product').addEventListener('click', () => startEditProduct(p));
          tr.querySelector('.btn-delete-product').addEventListener('click', () => deleteProduct(p.id));

          tbody.appendChild(tr);
        });
      }

      function getCatLabel(cat) {
        const catL = {
          'software_preconfigurado': isEN ? 'Business Software' : 'Software Empresarial',
          'software_custom': isEN ? 'Custom Development' : 'Desarrollo a Medida',
          'imprenta': isEN ? 'Print & Signage' : 'Imprenta y Rotulación',
          'pop_merchandising': isEN ? 'Corporate Merchandise' : 'POP Merchandising',
          'articulos_corporativos': isEN ? 'Corporate Articles' : 'Artículos Corporativos',
          'servicio_renovacion': isEN ? 'Renovation' : 'Renovación',
          'servicio_consultoria': isEN ? 'Consulting' : 'Consultoría',
          'servicio_publicidad': isEN ? 'Digital Marketing' : 'Marketing Digital'
        };
        return catL[cat] || cat;
      }

      function startEditProduct(p) {
        document.getElementById('productIdInput').value = p.id;
        document.getElementById('prodSku').value = p.sku;
        document.getElementById('prodCategory').value = p.category;
        document.getElementById('prodNameEs').value = p.name_es;
        document.getElementById('prodNameEn').value = p.name_en || '';
        document.getElementById('prodDescEs').value = p.description_es || '';
        document.getElementById('prodDescEn').value = p.description_en || '';
        document.getElementById('prodPriceMin').value = p.price_min || 0;
        document.getElementById('prodPriceType').value = p.price_type || 'one_time';
        document.getElementById('prodDeliveryMin').value = p.delivery_days_min !== null ? p.delivery_days_min : '';
        document.getElementById('prodDeliveryMax').value = p.delivery_days_max !== null ? p.delivery_days_max : '';
        document.getElementById('prodSortOrder').value = p.sort_order !== null ? p.sort_order : 0;
        document.getElementById('prodRequiresQuote').checked = !!p.requires_quote;
        document.getElementById('prodIsActive').checked = !!p.is_active;

        document.getElementById('productFormTitle').textContent = isEN ? "Edit Product" : "Editar Producto";
        document.getElementById('productFormBadge').style.display = 'inline-block';
        document.getElementById('btnCancelProductEdit').style.display = 'inline-block';

        const formCard = document.getElementById('productFormCard');
        if (formCard) formCard.scrollIntoView({ behavior: 'smooth' });
      }

      function resetProductForm() {
        document.getElementById('productForm').reset();
        document.getElementById('productIdInput').value = '';
        document.getElementById('productFormTitle').textContent = isEN ? "Register Product" : "Registrar Producto";
        document.getElementById('productFormBadge').style.display = 'none';
        document.getElementById('btnCancelProductEdit').style.display = 'none';
      }

      async function deleteProduct(id) {
        const confirmMsg = isEN ? "Are you sure you want to delete this product?" : "¿Estás seguro de que deseas eliminar este producto?";
        if (confirm(confirmMsg)) {
          try {
            const { error } = await supabase
              .from('productos')
              .delete()
              .eq('id', id);

            if (error) throw error;

            alert(isEN ? "Product deleted successfully." : "Producto eliminado correctamente.");
            await loadAdminProducts();
          } catch (err) {
            console.error("Error deleting product:", err);
            alert(isEN ? "Error deleting product: " + err.message : "Error al eliminar producto: " + err.message);
          }
        }
      }

      function setupProductCRUD() {
        const categoryFilter = document.getElementById('productCategoryFilter');
        if (categoryFilter) {
          categoryFilter.addEventListener('change', renderProductsTable);
        }

        const btnRefresh = document.getElementById('btnRefreshProductos');
        if (btnRefresh) {
          btnRefresh.addEventListener('click', async () => {
            const originalText = btnRefresh.textContent;
            btnRefresh.textContent = isEN ? 'Syncing...' : 'Sincronizando...';
            btnRefresh.disabled = true;
            await loadAdminProducts();
            btnRefresh.textContent = originalText;
            btnRefresh.disabled = false;
          });
        }

        const btnCancelEdit = document.getElementById('btnCancelProductEdit');
        if (btnCancelEdit) {
          btnCancelEdit.addEventListener('click', resetProductForm);
        }

        const productForm = document.getElementById('productForm');
        if (productForm) {
          productForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btnSave = document.getElementById('btnSaveProduct');
            const originalText = btnSave.textContent;
            btnSave.textContent = isEN ? "Saving..." : "Guardando...";
            btnSave.disabled = true;

            const productId = document.getElementById('productIdInput').value;
            const sku = document.getElementById('prodSku').value.trim();
            const category = document.getElementById('prodCategory').value;
            const nameEs = document.getElementById('prodNameEs').value.trim();
            const nameEn = document.getElementById('prodNameEn').value.trim();
            const descEs = document.getElementById('prodDescEs').value.trim();
            const descEn = document.getElementById('prodDescEn').value.trim();
            const priceMin = parseInt(document.getElementById('prodPriceMin').value) || 0;
            const priceType = document.getElementById('prodPriceType').value;
            const deliveryMin = document.getElementById('prodDeliveryMin').value !== '' ? parseInt(document.getElementById('prodDeliveryMin').value) : null;
            const deliveryMax = document.getElementById('prodDeliveryMax').value !== '' ? parseInt(document.getElementById('prodDeliveryMax').value) : null;
            const sortOrder = document.getElementById('prodSortOrder').value !== '' ? parseInt(document.getElementById('prodSortOrder').value) : 0;
            const requiresQuote = document.getElementById('prodRequiresQuote').checked;
            const isActive = document.getElementById('prodIsActive').checked;

            const payload = {
              sku,
              category,
              name_es: nameEs,
              name_en: nameEn || null,
              description_es: descEs || null,
              description_en: descEn || null,
              price_min: priceMin,
              price_type: priceType,
              delivery_days_min: deliveryMin,
              delivery_days_max: deliveryMax,
              sort_order: sortOrder,
              requires_quote: requiresQuote,
              is_active: isActive
            };

            try {
              if (productId) {
                const { error } = await supabase
                  .from('productos')
                  .update(payload)
                  .eq('id', productId);
                if (error) throw error;
              } else {
                const { error } = await supabase
                  .from('productos')
                  .insert([payload]);
                if (error) throw error;
              }

              alert(isEN ? "Product saved successfully." : "Producto guardado correctamente.");
              resetProductForm();
              await loadAdminProducts();
            } catch (err) {
              console.error("Error saving product:", err);
              alert(isEN ? "Failed to save product: " + err.message : "Error al guardar producto: " + err.message);
            } finally {
              btnSave.textContent = originalText;
              btnSave.disabled = false;
            }
          });
        }
      }

      // CRUD ACTIONS ATTACHMENT
      function setupAdminCRUD() {
        // Sync filter and refresh
        const filterSelect = document.getElementById('clientStatusFilter');
        if (filterSelect) {
          filterSelect.addEventListener('change', renderClientsTable);
        }

        const btnRefresh = document.getElementById('btnRefreshClientes');
        if (btnRefresh) {
          btnRefresh.addEventListener('click', async () => {
            const originalText = btnRefresh.textContent;
            btnRefresh.textContent = isEN ? 'Syncing...' : 'Sincronizando...';
            btnRefresh.disabled = true;
            await loadAdminClients();
            btnRefresh.textContent = originalText;
            btnRefresh.disabled = false;
          });
        }

        // Cancel Edit btn
        const btnCancelEdit = document.getElementById('btnCancelEdit');
        if (btnCancelEdit) {
          btnCancelEdit.addEventListener('click', resetClientForm);
        }

        // Submit client entry Form
        const clientForm = document.getElementById('clientForm');
        if (clientForm) {
          clientForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btnSave = document.getElementById('btnSaveClient');
            const originalText = btnSave.textContent;
            btnSave.textContent = t.btnSaving;
            btnSave.disabled = true;

            const clientId = document.getElementById('clientIdInput').value;
            const companyName = document.getElementById('clientCompanyName').value.trim();
            const legalId = document.getElementById('clientLegalId').value.trim();
            const ownerName = document.getElementById('clientOwnerName').value.trim();
            const email = document.getElementById('clientEmail').value.trim();
            const password = document.getElementById('clientPassword').value;
            const phone = document.getElementById('clientPhone').value.trim();
            const address = document.getElementById('clientAddress').value.trim();
            const accessCode = document.getElementById('clientAccessCode').value.trim();

            const ventas = parseInt(document.getElementById('clientVentas').value) || 0;
            const ventasTrend = document.getElementById('clientVentasTrend').value.trim();
            const cpl = parseInt(document.getElementById('clientCac').value) || 0;
            const cplTrend = document.getElementById('clientCacTrend').value.trim();
            const roas = parseFloat(document.getElementById('clientRoas').value) || 0.0;
            const roasTrend = document.getElementById('clientRoasTrend').value.trim();
            const ltv = parseInt(document.getElementById('clientLtv').value) || 0;
            const ltvTrend = document.getElementById('clientLtvTrend').value.trim();

            const onapi = parseInt(document.getElementById('clientOnapi').value) || 0;
            const camara = parseInt(document.getElementById('clientCamara').value) || 0;
            const dgii = parseInt(document.getElementById('clientDgii').value) || 0;

            const status = document.getElementById('clientStatus').value;

            const payload = {
              company_name: companyName,
              legal_id: legalId,
              owner_name: ownerName,
              email: email,
              password: password,
              phone: phone,
              address: address,
              access_code: accessCode,
              ventas: ventas,
              ventas_trend: ventasTrend,
              cpl: cpl,
              cpl_trend: cplTrend,
              roas: roas,
              roas_trend: roasTrend,
              ltv: ltv,
              ltv_trend: ltvTrend,
              tramite_onapi: onapi,
              tramite_camara: camara,
              tramite_dgii: dgii,
              status: status
            };

            try {
              if (clientId) {
                // UPDATE EXISITING
                const { error } = await supabase
                  .from('clientes')
                  .update(payload)
                  .eq('id', clientId);

                if (error) throw error;
              } else {
                // INSERT NEW
                // Fase 3: NO se generan chart_data ni pagos sintéticos.
                // chart_data y pagos se derivan ahora de ordenes reales vía el
                // RPC dashboard_overview. El cliente arranca con sus KPIs base.
                const { error } = await supabase
                  .from('clientes')
                  .insert([payload]);

                if (error) throw error;

                // Crear filas de trámites en client_tramites a partir de los %
                // ingresados (datos reales, no simulación). Idempotente.
                if (supabase) {
                  const { data: newClient } = await supabase
                    .from('clientes').select('id').eq('email', email).maybeSingle();
                  if (newClient && newClient.id) {
                    const tramiteRows = [
                      { cliente_id: newClient.id, tipo: 'onapi',  progress_percent: onapi,  description: 'Documentación ONAPI.' },
                      { cliente_id: newClient.id, tipo: 'camara', progress_percent: camara, description: 'Registro en Cámara.' },
                      { cliente_id: newClient.id, tipo: 'dgii',   progress_percent: dgii,   description: 'Inscripción DGII.' }
                    ].filter(r => r.progress_percent > 0);
                    if (tramiteRows.length) {
                      await supabase.from('client_tramites').upsert(
                        tramiteRows, { onConflict: 'cliente_id,tipo' }
                      );
                    }
                  }
                }
              }

              alert(t.saveSuccess);
              resetClientForm();
              await loadAdminClients();
            } catch (err) {
              console.error("Error saving client:", err);
              alert(isEN ? "Failed to save client: " + err.message : "Error al guardar cliente: " + err.message);
            } finally {
              btnSave.textContent = originalText;
              btnSave.disabled = false;
            }
          });
        }
      }

      // DELETE CLIENT ACTION
      async function deleteClient(id) {
        if (confirm(t.confirmDelete)) {
          try {
            const { error } = await supabase
              .from('clientes')
              .delete()
              .eq('id', id);

            if (error) throw error;

            alert(t.deleteSuccess);
            await loadAdminClients();
            
            // If deleting a client currently previewed in admin selection, fallback
            const adminClientSelect = document.getElementById('adminClientSelect');
            if (adminClientSelect && adminClientSelect.value === id) {
              adminClientSelect.value = 'default';
              renderClientDashboard(defaultMetrics);
            }
          } catch (err) {
            console.error("Error deleting client:", err);
            alert(isEN ? "Error deleting client: " + err.message : "Error al eliminar cliente: " + err.message);
          }
        }
      }

      // INITIALIZE RUN
      initializeDashboard();

      // Theme Dashboard handler
      const themeBtn = document.getElementById('themeBtnDashboard');
      if (themeBtn) {
        themeBtn.addEventListener('click', () => {
          const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
          const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
          document.documentElement.setAttribute('data-theme', newTheme);
          localStorage.setItem('rcp-theme', newTheme);
          
          const moonIcon = document.getElementById('moonIcon');
          const sunIcon = document.getElementById('sunIcon');
          
          if (newTheme === 'light') {
            if (moonIcon) moonIcon.style.display = 'none';
            if (sunIcon) sunIcon.style.display = 'block';
            document.querySelectorAll('#sidebarLogo').forEach(el => el.src = '/Logo RCP Services.png');
          } else {
            if (moonIcon) moonIcon.style.display = 'block';
            if (sunIcon) sunIcon.style.display = 'none';
            document.querySelectorAll('#sidebarLogo').forEach(el => el.src = '/Logo RCP  fondo negro.png');
          }
        });
      }

      // Sync language control
      const langSelect = document.getElementById('langSelectDashboard');
      if (langSelect) {
        const currentLang = localStorage.getItem('rcp-lang') || 'es';
        langSelect.value = currentLang;
        
        langSelect.addEventListener('change', () => {
          const lang = langSelect.value;
          localStorage.setItem('rcp-lang', lang);
          window.location.reload();
        });
      }
    })();
