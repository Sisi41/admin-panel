// Sample data for the admin panel
const sampleData = {
    // Dashboard statistics
    statistics: {
        totalReports: 1247,
        pendingReports: 89,
        resolvedReports: 987,
        activeUsers: 2456
    },

    // Reports data
    reports: [
        {
            id: "REP-000001",
            title: "Broken Staircase in Science Building",
            description: "The staircase on the 3rd floor of the Science Building has broken handrails and loose steps, creating a safety hazard for students.",
            category: "infrastructure",
            priority: "high",
            status: "in_progress",
            location: {
                building: "Science Building",
                room: "Staircase 3A",
                coordinates: { lat: 51.754, lng: -1.254 },
                description: "Third floor main staircase"
            },
            submittedBy: "S123456",
            submittedDate: "2024-01-15T10:30:00Z",
            assignedTo: "Facilities Team",
            evidence: {
                images: [
                    "https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Broken+Handrail",
                    "https://via.placeholder.com/400x300/EF4444/FFFFFF?text=Loose+Steps"
                ],
                audio: [
                    "https://www.soundjay.com/button/beep-07.wav"
                ],
                documents: []
            },
            timeline: [
                {
                    action: "report_submitted",
                    performedBy: { name: "S123456" },
                    timestamp: "2024-01-15T10:30:00Z",
                    details: { method: "Mobile App" }
                },
                {
                    action: "status_updated",
                    performedBy: { name: "System" },
                    timestamp: "2024-01-15T11:00:00Z",
                    details: { from: "submitted", to: "under_review" }
                },
                {
                    action: "assignment",
                    performedBy: { name: "Admin" },
                    timestamp: "2024-01-15T11:30:00Z",
                    details: { assignedTo: "Facilities Team" }
                },
                {
                    action: "status_updated",
                    performedBy: { name: "Facilities Manager" },
                    timestamp: "2024-01-16T09:15:00Z",
                    details: { from: "under_review", to: "in_progress" }
                }
            ],
            resolution: {
                notes: [
                    {
                        content: "Initial assessment completed. Parts ordered for repair.",
                        addedBy: { name: "Facilities Manager" },
                        addedAt: "2024-01-16T09:15:00Z"
                    }
                ]
            }
        },
        {
            id: "REP-000002",
            title: "Harassment Incident Report",
            description: "Verbal harassment reported in library study area by unknown individual.",
            category: "harassment",
            priority: "critical",
            status: "under_review",
            location: {
                building: "Library",
                room: "Study Area B",
                coordinates: { lat: 51.755, lng: -1.253 },
                description: "Quiet study area near windows"
            },
            submittedBy: "S234567",
            submittedDate: "2024-01-15T14:20:00Z",
            assignedTo: "Security Office",
            evidence: {
                images: [],
                audio: [
                    "https://www.soundjay.com/button/beep-07.wav"
                ],
                documents: []
            },
            anonymous: true
        },
        {
            id: "REP-000003",
            title: "Flickering Lights in Lecture Hall",
            description: "Lights in Lecture Hall A are flickering intermittently, causing discomfort during lectures.",
            category: "infrastructure",
            priority: "medium",
            status: "submitted",
            location: {
                building: "Main Building",
                room: "Lecture Hall A",
                coordinates: { lat: 51.756, lng: -1.255 },
                description: "Main lecture hall, front section"
            },
            submittedBy: "S345678",
            submittedDate: "2024-01-14T16:45:00Z",
            assignedTo: null
        },
        {
            id: "REP-000004",
            title: "Medical Emergency - Student Assistance",
            description: "Student requires immediate medical attention in Student Union building.",
            category: "medical",
            priority: "critical",
            status: "resolved",
            location: {
                building: "Student Union",
                room: "Common Area",
                coordinates: { lat: 51.757, lng: -1.256 },
                description: "Near cafeteria entrance"
            },
            submittedBy: "S456789",
            submittedDate: "2024-01-14T09:15:00Z",
            assignedTo: "Campus Health",
            resolution: {
                description: "Student treated and referred to campus health services",
                resolvedBy: { name: "Health Officer" },
                resolvedAt: "2024-01-14T10:30:00Z",
                notes: [
                    {
                        content: "Student stabilized and transported to health center.",
                        addedBy: { name: "Health Officer" },
                        addedAt: "2024-01-14T10:00:00Z"
                    }
                ]
            }
        }
    ],

    // Users data
    users: [
        {
            id: "U1001",
            universityId: "S123456",
            name: "Alice Johnson",
            email: "alice.johnson@student.uoe.edu",
            role: "student",
            department: "Computer Science",
            faculty: "Engineering",
            status: "active",
            lastLogin: "2024-01-15T08:30:00Z",
            reportCount: 3,
            joinDate: "2023-09-15T00:00:00Z"
        },
        {
            id: "U1002",
            universityId: "F789012",
            name: "Dr. Michael Chen",
            email: "michael.chen@uoe.edu",
            role: "staff",
            department: "Engineering",
            faculty: "Engineering",
            status: "active",
            lastLogin: "2024-01-15T14:20:00Z",
            reportCount: 0,
            joinDate: "2020-08-01T00:00:00Z"
        },
        {
            id: "U1003",
            universityId: "A345678",
            name: "Sarah Williams",
            email: "sarah.williams@uoe.edu",
            role: "admin",
            department: "Administration",
            faculty: "Administration",
            status: "active",
            lastLogin: "2024-01-15T16:45:00Z",
            reportCount: 0,
            joinDate: "2019-03-15T00:00:00Z"
        },
        {
            id: "U1004",
            universityId: "S234567",
            name: "David Brown",
            email: "david.brown@student.uoe.edu",
            role: "student",
            department: "Medicine",
            faculty: "Medical Sciences",
            status: "active",
            lastLogin: "2024-01-14T11:15:00Z",
            reportCount: 1,
            joinDate: "2023-09-15T00:00:00Z"
        },
        {
            id: "U1005",
            universityId: "F456789",
            name: "Prof. Emma Davis",
            email: "emma.davis@uoe.edu",
            role: "department_head",
            department: "Law",
            faculty: "Social Sciences",
            status: "active",
            lastLogin: "2024-01-14T09:30:00Z",
            reportCount: 0,
            joinDate: "2018-01-15T00:00:00Z"
        }
    ],

    // Analytics data
    categoryStats: [
        { category: "infrastructure", count: 456 },
        { category: "security", count: 234 },
        { category: "harassment", count: 178 },
        { category: "medical", count: 145 },
        { category: "fire", count: 89 },
        { category: "other", count: 145 }
    ],

    monthlyTrend: [
        { month: "Jul", count: 98 },
        { month: "Aug", count: 112 },
        { month: "Sep", count: 134 },
        { month: "Oct", count: 156 },
        { month: "Nov", count: 143 },
        { month: "Dec", count: 121 },
        { month: "Jan", count: 89 }
    ],

    priorityStats: [
        { priority: "low", count: 345 },
        { priority: "medium", count: 567 },
        { priority: "high", count: 256 },
        { priority: "critical", count: 79 }
    ],

    // System settings
    categories: [
        "infrastructure",
        "security", 
        "harassment",
        "medical",
        "fire",
        "other"
    ],

    departments: [
        "Facilities Management",
        "Campus Security",
        "Student Affairs",
        "Health Services",
        "Human Resources",
        "IT Services"
    ],

    faculties: [
        "Engineering",
        "Medical Sciences",
        "Social Sciences",
        "Business",
        "Arts",
        "Law"
    ],

    // Recent activity
    recentActivity: [
        {
            id: 1,
            type: "report_submitted",
            title: "New report submitted",
            description: "Broken window in Library reported",
            timestamp: "2024-01-15T16:30:00Z",
            user: "S123456"
        },
        {
            id: 2,
            type: "status_updated",
            title: "Report status updated",
            description: "REP-000045 marked as resolved",
            timestamp: "2024-01-15T15:45:00Z",
            user: "Admin"
        },
        {
            id: 3,
            type: "user_registered",
            title: "New user registered",
            description: "John Smith joined the platform",
            timestamp: "2024-01-15T14:20:00Z",
            user: "System"
        },
        {
            id: 4,
            type: "assignment",
            title: "Report assigned",
            description: "REP-000067 assigned to Facilities Team",
            timestamp: "2024-01-15T13:15:00Z",
            user: "Admin"
        }
    ],

    // Location hotspots
    hotspots: [
        { location: "Science Building", count: 45, category: "infrastructure" },
        { location: "Library", count: 38, category: "security" },
        { location: "Student Union", count: 32, category: "harassment" },
        { location: "North Dormitories", count: 28, category: "infrastructure" },
        { location: "Engineering Building", count: 25, category: "medical" }
    ],

    // Resolution metrics
    resolutionMetrics: [
        { category: "infrastructure", avgResolutionTime: 5.2, successRate: 85 },
        { category: "security", avgResolutionTime: 2.1, successRate: 92 },
        { category: "harassment", avgResolutionTime: 7.8, successRate: 78 },
        { category: "medical", avgResolutionTime: 1.5, successRate: 95 },
        { category: "fire", avgResolutionTime: 3.2, successRate: 88 },
        { category: "other", avgResolutionTime: 4.5, successRate: 82 }
    ]
};

