import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Event } from '../types/event';
import api from './api';

const STORAGE_KEY = '@events_storage';

// Eventos populados inicialmente
const INITIAL_EVENTS: Event[] = [
  {
    id: 1,
    adminId: 1,
    title: 'Reunião Executiva Q1 2026',
    description: 'Análise de resultados do primeiro trimestre e definição de metas estratégicas para o próximo período. Participação obrigatória de todos os diretores.',
    date: '15/01/2026',
    startTime: '09:00',
    endTime: '11:30',
    location: 'São Paulo, SP - Sede Central',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
  },
  {
    id: 2,
    adminId: 1,
    title: 'Workshop de Inovação Tecnológica',
    description: 'Sessão colaborativa para desenvolvimento de novas estratégias de produto e discussão de tendências tecnológicas do mercado.',
    date: '22/01/2026',
    startTime: '14:00',
    endTime: '18:00',
    location: 'Rio de Janeiro, RJ - Innovation Hub',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
  },
  {
    id: 3,
    adminId: 1,
    title: 'Lançamento Produto Alpha',
    description: 'Apresentação oficial do novo produto Alpha para stakeholders, parceiros estratégicos e imprensa especializada.',
    date: '28/01/2026',
    startTime: '19:00',
    endTime: '22:00',
    location: 'Belo Horizonte, MG - Centro de Convenções',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
  },
  {
    id: 4,
    adminId: 1,
    title: 'Treinamento Técnico - Equipe',
    description: 'Capacitação técnica intensiva sobre novas ferramentas, processos operacionais e metodologias ágeis.',
    date: '05/02/2026',
    startTime: '08:00',
    endTime: '17:00',
    location: 'Curitiba, PR - Centro de Treinamento',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800',
  },
  {
    id: 5,
    adminId: 1,
    title: 'Evento de Networking Executivo',
    description: 'Encontro exclusivo com líderes do setor para troca de experiências, discussão de cases de sucesso e oportunidades de parcerias.',
    date: '12/02/2026',
    startTime: '18:30',
    endTime: '22:30',
    location: 'Florianópolis, SC - Beach Hotel Resort',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
  },
  {
    id: 6,
    adminId: 1,
    title: 'Revisão Estratégica Anual',
    description: 'Alinhamento de objetivos corporativos, definição de KPIs e planejamento estratégico com os times de liderança.',
    date: '19/02/2026',
    startTime: '09:00',
    endTime: '16:00',
    location: 'Porto Alegre, RS - Hotel Executive',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800',
  },
  {
    id: 7,
    adminId: 1,
    title: 'Conferência de Vendas 2026',
    description: 'Apresentação de resultados, premiação das melhores equipes e lançamento das campanhas do ano.',
    date: '26/02/2026',
    startTime: '10:00',
    endTime: '18:00',
    location: 'São Paulo, SP - Centro de Eventos',
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800',
  },
  {
    id: 8,
    adminId: 1,
    title: 'Summit de Transformação Digital',
    description: 'Discussão sobre IA, automação e as novas tendências em transformação digital para o setor corporativo.',
    date: '05/03/2026',
    startTime: '08:30',
    endTime: '17:30',
    location: 'Brasília, DF - Centro Internacional',
    imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
  },
  {
    id: 9,
    adminId: 1,
    title: 'Encontro de Desenvolvedores',
    description: 'Hackathon e workshops práticos sobre as mais recentes tecnologias e frameworks de desenvolvimento.',
    date: '12/03/2026',
    startTime: '09:00',
    endTime: '19:00',
    location: 'Recife, PE - Tech Park',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800',
  },
  {
    id: 10,
    adminId: 1,
    title: 'Apresentação de Resultados Q1',
    description: 'Balanço financeiro do primeiro trimestre e projeções para os próximos meses. Exclusivo para acionistas.',
    date: '25/03/2026',
    startTime: '15:00',
    endTime: '17:00',
    location: 'São Paulo, SP - Auditório Corporativo',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
  },
];

class EventService {
  // Inicializa eventos (Não necessário com API real, mantido vazio ou removido)
  async initializeEvents(): Promise<void> {
    // API real não precisa de inicialização local
  }

  // Busca todos os eventos
  async getEvents(): Promise<Event[]> {
    try {
      const response = await api.get('/events');
      // Mapeando dados do backend para o modelo do frontend se necessário
      // Backend: id, name, date, location, image
      // Frontend: id, title, date, location, imageUrl, description...

      const backendEvents = response.data;

      // Adaptando campos
      return backendEvents.map((e: any) => ({
        id: e.id,
        adminId: e.adminId ?? 1, // Fallback se não vier
        title: e.name, // Mapeia name -> title
        description: e.description || 'Sem descrição',
        date: e.date, // Formato esperado: YYYY-MM-DD
        startTime: e.startTime || '',
        endTime: e.endTime || '',
        location: e.location,
        imageUrl: e.image, // Mapeia image -> imageUrl
      }));

    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      throw error;
    }
  }

  // Busca um evento específico por ID
  async getEventById(id: number): Promise<Event | null> {
    try {
      // Como o endpoint /events/{id} não foi explicitamente detalhado na lista de endpoints GET,
      // mas é padrão REST. Se não existir, podemos filtrar da lista.
      // Assumindo que podemos filtrar da lista para garantir consistência com o que temos hoje,
      // ou implementar chamada direta se houver endpoint GET /events/{id}

      // Vamos tentar buscar da lista para garantir performance se a lista já estiver carregada em cache, 
      // mas aqui é um service stateless. 
      // Vamos usar a lista completa por enquanto pois a doc só listou GET /events
      const events = await this.getEvents();
      return events.find(event => event.id === id) || null;
    } catch (error) {
      console.error('Erro ao buscar evento:', error);
      return null;
    }
  }

  // Cria um novo evento
  async createEvent(eventData: Omit<Event, 'id'>): Promise<Event> {
    try {
      // Mapeando payload para o backend
      // Backend espera: { name, date, location, image }
      const payload = {
        name: eventData.title,
        date: eventData.date, // Deve estar em YYYY-MM-DD
        location: eventData.location,
        image: eventData.imageUrl
      };

      const response = await api.post('/events', payload);
      const newEvent = response.data;

      // Retorna formato frontend
      return {
        ...eventData,
        id: newEvent.id,
        // Mantemos os dados locais que enviamos pois o backend pode não retornar tudo
        // Mas idealmente usamos o retorno.
      } as Event;
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      throw error;
    }
  }

  // Atualiza um evento existente
  async updateEvent(id: number, eventData: Partial<Event>): Promise<Event | null> {
    try {
      // Backend permite atualizar apenas date e location
      const payload: any = {};
      if (eventData.date) payload.date = eventData.date;
      if (eventData.location) payload.location = eventData.location;

      // Se houver outros campos que o backend aceita, adicione aqui.
      // A doc diz: "Envie apenas o que deseja alterar, mas lembre-se que o backend só permite date e location"

      const response = await api.put(`/events/${id}`, payload);
      return response.data; // Assumindo que retorna o evento atualizado
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      throw error;
    }
  }

  // Deleta um evento
  async deleteEvent(id: number): Promise<boolean> {
    try {
      await api.delete(`/events/${id}`);
      return true;
    } catch (error) {
      console.error('Erro ao deletar evento:', error);
      return false;
    }
  }

  // Reseta os eventos (Não aplicável API real)
  async resetEvents(): Promise<void> {
    // No-op
  }
}

export default new EventService();
