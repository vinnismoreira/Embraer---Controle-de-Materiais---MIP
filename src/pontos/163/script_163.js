// Importa o SDK do Supabase
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const SUPABASE_URL = "https://mqjhjcdfgksdfxfzfdlk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xamhqY2RmZ2tzZGZ4ZnpmZGxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDQ0MjAsImV4cCI6MjA3NDk4MDQyMH0.Kbw_ai5CndZvJQ8SJEeVjPHIDsp-6flf941kIJpG6XY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================
// SISTEMA DE GESTÃO DE ESTOQUE
// ==========================
class StockManager {

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

    constructor() {
    this.stockItems = [];
    this.currentFilter = 'ALL';
    this.currentSearch = '';
    this.editingItemId = null;
    this.init();
}

    init() {
        this.bindEvents();
        this.loadFromDatabase();
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

   // ==========================
// SISTEMA DE REGISTRO LIMPEZA (LOCAL STORAGE)
// ==========================
class RegistroLimpeza {
  constructor() {
    this.registros = [];
    this.editandoId = null;
    this.init();
  }

  init() {
    this.bindEvents();
    this.loadFromLocalStorage();

    // Define a data de hoje automaticamente
    const hoje = new Date().toISOString().split("T")[0];
    document.getElementById("verification-date").value = hoje;
  }

  bindEvents() {
    document
      .getElementById("add-item-btn")
      ?.addEventListener("click", () => this.openModal());
    document
      .getElementById("close-modal-btn")
      ?.addEventListener("click", () => this.closeModal());
    document
      .getElementById("cancel-modal-btn")
      ?.addEventListener("click", () => this.closeModal());
    document
      .getElementById("save-item-btn")
      ?.addEventListener("click", () => this.saveItem());
    document
      .getElementById("clear-form-btn")
      ?.addEventListener("click", () => this.clearForm());
  }

  // === LOCAL STORAGE ===
  loadFromLocalStorage() {
    const data = localStorage.getItem("REGISTRO_LIMPEZA");
    this.registros = data ? JSON.parse(data) : [];
    this.renderTable();
  }

  saveToLocalStorage() {
    localStorage.setItem("REGISTRO_LIMPEZA", JSON.stringify(this.registros));
  }

  // === CRUD ===
  saveItem() {
    const formData = {
      id: this.editandoId || Date.now(),
      limpo: document.getElementById("clean").value,
      ponto: document.getElementById("ponto").value,
      data_de_verificacao: document.getElementById("verification-date").value,
      observacao: document.getElementById("observation").value.trim(),
    };

    if (!formData.limpo || !formData.ponto || !formData.data_de_verificacao) {
      alert("⚠️ Preencha todos os campos obrigatórios!");
      return;
    }

    if (this.editandoId) {
      // Editar existente
      const index = this.registros.findIndex((r) => r.id === this.editandoId);
      if (index !== -1) this.registros[index] = formData;
      alert("✏️ Registro atualizado com sucesso!");
    } else {
      // Novo registro
      this.registros.unshift(formData);
      alert("✅ Registro salvo com sucesso!");
    }

    this.saveToLocalStorage();
    this.closeModal();
    this.renderTable();
  }

  deleteItem(id) {
    if (!confirm("🗑️ Deseja realmente excluir este registro?")) return;
    this.registros = this.registros.filter((r) => r.id !== id);
    this.saveToLocalStorage();
    this.renderTable();
  }

  // === Modal ===
  openModal(id = null) {
    this.editandoId = id;
    const modal = document.getElementById("item-modal");

    document.getElementById("modal-title").textContent = id
      ? "Editar Registro"
      : "Anotar Novo Registro";
    document.getElementById("modal-description").textContent = id
      ? "Edite as informações do registro abaixo."
      : "Preencha as informações abaixo para registrar.";

    if (id) this.loadItemData(id);
    else this.clearForm();

    modal.classList.add("active");
  }

  closeModal() {
    document.getElementById("item-modal").classList.remove("active");
    this.editandoId = null;
    this.clearForm();
  }

  clearForm() {
    document.getElementById("item-form").reset();
    const hoje = new Date().toISOString().split("T")[0];
    document.getElementById("verification-date").value = hoje;
  }

  loadItemData(id) {
    const item = this.registros.find((r) => r.id === id);
    if (!item) return;
    document.getElementById("clean").value = item.limpo;
    document.getElementById("ponto").value = item.ponto;
    document.getElementById("verification-date").value =
      item.data_de_verificacao;
    document.getElementById("observation").value = item.observacao;
  }

  // === Renderiza a tabela ===
  renderTable() {
    const tbody = document.getElementById("stock-table-body");
    const msg = document.getElementById("no-items-message");

    if (!this.registros.length) {
      tbody.innerHTML = "";
      msg.style.display = "block";
      return;
    }

    msg.style.display = "none";
    tbody.innerHTML = "";

    this.registros.forEach((r) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${r.limpo || "-"}</td>
        <td>${r.ponto || "-"}</td>
        <td>${r.data_de_verificacao || "-"}</td>
        <td>${r.observacao || "-"}</td>
        <td>
          <a href="#" class="action-link action-edit" data-id="${r.id}">Editar</a>
          <a href="#" class="action-link action-delete" data-id="${r.id}">Excluir</a>
        </td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll(".action-edit").forEach((btn) =>
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.openModal(Number(e.target.dataset.id));
      })
    );

    tbody.querySelectorAll(".action-delete").forEach((btn) =>
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.deleteItem(Number(e.target.dataset.id));
      })
    );
  }
}

// === Inicializa o sistema ===
const registroLimpeza = new RegistroLimpeza();
window.registroLimpeza = registroLimpeza;

// Controla submenu da sidebar
document.querySelectorAll('.sidebar-item > .sidebar-link').forEach(link => {
  link.addEventListener('click', e => {
    const parent = link.parentElement;
    parent.classList.toggle('active');
  });
});

// === Sidebar retrátil (apenas um botão) ===
const sidebar = document.querySelector('.sidebar');
const menuToggle = document.getElementById('menu-toggle');

if (menuToggle && sidebar) {
  // Abre/fecha sidebar
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('active');
    document.body.classList.toggle('sidebar-open');
  });

  // Fecha ao clicar fora
  document.addEventListener('click', (e) => {
    if (
      sidebar.classList.contains('active') &&
      !sidebar.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      sidebar.classList.remove('active');
      document.body.classList.remove('sidebar-open');
    }
  });
}

// Seleciona o X dentro da sidebar
const closeSidebar = document.querySelector('.sidebar .close-sidebar');

if (closeSidebar && sidebar) {
  closeSidebar.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.remove('active');
    document.body.classList.remove('sidebar-open');
  });
}