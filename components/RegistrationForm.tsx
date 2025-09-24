import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Save, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import EmbraerLogo from './EmbraerLogo';

interface RegistrationFormProps {
  onSubmit: (data: FormData) => void;
  onBack: () => void;
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

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit, onBack }) => {
  const [formData, setFormData] = useState<FormData>({
    materialName: '',
    materialId: '',
    quantity: '',
    status: '',
    location: '',
    discardReason: '',
    verificationDate: '',
    expiryDate: '',
    responsible: '',
    observations: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      handleClear();
    }, 3000);
  };

  const handleClear = () => {
    setFormData({
      materialName: '',
      materialId: '',
      quantity: '',
      status: '',
      location: '',
      discardReason: '',
      verificationDate: '',
      expiryDate: '',
      responsible: '',
      observations: ''
    });
  };

  const isFormValid = formData.materialName && formData.materialId && formData.quantity && 
                     formData.status && formData.location && formData.verificationDate && 
                     formData.responsible;

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
          <Button 
            onClick={onBack}
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Gestão
          </Button>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto p-6">
        {/* Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
            Formulário de Cadastro de Material
          </h1>
          <p className="text-blue-600">Registre novos materiais no sistema de estoque</p>
        </motion.div>

        {/* Success Alert */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-6"
          >
            <Alert className="bg-green-50 border-green-200 text-green-700">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Material cadastrado com sucesso! Os dados foram atualizados na gestão de estoque.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white border-blue-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-blue-700">Informações do Material</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nome do Material */}
                  <div>
                    <Label htmlFor="materialName" className="text-gray-700">
                      Nome do Material *
                    </Label>
                    <Input
                      id="materialName"
                      value={formData.materialName}
                      onChange={(e) => handleInputChange('materialName', e.target.value)}
                      className="bg-white border-blue-300"
                      placeholder="Ex: Turbina A320"
                      required
                    />
                  </div>

                  {/* Código/ID do Material */}
                  <div>
                    <Label htmlFor="materialId" className="text-gray-700">
                      Código/ID do Material *
                    </Label>
                    <Input
                      id="materialId"
                      value={formData.materialId}
                      onChange={(e) => handleInputChange('materialId', e.target.value)}
                      className="bg-white border-blue-300"
                      placeholder="Ex: MAT-2024-001"
                      required
                    />
                  </div>

                  {/* Quantidade */}
                  <div>
                    <Label htmlFor="quantity" className="text-gray-700">
                      Quantidade *
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange('quantity', e.target.value)}
                      className="bg-white border-blue-300"
                      placeholder="Ex: 10"
                      required
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <Label className="text-gray-700">Status *</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                      <SelectTrigger className="bg-white border-blue-300">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-blue-200">
                        <SelectItem value="OK">OK</SelectItem>
                        <SelectItem value="EM FALTA">Em Falta</SelectItem>
                        <SelectItem value="EM DESCARTE">Em Descarte</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Localização no Estoque */}
                  <div>
                    <Label htmlFor="location" className="text-gray-700">
                      Localização no Estoque *
                    </Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="bg-white border-blue-300"
                      placeholder="Ex: Setor A - Prateleira 12"
                      required
                    />
                  </div>

                  {/* Motivo de Descarte */}
                  <div>
                    <Label className="text-gray-700">Motivo de Descarte</Label>
                    <Select value={formData.discardReason} onValueChange={(value) => handleInputChange('discardReason', value)}>
                      <SelectTrigger className="bg-white border-blue-300">
                        <SelectValue placeholder="Selecione o motivo" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-blue-200">
                        <SelectItem value="Nenhum Uso">Nenhum Uso</SelectItem>
                        <SelectItem value="Total">Total</SelectItem>
                        <SelectItem value="Validade Vencida">Validade Vencida</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Data de Verificação */}
                  <div>
                    <Label htmlFor="verificationDate" className="text-gray-700">
                      Data de Verificação *
                    </Label>
                    <Input
                      id="verificationDate"
                      type="date"
                      value={formData.verificationDate}
                      onChange={(e) => handleInputChange('verificationDate', e.target.value)}
                      className="bg-white border-blue-300"
                      required
                    />
                  </div>

                  {/* Data de Validade */}
                  <div>
                    <Label htmlFor="expiryDate" className="text-gray-700">
                      Data de Validade
                    </Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                      className="bg-white border-blue-300"
                    />
                  </div>

                  {/* Responsável pelo Cadastro */}
                  <div className="md:col-span-2">
                    <Label htmlFor="responsible" className="text-gray-700">
                      Responsável pelo Cadastro *
                    </Label>
                    <Input
                      id="responsible"
                      value={formData.responsible}
                      onChange={(e) => handleInputChange('responsible', e.target.value)}
                      className="bg-white border-blue-300"
                      placeholder="Ex: João Silva"
                      required
                    />
                  </div>

                  {/* Observações Adicionais */}
                  <div className="md:col-span-2">
                    <Label htmlFor="observations" className="text-gray-700">
                      Observações Adicionais
                    </Label>
                    <Textarea
                      id="observations"
                      value={formData.observations}
                      onChange={(e) => handleInputChange('observations', e.target.value)}
                      className="bg-white border-blue-300 min-h-20"
                      placeholder="Informações adicionais sobre o material..."
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button
                    type="button"
                    onClick={handleClear}
                    variant="outline"
                    className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Limpar Formulário
                  </Button>
                  <Button
                    type="submit"
                    disabled={!isFormValid}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    ENVIAR
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default RegistrationForm;