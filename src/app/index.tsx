import { useRouter } from 'expo-router';

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useMemo, useState } from 'react';

import { useBudd } from '../context/BuddContext';

const GREEN = '#76EB3C';

const filtros = [
  'Todos',
  'Bares',
  'Restaurantes',
  'Eventos',
];

const destaques = [
  {
    id: '1',
    name: 'Budd House',
    category: 'Bar',
    rating: '4.8',
    distance: '1,2 km',
    emoji: '🍸',
    address: 'Centro, Florianópolis',
    description:
      'Bar com drinks, música e experiências para aproveitar a noite.',
  },
  {
    id: '2',
    name: 'Praia Club',
    category: 'Night Club',
    rating: '4.7',
    distance: '2,4 km',
    emoji: '🎵',
    address: 'Beira-Mar, Florianópolis',
    description:
      'Club com festas, música e eventos especiais.',
  },
  {
    id: '3',
    name: 'Budd Kitchen',
    category: 'Restaurante',
    rating: '4.9',
    distance: '3,1 km',
    emoji: '🍔',
    address: 'Centro, Florianópolis',
    description:
      'Restaurante com hambúrgueres, pratos e bebidas.',
  },
];

const promocoes = [
  {
    id: '1',
    title: '2 Drinks pelo preço de 1',
    place: 'Budd House',
    placeId: '1',
    description: 'Hoje até 22h',
    emoji: '🍹',
    category: 'Bar',
    address: 'Centro, Florianópolis',
    placeDescription:
      'Bar com drinks, música e experiências para aproveitar a noite.',
  },
  {
    id: '2',
    title: '20% OFF no jantar',
    place: 'Budd Kitchen',
    placeId: '3',
    description: 'De segunda a quinta',
    emoji: '🍔',
    category: 'Restaurante',
    address: 'Centro, Florianópolis',
    placeDescription:
      'Restaurante com hambúrgueres, pratos e bebidas.',
  },
];

const eventos = [
  {
    id: '1',
    day: 'SEX',
    date: '10',
    title: 'Live Music',
    place: 'Budd House',
    placeId: '1',
    time: '21:00',
    emoji: '🎸',
    category: 'Bar',
    address: 'Centro, Florianópolis',
    description:
      'Bar com música ao vivo, drinks e experiências para aproveitar a noite.',
  },
  {
    id: '2',
    day: 'SÁB',
    date: '11',
    title: 'Budd Party',
    place: 'Praia Club',
    placeId: '2',
    time: '23:00',
    emoji: '🎧',
    category: 'Night Club',
    address: 'Beira-Mar, Florianópolis',
    description:
      'Club com festas, música e eventos especiais.',
  },
];

