import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EventCard from '../../components/card';
import EventModal from '../../components/modal';
import AgendaView from '../../components/agendaview';
import ProfileModal from '../../components/profilemodal';
import Calendar from '../../components/calendar';
import ConfirmModal from '../../components/confirmmodal';
import Toast from '../../components/toast';
import EventDetail from '../../components/eventdetail';
import eventService from '../../service/eventService';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import type { Event } from '../../types/event';
import styles from './style';
import { useAuth } from '../../context/AuthContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type DashboardRouteProp = RouteProp<RootStackParamList, 'Dashboard'>;

const Dashboard: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<DashboardRouteProp>();
  const { signOut, user: authUser } = useAuth();

  const admin = route.params?.admin || authUser;

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAgendaOpen, setIsAgendaOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const [showToast, setShowToast] = useState(false);

  const handleLogout = async (): Promise<void> => {
    await signOut();
    navigation.navigate('Login');
  };

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      await eventService.initializeEvents();
      const data = await eventService.getEvents();
      setEvents(data);
    } catch (err) {
      console.error('Erro ao buscar eventos:', err);
      setToastMessage('Erro ao carregar eventos');
      setToastType('error');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleDelete = async (id: number): Promise<void> => {
    setEventToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async (): Promise<void> => {
    if (eventToDelete === null) return;

    try {
      const success = await eventService.deleteEvent(eventToDelete);
      if (success) {
        setToastMessage('Evento removido com sucesso');
        setToastType('success');
        setShowToast(true);
        fetchEvents();
      } else {
        setToastMessage('Evento não encontrado');
        setToastType('error');
        setShowToast(true);
      }
    } catch (err) {
      console.error('Erro ao deletar evento', err);
      setToastMessage('Erro ao remover evento');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsConfirmOpen(false);
      setEventToDelete(null);
    }
  };

  const openEdit = (event: Event): void => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Toast Notification */}
      <Toast message={toastMessage} type={toastType} visible={showToast} />

      {/* Navbar */}
      <View style={styles.navbar}>
        <View style={styles.navContent}>
          <TouchableOpacity
            style={styles.btnAgenda}
            onPress={() => setIsAgendaOpen(true)}
          >
            <Text style={styles.btnAgendaText}>Agenda</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsProfileOpen(true)}>
            <Text style={styles.adminName}>{admin?.name || 'Admin'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.btnIconLogout}>⏏</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.main}>
          <View style={styles.heroSection}>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>Gestão Centralizada</Text>
              <Text style={styles.heroSubtitle}>
                Organize seus compromissos e eventos corporativos com precisão.
              </Text>
            </View>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <View style={styles.spinner} />
              <Text style={styles.loadingText}>Carregando eventos...</Text>
            </View>
          ) : events.length > 0 ? (
            <EventDetail
              events={events}
              onEventEdit={openEdit}
              onEventDelete={handleDelete}
            />
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <View style={styles.emptyIconCircle}>
                  <View style={styles.emptyIconLine1} />
                  <View style={styles.emptyIconLine2} />
                  <View style={styles.emptyIconLine3} />
                </View>
              </View>
              <Text style={styles.emptyStateTitle}>Nenhum evento ainda</Text>
              <Text style={styles.emptyStateText}>Comece criando seu primeiro evento corporativo</Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => {
                  setEditingEvent(null);
                  setIsModalOpen(true);
                }}
              >
                <Text style={styles.emptyButtonText}>Criar primeiro evento</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modals */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={() => {
          setIsModalOpen(false);
          fetchEvents();
        }}
        editingEvent={editingEvent}
      />

      <AgendaView
        isOpen={isAgendaOpen}
        onClose={() => setIsAgendaOpen(false)}
        events={events}
        onEventClick={(event) => {
          openEdit(event);
        }}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        admin={admin}
      />

      <Calendar
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        events={events}
        onEventClick={(event) => {
          openEdit(event);
        }}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar"
        message="Deseja remover permanentemente este evento?"
      />

      {/* FAB Buttons */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fabSecondary}
          onPress={() => setIsCalendarOpen(true)}
        >
          <Text style={{ fontSize: 26, color: '#000', fontWeight: '700' }}>▦</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.fabPrimary}
          onPress={() => {
            setEditingEvent(null);
            setIsModalOpen(true);
          }}
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;