
import React, { useMemo } from 'react';
import { UserProfile, Message } from '../../types';
import DashboardCard from '../../components/admin/DashboardCard';
import SimpleBarChart from '../../components/admin/SimpleBarChart';
import ProfileSection from '../../components/ProfileSection';

interface DashboardViewProps {
  allUsers: UserProfile[];
  messagesByConversationId: Record<string, Message[]>;
}

const DashboardView: React.FC<DashboardViewProps> = ({ allUsers, messagesByConversationId }) => {
  const stats = useMemo(() => {
    const totalUsers = allUsers.length;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const newUsersToday = allUsers.filter(u => u.registrationDate && new Date(u.registrationDate) >= today).length;
    const newUsersWeek = allUsers.filter(u => u.registrationDate && new Date(u.registrationDate) >= startOfWeek).length;
    const newUsersMonth = allUsers.filter(u => u.registrationDate && new Date(u.registrationDate) >= startOfMonth).length;
    
    let totalMatches = 0;
    let totalLikes = 0;
    allUsers.forEach(user => {
        // In a real app, this would be a database query. For this simulation, we check each user's localStorage data.
        // This is inefficient but demonstrates the logic.
        try {
            totalMatches += JSON.parse(localStorage.getItem(`kupido-matches-${user.id}`) || '[]').length;
            totalLikes += JSON.parse(localStorage.getItem(`kupido-likes-${user.id}`) || '[]').length;
        } catch (e) {
            // Ignore potential parsing errors from empty/malformed localStorage
        }
    });
    totalMatches /= 2; // Each match is stored by both users, so we divide by 2.

    const totalMessages = Object.values(messagesByConversationId).reduce((sum, messages) => sum + messages.length, 0);

    const matchRate = totalLikes > 0 ? ((totalMatches / totalLikes) * 100).toFixed(1) + '%' : '0%';

    const growthData = Array(6).fill(0).map((_, i) => {
        const month = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
        const nextMonth = new Date(now.getFullYear(), now.getMonth() - (4 - i), 1);
        const usersInMonth = allUsers.filter(u => {
            if (!u.registrationDate) return false;
            const userDate = new Date(u.registrationDate);
            return userDate >= month && userDate < nextMonth;
        }).length;
        return { label: month.toLocaleString('default', { month: 'short' }), value: usersInMonth };
    });

    return {
      totalUsers,
      newUsersToday,
      newUsersWeek,
      newUsersMonth,
      totalMatches: Math.round(totalMatches),
      totalMessages,
      totalLikes,
      matchRate,
      growthData,
    };
  }, [allUsers, messagesByConversationId]);

  return (
    <div className="animate-fade-in">
      <ProfileSection title="Visão Geral do Sistema">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard title="Total de Usuários" value={stats.totalUsers} icon="fa-users" />
          <DashboardCard title="Total de Matches" value={stats.totalMatches} icon="fa-heart-circle-check" change={`${stats.matchRate} taxa de match`} changeType='neutral' />
          <DashboardCard title="Total de Mensagens" value={stats.totalMessages} icon="fa-comments" />
          <DashboardCard title="Total de Curtidas (Likes)" value={stats.totalLikes} icon="fa-thumbs-up" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
            <DashboardCard title="Novos Usuários (Hoje)" value={stats.newUsersToday} icon="fa-user-plus" changeType="increase" />
            <DashboardCard title="Novos Usuários (Semana)" value={stats.newUsersWeek} icon="fa-user-clock" changeType="increase" />
            <DashboardCard title="Novos Usuários (Mês)" value={stats.newUsersMonth} icon="fa-user-check" changeType="increase" />
        </div>
      </ProfileSection>

      <ProfileSection title="Crescimento de Usuários">
         <SimpleBarChart data={stats.growthData} title="Novos Usuários (Últimos 6 Meses)" />
      </ProfileSection>

      <ProfileSection title="Alertas e Notificações">
         <div className="space-y-4">
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg" role="alert">
              <p className="font-bold"><i className="fa-solid fa-triangle-exclamation mr-2"></i>Ações Urgentes (Exemplo)</p>
              <ul className="list-disc list-inside mt-2 text-sm">
                <li>Aumento de 200% em denúncias de 'Perfil Falso' nas últimas 24h.</li>
                <li>Pico de atividade suspeita detectado na região da Zambézia.</li>
              </ul>
            </div>
         </div>
      </ProfileSection>
    </div>
  );
};

export default DashboardView;