export default function HomeScreen() {
  const router = useRouter();

  const { posts } = useBudd();

  const [filtroSelecionado, setFiltroSelecionado] =
    useState('Todos');

  const [pesquisa, setPesquisa] = useState('');

  function abrirPerfil() {
    router.push('/profile');
  }

  function abrirCriar() {
    router.push('/create');
  }

  function abrirExplorar() {
    router.push('/explore');
  }

  function abrirMapa() {
    router.push('/mapa');
  }

  function abrirAssistente() {
    router.push('/assistente');
  }

  function abrirLugar(
    lugar: {
      id: string;
      name: string;
      category: string;
      address: string;
      description: string;
    },
  ) {
    let type:
      | 'Bar'
      | 'Restaurante'
      | 'Night Club' = 'Bar';

    if (lugar.category === 'Restaurante') {
      type = 'Restaurante';
    }

    if (lugar.category === 'Night Club') {
      type = 'Night Club';
    }

    router.push({
      pathname: '/place',
      params: {
        id: lugar.id,
        name: lugar.name,
        type,
        description: lugar.description,
        address: lugar.address,
      },
    });
  }

  const destaquesFiltrados = useMemo(() => {
    let resultado = destaques;

    if (filtroSelecionado === 'Bares') {
      resultado = destaques.filter(
        (item) =>
          item.category === 'Bar' ||
          item.category === 'Night Club',
      );
    }

    if (filtroSelecionado === 'Restaurantes') {
      resultado = destaques.filter(
        (item) =>
          item.category === 'Restaurante',
      );
    }

    if (filtroSelecionado === 'Eventos') {
      resultado = destaques.filter(
        (item) =>
          item.category === 'Bar' ||
          item.category === 'Night Club',
      );
    }

    if (pesquisa.trim().length > 0) {
      const texto = pesquisa
        .trim()
        .toLowerCase();

      resultado = resultado.filter((item) =>
        `${item.name} ${item.category} ${item.address}`
          .toLowerCase()
          .includes(texto),
      );
    }

    return resultado;
  }, [
    filtroSelecionado,
    pesquisa,
  ]);

  const eventosFiltrados = useMemo(() => {
    if (pesquisa.trim().length === 0) {
      return eventos;
    }

    const texto = pesquisa
      .trim()
      .toLowerCase();

    return eventos.filter((evento) =>
      `${evento.title} ${evento.place}`
        .toLowerCase()
        .includes(texto),
    );
  }, [pesquisa]);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContent
        }
      >
        {/* HEADER */}

        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>
              budd
            </Text>

            <Text style={styles.subtitle}>
              Descubra o que está acontecendo
            </Text>
          </View>

          <Pressable
            onPress={abrirPerfil}
            style={styles.profileButton}
          >
            <Text style={styles.profileIcon}>
              👤
            </Text>
          </Pressable>
        </View>

        {/* ASSISTENTE */}

        <Pressable
          style={styles.assistantCard}
          onPress={abrirAssistente}
        >
          <View
            style={styles.assistantIcon}
          >
            <Text style={styles.assistantEmoji}>
              ✨
            </Text>
          </View>

          <View
            style={styles.assistantInfo}
          >
            <Text style={styles.assistantTitle}>
              Precisa de uma ideia?
            </Text>

            <Text
              style={styles.assistantDescription}
            >
              Pergunte ao Assistente Budd
            </Text>
          </View>

          <Text style={styles.assistantArrow}>
            ›
          </Text>
        </Pressable>

        {/* PESQUISA */}

        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>
            🔎
          </Text>

          <TextInput
            value={pesquisa}
            onChangeText={setPesquisa}
            placeholder="Buscar bares, restaurantes..."
            placeholderTextColor="#666"
            style={styles.searchInput}
          />

          {pesquisa.length > 0 && (
            <Pressable
              onPress={() => setPesquisa('')}
              style={styles.clearSearch}
            >
              <Text style={styles.clearSearchText}>
                ×
              </Text>
            </Pressable>
          )}
        </View>

        {/* FILTROS */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {filtros.map((filtro) => {
            const ativo =
              filtro === filtroSelecionado;

            return (
              <Pressable
                key={filtro}
                onPress={() =>
                  setFiltroSelecionado(filtro)
                }
                style={[
                  styles.filterButton,
                  ativo &&
                    styles.filterButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    ativo &&
                      styles.filterTextActive,
                  ]}
                >
                  {filtro}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* DESTAQUES */}

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              🔥 Destaques
            </Text>

            <Text style={styles.sectionSubtitle}>
              Lugares que estão bombando agora
            </Text>
          </View>

          <Pressable onPress={abrirExplorar}>
            <Text style={styles.seeAll}>
              Ver todos
            </Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={
            styles.highlightList
          }
        >
          {destaquesFiltrados.map((item) => (
            <Pressable
              key={item.id}
              style={styles.highlightCard}
              onPress={() =>
                abrirLugar(item)
              }
            >
              <View
                style={styles.highlightImage}
              >
                <Text
                  style={
                    styles.highlightEmoji
                  }
                >
                  {item.emoji}
                </Text>

                <View
                  style={styles.favorite}
                >
                  <Text>♡</Text>
                </View>
              </View>

              <View
                style={styles.highlightContent}
              >
                <Text
                  style={styles.highlightName}
                >
                  {item.name}
                </Text>

                <Text
                  style={
                    styles.highlightCategory
                  }
                >
                  {item.category}
                </Text>

                <View
                  style={styles.infoRow}
                >
                  <Text
                    style={styles.rating}
                  >
                    ★ {item.rating}
                  </Text>

                  <Text
                    style={styles.distance}
                  >
                    • {item.distance}
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}

          {destaquesFiltrados.length === 0 && (
            <View style={styles.noResults}>
              <Text
                style={styles.noResultsIcon}
              >
                🔎
              </Text>

              <Text
                style={styles.noResultsText}
              >
                Nenhum lugar encontrado.
              </Text>

              <Text
                style={styles.noResultsHint}
              >
                Tente outra busca ou categoria.
              </Text>
            </View>
          )}
        </ScrollView>

        {/* PROMOÇÕES */}

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              🎁 Promoções
            </Text>

            <Text style={styles.sectionSubtitle}>
              Aproveite ofertas perto de você
            </Text>
          </View>

          <Pressable onPress={abrirExplorar}>
            <Text style={styles.seeAll}>
              Explorar
            </Text>
          </Pressable>
        </View>

        {promocoes.map((promocao) => (
          <Pressable
            key={promocao.id}
            style={styles.promotionCard}
            onPress={() =>
              abrirLugar({
                id: promocao.placeId,
                name: promocao.place,
                category:
                  promocao.category,
                address:
                  promocao.address,
                description:
                  promocao.placeDescription,
              })
            }
          >
            <View
              style={styles.promotionIcon}
            >
              <Text
                style={
                  styles.promotionEmoji
                }
              >
                {promocao.emoji}
              </Text>
            </View>

            <View
              style={styles.promotionInfo}
            >
              <Text
                style={styles.promotionTitle}
              >
                {promocao.title}
              </Text>

              <Text
                style={styles.promotionPlace}
              >
                {promocao.place}
              </Text>

              <Text
                style={
                  styles.promotionDescription
                }
              >
                {promocao.description}
              </Text>
            </View>

            <Text style={styles.arrow}>
              ›
            </Text>
          </Pressable>
        ))}

        {/* EVENTOS */}

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              🎵 Eventos próximos
            </Text>

            <Text style={styles.sectionSubtitle}>
              O que acontece nos próximos dias
            </Text>
          </View>

          <Pressable onPress={abrirExplorar}>
            <Text style={styles.seeAll}>
              Ver todos
            </Text>
          </Pressable>
        </View>

        {eventosFiltrados.map((evento) => (
          <Pressable
            key={evento.id}
            style={styles.eventCard}
            onPress={() =>
              abrirLugar({
                id: evento.placeId,
                name: evento.place,
                category:
                  evento.category,
                address:
                  evento.address,
                description:
                  evento.description,
              })
            }
          >
            <View style={styles.dateBox}>
              <Text style={styles.dateDay}>
                {evento.day}
              </Text>

              <Text
                style={styles.dateNumber}
              >
                {evento.date}
              </Text>
            </View>

            <View
              style={styles.eventEmoji}
            >
              <Text>{evento.emoji}</Text>
            </View>

            <View style={styles.eventInfo}>
              <Text
                style={styles.eventTitle}
              >
                {evento.title}
              </Text>

              <Text
                style={styles.eventPlace}
              >
                {evento.place}
              </Text>

              <Text
                style={styles.eventTime}
              >
                Hoje • {evento.time}
              </Text>
            </View>

            <Text style={styles.arrow}>
              ›
            </Text>
          </Pressable>
        ))}

        {eventosFiltrados.length === 0 && (
          <View style={styles.emptyEvents}>
            <Text style={styles.emptyEventsIcon}>
              🎵
            </Text>

            <Text
              style={styles.emptyEventsText}
            >
              Nenhum evento encontrado.
            </Text>
          </View>
        )}

        {/* PUBLICAÇÕES */}

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              ✨ Comunidade
            </Text>

            <Text style={styles.sectionSubtitle}>
              O que a galera está compartilhando
            </Text>
          </View>

          <Pressable onPress={abrirCriar}>
            <Text style={styles.seeAll}>
              Publicar
            </Text>
          </Pressable>
        </View>

        {posts.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>
              ✨
            </Text>

            <Text style={styles.emptyTitle}>
              Seja o primeiro a publicar
            </Text>

            <Text style={styles.emptyText}>
              Compartilhe uma experiência,
              foto ou descoberta com a comunidade.
            </Text>

            <Pressable
              style={styles.emptyButton}
              onPress={abrirCriar}
            >
              <Text
                style={styles.emptyButtonText}
              >
                + Criar publicação
              </Text>
            </Pressable>
          </View>
        ) : (
          posts.map((post) => (
            <View
              key={post.id}
              style={styles.post}
            >
              <View
                style={styles.postHeader}
              >
                <View style={styles.avatar}>
                  <Text
                    style={styles.avatarText}
                  >
                    {post.initial}
                  </Text>
                </View>

                <View
                  style={styles.authorArea}
                >
                  <Text
                    style={styles.author}
                  >
                    {post.author}
                  </Text>

                  <Text style={styles.time}>
                    {post.time}
                  </Text>
                </View>
              </View>

              {post.imageUrl ? (
                <View
                  style={styles.postImagePlaceholder}
                >
                  <Text
                    style={
                      styles.postImageText
                    }
                  >
                    📷
                  </Text>

                  <Text
                    style={
                      styles.postImageCaption
                    }
                  >
                    Foto da publicação
                  </Text>
                </View>
              ) : null}

              {post.text ? (
                <Text style={styles.postText}>
                  {post.text}
                </Text>
              ) : null}

              <View
                style={styles.postActions}
              >
                <Pressable
                  style={styles.postAction}
                >
                  <Text
                    style={
                      styles.postActionIcon
                    }
                  >
                    ♡
                  </Text>

                  <Text
                    style={
                      styles.postActionText
                    }
                  >
                    Curtir
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.postAction}
                >
                  <Text
                    style={
                      styles.postActionIcon
                    }
                  >
                    💬
                  </Text>

                  <Text
                    style={
                      styles.postActionText
                    }
                  >
                    Comentar
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.postAction}
                >
                  <Text
                    style={
                      styles.postActionIcon
                    }
                  >
                    ↗
                  </Text>

                  <Text
                    style={
                      styles.postActionText
                    }
                  >
                    Compartilhar
                  </Text>
                </Pressable>
              </View>
            </View>
          ))
        )}

        {/* PUBLICAR */}

        <Pressable
          style={styles.publishButton}
          onPress={abrirCriar}
        >
          <Text
            style={styles.publishButtonText}
          >
            + Publicar no Budd
          </Text>
        </Pressable>
      </ScrollView>

      {/* NAVEGAÇÃO INFERIOR */}

      <View style={styles.bottomBar}>
        {/* INÍCIO */}

        <Pressable
          style={styles.bottomItem}
          onPress={() => router.replace('/')}
        >
          <Text
            style={[
              styles.bottomIcon,
              styles.bottomIconActive,
            ]}
          >
            🏠
          </Text>

          <Text
            style={[
              styles.bottomText,
              styles.bottomTextActive,
            ]}
          >
            Início
          </Text>
        </Pressable>

        {/* EXPLORAR */}

        <Pressable
          style={styles.bottomItem}
          onPress={abrirExplorar}
        >
          <Text style={styles.bottomIcon}>
            🔎
          </Text>

          <Text style={styles.bottomText}>
            Explorar
          </Text>
        </Pressable>

        {/* MAPA */}

        <Pressable
          style={styles.bottomItem}
          onPress={abrirMapa}
        >
          <Text style={styles.bottomIcon}>
            🗺️
          </Text>

          <Text style={styles.bottomText}>
            Mapa
          </Text>
        </Pressable>

        {/* PUBLICAR */}

        <Pressable
          style={styles.bottomItem}
          onPress={abrirCriar}
        >
          <View
            style={styles.publishCircle}
          >
            <Text style={styles.publishIcon}>
              ＋
            </Text>
          </View>

          <Text style={styles.bottomText}>
            Publicar
          </Text>
        </Pressable>

        {/* PERFIL */}

        <Pressable
          style={styles.bottomItem}
          onPress={abrirPerfil}
        >
          <Text style={styles.bottomIcon}>
            👤
          </Text>

          <Text style={styles.bottomText}>
            Perfil
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  scrollContent: {
    paddingTop: 54,
    paddingHorizontal: 18,
    paddingBottom: 125,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  logo: {
    color: GREEN,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
  },

  subtitle: {
    color: '#777',
    fontSize: 12,
    marginTop: 3,
  },

  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#151515',
    borderWidth: 1,
    borderColor: '#292929',
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileIcon: {
    fontSize: 20,
  },

  assistantCard: {
    minHeight: 68,
    backgroundColor: '#101810',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#263426',
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  assistantIcon: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },

  assistantEmoji: {
    fontSize: 22,
  },

  assistantInfo: {
    flex: 1,
    marginLeft: 11,
  },

  assistantTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },

  assistantDescription: {
    color: '#777',
    fontSize: 11,
    marginTop: 3,
  },

  assistantArrow: {
    color: GREEN,
    fontSize: 28,
    marginLeft: 8,
  },

  searchContainer: {
    height: 52,
    borderRadius: 15,
    backgroundColor: '#151515',
    borderWidth: 1,
    borderColor: '#242424',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 15,
  },

  searchIcon: {
    fontSize: 18,
    marginRight: 9,
  },

  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 14,
  },

  clearSearch: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: '#292929',
    alignItems: 'center',
    justifyContent: 'center',
  },

  clearSearchText: {
    color: '#AAA',
    fontSize: 19,
    lineHeight: 21,
  },

  filters: {
    gap: 9,
    paddingBottom: 8,
  },

  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#151515',
    borderWidth: 1,
    borderColor: '#242424',
  },

  filterButtonActive: {
    backgroundColor: GREEN,
    borderColor: GREEN,
  },

  filterText: {
    color: '#AAA',
    fontSize: 13,
    fontWeight: '600',
  },

  filterTextActive: {
    color: '#000',
    fontWeight: '800',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 25,
    marginBottom: 13,
  },

  sectionTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
  },

  sectionSubtitle: {
    color: '#666',
    fontSize: 12,
    marginTop: 3,
  },

  seeAll: {
    color: GREEN,
    fontSize: 12,
    fontWeight: '700',
  },

  highlightList: {
    gap: 12,
    paddingRight: 18,
  },

  highlightCard: {
    width: 205,
    backgroundColor: '#151515',
    borderRadius: 17,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#222',
  },

  highlightImage: {
    height: 135,
    backgroundColor: '#242424',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  highlightEmoji: {
    fontSize: 52,
  },

  favorite: {
    position: 'absolute',
    right: 10,
    top: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  highlightContent: {
    padding: 13,
  },

  highlightName: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },

  highlightCategory: {
    color: '#777',
    fontSize: 12,
    marginTop: 3,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 9,
  },

  rating: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },

  distance: {
    color: '#777',
    fontSize: 12,
    marginLeft: 5,
  },

  noResults: {
    width: 280,
    paddingVertical: 32,
    alignItems: 'center',
  },

  noResultsIcon: {
    fontSize: 24,
  },

  noResultsText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
  },

  noResultsHint: {
    color: '#666',
    fontSize: 11,
    marginTop: 4,
  },

  promotionCard: {
    minHeight: 88,
    backgroundColor: '#151515',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#222',
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  promotionIcon: {
    width: 54,
    height: 54,
    borderRadius: 14,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },

  promotionEmoji: {
    fontSize: 27,
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

  promotionPlace: {
    color: GREEN,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 3,
  },

  promotionDescription: {
    color: '#777',
    fontSize: 11,
    marginTop: 3,
  },

  arrow: {
    color: GREEN,
    fontSize: 28,
    marginLeft: 8,
  },

  eventCard: {
    minHeight: 84,
    backgroundColor: '#151515',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#222',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  dateBox: {
    width: 45,
    alignItems: 'center',
  },

  dateDay: {
    color: GREEN,
    fontSize: 10,
    fontWeight: '800',
  },

  dateNumber: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 1,
  },

  eventEmoji: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#242424',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },

  eventInfo: {
    flex: 1,
  },

  eventTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },

  eventPlace: {
    color: '#AAA',
    fontSize: 12,
    marginTop: 3,
  },

  eventTime: {
    color: '#666',
    fontSize: 11,
    marginTop: 3,
  },

  emptyEvents: {
    backgroundColor: '#101010',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#1E1E1E',
    paddingVertical: 24,
    alignItems: 'center',
    marginBottom: 4,
  },

  emptyEventsIcon: {
    fontSize: 25,
  },

  emptyEventsText: {
    color: '#777',
    fontSize: 12,
    marginTop: 7,
  },

  empty: {
    backgroundColor: '#101010',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 35,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E1E1E',
  },

  emptyIcon: {
    fontSize: 30,
  },

  emptyTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 8,
  },

  emptyText: {
    color: '#777',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 8,
  },

  emptyButton: {
    backgroundColor: GREEN,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 10,
    marginTop: 16,
  },

  emptyButtonText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '800',
  },

  post: {
    backgroundColor: '#151515',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#222',
  },

  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '900',
  },

  authorArea: {
    marginLeft: 10,
  },

  author: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },

  time: {
    color: '#666',
    fontSize: 11,
    marginTop: 2,
  },

  postImagePlaceholder: {
    height: 180,
    backgroundColor: '#242424',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 13,
  },

  postImageText: {
    fontSize: 35,
  },

  postImageCaption: {
    color: '#777',
    fontSize: 11,
    marginTop: 6,
  },

  postText: {
    color: '#DDD',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 13,
  },

  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#222',
  },

  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  postActionIcon: {
    color: '#AAA',
    fontSize: 17,
  },

  postActionText: {
    color: '#888',
    fontSize: 11,
  },

  publishButton: {
    backgroundColor: GREEN,
    borderRadius: 13,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 10,
  },

  publishButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '900',
  },

  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0D0D0D',
    borderTopWidth: 1,
    borderTopColor: '#222',
    paddingTop: 8,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },

  bottomItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minWidth: 0,
  },

  bottomIcon: {
    fontSize: 18,
    opacity: 0.65,
  },

  bottomIconActive: {
    opacity: 1,
  },

  bottomText: {
    color: '#777',
    fontSize: 9,
    marginTop: 4,
  },

  bottomTextActive: {
    color: GREEN,
    fontWeight: '700',
  },

  publishCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -5,
  },

  publishIcon: {
    color: '#000',
    fontSize: 22,
    fontWeight: '800',
  },
});