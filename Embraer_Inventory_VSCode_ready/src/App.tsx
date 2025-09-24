import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import StockManagement from "./components/StockManagement";
import RegistrationForm from "./components/RegistrationForm";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";

interface StockItem {
  id: string;
  name: string;
  materialId: string;
  quantity: number;
  verifiedBy: string;
  verifiedDate: string;
  status: "OK" | "EM FALTA" | "VENCIDO" | "EM DESCARTE";
}

interface FormData {
  materialName: string;
  materialId: string;
  quantity: string;
  status: string;
  location: string;
  discardReason: string;
  verificationDate: string;
  expiryDate: string;
  responsible: string;
  observations: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<
    "stock" | "form"
  >("stock");
  const [stockItems, setStockItems] = useState<StockItem[]>([
    {
      id: "1",
      name: "Turbina CFM56-7B",
      materialId: "MAT-2024-001",
      quantity: 5,
      verifiedBy: "Carlos Santos",
      verifiedDate: "15/01/2024",
      status: "OK",
    },
    {
      id: "2",
      name: "Sistema Hidráulico A320",
      materialId: "MAT-2024-002",
      quantity: 0,
      verifiedBy: "Ana Silva",
      verifiedDate: "14/01/2024",
      status: "EM FALTA",
    },
    {
      id: "3",
      name: "Componente Avionics E-Jet",
      materialId: "MAT-2024-003",
      quantity: 12,
      verifiedBy: "Roberto Lima",
      verifiedDate: "10/01/2024",
      status: "VENCIDO",
    },
    {
      id: "4",
      name: "Peça Estrutural Legacy 600",
      materialId: "MAT-2024-004",
      quantity: 8,
      verifiedBy: "Fernanda Costa",
      verifiedDate: "08/01/2024",
      status: "EM DESCARTE",
    },
    {
      id: "5",
      name: "Sistema de Combustível KC-390",
      materialId: "MAT-2024-005",
      quantity: 15,
      verifiedBy: "Pedro Oliveira",
      verifiedDate: "16/01/2024",
      status: "OK",
    },
  ]);

  const handleAddItem = (item: Omit<StockItem, "id">) => {
    const newItem: StockItem = {
      ...item,
      id: Date.now().toString(),
    };
    setStockItems((prev) => [...prev, newItem]);
    toast.success("Item adicionado com sucesso!");
  };

  const handleEditItem = (
    id: string,
    updates: Partial<StockItem>,
  ) => {
    setStockItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updates } : item,
      ),
    );
    toast.success("Item editado com sucesso!");
  };

  const handleDeleteItem = (id: string) => {
    setStockItems((prev) =>
      prev.filter((item) => item.id !== id),
    );
    toast.success("Item removido com sucesso!");
  };

  const handleFormSubmit = (formData: FormData) => {
    // Convert form data to stock item
    const newStockItem: StockItem = {
      id: Date.now().toString(),
      name: formData.materialName,
      materialId: formData.materialId,
      quantity: parseInt(formData.quantity),
      verifiedBy: formData.responsible,
      verifiedDate: new Date(
        formData.verificationDate,
      ).toLocaleDateString("pt-BR"),
      status: formData.status as StockItem["status"],
    };

    setStockItems((prev) => [...prev, newStockItem]);
    toast.success(
      "Material cadastrado e adicionado ao estoque!",
    );

    // Navigate back to stock management after a short delay
    setTimeout(() => {
      setCurrentPage("stock");
    }, 2000);
  };

  const navigateToForm = () => {
    setCurrentPage("form");
  };

  const navigateToStock = () => {
    setCurrentPage("stock");
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {currentPage === "stock" ? (
          <motion.div
            key="stock"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <StockManagement
              stockItems={stockItems}
              onAddItem={handleAddItem}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
              onNavigateToForm={navigateToForm}
            />
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            <RegistrationForm
              onSubmit={handleFormSubmit}
              onBack={navigateToStock}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "white",
            border: "1px solid rgb(147 197 253)",
            color: "rgb(17 24 39)",
          },
        }}
      />
    </div>
  );
}