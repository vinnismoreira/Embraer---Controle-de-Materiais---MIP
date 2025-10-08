// Importa o SDK do Supabase
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const SUPABASE_URL = "https://mqjhjcdfgksdfxfzfdlk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xamhqY2RmZ2tzZGZ4ZnpmZGxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDQ0MjAsImV4cCI6MjA3NDk4MDQyMH0.Kbw_ai5CndZvJQ8SJEeVjPHIDsp-6flf941kIJpG6XY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================
// SISTEMA DE GESTÃO DE ESTOQUE
// ==========================
class SimpleFormManager {
    constructor() {
        this.items = JSON.parse(localStorage.getItem("REGISTROS_LIMPEZA")) || [];
        this.tableBody = document.getElementById("stock-table-body");
        this.noItemsMsg = document.getElementById("no-items-message");
        this.init();
    }

    init() {
        const saveBtn = document.getElementById("save-item-btn");
        const cancelBtn = document.getElementById("cancel-modal-btn");
        const closeBtn = document.getElementById("close-modal-btn");

        if (saveBtn) saveBtn.addEventListener("click", () => this.saveItem());
        if (cancelBtn) cancelBtn.addEventListener("click", () => this.clearForm());
        if (closeBtn) closeBtn.addEventListener("click", () => this.clearForm());

        this.renderTable();
    }

    getFormData() {
        return {
            id: Date.now().toString(),
            clean: document.getElementById("clean").value,
            ponto: document.getElementById("ponto").value,
            verificationDate: document.getElementById("verification-date").value,
            observation: document.getElementById("observation").value.trim()
        };
    }

    saveItem() {
        const data = this.getFormData();

        if (!data.clean || !data.ponto || !data.verificationDate) {
            alert("Por favor, preencha todos os campos obrigatórios!");
            return;
        }

        this.items.push(data);
        this.updateLocalStorage();
        this.renderTable();
        this.clearForm();
        alert("✅ Registro salvo com sucesso!");
    }

    deleteItem(id) {
        if (!confirm("Deseja realmente remover este registro?")) return;
        this.items = this.items.filter(i => i.id !== id);
        this.updateLocalStorage();
        this.renderTable();
    }

    updateLocalStorage() {
        localStorage.setItem("REGISTROS_LIMPEZA", JSON.stringify(this.items));
    }

    clearForm() {
        document.getElementById("item-form").reset();
    }

    renderTable() {
        if (!this.tableBody || !this.noItemsMsg) return;

        if (this.items.length === 0) {
            this.tableBody.innerHTML = "";
            this.noItemsMsg.style.display = "block";
            return;
        }

        this.noItemsMsg.style.display = "none";
        this.tableBody.innerHTML = "";

        this.items.forEach(item => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${item.clean}</td>
                <td class="center-column">${item.ponto}</td>
                <td class="center-column">${new Date(item.verificationDate).toLocaleDateString("pt-BR")}</td>
                <td class="right-column">${item.observation || "-"}</td>
                <td><a href="#" class="delete-link" data-id="${item.id}">Excluir</a></td>
            `;
            this.tableBody.appendChild(tr);
        });

        // Botão de excluir
        this.tableBody.querySelectorAll(".delete-link").forEach(link => {
            link.addEventListener("click", e => {
                e.preventDefault();
                this.deleteItem(e.currentTarget.dataset.id);
            });
        });
    }
}

// Inicializa o sistema
document.addEventListener("DOMContentLoaded", () => {
    new SimpleFormManager();
});
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