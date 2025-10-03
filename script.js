import { createClient } from "https://esm.sh/@supabase/supabase-js";

// === CONFIGURAÇÃO SUPABASE ===
const supabase = createClient(
  "https://mqjhjcdfgksdfxfzfdlk.supabase.co", // sua URL do Supabase
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xamhqY2RmZ2tzZGZ4ZnpmZGxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDQ0MjAsImV4cCI6MjA3NDk4MDQyMH0.Kbw_ai5CndZvJQ8SJEeVjPHIDsp-6flf941kIJpG6XY"                    // sua anon key
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

// === Função para salvar dados no Supabase ===
async function salvarNoSupabase(dados) {
    const { data, error } = await supabase
        .from("registros")
        .insert([dados]);

    if (error) {
        console.error("Erro ao salvar:", error);
        alert("❌ Erro ao salvar dados");
        return false;
    }
    return true;
}

// === Classe StockManager ===
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

        document.getElementById('item-modal').addEventListener('click', e => {
            if (e.target.id === 'item-modal') this.closeModal();
        });
    }

    openModal(itemId = null) {
        this.editingItemId = itemId;
        document.getElementById('item-modal').classList.add('active');
    }

    closeModal() {
        document.getElementById('item-modal').classList.remove('active');
        this.clearForm();
    }

    clearForm() {
        document.getElementById('item-form').reset();
    }

    async saveItem() {
        const formData = {
            material: document.getElementById('material-name').value || "-",
            material_id: document.getElementById('material-id').value || "-",
            descricao: document.getElementById('material-desc').value || "-",
            quantidade: parseInt(document.getElementById('quantity').value) || 0,
            status: document.getElementById('status').value || "-",
            localizacao: document.getElementById('location').value || "-",
            motivo_descartado: document.getElementById('discard-reason').value || "-",
            data_verificacao: document.getElementById('verification-date').value || "-",
            data_validade: document.getElementById('expiry-date').value || "-",
            responsavel: document.getElementById('responsible').value || "-"
        };

        // Salvar localmente
        if (this.editingItemId) {
            const idx = this.stockItems.findIndex(i => i.id === this.editingItemId);
            if (idx !== -1) this.stockItems[idx] = { id: this.editingItemId, ...formData };
        } else {
            this.stockItems.push({ id: Date.now().toString(), ...formData });
        }
        localStorage.setItem('stockItems', JSON.stringify(this.stockItems));
        this.renderTable();

        // Salvar no Supabase
        await salvarNoSupabase(formData);

        this.closeModal();
    }

    getFilteredItems() {
        let filtered = this.stockItems;
        if (this.currentFilter !== 'ALL') filtered = filtered.filter(i => i.status === this.currentFilter);
        if (this.currentSearch) {
            const term = this.currentSearch.toLowerCase();
            filtered = filtered.filter(i => i.material.toLowerCase().includes(term) || i.material_id.toLowerCase().includes(term));
        }
        return filtered;
    }

    renderTable() {
        const tbody = document.getElementById('stock-table-body');
        tbody.innerHTML = "";
        const filtered = this.getFilteredItems();
        filtered.forEach(item => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${item.material}</td>
                <td>${item.material_id}</td>
                <td>${item.quantidade}</td>
                <td>${item.responsavel}</td>
                <td>${item.status}</td>
                <td>${item.motivo_descartado}</td>
                <td>
                    <a href="#" class="action-edit" data-id="${item.id}">Editar</a>
                    <a href="#" class="action-delete" data-id="${item.id}">Excluir</a>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    updateItemsCount() {
        document.getElementById('items-count').textContent = `${this.getFilteredItems().length} itens`;
    }
}

// === Inicialização ===
document.addEventListener('DOMContentLoaded', () => {
    carregarMateriais();
    sincronizarSelects();
    window.stockManager = new StockManager();
});