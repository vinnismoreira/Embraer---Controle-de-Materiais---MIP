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

// === Funções auxiliares Supabase ===
async function carregarTabelaSupabase() {
    const { data, error } = await supabase
        .from("registros")
        .select("*")
        .order("criado_em", { ascending: false });

    if (error) {
        console.error("Erro ao carregar tabela:", error);
        return [];
    }
    return data;
}

async function salvarNoSupabase(dados) {
    const { data, error } = await supabase
        .from("registros")
        .insert([dados]);

    if (error) {
        console.error("Erro ao salvar:", error);
        return false;
    }
    return true;
}

async function atualizarNoSupabase(id, dados) {
    const { error } = await supabase
        .from("registros")
        .update(dados)
        .eq("id", id);

    if (error) {
        console.error("Erro ao atualizar:", error);
        return false;
    }
    return true;
}

async function deletarNoSupabase(id) {
    const { error } = await supabase
        .from("registros")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Erro ao deletar:", error);
        return false;
    }
    return true;
}

// === Funções de carregamento e sincronização dos selects ===
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

// === StockManager com integração Supabase ===
class StockManager {
    constructor() {
        this.stockItems = [];
        this.currentFilter = 'ALL';
        this.currentSearch = '';
        this.editingItemId = null;
        this.init();
    }

    async init() {
        carregarMateriais();
        sincronizarSelects();
        await this.loadFromSupabase();
        this.bindEvents();
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
    }

    async loadFromSupabase() {
        const dados = await carregarTabelaSupabase();
        this.stockItems = dados.map(item => ({
            id: item.id.toString(),
            name: item.material ?? "-",
            materialId: item.material_id ?? "-",
            desc: item.descricao ?? "-",
            quantity: item.quantidade ?? 0,
            status: item.status ?? "-",
            location: item.localizacao ?? "-",
            discardReason: item.motivo_descartado ?? "-",
            verificationDate: item.data_verificacao ?? "-",
            expiryDate: item.data_validade ?? "-",
            responsible: item.responsavel ?? "-"
        }));
        this.renderTable();
    }

    openModal(itemId = null) {
        this.editingItemId = itemId;
        document.getElementById('item-modal').classList.add('active');
        if (itemId) this.loadItemData(itemId);
        else this.clearForm();
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
    }

    validateForm() {
        const required = ['material-name','material-id','quantity','status','location','verification-date','responsible'];
        const isValid = required.every(id => document.getElementById(id).value.trim() !== '');
        document.getElementById('save-item-btn').disabled = !isValid;
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

        if (this.editingItemId) {
            await atualizarNoSupabase(this.editingItemId, formData);
        } else {
            await salvarNoSupabase(formData);
        }

        await this.loadFromSupabase();
        this.closeModal();
    }

    async deleteItem(itemId) {
        if (!confirm('Deseja realmente remover este item?')) return;
        await deletarNoSupabase(itemId);
        await this.loadFromSupabase();
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
        tbody.innerHTML = '';
        const filtered = this.getFilteredItems();

        filtered.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name ?? '-'}</td>
                <td>${item.materialId ?? '-'}</td>
                <td>${item.quantity ?? '-'}</td>
                <td>${item.responsible ?? '-'}</td>
                <td><span class="status-badge ${this.getStatusClass(item.status)}">${item.status ?? '-'}</span></td>
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
                this.openModal(e.currentTarget.dataset.id);
            })
        );

        tbody.querySelectorAll('.action-delete').forEach(link =>
            link.addEventListener('click', e => {
                e.preventDefault();
                this.deleteItem(e.currentTarget.dataset.id);
            })
        );
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
}

// === Inicialização ===
document.addEventListener('DOMContentLoaded', () => {
    window.stockManager = new StockManager();
});
