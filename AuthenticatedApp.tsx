import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { UserProfile, Gender, Message, Notification, NotificationType, NotificationSettings, PrivacySettings, ReportReason, VerificationStatus } from './types';
import ProfileView from './views/ProfileView';
import DiscoveryView from './views/DiscoveryView';
import MatchesView from './views/MatchesView';
import BottomNav from './components/BottomNav';
import MatchModal from './components/MatchModal';
import ChatView from './views/ChatView';
import Header from './components/Header';
import NotificationsPanel from './components/NotificationsPanel';
import ReportModal from './components/ReportModal';
import ConfirmationModal from './components/ConfirmationModal';
import Onboarding from './components/Onboarding';
import SettingsView from './views/SettingsView';
import Toast, { ToastType } from './components/Toast';
import OnboardingFlow from './views/onboarding/OnboardingFlow';
import AdminView from './views/admin/AdminView';

const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

const getInitialProfile = (email: string): UserProfile => ({
    id: `user-${Date.now()}`,
    name: '',
    dateOfBirth: '',
    gender: Gender.PreferNotToSay,
    location: '',
    email,
    photos: [],
    bio: '',
    occupation: '',
    interests: [],
    preferences: {
      minAge: 25,
      maxAge: 35,
      genders: [Gender.Male],
      maxDistance: 50,
    },
    registrationDate: new Date().toISOString(),
    verificationStatus: VerificationStatus.Pending,
});

export type View = 'discover' | 'matches' | 'profile' | 'settings';

const calculateAge = (dateOfBirth: string): number => {
    if (!dateOfBirth) return 0;
    const birthday = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const m = today.getMonth() - birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
        age--;
    }
    return age > 0 ? age : 0;
}

const getConversationId = (userId1: string, userId2: string): string => {
  return [userId1, userId2].sort().join('_');
};

interface AuthenticatedAppProps {
    isProfileIncomplete?: boolean;
    onLogout?: (isInactive?: boolean) => void;
    userEmail: string;
    onOnboardingFinish?: () => void;
    isAdmin?: boolean;
}

