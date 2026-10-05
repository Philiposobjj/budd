import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { supabase } from '../lib/supabase';

type Place = {
  id: string;
  name: string;
  type: 'Bar' | 'Restaurante' | 'Night Club';
  description: string;
  address: string | null;
};

const categories = [
  'Todos',
  'Bares',
  'Restaurantes',
  'Night Clubs',
  'Eventos',
] as const;

type Category = (typeof categories)[number];

export default function ExploreScreen() {
  const router = useRouter();

  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState<Category>('Todos');

  useEffect(() => {
    async function loadPlaces() {
      setLoading(true);
      setError('');

      const { data, error } = await supabase
        .from('places')
        .select(
          'id, name, type, description, address'
        )
        .order('name', {
          ascending: true,
        });

      if (error) {
        console.error(
          'Erro ao carregar lugares:',
          error
        );

        setError(
          'Não foi possível carregar os lugares.'
        );

        setLoading(false);
        return;
      }

      setPlaces(data ?? []);
      setLoading(false);
    }

    loadPlaces();
  }, []);

  const filteredPlaces = useMemo(() => {
    const term = search.trim().toLowerCase();

    return places.filter((place) => {
      const matchesSearch =
        place.name
          .toLowerCase()
          .includes(term) ||
        place.description
          .toLowerCase()
          .includes(term) ||
        (place.address ?? '')
          .toLowerCase()
          .includes(term);

      let matchesCategory = true;

      if (selectedCategory === 'Bares') {
        matchesCategory =
          place.type === 'Bar';
      }

      if (selectedCategory === 'Restaurantes') {
        matchesCategory =
          place.type === 'Restaurante';
      }

      if (selectedCategory === 'Night Clubs') {
        matchesCategory =
          place.type === 'Night Club';
      }

      return matchesSearch && matchesCategory;
    });
  }, [
    places,
    search,
    selectedCategory,
  ]);

  function getIcon(type: Place['type']) {
    if (type === 'Bar') return '🍸';

    if (type === 'Restaurante') {
      return '🍽️';
    }

    return '🎧';
  }

  function abrirDetalhes(placeId: string) {
    router.push({
      pathname: '/place',
      params: {
        id: placeId,
      },
    });
  }

  function voltar() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/');
  }

  function limparFiltros() {
    setSearch('');
    setSelectedCategory('Todos');
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable
            onPress={voltar}
            style={styles.backButton}
          >
            <Text style={styles.backText}>
              ‹ Voltar
            </Text>
          </Pressable>

          <View style={styles.headerTitleArea}>
            <Text style={styles.title}>
              Descobrir
            </Text>

            <Text style={styles.subtitle}>
              Encontre lugares e eventos
            </Text>
          </View>

          <View style={styles.headerPlaceholder} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>
            🔎
          </Text>

          <TextInput
            style={styles.searchInput}
            placeholder="Buscar lugares..."
            placeholderTextColor="#777"
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            returnKeyType="search"
          />

          {search.length > 0 && (
            <Pressable
              onPress={() => setSearch('')}
              style={styles.clearButton}
            >
              <Text style={styles.clearText}>
                ×
              </Text>
            </Pressable>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
        >
          {categories.map((category) => {
            const active =
              selectedCategory === category;

            return (
              <Pressable
                key={category}
                onPress={() =>
                  setSelectedCategory(category)
                }
                style={[
                  styles.categoryButton,
                  active &&
                    styles.categoryButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    active &&
                      styles.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {selectedCategory !== 'Eventos' && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Lugares em destaque
              </Text>

              {!loading && !error && (
                <Text style={styles.resultCount}>
                  {filteredPlaces.length}{' '}
                  {filteredPlaces.length === 1
                    ? 'lugar'
                    : 'lugares'}
                </Text>
              )}
            </View>

            {loading && (
              <View style={styles.message}>
                <ActivityIndicator
                  color="#7CFF00"
                />

                <Text
                  style={styles.messageText}
                >
                  Carregando lugares...
                </Text>
              </View>
            )}

            {!loading && error !== '' && (
              <View style={styles.message}>
                <Text
                  style={styles.errorText}
                >
                  {error}
                </Text>
              </View>
            )}

            {!loading &&
              error === '' &&
              filteredPlaces.map((place) => (
                <Pressable
                  key={place.id}
                  style={({ pressed }) => [
                    styles.card,
                    pressed &&
                      styles.cardPressed,
                  ]}
                  onPress={() =>
                    abrirDetalhes(
                      place.id
                    )
                  }
                  accessibilityRole="button"
                  accessibilityLabel={`Ver detalhes de ${place.name}`}
                >
                  <View style={styles.icon}>
                    <Text
                      style={styles.iconText}
                    >
                      {getIcon(place.type)}
                    </Text>
                  </View>

                  <View style={styles.info}>
                    <Text
                      style={styles.placeName}
                    >
                      {place.name}
                    </Text>

                    <Text style={styles.type}>
                      {place.type}
                    </Text>

                    <Text
                      style={styles.description}
                    >
                      {place.description}
                    </Text>

                    {place.address && (
                      <Text
                        style={styles.address}
                      >
                        📍 {place.address}
                      </Text>
                    )}

                    <Text
                      style={styles.detailsLink}
                    >
                      Ver detalhes →
                    </Text>
                  </View>
                </Pressable>
              ))}

            {!loading &&
              error === '' &&
              filteredPlaces.length === 0 && (
                <View style={styles.message}>
                  <Text
                    style={styles.emptyTitle}
                  >
                    Nenhum lugar encontrado
                  </Text>

                  <Text
                    style={styles.messageText}
                  >
                    Tente outro nome ou
                    selecione outra
                    categoria.
                  </Text>

                  <Pressable
                    onPress={limparFiltros}
                    style={styles.resetButton}
                  >
                    <Text
                      style={styles.resetText}
                    >
                      Limpar filtros
                    </Text>
                  </Pressable>
                </View>
              )}
          </>
        )}

        {selectedCategory === 'Eventos' && (
          <View style={styles.eventsCard}>
            <View style={styles.eventsIcon}>
              <Text style={styles.eventsIconText}>
                🎟️
              </Text>
            </View>

            <Text style={styles.eventsTitle}>
              Eventos
            </Text>

            <Text style={styles.eventsText}>
              Encontre shows, festas, teatro
              e outros eventos no Budd.
            </Text>

            <View style={styles.eventTypes}>
              <View style={styles.eventType}>
                <Text style={styles.eventEmoji}>
                  🎵
                </Text>

                <Text style={styles.eventTypeText}>
                  Shows
                </Text>
              </View>

              <View style={styles.eventType}>
                <Text style={styles.eventEmoji}>
                  🎧
                </Text>

                <Text style={styles.eventTypeText}>
                  Festas
                </Text>
              </View>

              <View style={styles.eventType}>
                <Text style={styles.eventEmoji}>
                  🎭
                </Text>

                <Text style={styles.eventTypeText}>
                  Teatro
                </Text>
              </View>

              <View style={styles.eventType}>
                <Text style={styles.eventEmoji}>
                  🎟️
                </Text>

                <Text style={styles.eventTypeText}>
                  Ingressos
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
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
  },

  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 80,
  },

  backText: {
    color: '#7CFF00',
    fontSize: 15,
    fontWeight: '600',
  },

  headerTitleArea: {
    flex: 1,
    alignItems: 'center',
  },

  headerPlaceholder: {
    width: 80,
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
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  searchBox: {
    height: 52,
    backgroundColor: '#111',
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 14,
  },

  clearButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  clearText: {
    color: '#AAA',
    fontSize: 24,
  },

  categories: {
    gap: 8,
    paddingBottom: 24,
  },

  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#151515',
    borderWidth: 1,
    borderColor: '#252525',
  },

  categoryButtonActive: {
    backgroundColor: '#7CFF00',
    borderColor: '#7CFF00',
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
    marginBottom: 14,
  },

  sectionTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },

  resultCount: {
    color: '#777',
    fontSize: 12,
  },

  card: {
    backgroundColor: '#111',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 12,
  },

  cardPressed: {
    opacity: 0.7,
  },

  icon: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: '#7CFF00',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  iconText: {
    fontSize: 26,
  },

  info: {
    flex: 1,
  },

  placeName: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
  },

  type: {
    color: '#7CFF00',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 3,
  },

  description: {
    color: '#999',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },

  address: {
    color: '#777',
    fontSize: 12,
    marginTop: 8,
  },

  detailsLink: {
    color: '#7CFF00',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 12,
  },

  message: {
    alignItems: 'center',
    paddingVertical: 35,
    paddingHorizontal: 12,
  },

  messageText: {
    color: '#888',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },

  errorText: {
    color: '#FF7777',
    fontSize: 14,
    textAlign: 'center',
  },

  emptyTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },

  resetButton: {
    marginTop: 18,
    backgroundColor: '#7CFF00',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },

  resetText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '700',
  },

  eventsCard: {
    backgroundColor: '#111',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginTop: 10,
  },

  eventsIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#7CFF00',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  eventsIconText: {
    fontSize: 38,
  },

  eventsTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },

  eventsText: {
    color: '#999',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 300,
  },

  eventTypes: {
    width: '100%',
    marginTop: 28,
    gap: 10,
  },

  eventType: {
    backgroundColor: '#181818',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  eventEmoji: {
    fontSize: 22,
    width: 40,
  },

  eventTypeText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});