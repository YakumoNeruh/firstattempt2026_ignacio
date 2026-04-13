document.addEventListener('DOMContentLoaded', () => {

    // ── STATE ──
    const state = {
        isAuthenticated: false,
        currentView: 'dashboard',
        activeModal: null,
        selectedDocument: null,
        selectedStaffProfile: null,
        selectedPayment: null,
        paymentFilter: 'all',
        paymentSearch: '',
        activeTrackId: 101,
        rushConfirmId: null,
        requestTab: 'new',
        loginType: 'alumni',
        user: {
            name: 'Maria Clara Santos',
            studentNo: '20180234',
            course: 'Bachelor of Science in Computer Science',
            graduated: 'March 2022',
            honors: 'Cum Laude',
            email: 'maria.santos@addu.edu.ph',
            phone: '+63 912 345 6789',
            address: 'Davao City, Philippines',
            initials: 'MC'
        }
    };

    // ── DATA ──
    const documentsList = [
        { id: 1, title: 'Transcript of Records', desc: 'Official academic transcript with all courses and grades.', fee: '₱150', time: '5-7 business days', icon: 'fa-file-lines' },
        { id: 2, title: 'Certified True Copy of Diploma', desc: 'Authenticated copy of your diploma.', fee: '₱200', time: '3-5 business days', icon: 'fa-certificate' },
        { id: 3, title: 'Certificate of Graduation', desc: 'Official certificate confirming degree completion.', fee: '₱100', time: '2-3 business days', icon: 'fa-graduation-cap' },
        { id: 4, title: 'Certificate of Enrollment', desc: 'Proof of current or past enrollment.', fee: '₱80', time: '1-2 business days', icon: 'fa-file-signature' }
    ];

    const requestHistory = [
        { id: 'H1', title: 'Transcript of Records', date: 'Feb 15, 2026', ref: '#TOR-2026-0021', icon: 'fa-file-lines' },
        { id: 'H2', title: 'Certificate of Graduation', date: 'Oct 18, 2024', ref: '#COG-2024-0620', icon: 'fa-graduation-cap' },
    ];

    const trackedRequests = [
        {
            id: 101, title: 'Official Transcript of Records', requestNo: '#TOR-2024-0342',
            status: 'pending', statusLabel: 'Pending Upload', date: 'Oct 24, 2024', icon: 'fa-file-lines',
            requirements: ['Valid Government ID', 'Payment Receipt (₱150)'],
            requirementsDone: [false, false],
            rushFee: '₱200',
            hasRush: true,
            expiresIn: null,
            steps: [
                { name: 'Submitted',   label: 'Request Submitted',    desc: 'Your request has been received and logged.', date: 'Oct 24, 2024', done: true },
                { name: 'Verified',    label: 'Documents Verified',   desc: 'Verifying student records and requirements.', date: 'Pending', done: false },
                { name: 'Processed',   label: 'Document Processed',   desc: 'Registrar is preparing the document.', date: '', done: false },
                { name: 'Ready',       label: 'Ready for Download',   desc: 'Document is digitally signed and ready.', date: '', done: false }
            ]
        },
        {
            id: 102, title: 'Certified Diploma Copy', requestNo: '#DIP-2024-0198',
            status: 'processing', statusLabel: 'Processing', date: 'Oct 20, 2024', icon: 'fa-certificate',
            requirements: ['Valid Government ID', 'Payment Receipt (₱200)'],
            requirementsDone: [true, true],
            rushFee: '₱300',
            hasRush: true,
            expiresIn: null,
            steps: [
                { name: 'Submitted',   label: 'Request Submitted',    desc: 'Your request has been received and logged.', date: 'Oct 20, 2024', done: true },
                { name: 'Verified',    label: 'Documents Verified',   desc: 'All documents and payment verified.', date: 'Oct 21, 2024', done: true },
                { name: 'Processed',   label: 'Document Processed',   desc: 'Registrar is preparing the document.', date: 'Processing…', done: false },
                { name: 'Ready',       label: 'Ready for Download',   desc: 'Document is digitally signed and ready.', date: '', done: false }
            ]
        }
    ];

    const staffDocumentLogs = [
        { id: '#TOR-2024-0342', student: 'Maria Clara Santos', doc: 'Transcript of Records', date: '2026-02-15', status: 'Ready', ref: 'Available', qr: 'TOR-2024-0342' },
        { id: '#DIP-2024-0198', student: 'Juan Dela Cruz', doc: 'Certified Diploma', date: '2026-02-14', status: 'Processing', ref: 'QR-2024-0198', qr: 'DIP-2024-0198' },
        { id: '#COG-2024-0521', student: 'Emma Wilson', doc: 'Certificate of Graduation', date: '2026-02-12', status: 'Ready', ref: 'Available', qr: 'COG-2024-0521' }
    ];

    const staffPayments = [
        { id: '#PAY-2024-001', amount: '₱1,500.00', student: 'Maria Clara Santos', doc: 'Transcript + Diploma', date: '2026-02-15', status: 'Pending', flagged: true },
        { id: '#PAY-2024-002', amount: '₱200.00', student: 'Juan Dela Cruz', doc: 'Certificate', date: '2026-02-14', status: 'Verified', flagged: false }
    ];

    // ── ENGINE ──
    function render() {
        const root = document.getElementById('app-root');
        if (!state.isAuthenticated) {
            root.innerHTML = viewLogin();
        } else if (state.loginType === 'staff') {
            root.innerHTML = viewStaffShell();
        } else {
            root.innerHTML = viewShell();
        }
        const mc = document.getElementById('modal-container');
        if (mc) mc.innerHTML = state.activeModal ? viewModal() : '';
    }

    // ── ACTIONS ──
    window.actionLogin = (e) => { if (e) e.preventDefault(); state.isAuthenticated = true; state.currentView = 'dashboard'; render(); };
    window.actionLogout = () => { state.isAuthenticated = false; state.loginType = 'alumni'; render(); };
    window.navigate = (v) => { state.currentView = v; render(); };
    window.setRequestTab = (t) => { state.requestTab = t; render(); };
    window.setLoginType = (type) => { state.loginType = type; render(); };
    
    window.openModal = (name, data) => { state.activeModal = name; if (data !== undefined) state.selectedDocument = data; render(); };
    window.openQrCode = (id) => { state.selectedDocument = staffDocumentLogs.find(log => log.id === id); state.activeModal = 'qr-code'; render(); };
    window.openPaymentVerify = (id) => { state.selectedPayment = staffPayments.find(p => p.id === id); state.activeModal = 'payment-verify'; render(); };
    window.confirmPaymentVerification = () => {
        if (state.selectedPayment) {
            state.selectedPayment.status = 'Verified';
            alert(`Payment ${state.selectedPayment.id} verified successfully.`);
        }
        window.closeModal();
    };
    window.setPaymentFilter = (filter) => { state.paymentFilter = filter; render(); };
    window.setPaymentSearch = (value) => { state.paymentSearch = value; render(); };
    window.openStaffProfile = (id) => { state.selectedStaffProfile = staffDocumentLogs.find(log => log.id === id); state.activeModal = 'staff-profile'; render(); };
    window.changeRequestStatus = (id, status) => {
        const log = staffDocumentLogs.find(item => item.id === id);
        if (log) log.status = status;
        const tracked = trackedRequests.find(item => item.requestNo === id);
        if (tracked) {
            tracked.status = status === 'Ready' ? 'ready' : (status === 'Processed' ? 'processing' : 'pending');
            tracked.statusLabel = status === 'Ready' ? 'Ready' : (status === 'Processed' ? 'Processing' : 'Pending Upload');
            const order = ['Submitted', 'Verified', 'Processed', 'Ready'];
            const currentIndex = order.indexOf(status);
            tracked.steps = tracked.steps.map(step => ({
                ...step, done: order.indexOf(step.name) <= currentIndex
            }));
        }
        state.selectedStaffProfile = staffDocumentLogs.find(item => item.id === id);
        render();
    };
    window.closeModal = () => { state.activeModal = null; state.selectedDocument = null; state.selectedStaffProfile = null; state.selectedPayment = null; state.rushConfirmId = null; render(); };
    window.setActiveTrack = (id) => { state.activeTrackId = id; render(); };
    window.openPurpose = (doc) => { state.selectedDocument = doc; state.activeModal = 'purpose'; render(); };
    window.openVerify = (doc) => { state.selectedDocument = doc; state.activeModal = 'verify'; render(); };
    window.submitRequest = () => { alert('Request submitted successfully!'); window.closeModal(); window.navigate('track'); };
    window.openRushConfirm = (id) => { state.rushConfirmId = id; state.activeModal = 'rush-confirm'; render(); };
    window.confirmRush = () => { alert('Rush processing activated!'); window.closeModal(); };
    window.openPdfPreview = (id) => { state.activeTrackId = id; state.activeModal = 'pdf-preview'; render(); };

    // ── SHELL VIEWS ──
    function viewShell() {
        const views = { dashboard: viewDashboard, request: viewRequest, track: viewTrack, profile: viewProfile };
        const content = (views[state.currentView] || viewDashboard)();
        return `
        <div class="app-shell">
            ${viewSidebar()}
            <div class="main-area">
                ${viewTopbar()}
                <div class="page-content">${content}</div>
            </div>
        </div>
        <div id="modal-container"></div>`;
    }

    function viewStaffShell() {
        const staffViews = { dashboard: viewStaffDashboard, 'profile-mgmt': viewProfileManagement, 'doc-log': viewDocumentLog, 'payment': viewPaymentVerification, 'profile': viewStaffProfile };
        const content = (staffViews[state.currentView] || viewStaffDashboard)();
        return `
        <div class="app-shell">
            ${viewStaffSidebar()}
            <div class="main-area">
                ${viewStaffTopbar()}
                <div class="page-content">${content}</div>
            </div>
        </div>
        <div id="modal-container"></div>`;
    }

    function viewSidebar() {
        const nav = (view, icon, label) => `
            <button onclick="window.navigate('${view}')" class="nav-btn ${state.currentView === view ? 'active' : ''}">
                <i class="fa-solid ${icon}"></i> ${label}
            </button>`;
        return `
        <nav class="sidebar">
            <div class="sidebar-brand">
                <div class="sidebar-brand-icon"><img src="aknight-01.png" alt="Logo"></div>
                <div class="sidebar-brand-text">
                    <h2>Alumni Knights</h2>
                    <p>Student Portal</p>
                </div>
            </div>
            <div class="sidebar-nav">
                <div class="nav-label">Main</div>
                ${nav('dashboard', 'fa-house', 'Home')}
                ${nav('profile', 'fa-id-card', 'My Profile')}
                <div class="nav-label" style="margin-top:16px;">Documents</div>
                ${nav('request', 'fa-file-circle-plus', 'Request Documents')}
                ${nav('track', 'fa-bars-progress', 'Process Documents')}
            </div>
            <div class="sidebar-footer">
                <button onclick="window.actionLogout()" class="nav-btn danger">
                    <i class="fa-solid fa-right-from-bracket"></i> Sign Out
                </button>
            </div>
        </nav>`;
    }

    function viewStaffSidebar() {
        const nav = (view, icon, label) => `
            <button onclick="window.navigate('${view}')" class="nav-btn ${state.currentView === view ? 'active' : ''}">
                <i class="fa-solid ${icon}"></i> ${label}
            </button>`;
        return `
        <nav class="sidebar staff-mode">
            <div class="sidebar-brand">
                <div class="sidebar-brand-icon"><img src="aknight-01.png" alt="Logo"></div>
                <div class="sidebar-brand-text">
                    <h2>Registrar Portal</h2>
                    <p>Staff Management</p>
                </div>
            </div>
            <div class="sidebar-nav">
                <div class="nav-label">Management</div>
                ${nav('dashboard', 'fa-chart-line', 'Dashboard')}
                ${nav('profile-mgmt', 'fa-users', 'Profile Management')}
                <div class="nav-label" style="margin-top:16px;">Operations</div>
                ${nav('doc-log', 'fa-file-lines', 'Document Log')}
                ${nav('payment', 'fa-credit-card', 'Payment Verification')}
                <div class="nav-label" style="margin-top:16px;">Account</div>
                ${nav('profile', 'fa-user-circle', 'My Profile')}
            </div>
            <div class="sidebar-footer">
                <button onclick="window.actionLogout()" class="nav-btn danger">
                    <i class="fa-solid fa-right-from-bracket"></i> Sign Out
                </button>
            </div>
        </nav>`;
    }

    function viewTopbar() {
        return `
        <header class="topbar">
            <div class="topbar-left">
                <h1>Overview</h1>
                <p>Manage your academic records seamlessly.</p>
            </div>
            <div class="topbar-right">
                <div class="avatar-chip" onclick="window.navigate('profile')">
                    <div class="avatar">${state.user.initials}</div>
                    <div class="avatar-chip-text">
                        <p>${state.user.name}</p>
                        <p>Alumni</p>
                    </div>
                </div>
            </div>
        </header>`;
    }

    function viewStaffTopbar() {
        return `
        <header class="topbar">
            <div class="topbar-left">
                <h1>Staff Overview</h1>
                <p>Manage and process document requests.</p>
            </div>
            <div class="topbar-right">
                <div class="avatar-chip" onclick="window.navigate('dashboard')">
                    <div class="avatar" style="background:var(--gray-900);">AS</div>
                    <div class="avatar-chip-text">
                        <p>Admin Staff</p>
                        <p>Registrar</p>
                    </div>
                </div>
            </div>
        </header>`;
    }

    // ── CONTENT VIEWS ──

    function viewDashboard() {
        return `
        <div class="dash-grid">
            <div>
                <div class="profile-banner">
                    <div class="profile-avatar-lg"><i class="fa-solid fa-user"></i></div>
                    <div class="profile-info-banner">
                        <h2>${state.user.name}</h2>
                        <p>Student No. ${state.user.studentNo}</p>
                        <span class="verified-pill"><i class="fa-solid fa-check"></i> Verified Record</span>
                        <div class="profile-meta-grid">
                            <div class="profile-meta-item"><i class="fa-solid fa-graduation-cap"></i>${state.user.course}</div>
                            <div class="profile-meta-item"><i class="fa-solid fa-calendar"></i>Graduated ${state.user.graduated}</div>
                        </div>
                    </div>
                </div>

                <div class="section-title">Quick Actions</div>
                <div class="quick-actions-grid">
                    <div class="qa-card" onclick="window.navigate('profile')">
                        <div class="qa-icon blue"><i class="fa-solid fa-id-card"></i></div>
                        <div class="qa-text"><h4>View Profile</h4><p>Access verified academic records</p></div>
                        <i class="fa-solid fa-chevron-right qa-arrow"></i>
                    </div>
                    <div class="qa-card" onclick="window.navigate('request')">
                        <div class="qa-icon green"><i class="fa-solid fa-file-circle-plus"></i></div>
                        <div class="qa-text"><h4>Request Document</h4><p>Order transcripts &amp; certifications</p></div>
                        <i class="fa-solid fa-chevron-right qa-arrow"></i>
                    </div>
                </div>
            </div>

            <div>
                <div class="section-title">Recent Updates</div>
                <div class="card">
                    <div class="notif-list">
                        <div class="notif-item">
                            <div class="notif-icon blue"><i class="fa-solid fa-check"></i></div>
                            <div class="notif-body">
                                <h5>Transcript Approved</h5>
                                <p>Your Official Transcript of Records is ready.</p>
                                <span>Feb 15, 2026</span>
                            </div>
                        </div>
                        <div class="notif-item">
                            <div class="notif-icon gray"><i class="fa-solid fa-file"></i></div>
                            <div class="notif-body">
                                <h5>Request Received</h5>
                                <p>We received your request for a Diploma Copy.</p>
                                <span>Jan 10, 2026</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }

    function viewRequest() {
        return `
        <div style="max-width:1000px;">
            <div class="req-toolbar">
                <div class="req-tabs">
                    <button class="req-tab ${state.requestTab === 'new' ? 'active' : ''}" onclick="window.setRequestTab('new')">New Request</button>
                    <button class="req-tab ${state.requestTab === 'history' ? 'active' : ''}" onclick="window.setRequestTab('history')">History</button>
                </div>
                <div class="search-bar">
                    <i class="fa-solid fa-search"></i>
                    <input type="text" placeholder="Search document types…">
                </div>
            </div>
            ${state.requestTab === 'new' ? viewNewRequest() : viewRequestHistory()}
        </div>`;
    }

    function viewNewRequest() {
        return `
        <div class="doc-grid">
            ${documentsList.map(doc => `
                <div class="doc-card" onclick='window.openModal("confirm-request", ${JSON.stringify(doc)})'>
                    <div class="doc-card-head">
                        <div class="doc-icon"><i class="fa-solid ${doc.icon}"></i></div>
                        <div class="doc-card-head-text">
                            <h3>${doc.title}</h3>
                            <p>${doc.desc}</p>
                        </div>
                    </div>
                    <div class="doc-card-footer">
                        <div class="doc-meta">
                            <p>${doc.fee}</p>
                            <p><i class="fa-regular fa-clock"></i> ${doc.time}</p>
                        </div>
                        <button class="btn-request">Request</button>
                    </div>
                </div>
            `).join('')}
        </div>`;
    }

    function viewRequestHistory() {
        return `
        <div class="history-list">
            ${requestHistory.map(h => `
                <div class="hist-item">
                    <div class="hist-icon"><i class="fa-solid ${h.icon}"></i></div>
                    <div class="hist-body">
                        <h4>${h.title}</h4>
                        <p>${h.ref} · ${h.date}</p>
                    </div>
                    <span class="badge-verified"><i class="fa-solid fa-check"></i> Verified</span>
                </div>
            `).join('')}
        </div>`;
    }

    function viewTrack() {
        const active = trackedRequests.find(r => r.id === state.activeTrackId) || trackedRequests[0];
        const pendingCount = trackedRequests.filter(r => r.status !== 'ready').length;
        
        return `
        <div class="track-layout">
            <div class="track-master">
                <div class="track-summary-bar">
                    <div class="summary-pill">
                        <div class="summary-pill-header">Active</div>
                        <div class="number">${pendingCount}</div>
                    </div>
                    <div class="summary-pill" style="border-left:1px solid var(--gray-200);">
                        <div class="summary-pill-header">Total</div>
                        <div class="number">${trackedRequests.length}</div>
                    </div>
                </div>
                <div class="track-list-head">Requests</div>
                <div class="track-list">
                    ${trackedRequests.map(doc => `
                        <div class="track-card ${active.id === doc.id ? 'active' : ''}" onclick="window.setActiveTrack(${doc.id})">
                            <div class="track-card-top">
                                <div class="track-card-info">
                                    <h4>${doc.title}</h4>
                                    <p>${doc.requestNo}</p>
                                </div>
                            </div>
                            <div class="track-card-bottom">
                                <span class="status-pill ${doc.status}">${doc.statusLabel}</span>
                                ${doc.hasRush ? `<span class="rush-pill">Rush</span>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="track-detail">
                <div class="detail-header">
                    <div class="detail-header-left">
                        <h2>${active.title}</h2>
                        <p>ID: ${active.requestNo}</p>
                    </div>
                    <div class="detail-header-right">
                        <div class="lbl">Date Requested</div>
                        <div class="val">${active.date}</div>
                    </div>
                </div>
                <div class="detail-scroll">
                    <div class="stepper">
                        ${active.steps.map((s, i) => {
                            const isCurrent = !s.done && (i === 0 || active.steps[i-1].done);
                            return `
                            <div class="step-item ${s.done ? 'done' : ''} ${isCurrent ? 'current' : ''}">
                                <div class="step-dot ${s.done ? 'done' : ''} ${isCurrent ? 'current' : ''}">
                                    ${s.done ? '<i class="fa-solid fa-check"></i>' : (i+1)}
                                </div>
                                <div class="step-label">${s.name}</div>
                            </div>`;
                        }).join('')}
                    </div>

                    ${active.hasRush && active.status !== 'ready' ? `
                        <button class="btn-rush" onclick="window.openRushConfirm(${active.id})">
                            Activate Rush Processing (+${active.rushFee})
                        </button>
                    ` : ''}

                    <div class="timeline">
                        ${active.steps.map(s => `
                            <div class="tl-step ${!s.done ? 'faded' : ''}">
                                <div class="tl-dot ${s.done ? 'done' : 'pending'}"></div>
                                <h4>${s.label}</h4>
                                <p>${s.desc}</p>
                                ${s.date ? `<span class="tl-date">${s.date}</span>` : ''}
                            </div>
                        `).join('')}
                    </div>

                    <div class="checklist-section">
                        <h4>Requirements Checklist</h4>
                        ${active.requirements.map((r, i) => `
                            <div class="checklist-item">
                                <i class="fa-solid ${active.requirementsDone[i] ? 'fa-check done' : 'fa-circle-notch pending'}"></i>
                                ${r}
                            </div>
                        `).join('')}
                    </div>

                    ${active.status === 'ready' ? `
                        <button class="btn-download" onclick="window.openPdfPreview(${active.id})">
                            Download Official PDF
                        </button>
                    ` : ``}
                </div>
            </div>
        </div>`;
    }

    function viewProfile() {
        return `
        <div class="profile-page">
            <div class="card" style="margin-bottom: 24px; display: flex; align-items: center; gap: 24px;">
                <div style="width: 80px; height: 80px; border-radius: 50%; background: var(--blue-pale); display: flex; align-items: center; justify-content: center; font-size: 28px; color: var(--brand-primary);"><i class="fa-solid fa-user"></i></div>
                <div>
                    <h2 style="font-size: 20px; font-weight: 700; color: var(--gray-900);">${state.user.name}</h2>
                    <p style="font-size: 14px; color: var(--gray-500); margin-top: 4px;">Student No. ${state.user.studentNo}</p>
                    <div style="margin-top: 10px; display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; background: var(--green-light); color: var(--green-mid); border-radius: 6px; font-size: 12px; font-weight: 600;"><i class="fa-solid fa-check"></i> Verified Profile</div>
                </div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 320px; gap: 24px;">
                <div>
                    <div class="profile-section-card">
                        <h3>Academic Information</h3>
                        <div class="contact-grid">
                            <div class="contact-item">
                                <div class="contact-item-text"><div class="lbl">Degree Program</div><div class="val">${state.user.course}</div></div>
                            </div>
                            <div class="contact-item">
                                <div class="contact-item-text"><div class="lbl">Graduation Date</div><div class="val">${state.user.graduated}</div></div>
                            </div>
                            <div class="contact-item">
                                <div class="contact-item-text"><div class="lbl">Honors Received</div><div class="val">${state.user.honors}</div></div>
                            </div>
                        </div>
                    </div>

                    <div class="profile-section-card">
                        <h3>Contact Information</h3>
                        <div class="contact-grid">
                            <div class="contact-item">
                                <div class="contact-item-icon"><i class="fa-regular fa-envelope"></i></div>
                                <div class="contact-item-text"><div class="lbl">Email</div><div class="val">${state.user.email}</div></div>
                            </div>
                            <div class="contact-item">
                                <div class="contact-item-icon"><i class="fa-solid fa-phone"></i></div>
                                <div class="contact-item-text"><div class="lbl">Phone</div><div class="val">${state.user.phone}</div></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="profile-section-card">
                        <h3>Quick Actions</h3>
                        <div class="profile-action-btns">
                            <button class="btn-action-sm"><i class="fa-solid fa-share-nodes"></i> Share Credentials</button>
                            <button class="btn-action-sm"><i class="fa-solid fa-download"></i> Download Profile Info</button>
                            <button class="btn-action-sm" onclick="window.actionLogout()" style="color: var(--red);"><i class="fa-solid fa-arrow-right-from-bracket"></i> Sign Out</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }

    // ── STAFF VIEWS ──

    function viewStaffDashboard() {
        return `
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 32px;">
            <div class="stat-card">
                <div class="stat-icon blue"><i class="fa-solid fa-hourglass-half"></i></div>
                <div class="stat-text"><div class="stat-label">Pending Verification</div><div class="stat-value">42</div></div>
            </div>
            <div class="stat-card">
                <div class="stat-icon green"><i class="fa-solid fa-check"></i></div>
                <div class="stat-text"><div class="stat-label">Verified Today</div><div class="stat-value">128</div></div>
            </div>
            <div class="stat-card">
                <div class="stat-icon purple"><i class="fa-solid fa-credit-card"></i></div>
                <div class="stat-text"><div class="stat-label">Pending Payments</div><div class="stat-value">12</div></div>
            </div>
        </div>

        <div class="card">
            <h3 style="margin-bottom: 20px; font-size: 16px; font-weight: 600;">Recent Document Requests</h3>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Student Name</th>
                        <th>Document</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Feb 15, 2026</td>
                        <td style="font-weight: 500;">Maria Clara Santos</td>
                        <td>Transcript of Records</td>
                        <td><span class="status-pill pending">Pending</span></td>
                    </tr>
                    <tr>
                        <td>Feb 14, 2026</td>
                        <td style="font-weight: 500;">Juan Dela Cruz</td>
                        <td>Certified Diploma</td>
                        <td><span class="status-pill processing">Processing</span></td>
                    </tr>
                    <tr>
                        <td>Feb 12, 2026</td>
                        <td style="font-weight: 500;">Emma Wilson</td>
                        <td>Certificate of Graduation</td>
                        <td><span class="status-pill ready">Ready</span></td>
                    </tr>
                </tbody>
            </table>
        </div>`;
    }

    function viewStaffProfile() {
        return `
        <div class="profile-page">
            <div class="card" style="margin-bottom: 24px; display: flex; align-items: center; gap: 24px;">
                <div style="width: 80px; height: 80px; border-radius: 12px; background: var(--gray-900); display: flex; align-items: center; justify-content: center; font-size: 32px; color: var(--white);"><i class="fa-solid fa-user-shield"></i></div>
                <div>
                    <h2 style="font-size: 20px; font-weight: 700; color: var(--gray-900);">RC Modz</h2>
                    <p style="font-size: 14px; color: var(--gray-500); margin-top: 4px;">Staff ID: STAFF-2024-001</p>
                    <div style="margin-top: 10px; display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; background: var(--green-light); color: var(--green-mid); border-radius: 6px; font-size: 12px; font-weight: 600;"><i class="fa-solid fa-check"></i> Active Administrator</div>
                </div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 320px; gap: 24px;">
                <div>
                    <div class="profile-section-card">
                        <h3>Employment Details</h3>
                        <div class="contact-grid">
                            <div class="contact-item">
                                <div class="contact-item-text"><div class="lbl">Position</div><div class="val">System Administrator</div></div>
                            </div>
                            <div class="contact-item">
                                <div class="contact-item-text"><div class="lbl">Department</div><div class="val">Registrar Operations</div></div>
                            </div>
                        </div>
                    </div>
                    <div class="profile-section-card">
                        <h3>Contact Details</h3>
                        <div class="contact-grid">
                            <div class="contact-item">
                                <div class="contact-item-text"><div class="lbl">Email</div><div class="val">john.admin@addu.edu.ph</div></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="profile-section-card">
                        <h3>Actions</h3>
                        <div class="profile-action-btns">
                            <button class="btn-action-sm"><i class="fa-solid fa-key"></i> Change Password</button>
                            <button class="btn-action-sm" onclick="window.actionLogout()" style="color: var(--red);"><i class="fa-solid fa-arrow-right-from-bracket"></i> Sign Out</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }

    function viewProfileManagement() {
        return `
        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <div>
                    <h3 style="font-size: 16px; font-weight: 600;">Student Document Profiles</h3>
                </div>
                <button class="btn-primary" style="width: auto; padding: 8px 16px;">Add Record</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Document Type</th>
                        <th>Date Requested</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${staffDocumentLogs.map(log => `
                        <tr>
                            <td style="font-weight: 500;">${log.student}</td>
                            <td>${log.doc}</td>
                            <td>${log.date}</td>
                            <td><span class="status-pill ${log.status === 'Ready' ? 'ready' : log.status === 'Processing' ? 'processing' : 'pending'}">${log.status}</span></td>
                            <td><button class="btn-sm secondary" onclick="window.openStaffProfile('${log.id}')">Manage</button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>`;
    }

    function viewDocumentLog() {
        return `
        <div class="card">
            <div style="display: flex; gap: 12px; margin-bottom: 24px;">
                <input type="text" placeholder="Search Request ID, Student..." style="flex: 1; padding: 10px 14px; border: 1px solid var(--gray-300); border-radius: 8px; font-size: 13px; outline: none;">
                <button class="btn-outline" style="width: auto; padding: 10px 20px;"><i class="fa-solid fa-filter"></i> Filter</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Request ID</th>
                        <th>Student Name</th>
                        <th>Document</th>
                        <th>Status</th>
                        <th>Reference</th>
                    </tr>
                </thead>
                <tbody>
                    ${staffDocumentLogs.map(log => `
                        <tr>
                            <td style="color: var(--brand-primary); font-weight: 600;">${log.id}</td>
                            <td>${log.student}</td>
                            <td>${log.doc}</td>
                            <td><span class="status-pill ${log.status === 'Ready' ? 'ready' : 'processing'}">${log.status}</span></td>
                            <td>
                                ${log.ref.startsWith('QR') ? `<button class="btn-sm primary" onclick="window.openQrCode('${log.id}')">View QR</button>` : `<span style="font-size: 12px; color: var(--gray-400);">No QR Code</span>`}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>`;
    }

    function viewPaymentVerification() {
        return `
        <div style="max-width: 900px;">
            <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="font-size: 18px; font-weight: 600; color: var(--gray-900);">Payment Verifications</h3>
            </div>
            <div style="display: grid; gap: 16px;">
                ${staffPayments.map(payment => {
                    const verified = payment.status === 'Verified';
                    return `
                        <div class="card" style="display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                                    <div style="font-size: 14px; font-weight: 600; color: var(--gray-900);">${payment.student}</div>
                                    <span style="font-size: 11px; padding: 2px 8px; background: var(--gray-100); border-radius: 4px; color: var(--gray-600);">${payment.id}</span>
                                </div>
                                <div style="font-size: 12px; color: var(--gray-500);">${payment.doc} · Filed on ${payment.date}</div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 24px;">
                                <div style="text-align: right;">
                                    <div style="font-size: 18px; font-weight: 700; color: var(--gray-900);">${payment.amount}</div>
                                </div>
                                <button class="btn-primary" style="width: 120px; background: ${verified ? 'var(--green-mid)' : 'var(--brand-primary)'};" onclick="window.openPaymentVerify('${payment.id}')">
                                    ${verified ? 'Verified' : 'Verify'}
                                </button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>`;
    }

    // ── MODALS ──
    function viewModal() {
        if (state.activeModal === 'confirm-request' && state.selectedDocument) {
            const doc = state.selectedDocument;
            return `
            <div class="modal-overlay">
                <div class="modal-box">
                    <div class="modal-head">
                        <h3>Confirm Request</h3>
                        <button class="modal-close" onclick="window.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <div class="modal-body">
                        <div style="display: flex; align-items: center; gap: 16px; padding: 16px; background: var(--gray-50); border-radius: 8px;">
                            <div style="width: 40px; height: 40px; background: var(--blue-pale); color: var(--blue-mid); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 18px;"><i class="fa-solid ${doc.icon}"></i></div>
                            <div>
                                <h4 style="font-size: 14px; font-weight: 600;">${doc.title}</h4>
                            </div>
                        </div>
                        <div>
                            <div class="fee-row"><span class="label">Processing Time</span><span class="value">${doc.time}</span></div>
                            <div class="fee-row"><span class="label">Processing Fee</span><span class="value big">${doc.fee}</span></div>
                        </div>
                    </div>
                    <div class="modal-foot">
                        <button class="btn-outline" style="width: auto;" onclick="window.closeModal()">Cancel</button>
                        <button class="btn-primary" style="width: auto;" onclick='window.openPurpose(${JSON.stringify(doc).replace(/"/g, "&quot;")})'>Continue</button>
                    </div>
                </div>
            </div>`;
        }

        if (state.activeModal === 'purpose') {
            const purposes = [
                { title: 'Employment / Work', desc: 'Job applications or employment verification' },
                { title: 'Working / Studying Abroad', desc: 'International opportunities requiring authentication' },
                { title: 'Board Exam / Licensure', desc: 'Professional board examinations' },
                { title: 'Other Purpose', desc: 'General requirement' }
            ];
            return `
            <div class="modal-overlay">
                <div class="modal-box">
                    <div class="modal-head">
                        <h3>Select Purpose</h3>
                        <button class="modal-close" onclick="window.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <div class="modal-body">
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            ${purposes.map(p => `
                                <div style="padding: 16px; border: 1px solid var(--gray-200); border-radius: 8px; cursor: pointer; transition: border-color .2s;" onmouseover="this.style.borderColor='var(--brand-primary)'" onmouseout="this.style.borderColor='var(--gray-200)'" onclick='window.openVerify(${JSON.stringify(state.selectedDocument).replace(/"/g, "&quot;")})'>
                                    <h4 style="font-size: 14px; font-weight: 600; color: var(--gray-900);">${p.title}</h4>
                                    <p style="font-size: 12px; color: var(--gray-500); margin-top: 4px;">${p.desc}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>`;
        }

        if (state.activeModal === 'verify') {
            return `
            <div class="modal-overlay">
                <div class="modal-box">
                    <div class="modal-head">
                        <h3>Security Check</h3>
                        <button class="modal-close" onclick="window.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <div class="modal-body">
                        <p style="font-size: 13px; color: var(--gray-600);">Please enter your password to confirm this request.</p>
                        <div class="form-group" style="margin-bottom: 0;">
                            <label class="form-label">Password</label>
                            <input type="password" class="form-input" placeholder="Enter your password">
                        </div>
                    </div>
                    <div class="modal-foot">
                        <button class="btn-outline" style="width: auto;" onclick="window.closeModal()">Cancel</button>
                        <button class="btn-primary" style="width: auto;" onclick="window.submitRequest()">Confirm Request</button>
                    </div>
                </div>
            </div>`;
        }

        if (state.activeModal === 'payment-verify' && state.selectedPayment) {
            const payment = state.selectedPayment;
            return `
            <div class="modal-overlay">
                <div class="modal-box">
                    <div class="modal-head">
                        <h3>Verify Payment</h3>
                        <button class="modal-close" onclick="window.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <div class="modal-body" style="text-align: center;">
                        <div style="font-size: 36px; font-weight: 700; color: var(--gray-900); margin-bottom: 8px;">${payment.amount}</div>
                        <div style="font-size: 14px; color: var(--gray-600);">${payment.student}</div>
                        <div style="font-size: 12px; color: var(--gray-400); margin-top: 4px;">Ref: ${payment.id}</div>
                    </div>
                    <div class="modal-foot">
                        <button class="btn-outline" style="width: auto;" onclick="window.closeModal()">Cancel</button>
                        <button class="btn-primary" style="width: auto;" onclick="window.confirmPaymentVerification()">Mark as Verified</button>
                    </div>
                </div>
            </div>`;
        }

        if (state.activeModal === 'qr-code' && state.selectedDocument) {
            const log = state.selectedDocument;
            return `
            <div class="modal-overlay">
                <div class="modal-box" style="max-width:340px;">
                    <div class="modal-head">
                        <h3>Reference QR</h3>
                        <button class="modal-close" onclick="window.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <div class="modal-body" style="text-align:center;">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(log.qr)}" alt="QR Code" style="width:200px;height:200px;margin:auto;display:block;">
                        <div style="margin-top:16px;font-size:13px;color:var(--gray-600);">Request ID: <strong>${log.id}</strong></div>
                    </div>
                </div>
            </div>`;
        }

        if (state.activeModal === 'staff-profile' && state.selectedStaffProfile) {
            const profile = state.selectedStaffProfile;
            const statusOptions = ['Submitted', 'Verified', 'Processed', 'Ready'];
            return `
            <div class="modal-overlay">
                <div class="modal-box">
                    <div class="modal-head">
                        <h3>Update Request Status</h3>
                        <button class="modal-close" onclick="window.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <div class="modal-body">
                        <div style="margin-bottom: 16px;">
                            <div style="font-size:16px; font-weight:600; color:var(--gray-900);">${profile.student}</div>
                            <div style="font-size:13px; color:var(--gray-500); margin-top: 4px;">${profile.doc}</div>
                        </div>
                        <div style="display: grid; gap: 8px;">
                            ${statusOptions.map(option => `
                                <button class="btn-outline" style="justify-content: flex-start; ${profile.status === option ? 'background: var(--blue-pale); border-color: var(--blue-mid); color: var(--blue-mid);' : ''}" onclick="window.changeRequestStatus('${profile.id}', '${option}')">
                                    <i class="fa-solid ${profile.status === option ? 'fa-circle-dot' : 'fa-circle'}" style="font-size: 12px; margin-right: 8px;"></i>
                                    Set to ${option}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>`;
        }

        if (state.activeModal === 'rush-confirm') {
            return `
            <div class="modal-overlay">
                <div class="modal-box">
                    <div class="modal-head">
                        <h3>Confirm Rush Processing</h3>
                        <button class="modal-close" onclick="window.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <div class="modal-body">
                        <p style="font-size: 14px; color: var(--gray-700);">Activating rush processing will add an additional fee to your request and expedite processing to 1-2 days.</p>
                    </div>
                    <div class="modal-foot">
                        <button class="btn-outline" style="width: auto;" onclick="window.closeModal()">Cancel</button>
                        <button class="btn-primary" style="width: auto; background: var(--orange-mid);" onclick="window.confirmRush()">Confirm Rush</button>
                    </div>
                </div>
            </div>`;
        }

        if (state.activeModal === 'pdf-preview') {
            const req = trackedRequests.find(r => r.id === state.activeTrackId);
            return `
            <div class="modal-overlay">
                <div class="modal-box" style="max-width:500px;">
                    <div class="modal-head">
                        <h3>Document Preview</h3>
                        <button class="modal-close" onclick="window.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <div class="modal-body">
                        <div class="pdf-preview" style="text-align: center; border: 1px solid var(--gray-200); padding: 32px; border-radius: 8px;">
                            <h3 style="font-size: 14px; font-weight: 700; color: var(--gray-900); margin-bottom: 24px;">ATENEO DE DAVAO UNIVERSITY</h3>
                            <div style="font-size: 18px; font-weight: 700; color: var(--gray-900); margin-bottom: 24px; text-transform: uppercase;">${req ? req.title : ''}</div>
                            <div style="font-size: 14px; color: var(--gray-700); margin-bottom: 12px;">This certifies that</div>
                            <div style="font-size: 20px; font-weight: 700; color: var(--gray-900); margin-bottom: 12px;">${state.user.name.toUpperCase()}</div>
                            <div style="font-size: 14px; color: var(--gray-700);">has completed the necessary requirements.</div>
                        </div>
                    </div>
                    <div class="modal-foot">
                        <button class="btn-primary" style="width: auto;" onclick="alert('Downloading PDF…'); window.closeModal()">Download PDF</button>
                    </div>
                </div>
            </div>`;
        }

        return '';
    }

    function viewLogin() {
        if (state.loginType === 'staff') {
            return viewStaffLogin();
        }
        return viewAlumniLogin();
    }

    function viewAlumniLogin() {
        return `
        <div class="login-shell">
            <div class="login-left">
                <div class="login-brand-block">
                    <div class="login-logo"><img src="aknight-01.png" alt="Logo"></div>
                    <h1>Student Portal</h1>
                    <p>Alumni Knights' Hub</p>
                </div>
            </div>

            <div class="login-right">
                <div class="login-card">
                    <div class="login-card-header">
                        <h2>Sign In</h2>
                        <p>Access your academic records</p>
                    </div>

                    <form onsubmit="window.actionLogin(event)">
                        <div class="form-group">
                            <label class="form-label">Student Number</label>
                            <input type="text" class="form-input" placeholder="e.g. 20210001" required>
                        </div>
                        <div class="form-group">
                            <div class="form-row">
                                <label class="form-label">Password</label>
                                <a href="#" class="link-sm">Forgot password?</a>
                            </div>
                            <input type="password" class="form-input" placeholder="Enter password" required>
                        </div>
                        <button type="submit" class="btn-primary">Sign In</button>
                    </form>

                    <div class="divider"><span>OR</span></div>
                    <button class="btn-outline" onclick="window.actionLogin()">
                        <i class="fa-brands fa-google" style="color: var(--brand-primary);"></i>
                        Sign in with Google
                    </button>

                    <div style="margin-top: 32px; text-align: center;">
                        <button class="btn-outline" style="border: none; background: transparent; color: var(--gray-500);" onclick="window.setLoginType('staff')">
                            Staff Login &rarr;
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
    }

    function viewStaffLogin() {
        return `
        <div class="login-shell">
            <div class="login-left login-left-dark">
                <div class="login-brand-block">
                    <div class="login-logo"><img src="aknight-01.png" alt="Logo"></div>
                    <h1>Registrar Portal</h1>
                    <p>Staff Management System</p>
                </div>
            </div>

            <div class="login-right">
                <div class="login-card">
                    <div class="login-card-header">
                        <h2>Staff Login</h2>
                        <p>Secure system access</p>
                    </div>

                    <form onsubmit="window.actionLogin(event)">
                        <div class="form-group">
                            <label class="form-label">Staff ID</label>
                            <input type="text" class="form-input" placeholder="e.g. STAFF-2024" required>
                        </div>
                        <div class="form-group">
                            <div class="form-row">
                                <label class="form-label">Password</label>
                            </div>
                            <input type="password" class="form-input" placeholder="Enter password" required>
                        </div>
                        <button type="submit" class="btn-dark">Authenticate</button>
                    </form>

                    <div style="margin-top: 32px; text-align: center;">
                        <button class="btn-outline" style="border: none; background: transparent; color: var(--gray-500);" onclick="window.setLoginType('alumni')">
                            &larr; Back to Student Portal
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
    }

    render();

});