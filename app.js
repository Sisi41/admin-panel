// Main Application JavaScript
class UOEAdminPanel {
    constructor() {
        this.currentPage = 1;
        this.reportsPerPage = 10;
        this.currentFilters = {};
        this.charts = {};
        this.chartsInitialized = false;
        this.selectedReports = new Set();
        this.init();
    }

    init() {
        this.setupEventListeners();
        setTimeout(() => {
            this.setupCharts();
            this.loadDashboard();
        }, 100);
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.switchSection(e.currentTarget.dataset.target);
            });
        });

        // Report filters
        const statusFilter = document.getElementById('status-filter');
        const categoryFilter = document.getElementById('category-filter');
        
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.currentFilters.status = e.target.value;
                this.loadReports();
            });
        }

        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentFilters.category = e.target.value;
                this.loadReports();
            });
        }

        // Pagination
        const prevPage = document.getElementById('prev-page');
        const nextPage = document.getElementById('next-page');
        
        if (prevPage) {
            prevPage.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.loadReports();
                }
            });
        }

        if (nextPage) {
            nextPage.addEventListener('click', () => {
                const totalPages = Math.ceil(DataManager.getReports(this.currentFilters).length / this.reportsPerPage);
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.loadReports();
                }
            });
        }

        // Export buttons
        const exportReports = document.getElementById('export-reports');
        if (exportReports) {
            exportReports.addEventListener('click', () => {
                this.exportReports();
            });
        }

        // Modal close
        const closeModal = document.querySelector('.close-modal');
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // Close modal when clicking outside
        const reportModal = document.getElementById('report-modal');
        if (reportModal) {
            reportModal.addEventListener('click', (e) => {
                if (e.target.id === 'report-modal') {
                    this.closeModal();
                }
            });
        }

        // Analytics period filter
        const analyticsPeriod = document.getElementById('analytics-period');
        if (analyticsPeriod) {
            analyticsPeriod.addEventListener('change', (e) => {
                this.loadAnalytics(e.target.value);
            });
        }

        // System settings - Add category
        const addCategoryBtn = document.querySelector('.add-category .btn');
        if (addCategoryBtn) {
            addCategoryBtn.addEventListener('click', () => {
                this.addNewCategory();
            });
        }

        // Export options
        document.querySelectorAll('.export-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const format = e.currentTarget.dataset.format;
                this.exportData(format);
            });
        });
    }

    switchSection(sectionName) {
        console.log('Switching to section:', sectionName);
        
        // Update active menu item
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        const activeMenuItem = document.querySelector(`[data-target="${sectionName}"]`);
        if (activeMenuItem) {
            activeMenuItem.classList.add('active');
        }

        // Update active section
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        const activeSection = document.getElementById(sectionName);
        if (activeSection) {
            activeSection.classList.add('active');
        }

        // Update page title
        const titles = {
            dashboard: 'Dashboard',
            reports: 'Report Management',
            users: 'User Management',
            analytics: 'Analytics & Insights',
            system: 'System Settings'
        };

        const pageTitle = document.getElementById('page-title');
        const pageSubtitle = document.getElementById('page-subtitle');
        
        if (pageTitle) pageTitle.textContent = titles[sectionName] || 'Dashboard';
        if (pageSubtitle) pageSubtitle.textContent = this.getSubtitle(sectionName);

        // Load section-specific data
        switch(sectionName) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'reports':
                this.loadReports();
                break;
            case 'users':
                this.loadUsers();
                break;
            case 'analytics':
                this.loadAnalytics();
                break;
            case 'system':
                this.loadSystemSettings();
                break;
        }
    }

    getSubtitle(section) {
        const subtitles = {
            dashboard: 'Welcome to UoE Safe Admin Panel',
            reports: 'Manage and monitor safety reports',
            users: 'Manage user accounts and permissions',
            analytics: 'View insights and trends',
            system: 'Configure system settings'
        };
        return subtitles[section] || 'UoE Safe Admin Panel';
    }

    loadDashboard() {
        console.log('Loading dashboard...');
        
        if (typeof DataManager === 'undefined') {
            console.error('DataManager is not defined');
            return;
        }

        const stats = DataManager.getDashboardStats();
        
        // Update statistics cards
        const totalReportsEl = document.getElementById('total-reports');
        const pendingReportsEl = document.getElementById('pending-reports');
        const resolvedReportsEl = document.getElementById('resolved-reports');
        const activeUsersEl = document.getElementById('active-users');
        
        if (totalReportsEl) totalReportsEl.textContent = stats.totalReports.toLocaleString();
        if (pendingReportsEl) pendingReportsEl.textContent = stats.pendingReports.toLocaleString();
        if (resolvedReportsEl) resolvedReportsEl.textContent = stats.resolvedReports.toLocaleString();
        if (activeUsersEl) activeUsersEl.textContent = stats.activeUsers.toLocaleString();

        // Load recent activity
        this.loadRecentActivity();

        // Load priority distribution
        this.loadPriorityStats();

        // Update charts only if they are initialized
        if (this.chartsInitialized) {
            this.updateCharts();
        }
    }

    loadRecentActivity() {
        const activityList = document.getElementById('recent-activity-list');
        if (!activityList) return;

        const activities = DataManager.getRecentActivity();

        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-${this.getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-meta">
                        ${activity.description} • ${this.formatTimeAgo(activity.timestamp)}
                    </div>
                </div>
            </div>
        `).join('');
    }

    getActivityIcon(type) {
        const icons = {
            report_submitted: 'file-alt',
            status_updated: 'sync',
            user_registered: 'user-plus',
            assignment: 'user-check'
        };
        return icons[type] || 'info-circle';
    }

    loadPriorityStats() {
        const priorityList = document.getElementById('priority-list');
        if (!priorityList) return;

        const priorities = DataManager.getAnalyticsData().priorityStats;

        priorityList.innerHTML = priorities.map(priority => `
            <div class="priority-item">
                <span>${priority.priority.toUpperCase()}</span>
                <span class="priority-badge badge-${priority.priority}">
                    ${priority.count} reports
                </span>
            </div>
        `).join('');
    }

    loadReports() {
        console.log('Loading reports...');
        
        const reports = DataManager.getReports(this.currentFilters);
        const startIndex = (this.currentPage - 1) * this.reportsPerPage;
        const paginatedReports = reports.slice(startIndex, startIndex + this.reportsPerPage);
        
        const tbody = document.getElementById('reports-table-body');
        if (!tbody) {
            console.log('Reports table body not found');
            return;
        }
        
        tbody.innerHTML = paginatedReports.map(report => `
            <tr>
                <td>${report.id}</td>
                <td>
                    <div class="font-medium">${report.title}</div>
                    <div class="text-sm text-gray-500">${report.location.building}</div>
                </td>
                <td class="capitalize">${report.category.replace('_', ' ')}</td>
                <td>
                    <span class="priority-badge badge-${report.priority}">
                        ${report.priority}
                    </span>
                </td>
                <td>
                    <span class="status-badge status-${report.status}">
                        ${report.status.replace('_', ' ')}
                    </span>
                </td>
                <td>${this.formatDate(report.submittedDate)}</td>
                <td>
                    <button class="text-blue-600 hover:text-blue-900 mr-3 view-report" data-id="${report.id}">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="text-green-600 hover:text-green-900 assign-report" data-id="${report.id}">
                        <i class="fas fa-user-check"></i> Assign
                    </button>
                </td>
            </tr>
        `).join('');

        // Update pagination
        this.updatePagination(reports.length);

        // Add bulk actions
        this.enableBulkActions();

        // Add event listeners to view buttons
        document.querySelectorAll('.view-report').forEach(button => {
            button.addEventListener('click', (e) => {
                const reportId = e.target.closest('button').dataset.id;
                this.showReportDetails(reportId);
            });
        });

        // Add event listeners to assign buttons
        document.querySelectorAll('.assign-report').forEach(button => {
            button.addEventListener('click', (e) => {
                const reportId = e.target.closest('button').dataset.id;
                this.assignReport(reportId);
            });
        });
    }

    enableBulkActions() {
        const table = document.querySelector('.data-table');
        if (!table) return;

        // Add checkboxes to table header and rows
        const thead = table.querySelector('thead tr');
        const tbody = table.querySelector('tbody');
        
        // Add bulk selection header if not exists
        if (!thead.querySelector('.bulk-select')) {
            thead.innerHTML = `
                <th class="bulk-select" style="width: 40px;">
                    <input type="checkbox" id="select-all-reports">
                </th>
                ${thead.innerHTML}
            `;
        }

        // Add checkboxes to each row
        tbody.querySelectorAll('tr').forEach((row, index) => {
            if (!row.querySelector('.bulk-select-checkbox')) {
                const reportId = row.querySelector('.view-report')?.dataset.id;
                row.innerHTML = `
                    <td class="bulk-select">
                        <input type="checkbox" class="bulk-select-checkbox" data-id="${reportId}">
                    </td>
                    ${row.innerHTML}
                `;
            }
        });

        // Add bulk actions toolbar
        this.addBulkActionsToolbar();
    }

    addBulkActionsToolbar() {
        const existingToolbar = document.getElementById('bulk-actions-toolbar');
        if (existingToolbar) existingToolbar.remove();

        const toolbar = document.createElement('div');
        toolbar.id = 'bulk-actions-toolbar';
        toolbar.className = 'bulk-actions-toolbar';
        toolbar.style.display = 'none';
        toolbar.innerHTML = `
            <div class="bulk-actions-content">
                <span id="selected-count">0 reports selected</span>
                <div class="bulk-actions-buttons">
                    <select id="bulk-status-action">
                        <option value="">Update Status</option>
                        <option value="under_review">Under Review</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </select>
                    <select id="bulk-assign-action">
                        <option value="">Assign To</option>
                        <option value="Facilities Team">Facilities Team</option>
                        <option value="Security Office">Security Office</option>
                        <option value="Campus Health">Campus Health</option>
                        <option value="HR Department">HR Department</option>
                    </select>
                    <button class="btn btn-danger" id="bulk-delete-action">
                        <i class="fas fa-trash"></i> Delete Selected
                    </button>
                </div>
            </div>
        `;

        const tableContainer = document.querySelector('.table-container');
        tableContainer.parentNode.insertBefore(toolbar, tableContainer);

        this.setupBulkActionEvents();
    }

    setupBulkActionEvents() {
        // Select all checkbox
        const selectAll = document.getElementById('select-all-reports');
        if (selectAll) {
            selectAll.addEventListener('change', (e) => {
                const checkboxes = document.querySelectorAll('.bulk-select-checkbox');
                checkboxes.forEach(checkbox => {
                    checkbox.checked = e.target.checked;
                });
                this.updateBulkActionsUI();
            });
        }

        // Individual checkboxes
        document.querySelectorAll('.bulk-select-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateBulkActionsUI();
            });
        });

        // Bulk status update
        const bulkStatus = document.getElementById('bulk-status-action');
        if (bulkStatus) {
            bulkStatus.addEventListener('change', (e) => {
                if (e.target.value) {
                    this.bulkUpdateStatus(e.target.value);
                    e.target.value = '';
                }
            });
        }

        // Bulk assignment
        const bulkAssign = document.getElementById('bulk-assign-action');
        if (bulkAssign) {
            bulkAssign.addEventListener('change', (e) => {
                if (e.target.value) {
                    this.bulkAssignReports(e.target.value);
                    e.target.value = '';
                }
            });
        }

        // Bulk delete
        const bulkDelete = document.getElementById('bulk-delete-action');
        if (bulkDelete) {
            bulkDelete.addEventListener('click', () => {
                this.bulkDeleteReports();
            });
        }
    }

    updateBulkActionsUI() {
        const selected = document.querySelectorAll('.bulk-select-checkbox:checked');
        const toolbar = document.getElementById('bulk-actions-toolbar');
        const countElement = document.getElementById('selected-count');
        
        if (selected.length > 0) {
            if (toolbar) toolbar.style.display = 'block';
            if (countElement) countElement.textContent = `${selected.length} reports selected`;
        } else {
            if (toolbar) toolbar.style.display = 'none';
        }
    }

    bulkUpdateStatus(newStatus) {
        const selectedReports = this.getSelectedReportIds();
        if (selectedReports.length === 0) {
            this.showNotification('Please select reports to update', 'error');
            return;
        }

        selectedReports.forEach(reportId => {
            DataManager.updateReportStatus(reportId, newStatus);
        });

        this.loadReports();
        this.showNotification(`Updated status for ${selectedReports.length} reports to ${newStatus.replace('_', ' ')}`, 'success');
    }

    bulkAssignReports(assignee) {
        const selectedReports = this.getSelectedReportIds();
        if (selectedReports.length === 0) {
            this.showNotification('Please select reports to assign', 'error');
            return;
        }

        selectedReports.forEach(reportId => {
            DataManager.assignReport(reportId, assignee);
        });

        this.loadReports();
        this.showNotification(`Assigned ${selectedReports.length} reports to ${assignee}`, 'success');
    }

    bulkDeleteReports() {
        const selectedReports = this.getSelectedReportIds();
        if (selectedReports.length === 0) {
            this.showNotification('Please select reports to delete', 'error');
            return;
        }

        if (confirm(`Are you sure you want to delete ${selectedReports.length} reports? This action cannot be undone.`)) {
            selectedReports.forEach(reportId => {
                DataManager.deleteReport(reportId);
            });
            this.loadReports();
            this.showNotification(`Deleted ${selectedReports.length} reports`, 'success');
        }
    }

    getSelectedReportIds() {
        const checkboxes = document.querySelectorAll('.bulk-select-checkbox:checked');
        return Array.from(checkboxes).map(cb => cb.dataset.id).filter(id => id);
    }

    updatePagination(totalReports) {
        const totalPages = Math.ceil(totalReports / this.reportsPerPage);
        const pageInfo = document.getElementById('page-info');
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        
        if (pageInfo) pageInfo.textContent = `Page ${this.currentPage} of ${totalPages}`;
        if (prevBtn) prevBtn.disabled = this.currentPage === 1;
        if (nextBtn) nextBtn.disabled = this.currentPage === totalPages;
    }

    showReportDetails(reportId) {
        const report = DataManager.getReportById(reportId);
        if (!report) {
            console.error('Report not found:', reportId);
            return;
        }

        const evidenceHTML = this.generateEvidenceHTML(report.evidence);
        const timelineHTML = this.generateTimelineHTML(report.timeline);
        const resolutionNotesHTML = this.generateResolutionNotesHTML(report.resolution?.notes);

        const modalContent = `
            <div class="report-details">
                <div class="detail-section">
                    <h4>Report Information</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Report ID:</label>
                            <span>${report.id}</span>
                        </div>
                        <div class="detail-item">
                            <label>Title:</label>
                            <span>${report.title}</span>
                        </div>
                        <div class="detail-item">
                            <label>Description:</label>
                            <span>${report.description || 'No description provided'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Category:</label>
                            <span class="capitalize">${report.category.replace('_', ' ')}</span>
                        </div>
                        <div class="detail-item">
                            <label>Priority:</label>
                            <span class="priority-badge badge-${report.priority}">${report.priority}</span>
                        </div>
                        <div class="detail-item">
                            <label>Status:</label>
                            <span class="status-badge status-${report.status}">${report.status.replace('_', ' ')}</span>
                        </div>
                        <div class="detail-item">
                            <label>Submitted By:</label>
                            <span>${report.submittedBy}</span>
                        </div>
                        <div class="detail-item">
                            <label>Submitted Date:</label>
                            <span>${this.formatDate(report.submittedDate)}</span>
                        </div>
                        <div class="detail-item">
                            <label>Assigned To:</label>
                            <span>${report.assignedTo || 'Not assigned'}</span>
                        </div>
                    </div>
                </div>

                <div class="detail-section">
                    <h4>Location Details</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Building:</label>
                            <span>${report.location.building}</span>
                        </div>
                        <div class="detail-item">
                            <label>Room/Area:</label>
                            <span>${report.location.room || 'Not specified'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Location Description:</label>
                            <span>${report.location.description || 'Not specified'}</span>
                        </div>
                        <div class="detail-item">
                            <label>Coordinates:</label>
                            <span>${report.location.coordinates ? `${report.location.coordinates.lat}, ${report.location.coordinates.lng}` : 'Not available'}</span>
                        </div>
                    </div>
                </div>

                ${evidenceHTML}

                ${resolutionNotesHTML}

                <div class="detail-section">
                    <h4>Report Timeline</h4>
                    <div class="timeline">
                        ${timelineHTML}
                    </div>
                </div>

                <div class="detail-actions">
                    <select onchange="adminPanel.updateReportStatus('${report.id}', this.value)" class="status-select">
                        <option value="">Change Status</option>
                        <option value="submitted" ${report.status === 'submitted' ? 'selected' : ''}>Submitted</option>
                        <option value="under_review" ${report.status === 'under_review' ? 'selected' : ''}>Under Review</option>
                        <option value="in_progress" ${report.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
                        <option value="resolved" ${report.status === 'resolved' ? 'selected' : ''}>Resolved</option>
                        <option value="closed" ${report.status === 'closed' ? 'selected' : ''}>Closed</option>
                    </select>
                    
                    <select onchange="adminPanel.assignReport('${report.id}', this.value)" class="assign-select">
                        <option value="">Assign to...</option>
                        <option value="Facilities Team" ${report.assignedTo === 'Facilities Team' ? 'selected' : ''}>Facilities Team</option>
                        <option value="Security Office" ${report.assignedTo === 'Security Office' ? 'selected' : ''}>Security Office</option>
                        <option value="Campus Health" ${report.assignedTo === 'Campus Health' ? 'selected' : ''}>Campus Health</option>
                        <option value="HR Department" ${report.assignedTo === 'HR Department' ? 'selected' : ''}>HR Department</option>
                    </select>

                    <button class="btn btn-primary" onclick="adminPanel.addResolutionNote('${report.id}')">
                        <i class="fas fa-comment"></i> Add Note
                    </button>
                </div>
            </div>
        `;

        document.getElementById('report-details').innerHTML = modalContent;
        document.getElementById('report-modal').style.display = 'block';
    }

    generateEvidenceHTML(evidence) {
        if (!evidence || (!evidence.images?.length && !evidence.audio?.length)) {
            return '<div class="detail-section"><h4>Evidence</h4><p>No evidence attached</p></div>';
        }

        let html = '<div class="detail-section"><h4>Evidence</h4>';
        
        if (evidence.images && evidence.images.length > 0) {
            html += '<div class="evidence-section"><h5>Images</h5><div class="image-gallery">';
            evidence.images.forEach(img => {
                html += `<div class="evidence-item"><img src="${img}" alt="Evidence image" onclick="adminPanel.openImageModal('${img}')"></div>`;
            });
            html += '</div></div>';
        }

        if (evidence.audio && evidence.audio.length > 0) {
            html += '<div class="evidence-section"><h5>Audio Recordings</h5><div class="audio-gallery">';
            evidence.audio.forEach(audio => {
                html += `<div class="evidence-item"><audio controls><source src="${audio}" type="audio/mpeg">Your browser does not support the audio element.</audio></div>`;
            });
            html += '</div></div>';
        }

        html += '</div>';
        return html;
    }

    generateResolutionNotesHTML(notes) {
        if (!notes || notes.length === 0) {
            return '<div class="detail-section"><h4>Resolution Notes</h4><p>No resolution notes added</p></div>';
        }

        let html = '<div class="detail-section"><h4>Resolution Notes</h4><div class="resolution-notes">';
        notes.forEach(note => {
            html += `
                <div class="resolution-note">
                    <div class="note-content">${note.content}</div>
                    <div class="note-meta">Added by ${note.addedBy.name} • ${this.formatTimeAgo(note.addedAt)}</div>
                </div>
            `;
        });
        html += '</div></div>';
        return html;
    }

    generateTimelineHTML(timeline) {
        if (!timeline || timeline.length === 0) {
            return '<p>No timeline events</p>';
        }

        // Sort timeline by timestamp
        const sortedTimeline = [...timeline].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        return sortedTimeline.map(event => `
            <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                    <div class="timeline-title">${event.action.replace('_', ' ')}</div>
                    <div class="timeline-meta">
                        By ${event.performedBy?.name || 'System'} • ${this.formatTimeAgo(event.timestamp)}
                    </div>
                    ${event.details ? `<div class="timeline-details">${JSON.stringify(event.details, null, 2)}</div>` : ''}
                </div>
            </div>
        `).join('');
    }

    openImageModal(imageUrl) {
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.style.display = 'block';
        modal.innerHTML = `
            <div class="image-modal-content">
                <span class="close-image-modal">&times;</span>
                <img src="${imageUrl}" alt="Full size evidence">
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('.close-image-modal').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    closeModal() {
        const reportModal = document.getElementById('report-modal');
        if (reportModal) {
            reportModal.style.display = 'none';
        }
    }

    updateReportStatus(reportId, status) {
        if (!status) return;
        
        if (DataManager.updateReportStatus(reportId, status)) {
            this.loadReports();
            this.closeModal();
            this.showNotification('Report status updated successfully!', 'success');
        }
    }

    assignReport(reportId, assignee = null) {
        if (!assignee) {
            // Show assignment dialog
            assignee = prompt('Enter assignee name or select from options:\n\n- Facilities Team\n- Security Office\n- Campus Health\n- HR Department');
        }
        
        if (assignee && DataManager.assignReport(reportId, assignee)) {
            this.loadReports();
            if (document.getElementById('report-modal').style.display === 'block') {
                this.closeModal();
            }
            this.showNotification('Report assigned successfully!', 'success');
        }
    }

    addResolutionNote(reportId) {
        const note = prompt('Enter resolution note:');
        if (note && note.trim()) {
            DataManager.addResolutionNote(reportId, note);
            this.showReportDetails(reportId); // Refresh the view
            this.showNotification('Note added successfully', 'success');
        }
    }

    loadUsers() {
        console.log('Loading users...');
        
        const users = DataManager.getUsers();
        const tbody = document.getElementById('users-table-body');
        if (!tbody) {
            console.log('Users table body not found');
            return;
        }
        
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.universityId}</td>
                <td>
                    <div class="user-display">
                        <div class="user-avatar-small">${user.name.charAt(0)}</div>
                        <div>
                            <div class="font-medium">${user.name}</div>
                            <div class="text-sm text-gray-500">${user.email}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <select class="role-select" onchange="adminPanel.updateUserRole('${user.id}', this.value)">
                        <option value="student" ${user.role === 'student' ? 'selected' : ''}>Student</option>
                        <option value="staff" ${user.role === 'staff' ? 'selected' : ''}>Staff</option>
                        <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                        <option value="department_head" ${user.role === 'department_head' ? 'selected' : ''}>Department Head</option>
                    </select>
                </td>
                <td>${user.department}</td>
                <td>${user.faculty}</td>
                <td>
                    <span class="status-badge status-${user.status}">
                        ${user.status}
                    </span>
                </td>
                <td>${user.reportCount || 0}</td>
                <td>
                    <div class="flex gap-2">
                        <button class="text-blue-600 hover:text-blue-900" onclick="adminPanel.editUser('${user.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="${user.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}" 
                                onclick="adminPanel.toggleUserStatus('${user.id}')">
                            <i class="fas fa-${user.status === 'active' ? 'ban' : 'check'}"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    updateUserRole(userId, newRole) {
        if (DataManager.updateUserRole(userId, newRole)) {
            this.showNotification(`User role updated to ${newRole}`, 'success');
        }
    }

    toggleUserStatus(userId) {
        const user = DataManager.getUsers().find(u => u.id === userId);
        if (user) {
            const newStatus = user.status === 'active' ? 'suspended' : 'active';
            if (DataManager.updateUserStatus(userId, newStatus)) {
                this.loadUsers();
                this.showNotification(`User ${newStatus === 'active' ? 'activated' : 'suspended'}`, 'success');
            }
        }
    }

    editUser(userId) {
        const user = DataManager.getUsers().find(u => u.id === userId);
        if (user) {
            const newDept = prompt('Enter new department:', user.department);
            if (newDept) {
                user.department = newDept;
                this.loadUsers();
                this.showNotification('User department updated', 'success');
            }
        }
    }

    loadAnalytics(period = '30d') {
        console.log('Loading analytics for period:', period);
        
        const analytics = DataManager.getAnalyticsData();
        
        // Update hotspots
        this.loadHotspots(analytics.hotspots);
        
        // Update resolution metrics
        this.loadResolutionMetrics(analytics.resolutionMetrics);
        
        // Update charts with period data
        this.updateAnalyticsCharts(period);
    }

    loadHotspots(hotspots) {
        const hotspotList = document.getElementById('hotspot-list');
        if (!hotspotList) {
            console.log('Hotspot list not found');
            return;
        }
        
        hotspotList.innerHTML = hotspots.map(hotspot => `
            <div class="hotspot-item">
                <div class="flex justify-between items-center mb-2">
                    <span class="font-medium">${hotspot.location}</span>
                    <span class="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                        ${hotspot.count} reports
                    </span>
                </div>
                <div class="text-sm text-gray-600 capitalize">
                    Main issue: ${hotspot.category.replace('_', ' ')}
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div class="bg-red-600 h-2 rounded-full" style="width: ${(hotspot.count / 45) * 100}%"></div>
                </div>
            </div>
        `).join('');
    }

    loadResolutionMetrics(metrics) {
        const metricsContainer = document.getElementById('resolution-metrics');
        if (!metricsContainer) return;

        metricsContainer.innerHTML = metrics.map(metric => `
            <div class="metric-item">
                <div class="flex justify-between items-center mb-2">
                    <span class="font-medium capitalize">${metric.category.replace('_', ' ')}</span>
                    <span class="text-sm">${metric.avgResolutionTime} days</span>
                </div>
                <div class="flex justify-between items-center text-sm text-gray-600">
                    <span>Success Rate</span>
                    <span class="font-medium ${metric.successRate >= 90 ? 'text-green-600' : metric.successRate >= 80 ? 'text-yellow-600' : 'text-red-600'}">
                        ${metric.successRate}%
                    </span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div class="h-2 rounded-full ${metric.successRate >= 90 ? 'bg-green-600' : metric.successRate >= 80 ? 'bg-yellow-600' : 'bg-red-600'}" 
                         style="width: ${metric.successRate}%"></div>
                </div>
            </div>
        `).join('');
    }

    loadSystemSettings() {
        console.log('Loading system settings...');
        
        const settings = DataManager.getSystemSettings();
        
        // Load categories
        const categoriesList = document.getElementById('categories-list');
        if (categoriesList) {
            categoriesList.innerHTML = settings.categories.map(category => `
                <div class="category-item">
                    <span class="capitalize">${category}</span>
                    <div>
                        <button class="text-blue-600 hover:text-blue-800 mr-2" onclick="adminPanel.editCategory('${category}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="text-red-600 hover:text-red-800" onclick="adminPanel.removeCategory('${category}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }

        // Load departments
        const departmentsList = document.getElementById('departments-list');
        if (departmentsList) {
            departmentsList.innerHTML = settings.departments.map(dept => `
                <div class="department-item">
                    <span>${dept}</span>
                    <div>
                        <button class="text-blue-600 hover:text-blue-800 mr-2" onclick="adminPanel.editDepartment('${dept}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="text-red-600 hover:text-red-800" onclick="adminPanel.removeDepartment('${dept}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }

        // Load priority settings
        const prioritySettings = document.getElementById('priority-settings');
        if (prioritySettings) {
            prioritySettings.innerHTML = `
                <div class="priority-setting">
                    <label>Low Priority Response Time:</label>
                    <input type="number" value="72" class="w-20 p-1 border rounded"> hours
                </div>
                <div class="priority-setting">
                    <label>Medium Priority Response Time:</label>
                    <input type="number" value="48" class="w-20 p-1 border rounded"> hours
                </div>
                <div class="priority-setting">
                    <label>High Priority Response Time:</label>
                    <input type="number" value="24" class="w-20 p-1 border rounded"> hours
                </div>
                <div class="priority-setting">
                    <label>Critical Priority Response Time:</label>
                    <input type="number" value="4" class="w-20 p-1 border rounded"> hours
                </div>
            `;
        }

        // Add export options section
        const exportSection = document.querySelector('.export-section');
        if (!exportSection) {
            const systemSection = document.getElementById('system');
            const exportHTML = `
                <div class="export-section">
                    <div class="section-header">
                        <h2>Export Data</h2>
                    </div>
                    <div class="export-options">
                        <div class="export-option" data-format="pdf">
                            <i class="fas fa-file-pdf"></i>
                            <h4>Export as PDF</h4>
                            <p>Generate comprehensive PDF reports</p>
                        </div>
                        <div class="export-option" data-format="excel">
                            <i class="fas fa-file-excel"></i>
                            <h4>Export as Excel</h4>
                            <p>Download data in spreadsheet format</p>
                        </div>
                        <div class="export-option" data-format="csv">
                            <i class="fas fa-file-csv"></i>
                            <h4>Export as CSV</h4>
                            <p>Simple comma-separated values</p>
                        </div>
                    </div>
                </div>
            `;
            systemSection.innerHTML += exportHTML;

            // Add event listeners to export options
            document.querySelectorAll('.export-option').forEach(option => {
                option.addEventListener('click', (e) => {
                    const format = e.currentTarget.dataset.format;
                    this.exportData(format);
                });
            });
        }
    }

    addNewCategory() {
        const input = document.querySelector('.add-category input');
        const categoryName = input?.value.trim();
        if (categoryName && DataManager.addCategory(categoryName)) {
            this.loadSystemSettings();
            input.value = '';
            this.showNotification('Category added successfully', 'success');
        }
    }

    removeCategory(categoryName) {
        if (confirm(`Are you sure you want to remove the "${categoryName}" category?`)) {
            if (DataManager.removeCategory(categoryName)) {
                this.loadSystemSettings();
                this.showNotification('Category removed successfully', 'success');
            }
        }
    }

    editCategory(oldName) {
        const newName = prompt('Enter new category name:', oldName);
        if (newName && newName.trim() && newName !== oldName) {
            if (DataManager.removeCategory(oldName) && DataManager.addCategory(newName)) {
                this.loadSystemSettings();
                this.showNotification('Category updated successfully', 'success');
            }
        }
    }

    removeDepartment(departmentName) {
        if (confirm(`Are you sure you want to remove the "${departmentName}" department?`)) {
            if (DataManager.removeDepartment(departmentName)) {
                this.loadSystemSettings();
                this.showNotification('Department removed successfully', 'success');
            }
        }
    }

    editDepartment(oldName) {
        const newName = prompt('Enter new department name:', oldName);
        if (newName && newName.trim() && newName !== oldName) {
            if (DataManager.removeDepartment(oldName) && DataManager.addDepartment(newName)) {
                this.loadSystemSettings();
                this.showNotification('Department updated successfully', 'success');
            }
        }
    }

    setupCharts() {
        console.log('Setting up charts...');
        
        // Destroy existing charts if they exist
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });

        // Category Chart (Pie) - Dashboard
        const categoryCtx = document.getElementById('categoryChart');
        if (categoryCtx) {
            this.charts.categoryChart = new Chart(categoryCtx, {
                type: 'pie',
                data: {
                    labels: ['Infrastructure', 'Security', 'Harassment', 'Medical', 'Fire', 'Other'],
                    datasets: [{
                        data: [456, 234, 178, 145, 89, 145],
                        backgroundColor: [
                            '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#64748b'
                        ],
                        borderWidth: 2,
                        borderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                usePointStyle: true
                            }
                        },
                        title: {
                            display: false
                        }
                    }
                }
            });
        }

        // Trend Chart (Line) - Dashboard
        const trendCtx = document.getElementById('trendChart');
        if (trendCtx) {
            this.charts.trendChart = new Chart(trendCtx, {
                type: 'line',
                data: {
                    labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
                    datasets: [{
                        label: 'Reports',
                        data: [98, 112, 134, 156, 143, 121, 89],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        fill: true,
                        borderWidth: 3
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                drawBorder: false
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }

        // Time Chart (Bar) - Analytics
        const timeCtx = document.getElementById('timeChart');
        if (timeCtx) {
            this.charts.timeChart = new Chart(timeCtx, {
                type: 'bar',
                data: {
                    labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
                    datasets: [{
                        label: 'Reports',
                        data: [98, 112, 134, 156, 143, 121, 89],
                        backgroundColor: '#3b82f6',
                        borderWidth: 0,
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        // Resolution Chart (Bar) - Analytics
        const resolutionCtx = document.getElementById('resolutionChart');
        if (resolutionCtx) {
            this.charts.resolutionChart = new Chart(resolutionCtx, {
                type: 'bar',
                data: {
                    labels: ['Infrastructure', 'Security', 'Harassment', 'Medical', 'Fire', 'Other'],
                    datasets: [{
                        label: 'Average Resolution (days)',
                        data: [5.2, 2.1, 7.8, 1.5, 3.2, 4.5],
                        backgroundColor: '#10b981',
                        borderWidth: 0,
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Days'
                            }
                        }
                    }
                }
            });
        }

        this.chartsInitialized = true;
        console.log('Charts initialized');
    }

    updateCharts() {
        // Charts are automatically updated with static data
        console.log('Charts updated');
    }

    updateAnalyticsCharts(period) {
        // Update charts based on selected period
        console.log('Updating analytics charts for period:', period);
    }

    exportReports() {
        const reports = DataManager.getReports(this.currentFilters);
        this.exportData('csv', reports);
    }

    exportData(format, data = null) {
        let content, filename, mimeType;

        switch (format) {
            case 'pdf':
                this.showNotification('PDF export feature would be implemented with a PDF library', 'info');
                return;
            case 'excel':
                this.showNotification('Excel export feature would be implemented with a spreadsheet library', 'info');
                return;
            case 'csv':
            default:
                const reports = data || DataManager.getReports();
                let csv = 'Report ID,Title,Category,Priority,Status,Location,Submitted Date,Assigned To\n';
                
                reports.forEach(report => {
                    csv += `"${report.id}","${report.title}","${report.category}","${report.priority}","${report.status}","${report.location.building}","${this.formatDate(report.submittedDate)}","${report.assignedTo || ''}"\n`;
                });

                content = csv;
                filename = `uoe-reports-${new Date().toISOString().split('T')[0]}.csv`;
                mimeType = 'text/csv';
        }

        // Create and download file
        const blob = new Blob([content], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        this.showNotification(`Data exported as ${format.toUpperCase()} successfully!`, 'success');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        }`;
        notification.textContent = message;
        notification.style.zIndex = '10000';

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        
        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            return `${diffInHours} hours ago`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays} days ago`;
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing admin panel...');
    
    // Check if DataManager is available
    if (typeof DataManager === 'undefined') {
        console.error('DataManager is not defined. Please check that data/sample-data.js is loaded correctly.');
        // Create a fallback DataManager
        window.DataManager = {
            getDashboardStats: () => ({ totalReports: 0, pendingReports: 0, resolvedReports: 0, activeUsers: 0 }),
            getReports: () => [],
            getReportById: () => null,
            updateReportStatus: () => false,
            assignReport: () => false,
            deleteReport: () => false,
            addResolutionNote: () => false,
            getUsers: () => [],
            updateUserRole: () => false,
            updateUserStatus: () => false,
            getAnalyticsData: () => ({ categoryStats: [], monthlyTrend: [], priorityStats: [], hotspots: [], resolutionMetrics: [] }),
            getRecentActivity: () => [],
            getSystemSettings: () => ({ categories: [], departments: [], faculties: [] }),
            addCategory: () => false,
            removeCategory: () => false,
            addDepartment: () => false,
            removeDepartment: () => false
        };
    }
    
    window.adminPanel = new UOEAdminPanel();
});