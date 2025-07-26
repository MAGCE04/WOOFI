import { Dog } from '../types/dog';

interface DogCardProps {
  dog: Dog;
  isSelected: boolean;
  onSelect: (dog: Dog) => void;
}

export function DogCard({ dog, isSelected, onSelect }: DogCardProps) {
  return (
    <div 
      className={`border rounded-lg overflow-hidden shadow-md cursor-pointer transition-all ${
        isSelected ? 'ring-4 ring-blue-500' : 'hover:shadow-lg'
      }`}
      onClick={() => onSelect(dog)}
    >
      <img src={dog.image} alt={dog.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-bold">{dog.name}</h3>
        <p className="text-gray-600">{dog.breed}, {dog.age} years</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {dog.personality.slice(0, 3).map((trait, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {trait}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}