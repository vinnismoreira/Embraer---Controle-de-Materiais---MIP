import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Package, Edit3, Trash2, Search, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import EmbraerLogo from './EmbraerLogo';

interface StockItem {
  id: string;
  name: string;
  materialId: string;
  quantity: number;
  verifiedBy: string;
  verifiedDate: string;
  status: 'OK' | 'EM FALTA' | 'VENCIDO' | 'EM DESCARTE';
}

interface StockManagementProps {
  stockItems: StockItem[];
  onAddItem: (item: Omit<StockItem, 'id'>) => void;
  onEditItem: (id: string, item: Partial<StockItem>) => void;
  onDeleteItem: (id: string) => void;
  onNavigateToForm: () => void;
}

const StockManagement: React.FC<StockManagementProps> = ({
  stockItems,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onNavigateToForm
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    price: ''
  });

  const statusColors = {
    'OK': 'bg-green-500',
    'EM FALTA': 'bg-red-500',
    'VENCIDO': 'bg-orange-500',
    'EM DESCARTE': 'bg-gray-500'
  };

  const filteredItems = stockItems.filter(item => {
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.materialId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleAddItem = () => {
    if (newItem.name && newItem.quantity) {
      onAddItem({
        name: newItem.name,
        materialId: `MAT-${Date.now()}`,
        quantity: parseInt(newItem.quantity),
        verifiedBy: 'Sistema',
        verifiedDate: new Date().toLocaleDateString('pt-BR'),
        status: 'OK'
      });
      setNewItem({ name: '', quantity: '', price: '' });
      setIsModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 border-b border-blue-200 px-6 py-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <EmbraerLogo />
          <div className="flex items-center gap-4">
            <Button 
              onClick={onNavigateToForm}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Formulário de Cadastro
            </Button>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Anotar Item
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white border-blue-200">
                <DialogHeader>
                  <DialogTitle className="text-blue-700">Anotar Novo Item</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Adicione um novo item ao estoque preenchendo as informações abaixo.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      className="bg-white border-blue-300"
                      placeholder="Nome do produto"
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantity">Quantidade</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                      className="bg-white border-blue-300"
                      placeholder="Quantidade"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Preço</Label>
                    <Input
                      id="price"
                      value={newItem.price}
                      onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                      className="bg-white border-blue-300"
                      placeholder="R$ 0,00"
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 border-blue-300 text-blue-600"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleAddItem}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    >
                      Salvar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
            Gestão de Estoque
          </h1>
          <p className="text-blue-600">Controle e monitoramento de materiais aeronáuticos</p>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="bg-white border-blue-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-blue-700 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-64">
                  <Label htmlFor="search">Buscar</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-4 h-4" />
                    <Input
                      id="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar por nome ou ID do material..."
                      className="pl-10 bg-white border-blue-300"
                    />
                  </div>
                </div>
                <div className="min-w-48">
                  <Label>Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-white border-blue-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-blue-200">
                      <SelectItem value="ALL">Todos os Status</SelectItem>
                      <SelectItem value="OK">OK</SelectItem>
                      <SelectItem value="EM FALTA">EM FALTA</SelectItem>
                      <SelectItem value="VENCIDO">VENCIDO</SelectItem>
                      <SelectItem value="EM DESCARTE">EM DESCARTE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white border-blue-200 shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-blue-200 hover:bg-blue-50">
                    <TableHead className="text-blue-700">Nome do Produto</TableHead>
                    <TableHead className="text-blue-700">ID do Material</TableHead>
                    <TableHead className="text-blue-700">Quantidade</TableHead>
                    <TableHead className="text-blue-700">Verificado por</TableHead>
                    <TableHead className="text-blue-700">Status</TableHead>
                    <TableHead className="text-blue-700 text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="border-blue-200 hover:bg-blue-50 transition-colors"
                    >
                      <TableCell className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-900">{item.name}</span>
                      </TableCell>
                      <TableCell className="text-gray-600">{item.materialId}</TableCell>
                      <TableCell className="text-gray-900">{item.quantity}</TableCell>
                      <TableCell className="text-gray-600">
                        <div>
                          <div>{item.verifiedBy}</div>
                          <div className="text-xs text-blue-600">{item.verifiedDate}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={`${statusColors[item.status]} text-white border-0`}
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-blue-600 hover:bg-blue-100 p-2"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDeleteItem(item.id)}
                            className="text-red-600 hover:bg-red-100 p-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                  {filteredItems.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        Nenhum item encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer with pagination */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex items-center justify-between text-gray-600"
        >
          <div>
            Exibindo {filteredItems.length} de {stockItems.length} itens
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-blue-300 text-blue-600">
              Anterior
            </Button>
            <Button variant="outline" size="sm" className="border-blue-300 text-blue-600">
              1
            </Button>
            <Button variant="outline" size="sm" className="border-blue-300 text-blue-600">
              Próximo
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StockManagement;