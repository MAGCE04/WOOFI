import React, { useState } from 'react';
import { DogCard } from './DogCard';
import { DogModal } from './DogModal';
import { AdminPanel } from './AdminPanel';
import { shelterDogs } from '../data/dogs';
import { Dog } from '../types/dog';
import { Filter, Search, Heart, Users, Calendar, TrendingUp } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { DONATION_CONFIG } from '../config/donation';

export const Dashboard: React.FC = () => {
  const { publicKey } = useWallet();
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dogs, setDogs] = useState<Dog[]>(shelterDogs);

  const isAdmin = publicKey?.toString() === DONATION_CONFIG.recipientWallet;

  const filteredDogs = dogs.filter(dog => {
    const matchesSearch = dog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dog.breed.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || dog.adoptionStatus.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalDogs = dogs.length;
  const availableDogs = dogs.filter(dog => dog.adoptionStatus === 'Available').length;
  const pendingDogs = dogs.filter(dog => dog.adoptionStatus === 'Pending').length;
  const adoptedDogs = dogs.filter(dog => dog.adoptionStatus === 'Adopted').length;

  return (
    <div className="relative z-10 min-h-screen">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Dogs</p>
                <p className="text-2xl font-bold text-gray-900">{totalDogs}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-green-600">{availableDogs}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{pendingDogs}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Adopted</p>
                <p className="text-2xl font-bold text-purple-600">{adoptedDogs}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Shelter Dogs</h2>
            <p className="text-gray-600">Help us find loving homes for these amazing companions</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or breed..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="pending">Pending</option>
              <option value="adopted">Adopted</option>
            </select>
          </div>
        </div>

        {/* Dogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDogs.map((dog) => (
            <DogCard 
              key={dog.id} 
              dog={dog} 
              onClick={() => setSelectedDog(dog)}
            />
          ))}
        </div>

        {filteredDogs.length === 0 && (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No dogs found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      <DogModal 
        dog={selectedDog} 
        onClose={() => setSelectedDog(null)} 
      />

      {isAdmin && (
        <AdminPanel 
          dogs={dogs}
          onUpdateDogs={setDogs}
        />
      )}
    </div>
  );
};