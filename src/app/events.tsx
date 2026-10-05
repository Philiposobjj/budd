
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { useBudd } from '../context/BuddContext';

const GREEN = '#7CFF00';

type Categoria =
  | 'Todos'
  | 'Shows'
  | 'Festas'
  | 'Teatro'
  | 'Outros';

type Evento = {
  id: string;
  nome: string;
  categoria: Exclude<Categoria, 'Todos'>;
  local: string;
  placeId: string;
  data: string;
  horario: string;
  descricao: string;
  preco: number;
  imagem: string;
};

const categorias: Categoria[] = [
  'Todos',
  'Shows',
  'Festas',
  'Teatro',
  'Outros',
];

const eventos: Evento[] = [
  {
    id: 'evento-1',
    nome: 'Live Music',
    categoria: 'Shows',
    local: 'Budd House',
    placeId: '1',
    data: 'Hoje',
    horario: '21:00',
    descricao:
      'Uma noite de música ao vivo, drinks e boa gastronomia.',
    preco: 35,
    imagem: '🎸',
  },
  {
    id: 'evento-2',
    nome: 'Budd Party',
    categoria: 'Festas',
    local: 'Praia Club',
    placeId: '2',
    data: 'Hoje',
    horario: '23:00',
    descricao:
      'Festa com música eletrônica, DJs convidados e pista até tarde.',
    preco: 50,
    imagem: '🎧',
  },
  {
    id: 'evento-3',
    nome: 'Noite Especial',
    categoria: 'Shows',
    local: 'Budd House',
    placeId: '1',
    data: 'Amanhã',
    horario: '20:30',
    descricao:
      'Uma experiência especial com apresentação ao vivo.',
    preco: 40,
    imagem: '🎤',
  },
  {
    id: 'evento-4',
    nome: 'Festival Budd',
    categoria: 'Outros',
    local: 'Praia Club',
    placeId: '2',
    data: 'Sábado',
    horario: '18:00',
    descricao:
      'Um grande encontro de música, gastronomia e experiências.',
    preco: 65,
    imagem: '🎟️',
  },
  {
    id: 'evento-5',
    nome: 'Noite no Teatro',
    categoria: 'Teatro',
    local: 'Teatro Budd',
    placeId: '3',
    data: 'Domingo',
    horario: '19:00',
    descricao:
      'Uma noite de cultura e entretenimento.',
    preco: 45,
    imagem: '🎭',
  },
];