const AuthenticatedApp: React.FC<AuthenticatedAppProps> = ({ isProfileIncomplete = false, onLogout, userEmail, onOnboardingFinish, isAdmin = false }) => {
  const [isOnboarding, setIsOnboarding] = useState(isProfileIncomplete);
  
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => JSON.parse(localStorage.getItem('kupido-users') || '[]'));
  
  const [state, setState] = useState(() => {
    const currentUser = allUsers.find(u => u.email === userEmail) || getInitialProfile(userEmail);
    
    let initialProfile = currentUser;
    if (isProfileIncomplete) {
        const savedOnboardingProfile = localStorage.getItem('kupido-onboarding-profile');
        if (savedOnboardingProfile) {
            try {
                const parsedProfile = JSON.parse(savedOnboardingProfile);
                initialProfile = { ...currentUser, ...parsedProfile };
            } catch (e) { console.error("Failed to parse onboarding profile", e); }
        }
    }

    return {
      currentUser: initialProfile,
      activeView: 'discover' as View,
      likedIds: new Set<string>(JSON.parse(localStorage.getItem(`kupido-likes-${currentUser.id}`) || '[]')),
      passedIds: new Set<string>(JSON.parse(localStorage.getItem(`kupido-passes-${currentUser.id}`) || '[]')),
      superLikedIds: new Set<string>(JSON.parse(localStorage.getItem(`kupido-superlikes-${currentUser.id}`) || '[]')),
      matches: allUsers.filter(u => (JSON.parse(localStorage.getItem(`kupido-matches-${currentUser.id}`) || '[]')).includes(u.id)),
      newMatch: null as UserProfile | null,
      messagesByConversationId: JSON.parse(localStorage.getItem('kupido-messages') || '{}'),
      activeChatMatch: null as UserProfile | null,
      typingMatchIds: new Set<string>(),
      notifications: [] as Notification[],
      showNotifications: false,
      blockedUserIds: new Set<string>(JSON.parse(localStorage.getItem(`kupido-blocked-${currentUser.id}`) || '[]')),
      reportingUser: null as UserProfile | null,
      showDeactivateModal: false,
      showDeleteModal: false,
      showLogoutModal: false,
      isAccountDeactivated: false,
      showOnboarding: false, 
      superLikesRemaining: 1,
      notificationSettings: { newMatches: true, newMessages: true, newLikes: true, superLikes: true },
      privacySettings: { isProfileVisible: true },
      toast: null as { message: string, type: ToastType } | null,
    };
  });

  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    currentUser, activeView, likedIds, passedIds, matches, newMatch,
    messagesByConversationId, activeChatMatch, typingMatchIds, notifications,
    showNotifications, blockedUserIds, reportingUser, showDeactivateModal,
    showDeleteModal, isAccountDeactivated, showOnboarding, superLikesRemaining,
    notificationSettings, superLikedIds, showLogoutModal, privacySettings, toast
  } = state;
  
    // Granular useEffects for state persistence to prevent race conditions
    useEffect(() => {
        if (!currentUser.id) return;
        localStorage.setItem(`kupido-likes-${currentUser.id}`, JSON.stringify(Array.from(likedIds)));
    }, [likedIds, currentUser.id]);

    useEffect(() => {
        if (!currentUser.id) return;
        localStorage.setItem(`kupido-passes-${currentUser.id}`, JSON.stringify(Array.from(passedIds)));
    }, [passedIds, currentUser.id]);

    useEffect(() => {
        if (!currentUser.id) return;
        localStorage.setItem(`kupido-superlikes-${currentUser.id}`, JSON.stringify(Array.from(superLikedIds)));
    }, [superLikedIds, currentUser.id]);

    useEffect(() => {
        if (!currentUser.id) return;
        localStorage.setItem(`kupido-matches-${currentUser.id}`, JSON.stringify(matches.map(m => m.id)));
    }, [matches, currentUser.id]);

    useEffect(() => {
        if (!currentUser.id) return;
        localStorage.setItem(`kupido-blocked-${currentUser.id}`, JSON.stringify(Array.from(blockedUserIds)));
    }, [blockedUserIds, currentUser.id]);
    
    // Effect to persist the currentUser profile and update the main users list
    useEffect(() => {
        if (!currentUser.id) return;

        setAllUsers(prevAllUsers => {
            const updatedUsers = prevAllUsers.map(u => u.id === currentUser.id ? currentUser : u);
            if (!updatedUsers.some(u => u.id === currentUser.id)) {
                updatedUsers.push(currentUser);
            }
            // This check prevents overwriting the main user list with an empty one on logout/transition
            if (updatedUsers.length > 0) {
              localStorage.setItem('kupido-users', JSON.stringify(updatedUsers));
            }
            return updatedUsers;
        });
    }, [currentUser]);


  const showToast = useCallback((message: string, type: ToastType) => {
    setState(prev => ({ ...prev, toast: { message, type } }));
    setTimeout(() => {
        setState(prev => ({ ...prev, toast: null }));
    }, 3200); 
  }, []);
  
  const handleLogoutConfirm = () => {
      onLogout?.(false);
  }
  
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    if (!onLogout) return;
    inactivityTimerRef.current = setTimeout(() => {
        onLogout(true);
    }, INACTIVITY_TIMEOUT_MS);
  }, [onLogout]);

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetInactivityTimer));
    resetInactivityTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, resetInactivityTimer));
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [resetInactivityTimer]);


  const setCurrentUser = (user: UserProfile | ((prev: UserProfile) => UserProfile)) => {
    setState(prev => ({ ...prev, currentUser: typeof user === 'function' ? user(prev.currentUser) : user }));
  }

  const addNotification = useCallback((type: NotificationType, message: string, user?: UserProfile) => {
    const settingMap: Record<NotificationType, keyof NotificationSettings> = {
        [NotificationType.NEW_MATCH]: 'newMatches',
        [NotificationType.NEW_MESSAGE]: 'newMessages',
        [NotificationType.NEW_LIKE]: 'newLikes',
        [NotificationType.SUPER_LIKE]: 'superLikes',
    };
    if (!notificationSettings[settingMap[type]]) return;

    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      type,
      message,
      user,
      read: false,
      timestamp: new Date(),
    };
    setState(prev => ({...prev, notifications: [newNotification, ...prev.notifications]}));
  }, [notificationSettings]);

  const discoveryProfiles = useMemo(() => {
    if (!privacySettings.isProfileVisible) return [];
    const { minAge, maxAge, genders } = currentUser.preferences;
    return allUsers.filter(user => {
      if (user.id === currentUser.id) return false;
      const userAge = calculateAge(user.dateOfBirth);
      return !likedIds.has(user.id) &&
             !passedIds.has(user.id) &&
             !superLikedIds.has(user.id) &&
             !blockedUserIds.has(user.id) &&
             userAge >= minAge &&
             userAge <= maxAge &&
             genders.includes(user.gender);
    });
  }, [allUsers, currentUser, likedIds, passedIds, superLikedIds, blockedUserIds, privacySettings.isProfileVisible]);
  
  const activeMatches = useMemo(() => matches.filter(m => !blockedUserIds.has(m.id)), [matches, blockedUserIds]);

  const handlePass = useCallback((userId: string) => {
    setState(prev => ({...prev, passedIds: new Set(prev.passedIds).add(userId)}));
  }, []);

  const handleLike = useCallback((likedUser: UserProfile) => {
    const otherUserLikes = (JSON.parse(localStorage.getItem(`kupido-likes-${likedUser.id}`) || '[]')).includes(currentUser.id);
    const updatedLikedIds = new Set(state.likedIds).add(likedUser.id);
    
    if (otherUserLikes) {
        setState(prev => ({
            ...prev, 
            likedIds: updatedLikedIds,
            matches: [likedUser, ...prev.matches], 
            newMatch: likedUser
        }));
        addNotification(NotificationType.NEW_MATCH, `Você e ${likedUser.name} deram match!`, likedUser);
    } else {
        setState(prev => ({ ...prev, likedIds: updatedLikedIds }));
    }
  }, [addNotification, currentUser.id, state.likedIds]);

  const handleSuperLike = useCallback((user: UserProfile) => {
    if (superLikesRemaining <= 0) return;
    // Same logic as handleLike for creating a match
    handleLike(user); 
    setState(prev => ({
        ...prev,
        superLikedIds: new Set(prev.superLikedIds).add(user.id),
        superLikesRemaining: prev.superLikesRemaining - 1,
    }));
  }, [addNotification, superLikesRemaining, handleLike]);
  
  const handleSendMessage = useCallback((matchId: string, text: string) => {
    const conversationId = getConversationId(currentUser.id, matchId);
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      text,
      senderId: currentUser.id,
      timestamp: new Date(),
    };

    // Always read the latest from localStorage to be the source of truth, preventing race conditions.
    const allMessages = JSON.parse(localStorage.getItem('kupido-messages') || '{}');
    const updatedConversation = [...(allMessages[conversationId] || []), newMessage];
    const newMessagesByConversationId = {
      ...allMessages,
      [conversationId]: updatedConversation,
    };

    // Persist immediately.
    localStorage.setItem('kupido-messages', JSON.stringify(newMessagesByConversationId));

    // Update React state to reflect the change.
    setState((prev) => ({
      ...prev,
      messagesByConversationId: newMessagesByConversationId,
    }));
  }, [currentUser.id]);

  const handleSendMessageFromMatchModal = () => {
    if (!state.newMatch) return;
    setState(prev => ({
        ...prev,
        newMatch: null,
        activeChatMatch: prev.newMatch,
        activeView: 'matches',
    }));
  };
  
  const handleBlockUser = (userToBlock: UserProfile) => {
    setState(prev => ({
        ...prev,
        blockedUserIds: new Set(prev.blockedUserIds).add(userToBlock.id),
        activeChatMatch: prev.activeChatMatch?.id === userToBlock.id ? null : prev.activeChatMatch,
        reportingUser: null,
    }));
    showToast(`${userToBlock.name} foi bloqueado(a).`, 'info');
  };
  
  const handleReportUser = (user: UserProfile, reason: ReportReason) => {
    console.log('Reported', user.name, 'for', reason); 
    setState(p=>({...p, reportingUser: null}));
    showToast(`Denúncia sobre ${user.name} enviada. Obrigado!`, 'success');
  }

  const handleDeactivateAccount = () => {
    setState(prev => ({...prev, isAccountDeactivated: true, showDeactivateModal: false}));
    showToast('Sua conta foi desativada.', 'info');
  };
  const handleDeleteAccount = () => {
      onLogout?.(false);
  };
  const handleUpdateSettings = (settings: NotificationSettings) => setState(p => ({...p, notificationSettings: settings}));
  const handleUpdatePrivacySettings = (settings: PrivacySettings) => setState(p => ({...p, privacySettings: settings}));

  const handleOnboardingComplete = (completedProfile: UserProfile) => {
    const finalProfile = { ...currentUser, ...completedProfile };
    setCurrentUser(finalProfile);
    setIsOnboarding(false);
    setState(p => ({...p, activeView: 'discover' }));
    showToast('Perfil completo! Bem-vindo(a) ao Kupido!', 'success');
    
    // Final save of the completed profile to the main user list
    const updatedUsers = allUsers.map(u => u.email === userEmail ? finalProfile : u);
     if (!updatedUsers.some(u => u.email === userEmail)) {
        updatedUsers.push(finalProfile);
    }
    localStorage.setItem('kupido-users', JSON.stringify(updatedUsers));
    setAllUsers(updatedUsers);

    onOnboardingFinish?.();
  };

  if (isOnboarding) {
    return <OnboardingFlow initialProfile={currentUser} onOnboardingComplete={handleOnboardingComplete} />;
  }

  if (isAdmin) {
    return <AdminView 
        allUsers={allUsers}
        setAllUsers={setAllUsers}
        messagesByConversationId={messagesByConversationId}
        onBack={() => onLogout?.(false)}
        onShowToast={showToast}
    />;
  }
  
  const renderView = () => {
    switch (activeView) {
      case 'discover': return <DiscoveryView profiles={discoveryProfiles} onLike={handleLike} onPass={handlePass} onBlock={handleBlockUser} onReport={(user) => setState(p => ({...p, reportingUser: user}))} onSuperLike={handleSuperLike} superLikesRemaining={superLikesRemaining} />;
      case 'matches': return <MatchesView matches={activeMatches} onSelectMatch={(match) => setState(p=>({...p, activeChatMatch: match}))} messagesByConversationId={messagesByConversationId} currentUser={currentUser} />;
      case 'profile': return <ProfileView profile={currentUser} setProfile={setCurrentUser} setActiveView={(view) => setState(p => ({...p, activeView: view}))} onShowToast={showToast} />;
      case 'settings': return <SettingsView onBack={() => setState(p => ({...p, activeView: 'profile'}))} notificationSettings={notificationSettings} privacySettings={privacySettings} onSettingsChange={handleUpdateSettings} onPrivacySettingsChange={handleUpdatePrivacySettings} onDeactivate={() => setState(p => ({...p, showDeactivateModal: true}))} onDelete={() => setState(p => ({...p, showDeleteModal: true}))} onLogoutRequest={() => setState(p => ({...p, showLogoutModal: true}))} />;
      default: return <DiscoveryView profiles={discoveryProfiles} onLike={handleLike} onPass={handlePass} onBlock={handleBlockUser} onReport={(user) => setState(p => ({...p, reportingUser: user}))} onSuperLike={handleSuperLike} superLikesRemaining={superLikesRemaining} />;
    }
  };
  
  if (showOnboarding) {
    return <Onboarding onFinish={() => setState(p => ({...p, showOnboarding: false}))} />;
  }
  
  if (isAccountDeactivated) {
      return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center p-4">
             <i className="fa-solid fa-bed text-6xl text-gray-400 mb-4"></i>
             <h1 className="text-3xl font-bold text-gray-700">Conta Desativada</h1>
             <p className="text-gray-500 mt-2 max-w-sm">Sua conta está temporariamente desativada. Ninguém pode ver seu perfil. Volte quando quiser!</p>
             <button onClick={() => { setState(p => ({...p, isAccountDeactivated: false})); showToast('Conta reativada com sucesso!', 'success'); }} className="mt-6 bg-rose-500 text-white font-bold py-3 px-8 rounded-full hover:bg-rose-600 transition-transform transform hover:scale-105">
                Reativar Conta
             </button>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 to-rose-200 font-sans">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setState(p => ({...p, toast: null}))} />}
        <div className="max-w-4xl mx-auto h-screen flex flex-col">
           <Header
              notificationCount={notifications.filter(n => !n.read).length}
              onNotificationClick={() => setState(p => ({...p, showNotifications: !p.showNotifications}))}
            />
            <main className="px-4 sm:px-6 lg:px-8 flex-grow relative overflow-y-auto">
                 {activeChatMatch ? (
                    <ChatView
                        match={activeChatMatch}
                        messages={messagesByConversationId[getConversationId(currentUser.id, activeChatMatch.id)] || []}
                        currentUser={currentUser}
                        onSendMessage={(text) => handleSendMessage(activeChatMatch.id, text)}
                        onBack={() => setState(p=>({...p, activeChatMatch: null}))}
                        isTyping={typingMatchIds.has(activeChatMatch.id)}
                        onBlock={handleBlockUser}
                        onReport={(user) => setState(p => ({...p, reportingUser: user}))}
                    />
                ) : (
                    renderView()
                )}
            </main>
        </div>
        {!activeChatMatch && activeView !== 'settings' && <BottomNav activeView={activeView} setActiveView={(view) => setState(p => ({...p, activeView: view}))} />}
        {newMatch && <MatchModal currentUser={currentUser} newMatch={newMatch} onClose={() => setState(p => ({...p, newMatch: null}))} onSendMessageClick={handleSendMessageFromMatchModal} />}
        {showNotifications && <NotificationsPanel notifications={notifications} onClose={() => setState(p => ({...p, showNotifications: false}))} onReadAll={() => setState(p => ({...p, notifications: p.notifications.map(n => ({...n, read: true}))}))} />}
        {reportingUser && <ReportModal user={reportingUser} onClose={() => setState(p=>({...p, reportingUser: null}))} onSubmit={handleReportUser} />}
        {showDeactivateModal && <ConfirmationModal title="Desativar Conta?" description="Seu perfil ficará oculto e você não aparecerá para outras pessoas. Você pode reativar sua conta a qualquer momento." confirmText="Sim, Desativar" onConfirm={handleDeactivateAccount} onClose={() => setState(p => ({...p, showDeactivateModal: false}))} />}
        {showDeleteModal && <ConfirmationModal title="Deletar Conta Permanentemente?" description="Esta ação é irreversível. Todos os seus dados, matches e conversas serão apagados para sempre." confirmText="Sim, Deletar" onConfirm={handleDeleteAccount} onClose={() => setState(p => ({...p, showDeleteModal: false}))} isDestructive requiresConfirmationText="DELETAR" />}
        {showLogoutModal && <ConfirmationModal title="Sair da Conta?" description="Você precisará fazer login novamente para acessar seu perfil." confirmText="Sim, Sair" onConfirm={handleLogoutConfirm} onClose={() => setState(p => ({...p, showLogoutModal: false}))} />}
    </div>
  );
};

export default AuthenticatedApp;