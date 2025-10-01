// Stock Management System
class StockManager {
    constructor() {
        this.stockItems = JSON.parse(localStorage.getItem('stockItems')) || [];
        this.currentFilter = 'ALL';
        this.currentSearch = '';
        this.editingItemId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderTable();
        this.updateItemsCount();
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('verification-date').value = today;
    }

    bindEvents() {
        document.getElementById('add-item-btn').addEventListener('click', () => this.openModal());
        document.getElementById('close-modal-btn').addEventListener('click', () => this.closeModal());
        document.getElementById('cancel-modal-btn').addEventListener('click', () => this.closeModal());
        document.getElementById('save-item-btn').addEventListener('click', () => this.saveItem());
        document.getElementById('clear-form-btn').addEventListener('click', () => this.clearForm());

        document.getElementById('search-input').addEventListener('input', e => {
            this.currentSearch = e.target.value;
            this.renderTable();
        });

        document.getElementById('status-filter').addEventListener('change', e => {
            this.currentFilter = e.target.value;
            this.renderTable();
        });

        document.getElementById('item-form').addEventListener('input', () => this.validateForm());

        document.getElementById('item-modal').addEventListener('click', e => {
            if (e.target.id === 'item-modal') this.closeModal();
        });

        // Auto-generate material ID
        document.getElementById('material-name').addEventListener('input', e => {
            const matId = document.getElementById('material-id');
            if (!matId.value && e.target.value) matId.value = `MAT-2024-${Date.now().toString().slice(-6)}`;
        });
    }

    openModal(itemId = null) {
        this.editingItemId = itemId;
        const modal = document.getElementById('item-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');

        if (itemId) {
            modalTitle.textContent = 'Editar Item';
            modalDescription.textContent = 'Edite as informações do item selecionado.';
            this.loadItemData(itemId);
        } else {
            modalTitle.textContent = 'Anotar Novo Registro';
            modalDescription.textContent = 'Adicione um novo registro ao estoque preenchendo as informações abaixo.';
            this.clearForm();
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('verification-date').value = today;
        }

        modal.classList.add('active');
        this.validateForm();
    }

    closeModal() {
        document.getElementById('item-modal').classList.remove('active');
        this.editingItemId = null;
        this.clearForm();
    }

    loadItemData(itemId) {
        const item = this.stockItems.find(i => i.id === itemId);
        if (!item) return;
        document.getElementById('material-name').value = item.name;
        document.getElementById('material-id').value = item.materialId;
        document.getElementById('material-desc').value = item.desc || '';
        document.getElementById('quantity').value = item.quantity;
        document.getElementById('status').value = item.status;
        document.getElementById('location').value = item.location;
        document.getElementById('discard-reason').value = item.discardReason || '';
        document.getElementById('verification-date').value = item.verificationDate || '';
        document.getElementById('expiry-date').value = item.expiryDate || '';
        document.getElementById('responsible').value = item.responsible;
    }

    clearForm() {
        document.getElementById('item-form').reset();
        this.validateForm();
    }

    validateForm() {
        const required = ['material-name','material-id','quantity','status','location','verification-date','responsible'];
        const isValid = required.every(id => document.getElementById(id).value.trim() !== '');
        document.getElementById('save-item-btn').disabled = !isValid;
    }

