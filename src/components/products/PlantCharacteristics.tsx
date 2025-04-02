import { characteristics } from '@/helpers/PlanCharacteristics';

const PlantCharacteristics = () => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">¿Por qué tener plantas en casa?</h2>
      <p className="text-gray-600 mb-8">
        Las plantas no son solo decoración, son compañeras que transforman nuestro espacio y bienestar.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {characteristics.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="mb-4">{item.icon}</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{item.title}</h3>
            <p className="text-gray-600 text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlantCharacteristics;
