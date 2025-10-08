// script_dm.js

// Importa o SDK do Supabase
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const SUPABASE_URL = "https://mqjhjcdfgksdfxfzfdlk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xamhqY2RmZ2tzZGZ4ZnpmZGxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDQ0MjAsImV4cCI6MjA3NDk4MDQyMH0.Kbw_ai5CndZvJQ8SJEeVjPHIDsp-6flf941kIJpG6XY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* =============
   HELPERS
   ============= */

// Lê File -> DataURL (base64)
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve('');
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = err => reject(err);
    reader.readAsDataURL(file);
  });
}

// Reduz/comprime image (opcional) -> recebe File, retorna dataURL
async function resizeImageFileToDataURL(file, maxWidth = 1024, quality = 0.7) {
  if (!file) return '';
  const dataUrl = await readFileAsDataURL(file);
  return await new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const ratio = Math.min(1, maxWidth / img.width);
      const w = Math.round(img.width * ratio);
      const h = Math.round(img.height * ratio);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      // qualidade usada apenas com 'image/jpeg'
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(dataUrl); // fallback para original
    img.src = dataUrl;
  });
}

/* ===========================
   SISTEMA DE GESTÃO DE ESTOQUE
   =========================== */
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
    const verEl = document.getElementById('verification-date');
    if (verEl) verEl.value = today;
  }

  bindEvents() {
    const addBtn = document.getElementById('add-item-btn');
    if (addBtn) addBtn.addEventListener('click', (e) => { e.preventDefault(); this.openModal(); });

    const closeModalBtn = document.getElementById('close-modal-btn');
    if (closeModalBtn) closeModalBtn.addEventListener('click', (e) => { e.preventDefault(); this.closeModal(); });

    const cancelModalBtn = document.getElementById('cancel-modal-btn');
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', (e) => { e.preventDefault(); this.closeModal(); });

    const saveBtn = document.getElementById('save-item-btn');
    if (saveBtn) saveBtn.addEventListener('click', (e) => { e.preventDefault(); this.saveItem(); });

    const clearBtn = document.getElementById('clear-form-btn');
    if (clearBtn) clearBtn.addEventListener('click', (e) => { e.preventDefault(); this.clearForm(); });

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

    const itemForm = document.getElementById('item-form');
    if (itemForm) itemForm.addEventListener('input', () => this.validateForm());

    const itemModal = document.getElementById('item-modal');
    if (itemModal) itemModal.addEventListener('click', e => {
      if (e.target.id === 'item-modal') this.closeModal();
    });

    // Auto-generate material ID only if field exists
    const materialNameInput = document.getElementById('material-name');
    if (materialNameInput) {
      materialNameInput.addEventListener('input', e => {
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

    if (!modal) return;

    if (itemId) {
      if (modalTitle) modalTitle.textContent = 'Editar Item';
      if (modalDescription) modalDescription.textContent = 'Edite as informações do item selecionado.';
      this.loadItemData(itemId);
    } else {
      if (modalTitle) modalTitle.textContent = 'Anotar Novo Registro';
      if (modalDescription) modalDescription.textContent = 'Adicione um novo registro ao estoque preenchendo as informações abaixo.';
      this.clearForm();
      const today = new Date().toISOString().split('T')[0];
      const verEl = document.getElementById('verification-date');
      if (verEl) verEl.value = today;
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

    const map = {
      'material-name': item.pn,
      'material-id': item.ecode,
      'material-desc': item.descricao,
      'quantity': item.quantidade,
      'status': item.status,
      'location': item.localizacao_no_estoque,
      'discard-reason': item.motivo_de_descarte,
      'verification-date': item.data_de_verificacao,
      'expiry-date': item.data_de_validade,
      'responsible': item.responsavel_pelo_registro
    };

    Object.keys(map).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = map[id] ?? '';
    });

    // preview do anexo
    const preview = document.getElementById('preview');
    const imageGroup = document.getElementById('image-upload-group');
    const hasImage = document.getElementById('has-image');

    if (item.anexo && preview) {
      preview.innerHTML = `<img src="${item.anexo}" alt="anexo" style="max-width:120px;height:auto;border:1px solid #ddd;padding:4px;border-radius:4px;">`;
      if (imageGroup) imageGroup.style.display = 'block';
      if (hasImage) hasImage.value = 'Sim';
    } else {
      if (preview) preview.innerHTML = '';
      if (imageGroup) imageGroup.style.display = 'none';
      if (hasImage) hasImage.value = 'Não';
    }
  }

  clearForm() {
    const form = document.getElementById('item-form');
    if (form) form.reset();

    // limpa input de arquivo e preview
    const imageInput = document.getElementById('image-upload');
    const preview = document.getElementById('preview');
    const imageGroup = document.getElementById('image-upload-group');
    const hasImage = document.getElementById('has-image');

    if (imageInput) imageInput.value = '';
    if (preview) preview.innerHTML = '';
    if (imageGroup) imageGroup.style.display = 'none';
    if (hasImage) hasImage.value = 'Não';

    // zera edição em andamento
    this.editingItemId = null;

    this.validateForm();
  }

  validateForm() {
  const saveBtn = document.getElementById('save-item-btn');
  if (saveBtn) saveBtn.disabled = false; // força habilitar
}

  async saveItem() {
    // pega valores com guards
    const getVal = id => {
      const el = document.getElementById(id);
      return el ? el.value : '';
    };

    // lê e reduz imagem (se existir)
    let imageData = '';
    const imageInput = document.getElementById('image-upload');
    if (imageInput && imageInput.files && imageInput.files[0]) {
      try {
        // resize para economizar espaço antes de salvar no localStorage
        imageData = await resizeImageFileToDataURL(imageInput.files[0], 1024, 0.7);
      } catch (err) {
        console.warn('Erro ao processar imagem, fallback para original:', err);
        try {
          imageData = await readFileAsDataURL(imageInput.files[0]);
        } catch (err2) {
          imageData = '';
        }
      }
    }

    const formData = {
      pn: getVal('material-name'),
      ecode: getVal('material-id'),
      descricao: getVal('material-desc'),
      quantidade: parseInt(getVal('quantity')) || 0,
      status: getVal('status'),
      localizacao_no_estoque: getVal('location'),
      motivo_de_descarte: getVal('discard-reason'),
      data_de_verificacao: getVal('verification-date'),
      data_de_validade: getVal('expiry-date'),
      responsavel_pelo_registro: getVal('responsible'),
      rota: getVal('route'),
    };

    try {
      // tenta salvar/atualizar no Supabase (opcional, não bloqueante)
      try {
        if (this.editingItemId) {
          await supabase.from("GESTAO_DE_ESTOQUE").update(formData).eq("id", this.editingItemId);
        } else {
          await supabase.from("GESTAO_DE_ESTOQUE").insert([formData]);
        }
      } catch (supErr) {
        console.warn('Supabase (ignorado):', supErr?.message ?? supErr);
      }

      // atualizar localmente (edição ou novo)
      if (this.editingItemId) {
        const idx = this.stockItems.findIndex(i => i.id === this.editingItemId);
        if (idx !== -1) {
          this.stockItems[idx] = { id: this.editingItemId, ...formData };
        } else {
          this.stockItems.push({ id: this.editingItemId, ...formData });
        }
      } else {
        const newId = Date.now().toString();
        this.stockItems.push({ id: newId, ...formData });
      }

      localStorage.setItem('stockItems', JSON.stringify(this.stockItems));
      this.renderTable();
      this.updateItemsCount();
      this.clearForm();

      // fecha modal se existir
      const modal = document.getElementById('item-modal');
      if (modal) modal.classList.remove('active');

      alert('✅ Registro salvo com sucesso!');
    } catch (err) {
      console.error('Erro ao salvar item:', err);
      alert('Erro ao salvar o item.');
    } finally {
      this.editingItemId = null;
    }
  }

  deleteItem(itemId) {
    if (!confirm('Deseja realmente remover este item?')) return;
    this.stockItems = this.stockItems.filter(i => i.id !== itemId);
    localStorage.setItem('stockItems', JSON.stringify(this.stockItems));
    try {
      supabase.from("GESTAO_DE_ESTOQUE").delete().eq("id", itemId);
    } catch (err) {
      // ignore
    }
    this.renderTable();
    this.updateItemsCount();
  }

  getFilteredItems() {
    let filtered = this.stockItems;
    if (this.currentFilter && this.currentFilter !== 'ALL') {
      filtered = filtered.filter(i => i.status === this.currentFilter);
    }
    if (this.currentSearch) {
      const term = this.currentSearch.toLowerCase();
      filtered = filtered.filter(i =>
        (i.pn && i.pn.toLowerCase().includes(term)) ||
        (i.ecode && i.ecode.toLowerCase().includes(term)) ||
        (i.responsavel_pelo_registro && i.responsavel_pelo_registro.toLowerCase().includes(term))
      );
    }
    return filtered;
  }

 renderTable() {
  const tbody = document.getElementById('stock-table-body');
  const noItemsMsg = document.getElementById('no-items-message');
  if (!tbody) return;

  const filtered = this.getFilteredItems();

  if (!filtered.length) {
    tbody.innerHTML = '';
    if (noItemsMsg) noItemsMsg.style.display = 'block';
    const itemsCountEl = document.getElementById('items-count');
    if (itemsCountEl) itemsCountEl.textContent = `Exibindo 0 de ${this.stockItems.length} itens`;
    return;
  }

  if (noItemsMsg) noItemsMsg.style.display = 'none';
  tbody.innerHTML = '';

  filtered.forEach(item => {
    const row = document.createElement('tr');

    // Coluna 1: Nome do material
    const nomeCell = document.createElement('td');
    nomeCell.innerHTML = `
      <div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:320px;">
        ${item.pn || '-'}
      </div>
    `;

    // Coluna 2: Resposta — mostra o valor da rota ou "Sim"
    const respostaCell = document.createElement('td');
    respostaCell.style.textAlign = 'center';
    respostaCell.textContent = item.status || item.responsavel_pelo_registro || 'Sim';

    row.appendChild(nomeCell);
    row.appendChild(respostaCell);

    tbody.appendChild(row);
  });

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
    const itemsCountEl = document.getElementById('items-count');
    if (itemsCountEl) itemsCountEl.textContent = `Exibindo ${this.getFilteredItems().length} de ${this.stockItems.length} itens`;

    const elReg = document.getElementById("registered-count");
    const elNot = document.getElementById("not-registered-count");
    if (elReg) elReg.textContent = this.stockItems.length;
    if (elNot) elNot.textContent = 0;
  }
}

/* ===========================
   BANCO DE MATERIAIS (dados)
   =========================== */
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

/* ===========================
   INICIALIZAÇÃO APÓS DOM
   =========================== */
document.addEventListener('DOMContentLoaded', () => {
  // Popula selects (se existirem)
  ['material-name','material-id','material-desc'].forEach(id => {
    const select = document.getElementById(id);
    if (!select) return;
    materiaisDB.forEach(m => {
      const opt = document.createElement('option');
      if (id === 'material-name') opt.value = m.name;
      else if (id === 'material-id') opt.value = m.code;
      else opt.value = m.desc;
      opt.textContent = opt.value;
      select.appendChild(opt);
    });
  });

  // Sincroniza selects (se existirem)
  const matName = document.getElementById('material-name');
  const matId = document.getElementById('material-id');
  const matDesc = document.getElementById('material-desc');

  if (matName && matId && matDesc) {
    matName.addEventListener('change', () => {
      const match = materiaisDB.find(m => m.name === matName.value);
      if (match) { matId.value = match.code; matDesc.value = match.desc; }
    });
    matId.addEventListener('change', () => {
      const match = materiaisDB.find(m => m.code === matId.value);
      if (match) { matName.value = match.name; matDesc.value = match.desc; }
    });
    matDesc.addEventListener('change', () => {
      const match = materiaisDB.find(m => m.desc === matDesc.value);
      if (match) { matName.value = match.name; matId.value = match.code; }
    });
  }

  // Inicializa StockManager
  const stockManager = new StockManager();
  window.stockManager = stockManager;

  // Teste de conexão (silencioso)
  (async () => {
    try {
      const { data, error } = await supabase.from("GESTAO_DE_ESTOQUE").select("*").limit(1);
      if (error) {
        console.warn("❌ Erro ao conectar com Supabase:", error.message);
      } else {
        console.log("✅ Conectado ao Supabase com sucesso!");
      }
    } catch (err) {
      console.warn("❌ Falha ao testar Supabase (pode ser CORS/offline):", err.message || err);
    }
  })();

  // Controla submenu da sidebar (se existir)
  document.querySelectorAll('.sidebar-item > .sidebar-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      link.parentElement.classList.toggle('active');
    });
  });

  // Sidebar retrátil (guards)
  const sidebar = document.querySelector('.sidebar');
  const menuToggle = document.getElementById('menu-toggle');
  const closeSidebar = document.querySelector('.sidebar .close-sidebar');

  if (sidebar) {
    if (menuToggle) {
      menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('active');
        document.body.classList.toggle('sidebar-open');
      });
    }

    if (closeSidebar) {
      closeSidebar.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.remove('active');
        document.body.classList.remove('sidebar-open');
      });
    }

    document.addEventListener('click', (e) => {
      if (
        sidebar.classList.contains('active') &&
        !sidebar.contains(e.target) &&
        (!menuToggle || !menuToggle.contains(e.target))
      ) {
        sidebar.classList.remove('active');
        document.body.classList.remove('sidebar-open');
      }
    });
  }

  // toggle imagem (se existir)
  const hasImage = document.getElementById('has-image');
  const imageGroup = document.getElementById('image-upload-group');
  const imageInput = document.getElementById('image-upload');
  const preview = document.getElementById('preview');

  if (hasImage && imageGroup) {
    hasImage.addEventListener('change', () => {
      imageGroup.style.display = hasImage.value === 'Sim' ? 'block' : 'none';
      if (preview) preview.innerHTML = '';
    });
  }

  if (imageInput && preview) {
    imageInput.addEventListener('change', () => {
      const file = imageInput.files && imageInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        preview.innerHTML = `<img src="${ev.target.result}" alt="preview" style="max-width:100%;height:auto;border:1px solid #ddd;padding:4px;border-radius:4px;">`;
      };
      reader.readAsDataURL(file);
    });
  }
});
