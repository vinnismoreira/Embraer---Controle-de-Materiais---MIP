// Importa o SDK do Supabase
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const SUPABASE_URL = "https://mqjhjcdfgksdfxfzfdlk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xamhqY2RmZ2tzZGZ4ZnpmZGxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDQ0MjAsImV4cCI6MjA3NDk4MDQyMH0.Kbw_ai5CndZvJQ8SJEeVjPHIDsp-6flf941kIJpG6XY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================
// SISTEMA DE GESTÃO DE ESTOQUE
// ==========================
class StockManager {

    constructor() {
        this.stockItems = [];
        this.currentFilter = 'ALL';
        this.currentSearch = '';
        this.editingItemId = null;
        this.init();
    }

    async loadFromDatabase() {
        try {
            const { data, error } = await supabase
                .from("GESTAO_DE_ESTOQUE")
                .select("*")
                .order("id", { ascending: false });

            if (error) {
                console.error("❌ Erro ao carregar dados do Supabase:", error.message);
                alert("Erro ao carregar dados do banco: " + error.message);
                return;
            }

            this.stockItems = data || [];
            this.renderTable();
            this.updateItemsCount();
        } catch (err) {
            console.error("❌ Erro inesperado ao carregar dados:", err);
            alert("Erro inesperado ao carregar dados do banco.");
        }
    }

    init() {
        this.bindEvents();
        this.loadFromDatabase();
        const today = new Date().toISOString().split('T')[0];
        const verificationDate = document.getElementById('verification-date');
        if (verificationDate) verificationDate.value = today;
    }

    bindEvents() {
        const btnAdd = document.getElementById('add-item-btn');
        if (btnAdd) btnAdd.addEventListener('click', () => this.openModal());

        const btnClose = document.getElementById('close-modal-btn');
        if (btnClose) btnClose.addEventListener('click', () => this.closeModal());

        const btnCancel = document.getElementById('cancel-modal-btn');
        if (btnCancel) btnCancel.addEventListener('click', () => this.closeModal());

        const btnSave = document.getElementById('save-item-btn');
        if (btnSave) btnSave.addEventListener('click', () => this.saveItem());

        const btnClear = document.getElementById('clear-form-btn');
        if (btnClear) btnClear.addEventListener('click', () => this.clearForm());

        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.addEventListener('input', e => {
            this.currentSearch = e.target.value;
            this.renderTable();
        });

        const statusFilter = document.getElementById('status-filter');
        if (statusFilter) statusFilter.addEventListener('change', e => {
            this.currentFilter = e.target.value;
            this.renderTable();
        });

        const form = document.getElementById('item-form');
        if (form) form.addEventListener('input', () => this.validateForm());

        const modal = document.getElementById('item-modal');
        if (modal) modal.addEventListener('click', e => {
            if (e.target.id === 'item-modal') this.closeModal();
        });

        // Auto-generate material ID
        const materialName = document.getElementById('material-name');
        if (materialName) {
            materialName.addEventListener('input', e => {
                const matId = document.getElementById('material-id');
                if (matId && !matId.value && e.target.value) {
                    matId.value = `MAT-2024-${Date.now().toString().slice(-6)}`;
                }
            });
        }
    }

    openModal(itemId = null) {
        this.editingItemId = itemId;
        const modal = document.getElementById('item-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');

        if (!modal || !modalTitle || !modalDescription) return;

        if (itemId) {
            modalTitle.textContent = 'Editar Item';
            modalDescription.textContent = 'Edite as informações do item selecionado.';
            this.loadItemData(itemId);
        } else {
            modalTitle.textContent = 'Anotar Novo Registro';
            modalDescription.textContent = 'Adicione um novo registro ao estoque preenchendo as informações abaixo.';
            this.clearForm();
            const today = new Date().toISOString().split('T')[0];
            const verificationDate = document.getElementById('verification-date');
            if (verificationDate) verificationDate.value = today;
        }

        modal.classList.add('active');
        this.validateForm();
    }

    closeModal() {
        const modal = document.getElementById('item-modal');
        if (modal) modal.classList.remove('active');
        this.editingItemId = null;
        this.clearForm();
    }

