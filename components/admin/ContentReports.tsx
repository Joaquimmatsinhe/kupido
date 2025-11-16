import React, { useMemo } from 'react';
import { UserProfile, Message } from '../../types';
import SimpleBarChart from './SimpleBarChart';

interface ContentReportsProps {
  allUsers: UserProfile[];
  messagesByMatchId: Record<string, Message[]>;
}

const SUSPICIOUS_KEYWORDS = ['dinheiro', 'pix', 'venda', 'comprar', 'cripto', 'investimento', 'sugar daddy', 'patrocínio'];


const ContentReports: React.FC<ContentReportsProps> = ({ allUsers, messagesByMatchId }) => {
  // Simulação de análise de todas as mensagens
  const keywordData = useMemo(() => {
    // Em um app real, isso analisaria o DB de mensagens.
    // Vamos simular contagens.
    return SUSPICIOUS_KEYWORDS.map(keyword => ({
      label: keyword.charAt(0).toUpperCase() + keyword.slice(1),
      value: Math.floor(Math.random() * 50) + 5,
    })).sort((a, b) => b.value - a.value);
  }, []);

  const peakTimesData = useMemo(() => {
    return [
      { label: 'Madrugada', value: 85 },
      { label: 'Manhã', value: 30 },
      { label: 'Tarde', value: 45 },
      { label: 'Noite', value: 60 },
    ];
  }, []);

  return (
    <div className="space-y-6">
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SimpleBarChart data={keywordData} title="Top Palavras-Chave Suspeitas Usadas" />
            <SimpleBarChart data={peakTimesData} title="Horários de Pico de Atividade Maliciosa (Simulado)" />
       </div>
       <div>
            <h4 className="font-bold text-gray-800 mb-2">Padrões de Comportamento Suspeito</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 bg-gray-50 p-4 rounded-md">
                <li><span className="font-semibold">Spam de "Copiar e Colar":</span> Usuário envia a mesma mensagem para 10+ perfis em menos de 5 minutos.</li>
                <li><span className="font-semibold">Redirecionamento Imediato:</span> Usuário tenta mover a conversa para outra plataforma (WhatsApp, Telegram) na primeira mensagem.</li>
                <li><span className="font-semibold">Criação Rápida de Perfil:</span> Perfil criado há menos de 1 hora já enviou mais de 50 likes.</li>
                <li><span className="font-semibold">Múltiplas Denúncias:</span> Perfil recebeu mais de 3 denúncias por 'Spam' ou 'Perfil Falso' na última semana.</li>
            </ul>
       </div>
    </div>
  );
};

export default ContentReports;
