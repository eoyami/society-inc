"use client";

import { useState, useEffect } from 'react';

interface EditProfileModalProps {
  user: {
    _id: string;
    name: string;
    image?: string;
    coverImage?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: { name: string; image?: string; coverImage?: string }) => Promise<void>;
}

export default function EditProfileModal({ user, isOpen, onClose, onSave }: EditProfileModalProps) {
  const [name, setName] = useState(user?.name || '');
  const [image, setImage] = useState(user?.image || '');
  const [coverImage, setCoverImage] = useState(user?.coverImage || '');
  const [isSaving, setIsSaving] = useState(false);

  // Reset state when user prop changes or modal opens
  useEffect(() => {
    if (user) {
      setName(user.name);
      setImage(user.image || '');
      setCoverImage(user.coverImage || '');
    } else {
      setName('');
      setImage('');
      setCoverImage('');
    }
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        name: name || user?.name || '',
        image: image || user?.image || '',
        coverImage: coverImage || user?.coverImage || ''
      });
      onClose();
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      // Implementar feedback para o usuário (ex: toast)
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">URL da Foto de Perfil</label>
            <input
              type="text"
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">URL da Capa de Perfil</label>
            <input
              type="text"
              id="coverImage"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
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
              disabled={isSaving}
            >
              {isSaving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 