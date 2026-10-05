
import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';

import { supabase } from '../lib/supabase';
import { useBudd } from '../context/BuddContext';

const GREEN = '#76EB3C';

type Place = {
  id: string;
  name: string;
  type: 'Bar' | 'Restaurante' | 'Night Club';
  description: string;
  address: string | null;
};

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  icon: string;
};

const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Hambúrguer da Casa',
    description:
      'Pão, carne artesanal, queijo e molho especial.',
    price: 32.9,
    category: 'Comidas',
    icon: '🍔',
  },
  {
    id: '2',
    name: 'Batata Frita',
    description:
      'Porção de batatas crocantes.',
    price: 18.9,
    category: 'Comidas',
    icon: '🍟',
  },
  {
    id: '3',
    name: 'Caipirinha',
    description:
      'Limão, açúcar e cachaça.',
    price: 16.9,
    category: 'Drinks',
    icon: '🍹',
  },
  {
    id: '4',
    name: 'Refrigerante',
    description:
      'Lata 350ml.',
    price: 7.9,
    category: 'Bebidas',
    icon: '🥤',
  },
];

const gallery = [
  {
    id: '1',
    icon: '🍸',
    title: 'Drinks',
  },
  {
    id: '2',
    icon: '🎵',
    title: 'Ambiente',
  },
  {
    id: '3',
    icon: '🍔',
    title: 'Gastronomia',
  },
  {
    id: '4',
    icon: '✨',
    title: 'Noite',
  },
];

const promotions = [
  {
    id: '1',
    title: '2 Drinks pelo preço de 1',
    subtitle: 'Hoje até 22h',
    icon: '🍹',
  },
  {
    id: '2',
    title: '10% OFF no jantar',
    subtitle: 'Com pagamento pelo Budd',
    icon: '🔥',
  },
];

const events = [
  {
    id: '1',
    day: '10',
    week: 'SEX',
    title: 'Live Music',
    subtitle: 'A partir das 21h',
    icon: '🎸',
  },
  {
    id: '2',
    day: '11',
    week: 'SÁB',
    title: 'Budd Party',
    subtitle: 'A partir das 23h',
    icon: '🎧',
  },
];