export default function EventsScreen() {
  const router = useRouter();

  const { addToCart } = useBudd();

  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState<Categoria>('Todos');

  const [eventoSelecionado, setEventoSelecionado] =
    useState<Evento | null>(null);

  const eventosFiltrados = useMemo(() => {
    if (categoriaSelecionada === 'Todos') {
      return eventos;
    }

    return eventos.filter(
      (evento) =>
        evento.categoria === categoriaSelecionada
    );
  }, [categoriaSelecionada]);

  function comprarIngresso(evento: Evento) {
    addToCart({
      id: evento.id,
      placeId: evento.placeId,
      name: `Ingresso - ${evento.nome}`,
      description: `${evento.local} • ${evento.data} • ${evento.horario}`,
      price: evento.preco,
      quantity: 1,
    });

    setEventoSelecionado(null);

    router.push('/cart');
  }

  function abrirEvento(evento: Evento) {
    setEventoSelecionado(evento);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>
            ‹ Voltar
          </Text>
        </Pressable>

        <View style={styles.headerTitle}>
          <Text style={styles.title}>
            Eventos
          </Text>

          <Text style={styles.subtitle}>
            Shows, festas, teatro e muito mais
          </Text>
        </View>

        <Pressable
          onPress={() => router.push('/cart')}
          style={styles.cartButton}
        >
          <Text style={styles.cartIcon}>
            🛒
          </Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
        >
          {categorias.map((category) => {
            const selecionada =
              category === categoriaSelecionada;

            return (
              <Pressable
                key={category}
                onPress={() =>
                  setCategoriaSelecionada(
                    category
                  )
                }
                style={[
                  styles.category,
                  selecionada &&
                    styles.categoryActive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selecionada &&
                      styles.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Eventos disponíveis
            </Text>

            <Text style={styles.sectionSubtitle}>
              Encontre sua próxima experiência
            </Text>
          </View>

          <Text style={styles.count}>
            {eventosFiltrados.length}
          </Text>
        </View>

        {eventosFiltrados.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>
              🎟️
            </Text>

            <Text style={styles.emptyTitle}>
              Nenhum evento encontrado
            </Text>

            <Text style={styles.emptyText}>
              Ainda não temos eventos nessa
              categoria.
            </Text>
          </View>
        ) : (
          <View style={styles.eventList}>
            {eventosFiltrados.map((evento) => (
              <Pressable
                key={evento.id}
                style={styles.eventCard}
                onPress={() =>
                  abrirEvento(evento)
                }
              >
                <View style={styles.eventImage}>
                  <Text style={styles.eventEmoji}>
                    {evento.imagem}
                  </Text>
                </View>

                <View style={styles.eventInfo}>
                  <View
                    style={styles.eventTopRow}
                  >
                    <Text
                      style={styles.eventCategory}
                    >
                      {evento.categoria}
                    </Text>

                    <Text
                      style={styles.eventPrice}
                    >
                      R$ {evento.preco.toFixed(2)}
                    </Text>
                  </View>

                  <Text style={styles.eventName}>
                    {evento.nome}
                  </Text>

                  <Text style={styles.eventPlace}>
                    📍 {evento.local}
                  </Text>

                  <View
                    style={styles.eventDetails}
                  >
                    <Text
                      style={styles.eventDetail}
                    >
                      📅 {evento.data}
                    </Text>

                    <Text
                      style={styles.eventDetail}
                    >
                      🕐 {evento.horario}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        )}

        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>
            🎟️
          </Text>

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>
              Ingressos pelo Budd
            </Text>

            <Text style={styles.infoText}>
              Escolha o evento, adicione o ingresso
              ao carrinho e finalize seu pedido.
            </Text>
          </View>
        </View>
      </ScrollView>

      {eventoSelecionado && (
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.modalHandle} />

            <View style={styles.modalIcon}>
              <Text style={styles.modalEmoji}>
                {eventoSelecionado.imagem}
              </Text>
            </View>

            <Text style={styles.modalCategory}>
              {eventoSelecionado.categoria}
            </Text>

            <Text style={styles.modalTitle}>
              {eventoSelecionado.nome}
            </Text>

            <Text style={styles.modalPlace}>
              📍 {eventoSelecionado.local}
            </Text>

            <View style={styles.modalDetails}>
              <View style={styles.modalDetail}>
                <Text style={styles.modalDetailIcon}>
                  📅
                </Text>

                <View>
                  <Text
                    style={styles.modalDetailLabel}
                  >
                    Data
                  </Text>

                  <Text
                    style={styles.modalDetailValue}
                  >
                    {eventoSelecionado.data}
                  </Text>
                </View>
              </View>

              <View style={styles.modalDetail}>
                <Text style={styles.modalDetailIcon}>
                  🕐
                </Text>

                <View>
                  <Text
                    style={styles.modalDetailLabel}
                  >
                    Horário
                  </Text>

                  <Text
                    style={styles.modalDetailValue}
                  >
                    {eventoSelecionado.horario}
                  </Text>
                </View>
              </View>

              <View style={styles.modalDetail}>
                <Text style={styles.modalDetailIcon}>
                  🎟️
                </Text>

                <View>
                  <Text
                    style={styles.modalDetailLabel}
                  >
                    Ingresso
                  </Text>

                  <Text
                    style={styles.modalDetailValue}
                  >
                    R${' '}
                    {eventoSelecionado.preco.toFixed(
                      2
                    )}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.modalDescription}>
              {eventoSelecionado.descricao}
            </Text>

            <Pressable
              style={styles.buyButton}
              onPress={() =>
                comprarIngresso(
                  eventoSelecionado
                )
              }
            >
              <Text style={styles.buyButtonText}>
                Comprar ingresso
              </Text>
            </Pressable>

            <Pressable
              style={styles.closeButton}
              onPress={() =>
                setEventoSelecionado(null)
              }
            >
              <Text style={styles.closeButtonText}>
                Fechar
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  header: {
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 70,
  },

  backText: {
    color: GREEN,
    fontSize: 15,
    fontWeight: '600',
  },

  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },

  cartButton: {
    width: 70,
    alignItems: 'flex-end',
  },

  cartIcon: {
    fontSize: 22,
  },

  title: {
    color: '#FFF',
    fontSize: 30,
    fontWeight: '800',
  },

  subtitle: {
    color: '#777',
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  categories: {
    gap: 8,
    paddingBottom: 24,
  },

  category: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#151515',
    borderWidth: 1,
    borderColor: '#252525',
  },

  categoryActive: {
    backgroundColor: GREEN,
    borderColor: GREEN,
  },

  categoryText: {
    color: '#AAA',
    fontSize: 13,
    fontWeight: '600',
  },

  categoryTextActive: {
    color: '#000',
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  sectionTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
  },

  sectionSubtitle: {
    color: '#777',
    fontSize: 13,
    marginTop: 4,
  },

  count: {
    backgroundColor: '#151515',
    color: GREEN,
    fontSize: 13,
    fontWeight: 'bold',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 15,
  },

  eventList: {
    gap: 12,
  },

  eventCard: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#202020',
  },

  eventImage: {
    width: 78,
    height: 95,
    borderRadius: 13,
    backgroundColor: '#191919',
    alignItems: 'center',
    justifyContent: 'center',
  },

  eventEmoji: {
    fontSize: 35,
  },

  eventInfo: {
    flex: 1,
    marginLeft: 14,
  },

  eventTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  eventCategory: {
    color: GREEN,
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },

  eventPrice: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },

  eventName: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 7,
  },

  eventPlace: {
    color: '#AAA',
    fontSize: 12,
    marginTop: 7,
  },

  eventDetails: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 9,
  },

  eventDetail: {
    color: '#888',
    fontSize: 11,
  },

  emptyCard: {
    backgroundColor: '#111',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginTop: 10,
  },

  emptyIcon: {
    fontSize: 45,
    marginBottom: 18,
  },

  emptyTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },

  emptyText: {
    color: '#999',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 10,
  },

  infoBox: {
    backgroundColor: '#151515',
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoIcon: {
    fontSize: 28,
    marginRight: 14,
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },

  infoText: {
    color: '#888',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },

  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.82)',
    justifyContent: 'flex-end',
  },

  modal: {
    backgroundColor: '#111',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 24,
    paddingBottom: 35,
  },

  modalHandle: {
    width: 45,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#444',
    alignSelf: 'center',
    marginBottom: 20,
  },

  modalIcon: {
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },

  modalEmoji: {
    fontSize: 32,
  },

  modalCategory: {
    color: GREEN,
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: 15,
  },

  modalTitle: {
    color: '#FFF',
    fontSize: 25,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 5,
  },

  modalPlace: {
    color: '#999',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 7,
  },

  modalDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 22,
    backgroundColor: '#181818',
    borderRadius: 14,
    padding: 15,
  },

  modalDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  modalDetailIcon: {
    fontSize: 18,
    marginRight: 7,
  },

  modalDetailLabel: {
    color: '#666',
    fontSize: 10,
  },

  modalDetailValue: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },

  modalDescription: {
    color: '#AAA',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 18,
    textAlign: 'center',
  },

  buyButton: {
    backgroundColor: GREEN,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 22,
  },

  buyButtonText: {
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold',
  },

  closeButton: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 4,
  },

  closeButtonText: {
    color: '#888',
    fontSize: 14,
  },
});

