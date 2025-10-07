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
                verifiedBy: formData.responsible,
                verifiedDate: new Date(formData.verificationDate).toLocaleDateString('pt-BR'),
            });

            localStorage.setItem('stockItems', JSON.stringify(this.stockItems));
            this.renderTable();
            this.updateItemsCount();
            this.closeModal();
            alert("✅ Registro salvo com sucesso!");

        } catch (err) {
            console.error("❌ Erro inesperado:", err);
            alert("Erro inesperado ao salvar o item.");
        }
    }

    deleteItem(itemId) {
        if (!confirm('Deseja realmente remover este item?')) return;
        this.stockItems = this.stockItems.filter(i => i.id !== itemId);
        localStorage.setItem('stockItems', JSON.stringify(this.stockItems));
        supabase.from("GESTAO_DE_ESTOQUE").delete().eq("id", itemId);
        this.renderTable();
        this.updateItemsCount();
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

(async () => {
  const { data, error } = await supabase.from("GESTAO_DE_ESTOQUE").select("*").limit(1);
  if (error) {
    console.error("❌ Erro ao conectar com Supabase:", error.message);
  } else {
    console.log("✅ Conectado ao Supabase com sucesso!");
  }
})();

// Controla submenu da sidebar
document.querySelectorAll('.sidebar-item > .sidebar-link').forEach(link => {
  link.addEventListener('click', e => {
    const parent = link.parentElement;
    parent.classList.toggle('active');
  });
});

// === Sidebar ===
const sidebar = document.querySelector(".sidebar");
const toggleBtn = document.getElementById("sidebar-toggle");
const toggleIcon = toggleBtn.querySelector("i");

// Alterna abrir/fechar a sidebar
toggleBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  sidebar.classList.toggle("closed");

  if (sidebar.classList.contains("closed")) {
    toggleIcon.classList.remove("fa-xmark");
    toggleIcon.classList.add("fa-bars");
  } else {
    toggleIcon.classList.remove("fa-bars");
    toggleIcon.classList.add("fa-xmark");
  }
});

// Fecha ao clicar fora da sidebar
document.addEventListener("click", (e) => {
  const clickedOutsideSidebar = !sidebar.contains(e.target) && !toggleBtn.contains(e.target);
  if (!sidebar.classList.contains("closed") && clickedOutsideSidebar) {
    sidebar.classList.add("closed");
    toggleIcon.classList.remove("fa-xmark");
    toggleIcon.classList.add("fa-bars");
  }
});