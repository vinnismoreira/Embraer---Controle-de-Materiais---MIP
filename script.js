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

// === SUPABASE CONFIG ===
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const SUPABASE_URL = "https://mqjhjcdfgksdfxfzfdlk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xamhqY2RmZ2tzZGZ4ZnpmZGxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDQ0MjAsImV4cCI6MjA3NDk4MDQyMH0.Kbw_ai5CndZvJQ8SJEeVjPHIDsp-6flf941kIJpG6XY";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

// === Classe StockManager ===
class StockManager {
    constructor() {
        this.stockItems = [];
        this.currentFilter = 'ALL';
        this.currentSearch = '';
        this.editingItemId = null;
        this.init();
    }

    async init() {
        this.bindEvents();
        await this.loadFromSupabase();
        this.renderTable();
        this.updateItemsCount();
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('verification-date').value = today;
    }

    bindEvents() {
        document.getElementById('add-item-btn').addEventListener('click', () => this.openModal());
        document.getElementById('close-modal-btn').addEventListener('click', () => this.closeModal());
        document.getElementById('cancel-modal-btn').addEventListener('click', () => this.closeModal());

        document.getElementById('item-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.saveItem();
        });

        document.getElementById('save-item-btn').addEventListener('click', async (e) => {
            e.preventDefault();
            await this.saveItem();
        });

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

    async loadFromSupabase() {
        const { data, error } = await supabase.from("stock_items").select("*");
        if (error) {
            console.error("Erro ao carregar do Supabase:", error);
        } else {
            this.stockItems = data;
        }
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

        let result;
        if (this.editingItemId) {
            result = await supabase.from("stock_items").update(formData).eq("id", this.editingItemId);
        } else {
            result = await supabase.from("stock_items").insert([formData]);
        }

        if (result.error) {
            console.error("Erro ao salvar no Supabase:", result.error);
        } else {
            await this.loadFromSupabase();
            this.renderTable();
            this.updateItemsCount();
            this.closeModal();
        }
    }

    async deleteItem(itemId) {
        if (!confirm('Deseja realmente remover este item?')) return;
        const { error } = await supabase.from("stock_items").delete().eq("id", itemId);
        if (error) {
            console.error("Erro ao excluir:", error);
        } else {
            await this.loadFromSupabase();
            this.renderTable();
            this.updateItemsCount();
        }
    }

    loadItemData(itemId) {
        const item = this.stockItems.find(i => i.id == itemId);
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

    openModal(itemId = null) {
        this.editingItemId = itemId;
        if (itemId) {
            this.loadItemData(itemId);
            document.getElementById('modal-title').textContent = 'Editar Registro';
        } else {
            this.clearForm();
            document.getElementById('modal-title').textContent = 'Anotar Registro';
        }
        document.getElementById('item-modal').style.display = 'block';
        this.validateForm();
    }

    closeModal() {
        document.getElementById('item-modal').style.display = 'none';
        this.editingItemId = null;
    }
}

// === Inicialização ===
document.addEventListener('DOMContentLoaded', () => {
    carregarMateriais();
    sincronizarSelects();
    new StockManager();
});