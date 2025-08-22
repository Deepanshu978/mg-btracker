// Global variables
let transactions = [];
let nextId = 1;
let charts = {};

// Budget goals from the provided data
const budgetGoals = {
    monthlyIncome: 3000,
    monthlySavingsGoal: 600,
    monthlyExpenseLimit: 2000
};

// Sample transactions data
const sampleTransactions = [
    {
        id: 1,
        date: "2025-08-15",
        description: "Salary",
        amount: 3000,
        type: "Income",
        category: "Salary"
    },
    {
        id: 2,
        date: "2025-08-16",
        description: "Grocery Shopping",
        amount: 150,
        type: "Expense",
        category: "Food"
    },
    {
        id: 3,
        date: "2025-08-17",
        description: "Gas Bill",
        amount: 80,
        type: "Expense",
        category: "Utilities"
    },
    {
        id: 4,
        date: "2025-08-18",
        description: "Emergency Fund",
        amount: 500,
        type: "Savings",
        category: "Investment"
    },
    {
        id: 5,
        date: "2025-08-19",
        description: "Movie Tickets",
        amount: 25,
        type: "Expense",
        category: "Entertainment"
    },
    {
        id: 6,
        date: "2025-08-10",
        description: "Freelance Work",
        amount: 500,
        type: "Income",
        category: "Other"
    },
    {
        id: 7,
        date: "2025-08-12",
        description: "Restaurant Dinner",
        amount: 45,
        type: "Expense",
        category: "Food"
    },
    {
        id: 8,
        date: "2025-08-14",
        description: "Investment Portfolio",
        amount: 200,
        type: "Savings",
        category: "Investment"
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    console.log('Initializing app...');

    // Load sample data
    transactions = [...sampleTransactions];
    nextId = Math.max(...transactions.map(t => t.id)) + 1;

    // Set current date
    updateCurrentDate();

    // Set default date for new transactions
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.valueAsDate = new Date();
    }

    // Initialize event listeners
    setupEventListeners();

    // Update dashboard data (but keep dashboard hidden)
    updateDashboardData();

    console.log('App initialized with', transactions.length, 'transactions');
}

function setupEventListeners() {
    console.log('Setting up event listeners...');

    // Connect button on landing page
    const connectBtn = document.getElementById('connectBtn');
    if (connectBtn) {
        connectBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Connect button clicked');
            enterDashboard();
        });
    }

    // Transaction form
    const transactionForm = document.getElementById('transactionForm');
    if (transactionForm) {
        transactionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Transaction form submitted');
            handleAddTransaction(e);
        });
    }

    // Edit form
    const editForm = document.getElementById('editForm');
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Edit form submitted');
            handleEditTransaction(e);
        });
    }

    // Modal close buttons
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            closeEditModal();
        });
    }

    const cancelEditBtn = document.getElementById('cancelEditBtn');
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', function(e) {
            e.preventDefault();
            closeEditModal();
        });
    }

    // Modal close on background click
    const editModal = document.getElementById('editModal');
    if (editModal) {
        editModal.addEventListener('click', function(e) {
            if (e.target === editModal) {
                closeEditModal();
            }
        });
    }
}

function updateCurrentDate() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        dateElement.textContent = now.toLocaleDateString('en-US', options);
    }
}

function enterDashboard() {
    console.log('Entering dashboard...');
    const landingPage = document.getElementById('landingPage');
    const dashboard = document.getElementById('dashboard');

    if (landingPage && dashboard) {
        // Hide landing page
        landingPage.classList.add('hidden');
        landingPage.style.display = 'none';

        // Show dashboard
        dashboard.classList.remove('hidden');
        dashboard.style.display = 'block';

        console.log('Dashboard displayed');

        // Initialize charts after dashboard is visible
        setTimeout(() => {
            initializeCharts();
            updateDashboard();
            console.log('Charts and dashboard updated');
        }, 200);
    } else {
        console.error('Landing page or dashboard element not found');
    }
}


function createGroup(event) {
    event.preventDefault();

    const groupName = document.getElementById('groupName').value.trim();
    const description = document.getElementById('groupDescription').value.trim();
    const members = document.getElementById('groupMembers').value.split(',').map(m => m.trim());

    if (!groupName) {
        alert('Group name is required.');
        return;
    }

    fetch('api/groups.php?action=create_group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ group_name: groupName, description, members })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Group created successfully!');
            document.getElementById('createGroupForm').reset();
            loadGroups(); // Refresh groups list
        } else {
            alert('Failed to create group: ' + data.error);
        }
    })
    .catch(err => {
        console.error('Error:', err);
        alert('Failed to create group');
    });
}











