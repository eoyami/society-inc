"use client";

import { useState, useEffect } from 'react';

interface EditProfileModalProps {
  user: {
    _id: string;
    name: string;
    username: string;
    image?: string;
    coverImage?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: { name: string; username: string; image?: string; coverImage?: string }) => Promise<void>;
}

export default function EditProfileModal({ user, isOpen, onClose, onSave }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    image: '',
    coverImage: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState(true);

  // Reset state when user prop changes or modal opens
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        image: user.image || '',
        coverImage: user.coverImage || ''
      });
    } else {
      setFormData({
        name: '',
        username: '',
        image: '',
        coverImage: ''
      });
    }
  }, [user, isOpen]);

  // Verificar disponibilidade do username em tempo real
  useEffect(() => {
    const checkUsername = async () => {
      if (!formData.username || formData.username === user?.username) {
        setUsernameError('');
        setUsernameAvailable(true);
        return;
      }

      if (formData.username.length < 3) {
        setUsernameError('O nome de usuário deve ter pelo menos 3 caracteres');
        setUsernameAvailable(false);
        return;
      }

      if (!/^[a-z0-9_]+$/.test(formData.username)) {
        setUsernameError('Use apenas letras minúsculas, números e underscore');
        setUsernameAvailable(false);
        return;
      }

      setIsCheckingUsername(true);
      try {
        const response = await fetch(`/api/users/check-username?username=${formData.username}`);
        const data = await response.json();
        
        if (data.available) {
          setUsernameError('');
          setUsernameAvailable(true);
        } else {
          setUsernameError('Este nome de usuário já está em uso');
          setUsernameAvailable(false);
        }
      } catch (error) {
        setUsernameError('Erro ao verificar disponibilidade');
        setUsernameAvailable(false);
      } finally {
        setIsCheckingUsername(false);
      }
    };

    const timeoutId = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.username, user?.username]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'username' ? value.toLowerCase() : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameAvailable) return;
    
    setIsSaving(true);
    try {
      await onSave({
        name: formData.name || user?.name || '',
        username: formData.username || user?.username || '',
        image: formData.image || user?.image || '',
        coverImage: formData.coverImage || user?.coverImage || ''
      });
      onClose();
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Editar Perfil</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nome de Usuário</label>
            <div className="relative">
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${
                  usernameError ? 'border-red-500' : 
                  usernameAvailable ? 'border-green-500' : 'border-gray-300'
                }`}
                required
              />
              {isCheckingUsername && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>
            {usernameError && (
              <p className="mt-1 text-sm text-red-500">{usernameError}</p>
            )}
            {usernameAvailable && formData.username && formData.username !== user?.username && (
              <p className="mt-1 text-sm text-green-500">Nome de usuário disponível!</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">URL da Foto de Perfil</label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">URL da Capa de Perfil</label>
            <input
              type="text"
              id="coverImage"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isSaving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              disabled={isSaving || !usernameAvailable}
            >
              {isSaving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 