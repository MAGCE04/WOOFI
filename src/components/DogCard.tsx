import React from 'react';
import { Dog } from '../types/dog';

interface DogCardProps {
  dog: Dog;
  onClick: () => void;
}

export const DogCard: React.FC<DogCardProps> = ({ dog, onClick }) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100"
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={dog.image} 
          alt={dog.name}
          className="w-full h-48 object-cover"
        />
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
          dog.adoptionStatus === 'Available' ? 'bg-green-100 text-green-800' :
          dog.adoptionStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {dog.adoptionStatus}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{dog.name}</h3>
        <p className="text-gray-600 mb-3">{dog.breed} • {dog.age} years • {dog.gender}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {dog.personality.slice(0, 3).map((trait, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {trait}
            </span>
          ))}
        </div>
        
        <p className="text-gray-700 text-sm line-clamp-2">{dog.description}</p>
      </div>
    </div>
  );
};