// Utility functions for data management
const DataManager = {
    // Get all reports with optional filtering
    getReports: function(filters = {}) {
        let filteredReports = [...sampleData.reports];
        
        if (filters.status) {
            filteredReports = filteredReports.filter(report => report.status === filters.status);
        }
        
        if (filters.category) {
            filteredReports = filteredReports.filter(report => report.category === filters.category);
        }
        
        if (filters.priority) {
            filteredReports = filteredReports.filter(report => report.priority === filters.priority);
        }
        
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filteredReports = filteredReports.filter(report => 
                report.title.toLowerCase().includes(searchTerm) ||
                report.id.toLowerCase().includes(searchTerm) ||
                report.location.building.toLowerCase().includes(searchTerm)
            );
        }
        
        return filteredReports;
    },

    // Get report by ID
    getReportById: function(id) {
        return sampleData.reports.find(report => report.id === id);
    },

    // Update report status
    updateReportStatus: function(reportId, newStatus) {
        const report = this.getReportById(reportId);
        if (report) {
            const oldStatus = report.status;
            report.status = newStatus;
            
            // Add to timeline
            if (!report.timeline) report.timeline = [];
            report.timeline.push({
                action: 'status_update',
                performedBy: { name: 'Admin' },
                timestamp: new Date().toISOString(),
                details: {
                    from: oldStatus,
                    to: newStatus
                }
            });
            return true;
        }
        return false;
    },

    // Assign report
    assignReport: function(reportId, assignee) {
        const report = this.getReportById(reportId);
        if (report) {
            report.assignedTo = assignee;
            report.status = 'under_review';
            
            // Add to timeline
            if (!report.timeline) report.timeline = [];
            report.timeline.push({
                action: 'assignment',
                performedBy: { name: 'Admin' },
                timestamp: new Date().toISOString(),
                details: {
                    assignedTo: assignee
                }
            });
            return true;
        }
        return false;
    },

    // Delete report
    deleteReport: function(reportId) {
        const index = sampleData.reports.findIndex(report => report.id === reportId);
        if (index > -1) {
            sampleData.reports.splice(index, 1);
            return true;
        }
        return false;
    },

    // Add resolution note
    addResolutionNote: function(reportId, note) {
        const report = this.getReportById(reportId);
        if (report) {
            if (!report.resolution) report.resolution = { notes: [] };
            if (!report.resolution.notes) report.resolution.notes = [];
            
            report.resolution.notes.push({
                content: note,
                addedBy: { name: 'Admin' },
                addedAt: new Date().toISOString()
            });
            return true;
        }
        return false;
    },

    // Get dashboard statistics
    getDashboardStats: function() {
        return sampleData.statistics;
    },

    // Get analytics data
    getAnalyticsData: function() {
        return {
            categoryStats: sampleData.categoryStats,
            monthlyTrend: sampleData.monthlyTrend,
            priorityStats: sampleData.priorityStats,
            hotspots: sampleData.hotspots,
            resolutionMetrics: sampleData.resolutionMetrics
        };
    },

    // Get users
    getUsers: function() {
        return sampleData.users;
    },

    // Update user role
    updateUserRole: function(userId, newRole) {
        const user = sampleData.users.find(u => u.id === userId);
        if (user) {
            user.role = newRole;
            return true;
        }
        return false;
    },

    // Update user status
    updateUserStatus: function(userId, newStatus) {
        const user = sampleData.users.find(u => u.id === userId);
        if (user) {
            user.status = newStatus;
            return true;
        }
        return false;
    },

    // Get recent activity
    getRecentActivity: function() {
        return sampleData.recentActivity;
    },

    // Get system settings
    getSystemSettings: function() {
        return {
            categories: sampleData.categories,
            departments: sampleData.departments,
            faculties: sampleData.faculties
        };
    },

    // Add new category
    addCategory: function(categoryName) {
        if (!sampleData.categories.includes(categoryName)) {
            sampleData.categories.push(categoryName);
            return true;
        }
        return false;
    },

    // Remove category
    removeCategory: function(categoryName) {
        const index = sampleData.categories.indexOf(categoryName);
        if (index > -1) {
            sampleData.categories.splice(index, 1);
            return true;
        }
        return false;
    },

    // Add new department
    addDepartment: function(departmentName) {
        if (!sampleData.departments.includes(departmentName)) {
            sampleData.departments.push(departmentName);
            return true;
        }
        return false;
    },

    // Remove department
    removeDepartment: function(departmentName) {
        const index = sampleData.departments.indexOf(departmentName);
        if (index > -1) {
            sampleData.departments.splice(index, 1);
            return true;
        }
        return false;
    }
};