    loadItemData(itemId) {
        const item = this.stockItems.find(i => i.id === itemId);
        if (!item) return;

        const fields = [
            ['material-name', item.name],
            ['material-id', item.materialId],
            ['material-desc', item.desc || ''],
            ['quantity', item.quantity],
            ['status', item.status],
            ['location', item.location],
            ['discard-reason', item.discardReason || ''],
            ['verification-date', item.verificationDate || ''],
            ['expiry-date', item.expiryDate || ''],
            ['responsible', item.responsible]
        ];

        fields.forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) el.value = value;
        });
    }

    clearForm() {
        const form = document.getElementById('item-form');
        if (form) form.reset();
        this.validateForm();
    }

    validateForm() {
        const required = ['material-name','material-id','quantity','status','location','verification-date','responsible'];
        const isValid = required.every(id => {
            const el = document.getElementById(id);
            return el && el.value.trim() !== '';
        });
        const btnSave = document.getElementById('save-item-btn');
        if (btnSave) btnSave.disabled = !isValid;
    }

    async saveItem() {
        const formData = {
            pn: document.getElementById('material-name').value,
            ecode: document.getElementById('material-id').value,
            descricao: document.getElementById('material-desc').value,
            quantidade: parseInt(document.getElementById('quantity').value),
            status: document.getElementById('status').value,
            localizacao_no_estoque: document.getElementById('location').value,
            motivo_de_descarte: document.getElementById('discard-reason').value,
            data_de_verificacao: document.getElementById('verification-date').value,
            data_de_validade: document.getElementById('expiry-date').value,
            responsavel_pelo_registro: document.getElementById('responsible').value,
        };

        try {
            const { data, error } = await supabase
                .from("GESTAO_DE_ESTOQUE")
                .insert([formData]);

            if (error) {
                console.error("❌ Erro ao salvar no Supabase:", error.message);
                alert("Erro ao salvar no banco: " + error.message);
                return;
            }

            console.log("✅ Registro salvo no Supabase:", data);

            this.stockItems.push({
                id: Date.now().toString(),
                ...formData,
                verifiedBy: formData.responsavel_pelo_registro,
                verifiedDate: new Date(formData.data_de_verificacao).toLocaleDateString('pt-BR'),
            });

            await this.loadFromDatabase();
            this.renderTable();
            this.updateItemsCount();
            this.closeModal();
            alert("✅ Registro salvo com sucesso!");

        } catch (err) {
            console.error("❌ Erro inesperado:", err);
            alert("Erro inesperado ao salvar o item.");
        }
    }

    async deleteItem(itemId) {
        if (!confirm('Deseja realmente remover este item?')) return;

        try {
            const { error } = await supabase
                .from("GESTAO_DE_ESTOQUE")
                .delete()
                .eq("id", itemId);

            if (error) throw error;

            alert("🗑️ Item removido com sucesso!");
            await this.loadFromDatabase();
        } catch (err) {
            console.error("❌ Erro ao excluir item:", err);
            alert("Erro ao excluir o item do banco.");
        }
    }

    getFilteredItems() {
        let filtered = this.stockItems;
        if (this.currentFilter !== 'ALL') filtered = filtered.filter(i => i.status === this.currentFilter);
        if (this.currentSearch) {
            const term = this.currentSearch.toLowerCase();
            filtered = filtered.filter(i => i.name?.toLowerCase().includes(term) || i.materialId?.toLowerCase().includes(term));
        }
        return filtered;
    }

    renderTable() {
        const tbody = document.getElementById('stock-table-body');
        const noItemsMsg = document.getElementById('no-items-message');
        if (!tbody || !noItemsMsg) return;

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
                <td>${item.pn || '-'}</td>
                <td>${item.ecode || '-'}</td>
                <td>${item.quantidade ?? '-'}</td>
                <td>${item.responsavel_pelo_registro || '-'}</td>
                <td>
                    <span class="status-badge ${this.getStatusClass(item.status)}">
                        ${item.status || '-'}
                    </span>
                </td>
                <td>${item.motivo_de_descarte || '-'}</td>
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
        const counter = document.getElementById('items-count');
        if (counter) counter.textContent = `Exibindo ${this.getFilteredItems().length} de ${this.stockItems.length} itens`;
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
    // ... restante do array permanece igual ...
];

// Popula selects
['material-name','material-id','material-desc'].forEach(id => {
    const select = document.getElementById(id);
    if (!select) return;
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
const syncSelects = (sourceId, targetMap) => {
    const el = document.getElementById(sourceId);
    if (!el) return;
    el.addEventListener('change', () => {
        const match = materiaisDB.find(m => m[sourceId.split('-')[1]] === el.value);
        if (!match) return;
        for (const [tid, key] of Object.entries(targetMap)) {
            const tEl = document.getElementById(tid);
            if (tEl) tEl.value = match[key];
        }
    });
};

syncSelects('material-name', { 'material-id':'code', 'material-desc':'desc' });
syncSelects('material-id', { 'material-name':'name', 'material-desc':'desc' });
syncSelects('material-desc', { 'material-name':'name', 'material-id':'code' });

// Testa conexão Supabase
(async () => {
  const { data, error } = await supabase.from("GESTAO_DE_ESTOQUE").select("*").limit(1);
  if (error) console.error("❌ Erro ao conectar com Supabase:", error.message);
  else console.log("✅ Conectado ao Supabase com sucesso!");
})();

// Controla submenu da sidebar
document.querySelectorAll('.sidebar-item > .sidebar-link').forEach(link => {
  link.addEventListener('click', () => link.parentElement.classList.toggle('active'));
});

// Sidebar retrátil
const sidebar = document.querySelector('.sidebar');
const menuToggle = document.getElementById('menu-toggle');
if (menuToggle && sidebar) {
  menuToggle.addEventListener('click', e => {
    e.stopPropagation();
    sidebar.classList.toggle('active');
    document.body.classList.toggle('sidebar-open');
  });
  document.addEventListener('click', e => {
    if (sidebar.classList.contains('active') && !sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
      sidebar.classList.remove('active');
      document.body.classList.remove('sidebar-open');
    }
  });
}

const closeSidebar = document.querySelector('.sidebar .close-sidebar');
if (closeSidebar && sidebar) {
  closeSidebar.addEventListener('click', e => {
    e.stopPropagation();
    sidebar.classList.remove('active');
    document.body.classList.remove('sidebar-open');
  });
}