function handleAddTransaction(e) {
    e.preventDefault();
    console.log('Processing new transaction...');

    // Get form values directly from the form elements
    const description = document.getElementById('description').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    console.log('Form values:', { description, amount, type, category, date });

    // Validate transaction
    if (!description) {
        alert('Please enter a description');
        return;
    }

    if (!amount || amount <= 0) {
        alert('Please enter a valid amount greater than 0');
        return;
    }

    if (!type) {
        alert('Please select a transaction type');
        return;
    }

    if (!category) {
        alert('Please select a category');
        return;
    }

    if (!date) {
        alert('Please select a date');
        return;
    }

    const transaction = {
        id: nextId++,
        date: date,
        description: description,
        amount: amount,
        type: type,
        category: category
    };

    // Add transaction
    transactions.push(transaction);
    console.log('Transaction added:', transaction);

    // Reset form
    document.getElementById('transactionForm').reset();
    document.getElementById('date').valueAsDate = new Date();

    // Update dashboard
    updateDashboard();

    // Show success message
    alert('Transaction added successfully!');
}

function handleEditTransaction(e) {
    e.preventDefault();
    console.log('Processing edit transaction...');

    const id = parseInt(document.getElementById('editId').value);
    const transactionIndex = transactions.findIndex(t => t.id === id);

    if (transactionIndex === -1) {
        console.error('Transaction not found for editing');
        return;
    }

    transactions[transactionIndex] = {
        id: id,
        date: document.getElementById('editDate').value,
        description: document.getElementById('editDescription').value,
        amount: parseFloat(document.getElementById('editAmount').value),
        type: document.getElementById('editType').value,
        category: document.getElementById('editCategory').value
    };

    console.log('Transaction updated:', transactions[transactionIndex]);

    closeEditModal();
    updateDashboard();
    alert('Transaction updated successfully!');
}

function editTransaction(id) {
    console.log('Editing transaction:', id);
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) {
        console.error('Transaction not found:', id);
        return;
    }

    document.getElementById('editId').value = transaction.id;
    document.getElementById('editDescription').value = transaction.description;
    document.getElementById('editAmount').value = transaction.amount;
    document.getElementById('editType').value = transaction.type;
    document.getElementById('editCategory').value = transaction.category;
    document.getElementById('editDate').value = transaction.date;

    document.getElementById('editModal').classList.remove('hidden');
}

function deleteTransaction(id) {
    console.log('Deleting transaction:', id);
    if (confirm('Are you sure you want to delete this transaction?')) {
        transactions = transactions.filter(t => t.id !== id);
        updateDashboard();
        console.log('Transaction deleted');
    }
}

function closeEditModal() {
    const modal = document.getElementById('editModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function updateDashboard() {
    console.log('Updating dashboard...');
    updateSummaryCards();
    updateTransactionHistory();
    updateCharts();
    updateBudgetAnalysis();
}

function updateDashboardData() {
    updateSummaryCards();
    updateTransactionHistory();
    updateBudgetAnalysis();
}

function updateSummaryCards() {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const currentMonthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
    });

    const income = currentMonthTransactions
        .filter(t => t.type === 'Income')
        .reduce((sum, t) => sum + t.amount, 0);

    const expenses = currentMonthTransactions
        .filter(t => t.type === 'Expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const savings = currentMonthTransactions
        .filter(t => t.type === 'Savings')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalBalance = income - expenses - savings;

    const totalBalanceEl = document.getElementById('totalBalance');
    const totalSpentEl = document.getElementById('totalSpent');
    const totalSavedEl = document.getElementById('totalSaved');

    if (totalBalanceEl) totalBalanceEl.textContent = formatCurrency(totalBalance);
    if (totalSpentEl) totalSpentEl.textContent = formatCurrency(expenses);
    if (totalSavedEl) totalSavedEl.textContent = formatCurrency(savings);

    console.log('Summary updated:', { income, expenses, savings, totalBalance });
}