    async saveItem() {
        const formData = {
    PN: document.getElementById('material-name').value,
    ECODE: document.getElementById('material-id').value,
    DESCRIÇÃO: document.getElementById('material-desc').value,
    QUANTIDADE: parseInt(document.getElementById('quantity').value),
    STATUS: document.getElementById('status').value,
    "LOCALIZAÇÃO NO ESTOQUE": document.getElementById('location').value,
    "MOTIVO DE DESCARTE": document.getElementById('discard-reason').value,
    "DATA DE VERIFICAÇÃO": document.getElementById('verification-date').value,
    "DATA DE VALIDADE": document.getElementById('expiry-date').value,
    RESPONSÁVEL: document.getElementById('responsible').value
};

        if (this.editingItemId) {
            const idx = this.stockItems.findIndex(i => i.id === this.editingItemId);
            if (idx !== -1) {
                this.stockItems[idx] = {
                    ...this.stockItems[idx],
                    ...formData,
                    verifiedBy: formData.responsible,
                    verifiedDate: new Date(formData.verificationDate).toLocaleDateString('pt-BR')
                };
            }
        } else {
            this.stockItems.push({
                id: Date.now().toString(),
                ...formData,
                verifiedBy: formData.responsible,
                verifiedDate: new Date(formData.verificationDate).toLocaleDateString('pt-BR')
            });
        }

        localStorage.setItem('stockItems', JSON.stringify(this.stockItems));
        this.renderTable();
        this.updateItemsCount();
        this.closeModal();

        // Envia para Google Sheets
        try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbw_Pug1cE2-0W_E4pblwz3Zw-q2MNb9V4FZvJ1qZgg1pl8yJifBZlzxY1iL0xv5f-6i-w/exec", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });
    const result = await response.json();
    if (!result.success) console.error('Erro ao enviar para o Google Sheets:', result.error);
} catch (err) {
    console.error('Erro de conexão com o Google Apps Script:', err);
}
    }

    deleteItem(itemId) {
        if (!confirm('Deseja realmente remover este item?')) return;
        this.stockItems = this.stockItems.filter(i => i.id !== itemId);
        localStorage.setItem('stockItems', JSON.stringify(this.stockItems));
        this.renderTable();
        this.updateItemsCount();
    }

    getFilteredItems() {
        let filtered = this.stockItems;
        if (this.currentFilter !== 'ALL') filtered = filtered.filter(i => i.status === this.currentFilter);
        if (this.currentSearch) {
            const term = this.currentSearch.toLowerCase();
            filtered = filtered.filter(i => i.name.toLowerCase().includes(term) || i.materialId.toLowerCase().includes(term));
        }
        return filtered;
    }

    renderTable() {
        const tbody = document.getElementById('stock-table-body');
        const noItemsMsg = document.getElementById('no-items-message');
        const filtered = this.getFilteredItems();
    
        if (!filtered.length) {
            tbody.innerHTML = '';
            noItemsMsg.style.display = 'block';
            document.getElementById('items-count').textContent = `Exibindo 0 de ${this.stockItems.length} itens`;
            return;
        }
        noItemsMsg.style.display = 'none';
        tbody.innerHTML = '';
    
        filtered.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name || '-'}</td>
                <td>${item.materialId || '-'}</td>
                <td>${item.quantity ?? '-'}</td>
                <td>${item.responsible || item.verifiedBy || '-'}</td>
                <td>
                    <span class="status-badge ${this.getStatusClass(item.status)}">
                        ${item.status || '-'}
                    </span>
                </td>
                <td>${item.discardReason || '-'}</td>
                <td>
                    <a href="#" class="action-link action-edit" data-id="${item.id}">Editar</a>
                    <a href="#" class="action-link action-delete" data-id="${item.id}">Excluir</a>
                </td>
            `;
            tbody.appendChild(row);
        });
    
        tbody.querySelectorAll('.action-edit').forEach(link =>
            link.addEventListener('click', e => {
                e.preventDefault();
                const id = e.currentTarget.dataset.id;
                this.openModal(id);
            })
        );
    
        tbody.querySelectorAll('.action-delete').forEach(link =>
            link.addEventListener('click', e => {
                e.preventDefault();
                const id = e.currentTarget.dataset.id;
                this.deleteItem(id);
            })
        );
    
        this.updateItemsCount();
    }

    getStatusClass(status) {
        const classes = {
            'OK': 'status-ok',
            'EM FALTA': 'status-falta',
            'VENCIDO': 'status-vencido',
            'EM DESCARTE': 'status-descarte'
        };
        return classes[status] || '';
    }

    updateItemsCount() {
        document.getElementById('items-count').textContent = `Exibindo ${this.getFilteredItems().length} de ${this.stockItems.length} itens`;
    }
}

// Inicializa
const stockManager = new StockManager();
window.stockManager = stockManager;

// Banco de Materiais
const materiaisDB = [
    { name: "SOLVE TS 500 LTT", code: "79868", desc: "SOLVENTE PARA LIMPEZA MANUAL DE PEÇ" },
    { name: "MOLYKOTE 111", code: "832780", desc: "VALVE LUBRICANT FOR POTABLE WATER" },
    { name: "SOLVENTE, LIMPADOR CONTATOS ELE", code: "1525689", desc: "SOLVENTE, LIMPADOR CONTATOS ELE" },
    { name: "121-146 A/B", code: "2357606", desc: "COMPOSTO, EPOXI, CARGA MICROESFERA" },
    { name: "1357 NEUTRAL", code: "1457043", desc: "ADESIVO, CONTATO, POLICLOROPRENE AMAR" },
    { name: "3M DP420", code: "7567124", desc: "ADESIVO, EPOXI, TIPO 4.3 PER CDM200-0" },
    { name: "780-BRANCO", code: "7151736", desc: "SELANTE, SILICONE, BRANCO, TIPO S" },
    { name: "780RTV (PRETO)", code: "1453535", desc: "SELANTE, SILICONE, PRETO, TIPO S" },
    { name: "AEROKROIL", code: "7556549", desc: "OLEO PENETRANTE" },
    { name: "ARDROX AV 15 AEROSOL", code: "2976414", desc: "COMPOSTO INIBIDOR DE CORROSAO" }
];

// Popula selects
['material-name','material-id','material-desc'].forEach(id => {
    const select = document.getElementById(id);
    materiaisDB.forEach(m => {
        const opt = document.createElement('option');
        if (id==='material-name') opt.value = m.name;
        if (id==='material-id') opt.value = m.code;
        if (id==='material-desc') opt.value = m.desc;
        opt.textContent = opt.value;
        select.appendChild(opt);
    });
});

// Sincroniza selects
document.getElementById('material-name').addEventListener('change', () => {
    const match = materiaisDB.find(m => m.name === document.getElementById('material-name').value);
    if (match) { 
        document.getElementById('material-id').value = match.code; 
        document.getElementById('material-desc').value = match.desc; 
    }
});
document.getElementById('material-id').addEventListener('change', () => {
    const match = materiaisDB.find(m => m.code === document.getElementById('material-id').value);
    if (match) { 
        document.getElementById('material-name').value = match.name; 
        document.getElementById('material-desc').value = match.desc; 
    }
});
document.getElementById('material-desc').addEventListener('change', () => {
    const match = materiaisDB.find(m => m.desc === document.getElementById('material-desc').value);
    if (match) { 
        document.getElementById('material-name').value = match.name; 
        document.getElementById('material-id').value = match.code; 
    }
});
