import { createClient } from "https://esm.sh/@supabase/supabase-js";

// ⚡ CONFIGURAÇÃO DO SUPABASE
const supabase = createClient(
  "https://SEU-PROJECT.supabase.co", // sua URL do Supabase
  "SUA-ANON-KEY"                    // sua anon key
);

// === Banco de Materiais ===
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
    { name: "ARDROX AV 15 AEROSOL", code: "2976414", desc: "COMPOSTO INIBIDOR DE CORROSAO" },
    { name: "AV138-2 BR", code: "2941755", desc: "ADESIVO, EPOXI, AV138, COMP. A" },
    { name: "BOELUBE", code: "1453546", desc: "LUBRIFICANTE SINTETICO" },
    { name: "BONDERITE M-CR 1132 AERO", code: "6752518", desc: "SOLUCAO CONVERSAO QUIMICA, CLASS1A" },
    { name: "CB200-40", code: "7135770", desc: "ADESIVO, ACRILICO" },
    { name: "COR-BAN 27L", code: "9447580", desc: "COMPOSTO, INIBIDOR DE CORROSAO" },
    { name: "D-5026NS", code: "6125209", desc: "COMPOSTO, INIBIDOR DE CORROSAO, MIL" },
    { name: "D-7409", code: "6871644", desc: "FILME LUBRIFICANTE ANTI FRICÇÃO" },
    { name: "DOUBL CHECK DR-60", code: "1454375", desc: "REMOVEDOR, LIQUIDO, PENETRANTE" },
    { name: "DOW CORNING 4", code: "1453538", desc: "GRAXA, SILICONE-ISOLANTE ELETRICO" },
    { name: "EA9320NA", code: "1453275", desc: "ADESIVO, EPOXI, TIPO II" },
    { name: "EA9396", code: "6578982", desc: "ADESIVO, EPOXI, TIPO III" },
    { name: "EC1300L", code: "1453274", desc: "ADESIVO, ELASTOMERICO, BORRACHA SINTE" },
    { name: "EC-460", code: "4770964", desc: "ADESIVO, EPOXI, TIPO IV" },
    { name: "ES2000", code: "8996985", desc: "SELANTE, POLIURETANO, TRANSPARENTE" },
    { name: "HT3326-5-50", code: "1453504", desc: "SELANTE, POLIURETANO, VERDE" },
    { name: "HV998", code: "9120013", desc: "CATALISADOR, ADESIVO AV138, COMP. B" },
    { name: "JUNTA MOTOR DIESEL", code: "1453507", desc: "ADESIVO, ELASTOMERICO, RESISTENTE A COMB" },
    { name: "LOCTITE 221", code: "9117446", desc: "ADESIVO, ANAEROBICO, TRAVAMENTO, TIPO I" },
    { name: "LOCTITE 222", code: "1489797", desc: "ADESIVO, ANAEROBICO, TRAVAMENTO, TIPO II" },
    { name: "LOCTITE 241", code: "1453510", desc: "ADESIVO, ANAEROBICO, TRAVAMENTO, TIPO III" },
    { name: "LOCTITE 242", code: "6972486", desc: "ADESIVO, ANAEROBICO, TRAVAMENTO, TIPO IV" },
    { name: "LOCTITE 601 TORQUE ALTO", code: "2035987", desc: "ADESIVO, ANAEROBICO, FIXADOR TORQUE ALTO" },
    { name: "NYCOTE 7-11 DARK BLUE", code: "1453381", desc: "REVESTIMENTO ANTI CORROSIVO" },
    { name: "RTV-162", code: "3742496", desc: "ADESIVO-SELANTE, RTV, SILICONE" },
    { name: "RTV102", code: "7151869", desc: "SELANTE, SILICONE, BRANCO" },
    { name: "RTV106", code: "1453286", desc: "SELANTE, SILICONE, VERMELHO" },
    { name: "RTV108", code: "2957411", desc: "SELANTE, SILICONE, PRETO" },
    { name: "RTV157", code: "7151825", desc: "SELANTE, SILICONE, CINZA" },
    { name: "RTV159", code: "9129347", desc: "SELANTE, SILICONE, ALTA TEMP" },
    { name: "RTV732", code: "1453588", desc: "SELANTE, SILICONE, INCOLOR" },
    { name: "S1006-KIT-A", code: "5263329", desc: "ADESIVO, EPOXI, CABLAGENS ELETRICAS" }
];

// === Função para carregar selects ===
function carregarMateriais() {
    const nameSelect = document.getElementById('material-name');
    const codeSelect = document.getElementById('material-id');
    const descSelect = document.getElementById('material-desc');

    [nameSelect, codeSelect, descSelect].forEach(sel => {
        sel.innerHTML = '<option value="">Selecione...</option>';
    });

    materiaisDB.forEach(m => {
        let optName = document.createElement('option');
        optName.value = m.name;
        optName.textContent = m.name;
        nameSelect.appendChild(optName);

        let optCode = document.createElement('option');
        optCode.value = m.code;
        optCode.textContent = m.code;
        codeSelect.appendChild(optCode);

        let optDesc = document.createElement('option');
        optDesc.value = m.desc;
        optDesc.textContent = m.desc;
        descSelect.appendChild(optDesc);
    });
}

// === Sincronização entre selects ===
function sincronizarSelects() {
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
        const value = document.getElementById('material-desc').value.trim().toLowerCase();
        const match = materiaisDB.find(m => m.desc.toLowerCase() === value);
        if (match) {
            document.getElementById('material-name').value = match.name;
            document.getElementById('material-id').value = match.code;
        }
    });
}

// === Classe StockManager com cores restauradas ===
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
            name: document.getElementById('material-name').value || "-",
            materialId: document.getElementById('material-id').value || "-",
            desc: document.getElementById('material-desc').value || "-",
            quantity: parseInt(document.getElementById('quantity').value) || 0,
            status: document.getElementById('status').value || "-",
            location: document.getElementById('location').value || "-",
            discardReason: document.getElementById('discard-reason').value || "-",
            verificationDate: document.getElementById('verification-date').value || "-",
            expiryDate: document.getElementById('expiry-date').value || "-",
            responsible: document.getElementById('responsible').value || "-"
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

        

        try {
            const response = await fetch("SUA_URL_DO_APPS_SCRIPT", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    PN: formData.materialId,
                    ECODE: formData.materialId,
                    DESCRIÇÃO: formData.desc,
                    "LOCALIZAÇÃO NO ESTOQUE": formData.location,
                    "MOTIVO DE DESCARTE": formData.discardReason,
                    "DATA DE VERIFICAÇÃO": formData.verificationDate,
                    "DATA DE VALIDADE": formData.expiryDate,
                    RESPONSÁVEL: formData.responsible,
                    QUANTIDADE: formData.quantity,
                    STATUS: formData.status
                })
            });
            const result = await response.json();
            if (result.status !== "OK") console.error('Erro ao enviar para o Google Sheets:', result);
        } catch (err) {
            console.error('Erro de conexão com o Apps Script:', err);
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
                <td>${item.name ?? '-'}</td>
                <td>${item.materialId ?? '-'}</td>
                <td>${item.quantity ?? '-'}</td>
                <td>${item.responsible ?? '-'}</td>
                <td>
                    <span class="status-badge ${this.getStatusClass(item.status)}">
                        ${item.status ?? '-'}
                    </span>
                </td>
                <td>${item.discardReason ?? '-'}</td>
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

// === Inicialização ===
document.addEventListener('DOMContentLoaded', () => {
    carregarMateriais();
    sincronizarSelects();
    window.stockManager = new StockManager();
});