function updateTransactionHistory() {
    const tbody = document.getElementById('transactionTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    // Sort transactions by date (newest first)
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedTransactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.className = `transaction-row ${transaction.type.toLowerCase()}`;

        row.innerHTML = `
            <td>${formatDate(transaction.date)}</td>
            <td>${escapeHtml(transaction.description)}</td>
            <td><span class="status status--${transaction.type.toLowerCase()}">${escapeHtml(transaction.category)}</span></td>
            <td><span class="status status--${transaction.type.toLowerCase()}">${escapeHtml(transaction.type)}</span></td>
            <td class="amount-cell ${transaction.type.toLowerCase()}">${formatCurrency(transaction.amount)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-edit" onclick="editTransaction(${transaction.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action btn-delete" onclick="deleteTransaction(${transaction.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;

        tbody.appendChild(row);
    });

    console.log('Transaction history updated with', sortedTransactions.length, 'transactions');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function initializeCharts() {
    console.log('Initializing charts...');

    // Destroy existing charts if they exist
    Object.values(charts).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
            chart.destroy();
        }
    });
    charts = {};

    // Category Chart
    const categoryCtx = document.getElementById('categoryChart');
    if (categoryCtx) {
        charts.categoryChart = new Chart(categoryCtx, {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Income vs Expenses Chart
    const incomeExpenseCtx = document.getElementById('incomeExpenseChart');
    if (incomeExpenseCtx) {
        charts.incomeExpenseChart = new Chart(incomeExpenseCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Income',
                        data: [],
                        borderColor: '#1FB8CD',
                        backgroundColor: 'rgba(31, 184, 205, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Expenses',
                        data: [],
                        borderColor: '#B4413C',
                        backgroundColor: 'rgba(180, 65, 60, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    // Savings Chart
    const savingsCtx = document.getElementById('savingsChart');
    if (savingsCtx) {
        charts.savingsChart = new Chart(savingsCtx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Savings',
                    data: [],
                    backgroundColor: '#FFC185',
                    borderColor: '#D2BA4C',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Savings: $' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    console.log('Charts initialized');
}

function updateCharts() {
    updateCategoryChart();
    updateIncomeExpenseChart();
    updateSavingsChart();
}

function updateCategoryChart() {
    if (!charts.categoryChart) return;

    const expenses = transactions.filter(t => t.type === 'Expense');
    const categoryTotals = {};

    expenses.forEach(transaction => {
        categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount;
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    charts.categoryChart.data.labels = labels;
    charts.categoryChart.data.datasets[0].data = data;
    charts.categoryChart.update();
}

function updateIncomeExpenseChart() {
    if (!charts.incomeExpenseChart) return;

    // Group transactions by month
    const monthlyData = {};

    transactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { income: 0, expenses: 0 };
        }

        if (transaction.type === 'Income') {
            monthlyData[monthKey].income += transaction.amount;
        } else if (transaction.type === 'Expense') {
            monthlyData[monthKey].expenses += transaction.amount;
        }
    });

    const sortedMonths = Object.keys(monthlyData).sort();
    const incomeData = sortedMonths.map(month => monthlyData[month].income);
    const expenseData = sortedMonths.map(month => monthlyData[month].expenses);

    charts.incomeExpenseChart.data.labels = sortedMonths.map(month => {
        const [year, monthNum] = month.split('-');
        return new Date(year, monthNum - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });
    charts.incomeExpenseChart.data.datasets[0].data = incomeData;
    charts.incomeExpenseChart.data.datasets[1].data = expenseData;
    charts.incomeExpenseChart.update();
}

function updateSavingsChart() {
    if (!charts.savingsChart) return;

    // Group savings by month
    const monthlyData = {};

    transactions.filter(t => t.type === 'Savings').forEach(transaction => {
        const date = new Date(transaction.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + transaction.amount;
    });

    const sortedMonths = Object.keys(monthlyData).sort();
    const savingsData = sortedMonths.map(month => monthlyData[month]);

    charts.savingsChart.data.labels = sortedMonths.map(month => {
        const [year, monthNum] = month.split('-');
        return new Date(year, monthNum - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });
    charts.savingsChart.data.datasets[0].data = savingsData;
    charts.savingsChart.update();
}

function updateBudgetAnalysis() {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const currentMonthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
    });

    const income = currentMonthTransactions
        .filter(t => t.type === 'Income')
        .reduce((sum, t) => sum + t.amount, 0);

    const expenses = currentMonthTransactions
        .filter(t => t.type === 'Expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const savings = currentMonthTransactions
        .filter(t => t.type === 'Savings')
        .reduce((sum, t) => sum + t.amount, 0);

    // Update progress bars
    updateProgressBar('incomeProgress', 'incomeProgressText', income, budgetGoals.monthlyIncome);
    updateProgressBar('expenseProgress', 'expenseProgressText', expenses, budgetGoals.monthlyExpenseLimit);
    updateProgressBar('savingsProgress', 'savingsProgressText', savings, budgetGoals.monthlySavingsGoal);

    // Update summary cards
    const savedAmountEl = document.getElementById('savedAmount');
    const savedPercentageEl = document.getElementById('savedPercentage');
    const spentAmountEl = document.getElementById('spentAmount');
    const spentPercentageEl = document.getElementById('spentPercentage');
    const remainingAmountEl = document.getElementById('remainingAmount');

    if (savedAmountEl) savedAmountEl.textContent = formatCurrency(savings);
    if (savedPercentageEl) savedPercentageEl.textContent = income > 0 ? `${((savings / income) * 100).toFixed(1)}% of income` : '0% of income';

    if (spentAmountEl) spentAmountEl.textContent = formatCurrency(expenses);
    if (spentPercentageEl) spentPercentageEl.textContent = income > 0 ? `${((expenses / income) * 100).toFixed(1)}% of income` : '0% of income';

    // Update budget remaining
    const remaining = budgetGoals.monthlyExpenseLimit - expenses;
    if (remainingAmountEl) remainingAmountEl.textContent = formatCurrency(Math.max(0, remaining));

    const remainingPercentage = Math.max(0, (remaining / budgetGoals.monthlyExpenseLimit) * 100);
    updateProgressBar('remainingProgress', null, remaining > 0 ? remaining : 0, budgetGoals.monthlyExpenseLimit);
}

function updateProgressBar(progressId, textId, current, goal) {
    const percentage = Math.min((current / goal) * 100, 100);
    const progressElement = document.getElementById(progressId);

    if (progressElement) {
        progressElement.style.width = `${percentage}%`;
    }

    if (textId) {
        const textElement = document.getElementById(textId);
        if (textElement) {
            textElement.textContent = `${formatCurrency(current)} / ${formatCurrency(goal)}`;
        }
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}
