import React, { useMemo } from 'react';
import { UserProfile } from '../../types';

interface PhotoAnalysisProps {
  allUsers: UserProfile[];
}

const PhotoAnalysis: React.FC<PhotoAnalysisProps> = ({ allUsers }) => {

  const duplicatePhotos = useMemo(() => {
    const photoMap = new Map<string, UserProfile[]>();
    allUsers.forEach(user => {
      user.photos.forEach(photoUrl => {
        if (!photoMap.has(photoUrl)) {
          photoMap.set(photoUrl, []);
        }
        photoMap.get(photoUrl)!.push(user);
      });
    });

    const duplicates: { photoUrl: string; users: UserProfile[] }[] = [];
    photoMap.forEach((users, photoUrl) => {
      if (users.length > 1) {
        duplicates.push({ photoUrl, users });
      }
    });
    return duplicates;
  }, [allUsers]);

  // Simulação de detecção de fotos de banco de imagens
  const stockPhotos = useMemo(() => {
    // Em um app real, isso usaria uma API de análise de imagem.
    // Aqui, vamos apenas simular com base em uma foto de um usuário.
    const userWithStockPhoto = allUsers.find(u => u.email === 'john.doe@example.com'); // Exemplo
    if (userWithStockPhoto && userWithStockPhoto.photos.length > 0) {
        return [{ photoUrl: userWithStockPhoto.photos[0], user: userWithStockPhoto }];
    }
    return [];
  }, [allUsers]);


  const DuplicatePhotoCard: React.FC<{ photoUrl: string; users: UserProfile[] }> = ({ photoUrl, users }) => (
    <div className="border rounded-lg p-4">
        <img src={photoUrl} alt="Foto duplicada" className="w-full h-40 object-cover rounded-md mb-3"/>
        <p className="font-bold text-sm text-gray-800">Usada por {users.length} perfis:</p>
        <ul className="text-xs text-gray-600 list-disc list-inside mt-1">
            {users.map(u => <li key={u.id}>{u.name} ({u.email})</li>)}
        </ul>
    </div>
  );
  
  return (
    <div className="space-y-6">
        <div>
            <h4 className="font-bold text-gray-800 mb-2">Scanner de Fotos Duplicadas</h4>
            {duplicatePhotos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {duplicatePhotos.map(dp => (
                        <DuplicatePhotoCard key={dp.photoUrl} photoUrl={dp.photoUrl} users={dp.users} />
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-sm">Nenhuma foto duplicada encontrada entre os perfis.</p>
            )}
        </div>
        <div>
            <h4 className="font-bold text-gray-800 mb-2">Detecção de Fotos de Stock/Internet (Simulado)</h4>
             {stockPhotos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                   {stockPhotos.map(sp => (
                        <div key={sp.user.id} className="border border-yellow-400 bg-yellow-50 rounded-lg p-4">
                            <img src={sp.photoUrl} alt="Foto de stock" className="w-full h-40 object-cover rounded-md mb-3"/>
                             <p className="font-bold text-sm text-yellow-800">Possível foto de internet</p>
                            <p className="text-xs text-yellow-700">Usada por: {sp.user.name}</p>
                        </div>
                   ))}
                </div>
            ) : (
                <p className="text-gray-500 text-sm">Nenhuma foto de internet detectada.</p>
            )}
        </div>
         <div>
            <h4 className="font-bold text-gray-800 mb-2">Busca Reversa de Imagens</h4>
            <p className="text-gray-500 text-sm">Para verificar a autenticidade de uma foto, use uma ferramenta de busca reversa (ex: Google Lens). Isso pode ajudar a identificar se uma imagem foi retirada de redes sociais de outra pessoa ou de bancos de imagem.</p>
        </div>
    </div>
  );
};

export default PhotoAnalysis;
