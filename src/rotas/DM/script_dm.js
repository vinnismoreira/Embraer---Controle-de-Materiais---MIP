// script_dm.js

// ===============================
//  IMPORTAÇÃO DO SUPABASE
// ===============================
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://mqjhjcdfgksdfxfzfdlk.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xamhqY2RmZ2tzZGZ4ZnpmZGxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDQ0MjAsImV4cCI6MjA3NDk4MDQyMH0.Kbw_ai5CndZvJQ8SJEeVjPHIDsp-6flf941kIJpG6XY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===============================
//  HELPERS
// ===============================

// Lê um arquivo e o converte em base64
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve("");
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

// Redimensiona imagem para economizar espaço
async function resizeImageFileToDataURL(file, maxWidth = 1024, quality = 0.7) {
  if (!file) return "";
  const dataUrl = await readFileAsDataURL(file);
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const ratio = Math.min(1, maxWidth / img.width);
      const w = Math.round(img.width * ratio);
      const h = Math.round(img.height * ratio);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

// ===============================
//  CLASSE PRINCIPAL DE GESTÃO
// ===============================
class StockManager {
  constructor() {
    this.stockItems = JSON.parse(localStorage.getItem("stockItems")) || [];
    this.currentFilter = "ALL";
    this.currentSearch = "";
    this.editingItemId = null;
    this.init();
  }

  init() {
    this.bindEvents();
    this.renderTable();
    this.updateItemsCount();

    const today = new Date().toISOString().split("T")[0];
    const verEl = document.getElementById("verification-date");
    if (verEl) verEl.value = today;
  }

  bindEvents() {
    const id = (x) => document.getElementById(x);

    id("add-item-btn")?.addEventListener("click", (e) => {
      e.preventDefault();
      this.openModal();
    });

    id("close-modal-btn")?.addEventListener("click", (e) => {
      e.preventDefault();
      this.closeModal();
    });

    id("cancel-modal-btn")?.addEventListener("click", (e) => {
      e.preventDefault();
      this.closeModal();
    });

    id("save-item-btn")?.addEventListener("click", (e) => {
      e.preventDefault();
      this.saveItem();
    });

    id("clear-form-btn")?.addEventListener("click", (e) => {
      e.preventDefault();
      this.clearForm();
    });

    id("search-input")?.addEventListener("input", (e) => {
      this.currentSearch = e.target.value;
      this.renderTable();
    });

    id("status-filter")?.addEventListener("change", (e) => {
      this.currentFilter = e.target.value;
      this.renderTable();
    });

    id("item-form")?.addEventListener("input", () => this.validateForm());

    const modal = id("item-modal");
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target.id === "item-modal") this.closeModal();
      });
    }

    const matName = id("material-name");
    if (matName) {
      matName.addEventListener("input", (e) => {
        const matId = id("material-id");
        if (matId && !matId.value && e.target.value) {
          matId.value = `MAT-2024-${Date.now().toString().slice(-6)}`;
        }
      });
    }
  }

  openModal(itemId = null) {
    this.editingItemId = itemId;
    const modal = document.getElementById("item-modal");
    if (!modal) return;

    const title = document.getElementById("modal-title");
    const desc = document.getElementById("modal-description");

    if (itemId) {
      title.textContent = "Editar Item";
      desc.textContent = "Edite as informações do item selecionado.";
      this.loadItemData(itemId);
    } else {
      title.textContent = "Anotar Novo Registro";
      desc.textContent =
        "Adicione um novo registro ao estoque preenchendo as informações abaixo.";
      this.clearForm();
      const today = new Date().toISOString().split("T")[0];
      const verEl = document.getElementById("verification-date");
      if (verEl) verEl.value = today;
    }

    modal.classList.add("active");
    this.validateForm();
  }

  closeModal() {
    const modal = document.getElementById("item-modal");
    if (modal) modal.classList.remove("active");
    this.editingItemId = null;
    this.clearForm();
  }

  loadItemData(itemId) {
    const item = this.stockItems.find((i) => i.id === itemId);
    if (!item) return;

    const map = {
      "material-name": item.pn,
      "material-id": item.ecode,
      "material-desc": item.descricao,
      quantity: item.quantidade,
      status: item.status,
      location: item.localizacao_no_estoque,
      "discard-reason": item.motivo_de_descarte,
      "verification-date": item.data_de_verificacao,
      "expiry-date": item.data_de_validade,
      responsible: item.responsavel_pelo_registro,
    };

    Object.entries(map).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) el.value = val ?? "";
    });

    const preview = document.getElementById("preview");
    const imageGroup = document.getElementById("image-upload-group");
    const hasImage = document.getElementById("has-image");

    if (item.anexo && preview) {
      preview.innerHTML = `<img src="${item.anexo}" alt="anexo" style="max-width:120px;height:auto;border:1px solid #ddd;padding:4px;border-radius:4px;">`;
      if (imageGroup) imageGroup.style.display = "block";
      if (hasImage) hasImage.value = "Sim";
    } else {
      preview.innerHTML = "";
      if (imageGroup) imageGroup.style.display = "none";
      if (hasImage) hasImage.value = "Não";
    }
  }

  clearForm() {
    const form = document.getElementById("item-form");
    if (form) form.reset();

    const imageInput = document.getElementById("image-upload");
    const preview = document.getElementById("preview");
    const imageGroup = document.getElementById("image-upload-group");
    const hasImage = document.getElementById("has-image");

    if (imageInput) imageInput.value = "";
    if (preview) preview.innerHTML = "";
    if (imageGroup) imageGroup.style.display = "none";
    if (hasImage) hasImage.value = "Não";

    this.editingItemId = null;
    this.validateForm();
  }

  validateForm() {
    const saveBtn = document.getElementById("save-item-btn");
    if (saveBtn) saveBtn.disabled = false;
  }

  async saveItem() {
    const getVal = (id) => document.getElementById(id)?.value || "";

    let imageData = "";
    const imageInput = document.getElementById("image-upload");

    if (imageInput?.files?.[0]) {
      try {
        imageData = await resizeImageFileToDataURL(imageInput.files[0]);
      } catch {
        imageData = await readFileAsDataURL(imageInput.files[0]);
      }
    }

    const formData = {
      pn: getVal("material-name"),
      ecode: getVal("material-id"),
      descricao: getVal("material-desc"),
      quantidade: parseInt(getVal("quantity")) || 0,
      status: getVal("status"),
      localizacao_no_estoque: getVal("location"),
      motivo_de_descarte: getVal("discard-reason"),
      data_de_verificacao: getVal("verification-date"),
      data_de_validade: getVal("expiry-date"),
      responsavel_pelo_registro: getVal("responsible"),
      anexo: imageData,
    };

    try {
      // Atualiza ou insere no Supabase
      if (this.editingItemId) {
        await supabase
          .from("GESTAO_DE_ESTOQUE")
          .update(formData)
          .eq("id", this.editingItemId);
      } else {
        await supabase.from("GESTAO_DE_ESTOQUE").insert([formData]);
      }

      // Atualiza localStorage
      if (this.editingItemId) {
        const idx = this.stockItems.findIndex(
          (i) => i.id === this.editingItemId
        );
        if (idx !== -1) this.stockItems[idx] = { id: this.editingItemId, ...formData };
      } else {
        this.stockItems.push({ id: Date.now().toString(), ...formData });
      }

      localStorage.setItem("stockItems", JSON.stringify(this.stockItems));
      this.renderTable();
      this.updateItemsCount();
      this.clearForm();

      this.closeModal();
      alert("✅ Registro salvo com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar item:", err);
      alert("Erro ao salvar o item.");
    } finally {
      this.editingItemId = null;
    }
  }

  deleteItem(itemId) {
    if (!confirm("Deseja realmente remover este item?")) return;

    this.stockItems = this.stockItems.filter((i) => i.id !== itemId);
    localStorage.setItem("stockItems", JSON.stringify(this.stockItems));

    supabase.from("GESTAO_DE_ESTOQUE").delete().eq("id", itemId);
    this.renderTable();
    this.updateItemsCount();
  }

  getFilteredItems() {
    let filtered = [...this.stockItems];

    if (this.currentFilter !== "ALL") {
      filtered = filtered.filter((i) => i.status === this.currentFilter);
    }

    if (this.currentSearch) {
      const term = this.currentSearch.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          (i.pn && i.pn.toLowerCase().includes(term)) ||
          (i.ecode && i.ecode.toLowerCase().includes(term)) ||
          (i.responsavel_pelo_registro &&
            i.responsavel_pelo_registro.toLowerCase().includes(term))
      );
    }

    return filtered;
  }

  renderTable() {
    const tbody = document.getElementById("stock-table-body");
    const noItemsMsg = document.getElementById("no-items-message");
    if (!tbody) return;

    const filtered = this.getFilteredItems();
    tbody.innerHTML = "";

    if (!filtered.length) {
      if (noItemsMsg) noItemsMsg.style.display = "block";
      return;
    }

    if (noItemsMsg) noItemsMsg.style.display = "none";

    filtered.forEach((item) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>
          <div style="display:flex;align-items:center;gap:8px;">
            ${
              item.anexo
                ? `<img src="${item.anexo}" alt="thumb" style="width:56px;height:40px;object-fit:cover;border-radius:4px;border:1px solid #ddd;">`
                : ""
            }
            <div style="max-width:320px;overflow:hidden;text-overflow:ellipsis;">
              ${item.pn || "-"}
            </div>
          </div>
        </td>
        <td style="text-align:center;">${item.quantidade ?? "-"}</td>
        <td style="text-align:center;">
          ${
            item.anexo
              ? `<a href="${item.anexo}" target="_blank" rel="noopener" title="Abrir anexo"><i class="fas fa-paperclip"></i></a>`
              : "-"
          }
        </td>
      `;

      tbody.appendChild(row);
    });

    this.updateItemsCount();
  }

  updateItemsCount() {
    const itemsCountEl = document.getElementById("items-count");
    if (itemsCountEl)
      itemsCountEl.textContent = `Exibindo ${this.getFilteredItems().length} de ${this.stockItems.length} itens`;

    const today = new Date().toISOString().split("T")[0];
    const registradosHoje = this.stockItems.filter(
      (i) => i.data_de_verificacao === today
    ).length;
    const naoRegistrados = this.stockItems.length - registradosHoje;

    document.getElementById("registered-count").textContent = registradosHoje;
    document.getElementById("not-registered-count").textContent = naoRegistrados;
  }
}

// ===============================
//  INICIALIZAÇÃO
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  window.stockManager = new StockManager();
});