export default function PlaceScreen() {
  const router = useRouter();

  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const {
    cart,
    addToCart,
    removeFromCart,
  } = useBudd();

  const [place, setPlace] =
    useState<Place | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [favorited, setFavorited] =
    useState(false);

  useEffect(() => {
    async function loadPlace() {
      if (!id) {
        setError(
          'Estabelecimento não encontrado.',
        );

        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      const { data, error } = await supabase
        .from('places')
        .select(
          'id, name, type, description, address',
        )
        .eq('id', id)
        .single();

      if (error) {
        console.error(
          'Erro ao carregar estabelecimento:',
          error,
        );

        setError(
          'Não foi possível carregar o estabelecimento.',
        );

        setLoading(false);
        return;
      }

      setPlace(data);
      setLoading(false);
    }

    loadPlace();
  }, [id]);

  function getIcon(type: Place['type']) {
    if (type === 'Bar') {
      return '🍸';
    }

    if (type === 'Restaurante') {
      return '🍽️';
    }

    return '🎧';
  }

  function voltar() {
    router.back();
  }

  async function abrirLocalizacao() {
    if (!place?.address) {
      return;
    }

    const endereco =
      encodeURIComponent(place.address);

    const url =
      `https://www.google.com/maps/search/?api=1&query=${endereco}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error(
        'Erro ao abrir localização:',
        error,
      );
    }
  }

  async function compartilharLugar() {
    if (!place) {
      return;
    }

    const endereco = place.address
      ? `\n📍 ${place.address}`
      : '';

    const mensagem =
      `Confira este lugar no Budd:\n\n` +
      `${place.name}\n` +
      `${place.type}` +
      `${endereco}\n\n` +
      `${place.description}`;

    try {
      await Share.share({
        message: mensagem,
      });
    } catch (error) {
      console.error(
        'Erro ao compartilhar lugar:',
        error,
      );
    }
  }

  function alternarFavorito() {
    setFavorited((current) => !current);
  }

  function abrirReserva() {
    if (!place) {
      return;
    }

    router.push({
      pathname: '/reservation',
      params: {
        placeId: place.id,
        placeName: place.name,
      },
    });
  }

  function adicionarAoCarrinho(
    item: MenuItem,
  ) {
    if (!place) {
      return;
    }

    addToCart({
      id: item.id,
      placeId: place.id,
      name: item.name,
      description: item.description,
      price: item.price,
      quantity: 1,
    });
  }

  function removerItemDoCarrinho(
    item: MenuItem,
  ) {
    if (!place) {
      return;
    }

    removeFromCart(
      item.id,
      place.id,
    );
  }

  function abrirCarrinho() {
    router.push('/cart');
  }

  const quantidadeCarrinho =
    cart.reduce(
      (total, item) =>
        total + item.quantity,
      0,
    );

  const totalCarrinho =
    cart.reduce(
      (total, item) =>
        total +
        item.price * item.quantity,
      0,
    );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          color={GREEN}
          size="large"
        />

        <Text style={styles.loadingText}>
          Carregando estabelecimento...
        </Text>
      </View>
    );
  }

  if (error || !place) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>
          Ops...
        </Text>

        <Text style={styles.errorText}>
          {error ||
            'Estabelecimento não encontrado.'}
        </Text>

        <Pressable
          onPress={voltar}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>
            Voltar
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          quantidadeCarrinho > 0 &&
            styles.contentWithCart,
        ]}
      >
        {/* CAPA */}
        <View style={styles.cover}>
          <View style={styles.coverGlowOne} />
          <View style={styles.coverGlowTwo} />

          <Pressable
            onPress={voltar}
            style={styles.backCircle}
          >
            <Text style={styles.backIcon}>
              ‹
            </Text>
          </Pressable>

          <Pressable
            onPress={alternarFavorito}
            style={styles.favoriteCircle}
          >
            <Text
              style={[
                styles.favoriteIcon,
                favorited &&
                  styles.favoriteActive,
              ]}
            >
              {favorited ? '♥' : '♡'}
            </Text>
          </Pressable>

          <View style={styles.coverContent}>
            <View style={styles.placeLogo}>
              <Text style={styles.placeLogoText}>
                {getIcon(place.type)}
              </Text>
            </View>

            <Text style={styles.coverHint}>
              BUdd EXPERIENCE
            </Text>
          </View>
        </View>

        <View style={styles.main}>
          {/* IDENTIDADE */}
          <Text style={styles.type}>
            {place.type}
          </Text>

          <Text style={styles.name}>
            {place.name}
          </Text>

          <View style={styles.ratingRow}>
            <Text style={styles.rating}>
              ★ 4.8
            </Text>

            <Text style={styles.ratingSeparator}>
              •
            </Text>

            <Text style={styles.ratingText}>
              328 avaliações
            </Text>

            <Text style={styles.ratingSeparator}>
              •
            </Text>

            <Text style={styles.openText}>
              Aberto agora
            </Text>
          </View>

          {place.address && (
            <Text style={styles.address}>
              📍 {place.address}
            </Text>
          )}

          {/* HORÁRIO */}
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>
                🕐
              </Text>

              <View>
                <Text style={styles.infoLabel}>
                  Horário
                </Text>

                <Text style={styles.infoValue}>
                  Hoje, 18h — 02h
                </Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>
                📍
              </Text>

              <View>
                <Text style={styles.infoLabel}>
                  Distância
                </Text>

                <Text style={styles.infoValue}>
                  1,2 km de você
                </Text>
              </View>
            </View>
          </View>

          {/* AÇÕES */}
          <View style={styles.actions}>
            <Pressable
              style={styles.actionButton}
              onPress={abrirLocalizacao}
              disabled={!place.address}
            >
              <Text style={styles.actionIcon}>
                📍
              </Text>

              <Text style={styles.actionText}>
                Como chegar
              </Text>
            </Pressable>

            <Pressable
              style={styles.actionButton}
              onPress={compartilharLugar}
            >
              <Text style={styles.actionIcon}>
                ↗
              </Text>

              <Text style={styles.actionText}>
                Compartilhar
              </Text>
            </Pressable>

            <Pressable
              style={styles.actionButton}
              onPress={alternarFavorito}
            >
              <Text style={styles.actionIcon}>
                {favorited ? '♥' : '♡'}
              </Text>

              <Text style={styles.actionText}>
                {favorited
                  ? 'Salvo'
                  : 'Favoritar'}
              </Text>
            </Pressable>
          </View>

          {/* SOBRE */}
          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>
            Sobre o lugar
          </Text>

          <Text style={styles.description}>
            {place.description}
          </Text>

          {/* RESERVA */}
          <View style={styles.reserveBox}>
            <View style={styles.reserveIcon}>
              <Text>
                🍽️
              </Text>
            </View>

            <View style={styles.reserveInfo}>
              <Text style={styles.reserveTitle}>
                Reserve sua mesa
              </Text>

              <Text style={styles.reserveText}>
                Escolha data, horário e
                quantidade de pessoas.
              </Text>
            </View>

            <Pressable
              style={styles.reserveButton}
              onPress={abrirReserva}
            >
              <Text
                style={
                  styles.reserveButtonText
                }
              >
                Reservar
              </Text>
            </Pressable>
          </View>

          {/* GALERIA */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                Galeria
              </Text>

              <Text style={styles.sectionSubtitle}>
                Veja um pouco do ambiente
              </Text>
            </View>

            <Text style={styles.seeAll}>
              Ver tudo
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={
              styles.galleryList
            }
          >
            {gallery.map((item) => (
              <Pressable
                key={item.id}
                style={styles.galleryCard}
              >
                <Text style={styles.galleryIcon}>
                  {item.icon}
                </Text>

                <Text style={styles.galleryTitle}>
                  {item.title}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* PROMOÇÕES */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                Promoções
              </Text>

              <Text style={styles.sectionSubtitle}>
                Aproveite enquanto estiver disponível
              </Text>
            </View>
          </View>

          {promotions.map((promotion) => (
            <Pressable
              key={promotion.id}
              style={styles.promotionCard}
            >
              <View style={styles.promotionIcon}>
                <Text>
                  {promotion.icon}
                </Text>
              </View>

              <View style={styles.promotionInfo}>
                <Text
                  style={styles.promotionTitle}
                >
                  {promotion.title}
                </Text>

                <Text
                  style={styles.promotionSubtitle}
                >
                  {promotion.subtitle}
                </Text>
              </View>

              <Text style={styles.promotionArrow}>
                ›
              </Text>
            </Pressable>
          ))}

          {/* EVENTOS */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                Próximos eventos
              </Text>

              <Text style={styles.sectionSubtitle}>
                O que vai acontecer por aqui
              </Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={
              styles.eventsList
            }
          >
            {events.map((event) => (
              <Pressable
                key={event.id}
                style={styles.eventCard}
              >
                <View style={styles.eventDate}>
                  <Text style={styles.eventWeek}>
                    {event.week}
                  </Text>

                  <Text style={styles.eventDay}>
                    {event.day}
                  </Text>
                </View>

                <View style={styles.eventInfo}>
                  <Text style={styles.eventIcon}>
                    {event.icon}
                  </Text>

                  <Text style={styles.eventTitle}>
                    {event.title}
                  </Text>

                  <Text style={styles.eventSubtitle}>
                    {event.subtitle}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>

          {/* CARDÁPIO */}
          <View style={styles.divider} />

          <View style={styles.menuHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                Cardápio
              </Text>

              <Text style={styles.sectionSubtitle}>
                Peça pelo Budd
              </Text>
            </View>

            <View style={styles.menuBadge}>
              <Text style={styles.menuBadgeText}>
                4 itens
              </Text>
            </View>
          </View>

          {menuItems.map((item) => {
            const itemNoCarrinho =
              cart.find(
                (cartItem) =>
                  cartItem.id === item.id &&
                  cartItem.placeId ===
                    place.id,
              );

            const quantidade =
              itemNoCarrinho?.quantity || 0;

            return (
              <View
                key={item.id}
                style={styles.menuItem}
              >
                <View style={styles.productIcon}>
                  <Text>
                    {item.icon}
                  </Text>
                </View>

                <View style={styles.menuInfo}>
                  <Text style={styles.menuCategory}>
                    {item.category}
                  </Text>

                  <Text style={styles.menuName}>
                    {item.name}
                  </Text>

                  <Text
                    style={
                      styles.menuDescription
                    }
                  >
                    {item.description}
                  </Text>

                  <Text style={styles.menuPrice}>
                    R${' '}
                    {item.price
                      .toFixed(2)
                      .replace('.', ',')}
                  </Text>
                </View>

                {quantidade === 0 ? (
                  <Pressable
                    style={styles.addButton}
                    onPress={() =>
                      adicionarAoCarrinho(item)
                    }
                  >
                    <Text
                      style={styles.addButtonText}
                    >
                      +
                    </Text>
                  </Pressable>
                ) : (
                  <View style={styles.quantity}>
                    <Pressable
                      onPress={() =>
                        removerItemDoCarrinho(
                          item,
                        )
                      }
                      style={
                        styles.quantityButton
                      }
                    >
                      <Text
                        style={
                          styles.quantityButtonText
                        }
                      >
                        −
                      </Text>
                    </Pressable>

                    <Text
                      style={styles.quantityText}
                    >
                      {quantidade}
                    </Text>

                    <Pressable
                      onPress={() =>
                        adicionarAoCarrinho(
                          item,
                        )
                      }
                      style={
                        styles.quantityButton
                      }
                    >
                      <Text
                        style={
                          styles.quantityButtonText
                        }
                      >
                        +
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>
            );
          })}

          {/* INFORMAÇÕES */}
          <View style={styles.additionalBox}>
            <Text style={styles.sectionTitle}>
              Informações
            </Text>

            <View style={styles.additionalRow}>
              <Text style={styles.additionalIcon}>
                💳
              </Text>

              <Text style={styles.additionalText}>
                Aceita pagamento pelo Budd
              </Text>
            </View>

            <View style={styles.additionalRow}>
              <Text style={styles.additionalIcon}>
                📶
              </Text>

              <Text style={styles.additionalText}>
                Wi-Fi disponível
              </Text>
            </View>

            <View style={styles.additionalRow}>
              <Text style={styles.additionalIcon}>
                🅿️
              </Text>

              <Text style={styles.additionalText}>
                Estacionamento próximo
              </Text>
            </View>

            <View style={styles.additionalRow}>
              <Text style={styles.additionalIcon}>
                🔞
              </Text>

              <Text style={styles.additionalText}>
                Ambiente para maiores de 18 anos
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* CARRINHO */}
      {quantidadeCarrinho > 0 && (
        <View style={styles.cartBar}>
          <View>
            <Text style={styles.cartQuantity}>
              {quantidadeCarrinho}{' '}
              {quantidadeCarrinho === 1
                ? 'item'
                : 'itens'}
            </Text>

            <Text style={styles.cartTotal}>
              R${' '}
              {totalCarrinho
                .toFixed(2)
                .replace('.', ',')}
            </Text>
          </View>

          <Pressable
            style={styles.cartButton}
            onPress={abrirCarrinho}
          >
            <Text style={styles.cartButtonText}>
              Ver carrinho
            </Text>
          </Pressable>
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

  content: {
    paddingBottom: 40,
  },

  contentWithCart: {
    paddingBottom: 125,
  },

  center: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },

  loadingText: {
    color: '#888',
    fontSize: 14,
    marginTop: 12,
  },

  errorTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '800',
  },

  errorText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },

  backButton: {
    marginTop: 24,
    backgroundColor: GREEN,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },

  backButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
  },

  /* CAPA */

  cover: {
    height: 290,
    backgroundColor: '#101410',
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },

  coverGlowOne: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#172A16',
    top: -100,
    right: -70,
  },

  coverGlowTwo: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#122016',
    bottom: -100,
    left: -60,
  },

  coverContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  coverHint: {
    color: '#555',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: 12,
  },

  placeLogo: {
    width: 120,
    height: 120,
    borderRadius: 32,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 5,
    borderColor: '#000',
  },

  placeLogoText: {
    fontSize: 54,
  },

  backCircle: {
    position: 'absolute',
    top: 22,
    left: 18,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },

  backIcon: {
    color: '#FFF',
    fontSize: 32,
    lineHeight: 32,
    marginTop: -3,
  },

  favoriteCircle: {
    position: 'absolute',
    top: 22,
    right: 18,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },

  favoriteIcon: {
    color: '#FFF',
    fontSize: 23,
  },

  favoriteActive: {
    color: GREEN,
  },

  /* PRINCIPAL */

  main: {
    padding: 20,
  },

  type: {
    color: GREEN,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 3,
    marginBottom: 5,
  },

  name: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '800',
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 9,
    gap: 7,
  },

  rating: {
    color: GREEN,
    fontSize: 13,
    fontWeight: '800',
  },

  ratingSeparator: {
    color: '#444',
    fontSize: 12,
  },

  ratingText: {
    color: '#888',
    fontSize: 12,
  },

  openText: {
    color: GREEN,
    fontSize: 12,
    fontWeight: '600',
  },

  address: {
    color: '#888',
    fontSize: 14,
    marginTop: 11,
    lineHeight: 20,
  },

  infoRow: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
  },

  infoItem: {
    flex: 1,
    backgroundColor: '#101010',
    borderRadius: 14,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoIcon: {
    fontSize: 18,
    marginRight: 9,
  },

  infoLabel: {
    color: '#666',
    fontSize: 10,
    fontWeight: '600',
  },

  infoValue: {
    color: '#DDD',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 3,
  },

  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },

  actionButton: {
    flex: 1,
    minHeight: 68,
    backgroundColor: '#111',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionIcon: {
    fontSize: 20,
  },

  actionText: {
    color: '#999',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 6,
  },

  divider: {
    height: 1,
    backgroundColor: '#1F1F1F',
    marginVertical: 25,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 28,
    marginBottom: 14,
  },

  sectionTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
  },

  sectionSubtitle: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },

  seeAll: {
    color: GREEN,
    fontSize: 12,
    fontWeight: '700',
  },

  description: {
    color: '#AAA',
    fontSize: 15,
    lineHeight: 23,
    marginTop: 3,
  },

  /* RESERVA */

  reserveBox: {
    backgroundColor: '#111',
    borderRadius: 18,
    padding: 15,
    marginTop: 22,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E1E1E',
  },

  reserveIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  reserveInfo: {
    flex: 1,
    marginLeft: 11,
    paddingRight: 8,
  },

  reserveTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },

  reserveText: {
    color: '#777',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },

  reserveButton: {
    backgroundColor: GREEN,
    borderRadius: 11,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },

  reserveButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '800',
  },

  /* GALERIA */

  galleryList: {
    gap: 10,
    paddingBottom: 2,
  },

  galleryCard: {
    width: 120,
    height: 105,
    borderRadius: 16,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1D1D1D',
  },

  galleryIcon: {
    fontSize: 32,
  },

  galleryTitle: {
    color: '#AAA',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 9,
  },

  /* PROMOÇÕES */

  promotionCard: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1C1C1C',
  },

  promotionIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#192317',
    alignItems: 'center',
    justifyContent: 'center',
  },

  promotionInfo: {
    flex: 1,
    marginLeft: 12,
  },

  promotionTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },

  promotionSubtitle: {
    color: GREEN,
    fontSize: 11,
    marginTop: 4,
  },

  promotionArrow: {
    color: '#666',
    fontSize: 28,
    marginLeft: 8,
  },

  /* EVENTOS */

  eventsList: {
    gap: 10,
  },

  eventCard: {
    width: 210,
    minHeight: 112,
    backgroundColor: '#111',
    borderRadius: 17,
    padding: 13,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#1D1D1D',
  },

  eventDate: {
    width: 48,
    height: 62,
    borderRadius: 12,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },

  eventWeek: {
    color: '#000',
    fontSize: 9,
    fontWeight: '900',
  },

  eventDay: {
    color: '#000',
    fontSize: 25,
    fontWeight: '900',
    marginTop: -2,
  },

  eventInfo: {
    flex: 1,
    marginLeft: 12,
  },

  eventIcon: {
    fontSize: 18,
  },

  eventTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 5,
  },

  eventSubtitle: {
    color: '#777',
    fontSize: 10,
    marginTop: 4,
  },

  /* CARDÁPIO */

  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  menuBadge: {
    backgroundColor: '#151515',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  menuBadgeText: {
    color: '#777',
    fontSize: 10,
    fontWeight: '700',
  },

  menuItem: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1B1B1B',
  },

  productIcon: {
    width: 62,
    height: 62,
    borderRadius: 15,
    backgroundColor: '#191919',
    alignItems: 'center',
    justifyContent: 'center',
  },

  menuInfo: {
    flex: 1,
    paddingHorizontal: 12,
  },

  menuCategory: {
    color: GREEN,
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 3,
  },

  menuName: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },

  menuDescription: {
    color: '#777',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 4,
  },

  menuPrice: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 6,
  },

  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },

  addButtonText: {
    color: '#000',
    fontSize: 27,
    fontWeight: '400',
    lineHeight: 29,
  },

  quantity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },

  quantityButtonText: {
    color: '#000',
    fontSize: 21,
    fontWeight: '600',
  },

  quantityText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
    minWidth: 16,
    textAlign: 'center',
  },

  /* INFORMAÇÕES */

  additionalBox: {
    backgroundColor: '#111',
    borderRadius: 18,
    padding: 18,
    marginTop: 18,
    marginBottom: 15,
  },

  additionalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },

  additionalIcon: {
    fontSize: 17,
    width: 30,
  },

  additionalText: {
    color: '#999',
    fontSize: 12,
    flex: 1,
  },

  /* CARRINHO */

  cartBar: {
    position: 'absolute',
    left: 15,
    right: 15,
    bottom: 15,
    backgroundColor: '#151515',
    borderWidth: 1,
    borderColor: '#292929',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  cartQuantity: {
    color: '#999',
    fontSize: 11,
  },

  cartTotal: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '800',
    marginTop: 2,
  },

  cartButton: {
    backgroundColor: GREEN,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },

  cartButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '800',
  },
});

