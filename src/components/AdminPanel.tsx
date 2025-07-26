import React, { useState } from 'react';
import { Dog } from '../types/dog';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface AdminPanelProps {
  dogs: Dog[];
  onUpdateDogs: (dogs: Dog[]) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ dogs, onUpdateDogs }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingDog, setEditingDog] = useState<Dog | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [formData, setFormData] = useState<Partial<Dog>>({
    name: '',
    breed: '',
    age: 1,
    gender: 'Male',
    size: 'Medium',
    image: '',
    description: '',
    personality: [],
    medicalHistory: [],
    adoptionStatus: 'Available',
    dateArrived: new Date().toISOString().split('T')[0],
    specialNeeds: [],
  });

  const handleEdit = (dog: Dog) => {
    setEditingDog(dog);
    setFormData(dog);
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    setEditingDog(null);
    setFormData({
      name: '',
      breed: '',
      age: 1,
      gender: 'Male',
      size: 'Medium',
      image: '',
      description: '',
      personality: [],
      medicalHistory: [],
      adoptionStatus: 'Available',
      dateArrived: new Date().toISOString().split('T')[0],
      specialNeeds: [],
    });
    setIsAddingNew(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.breed) return;

    const newDog: Dog = {
      id: editingDog?.id || Date.now().toString(),
      name: formData.name!,
      breed: formData.breed!,
      age: formData.age!,
      gender: formData.gender as 'Male' | 'Female',
      size: formData.size as 'Small' | 'Medium' | 'Large',
      image: formData.image!,
      description: formData.description!,
      personality: formData.personality!,
      medicalHistory: formData.medicalHistory!,
      adoptionStatus: formData.adoptionStatus as 'Available' | 'Pending' | 'Adopted',
      dateArrived: formData.dateArrived!,
      specialNeeds: formData.specialNeeds!,
    };

    let updatedDogs;
    if (editingDog) {
      updatedDogs = dogs.map(dog => dog.id === editingDog.id ? newDog : dog);
    } else {
      updatedDogs = [...dogs, newDog];
    }

    onUpdateDogs(updatedDogs);
    setEditingDog(null);
    setIsAddingNew(false);
  };

  const handleDelete = (dogId: string) => {
    if (confirm('Are you sure you want to delete this dog?')) {
      const updatedDogs = dogs.filter(dog => dog.id !== dogId);
      onUpdateDogs(updatedDogs);
    }
  };

  const handleArrayInput = (field: 'personality' | 'medicalHistory' | 'specialNeeds', value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({ ...prev, [field]: items }));
  };

  if (!isOpen && !editingDog && !isAddingNew) {
    return (
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-all duration-200"
        >
          <Edit className="w-4 h-4" />
          Admin Panel
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
            <button
              onClick={() => {
                setIsOpen(false);
                setEditingDog(null);
                setIsAddingNew(false);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {(editingDog || isAddingNew) ? (
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">
              {editingDog ? `Edit ${editingDog.name}` : 'Add New Dog'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
                <input
                  type="text"
                  value={formData.breed || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, breed: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input
                  type="number"
                  value={formData.age || 1}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  value={formData.gender || 'Male'}
                  onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as 'Male' | 'Female' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                <select
                  value={formData.size || 'Medium'}
                  onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value as 'Small' | 'Medium' | 'Large' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adoption Status</label>
                <select
                  value={formData.adoptionStatus || 'Available'}
                  onChange={(e) => setFormData(prev => ({ ...prev, adoptionStatus: e.target.value as 'Available' | 'Pending' | 'Adopted' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Available">Available</option>
                  <option value="Pending">Pending</option>
                  <option value="Adopted">Adopted</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.image || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Personality (comma-separated)</label>
                <input
                  type="text"
                  value={formData.personality?.join(', ') || ''}
                  onChange={(e) => handleArrayInput('personality', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medical History (comma-separated)</label>
                <input
                  type="text"
                  value={formData.medicalHistory?.join(', ') || ''}
                  onChange={(e) => handleArrayInput('medicalHistory', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Needs (comma-separated)</label>
                <input
                  type="text"
                  value={formData.specialNeeds?.join(', ') || ''}
                  onChange={(e) => handleArrayInput('specialNeeds', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Arrived</label>
                <input
                  type="date"
                  value={formData.dateArrived || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateArrived: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={() => {
                  setEditingDog(null);
                  setIsAddingNew(false);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Manage Dogs</h3>
              <button
                onClick={handleAddNew}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New Dog
              </button>
            </div>

            <div className="space-y-4">
              {dogs.map((dog) => (
                <div key={dog.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <img src={dog.image} alt={dog.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div>
                      <h4 className="font-semibold">{dog.name}</h4>
                      <p className="text-sm text-gray-600">{dog.breed} • {dog.adoptionStatus}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(dog)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(dog.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};