import React from 'react';
import { UserProfile, Message } from '../../types';
import ProfileSection from '../../components/ProfileSection';
import MessageMonitoring from '../../components/admin/MessageMonitoring';
import PhotoAnalysis from '../../components/admin/PhotoAnalysis';
import ContentReports from '../../components/admin/ContentReports';

interface ContentAnalysisViewProps {
  allUsers: UserProfile[];
  messagesByConversationId: Record<string, Message[]>;
}

const ContentAnalysisView: React.FC<ContentAnalysisViewProps> = ({ allUsers, messagesByConversationId }) => {
  // Nota: A estrutura de 'messagesByMatchId' é por usuário. Para uma visão de admin,
  // idealmente teríamos um endpoint global de mensagens. Aqui, simulamos a funcionalidade
  // com os dados disponíveis, que podem ser limitados à visão do usuário logado.
  // Os componentes filhos irão simular conversas globais para demonstrar a funcionalidade.
  
  return (
    <div className="space-y-6 animate-fade-in">
      <ProfileSection title="Monitoramento de Mensagens">
        <p className="text-sm text-gray-600 mb-4">Visualize e filtre conversas para identificar comportamento inadequado. As conversas são simuladas para fins de demonstração.</p>
        <MessageMonitoring allUsers={allUsers} messagesByConversationId={messagesByConversationId} />
      </ProfileSection>
      
      <ProfileSection title="Análise de Fotos">
         <p className="text-sm text-gray-600 mb-4">Ferramentas para detectar perfis falsos ou conteúdo reaproveitado.</p>
        <PhotoAnalysis allUsers={allUsers} />
      </ProfileSection>
      
      <ProfileSection title="Relatórios de Conteúdo">
         <p className="text-sm text-gray-600 mb-4">Insights sobre padrões de conteúdo para ajudar na moderação proativa.</p>
        <ContentReports allUsers={allUsers} messagesByMatchId={messagesByConversationId} />
      </ProfileSection>
    </div>
  );
};

export default ContentAnalysisView;
