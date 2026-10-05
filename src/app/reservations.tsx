
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  useFocusEffect,
  useRouter,
} from 'expo-router';

import { supabase } from '../lib/supabase';

type Reservation = {
  id: string;
  place_id: string;
  reservation_date: string;
  reservation_time: string;
  people: number;
  status: string;
};

type Place = {
  id: string;
  name: string;
  type: string;
};

export default function ReservationsScreen() {
  const router = useRouter();

  const [reservations, setReservations] =
    useState<Reservation[]>([]);

  const [places, setPlaces] = useState<
    Record<string, Place>
  >({});

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState('');

  const carregarReservas = useCallback(
    async (mostrarLoading = true) => {
      try {
        if (mostrarLoading) {
          setLoading(true);
        }

        setErrorMessage('');

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.replace('/login');
          return;
        }

        const { data, error } = await supabase
          .from('reservations')
          .select(
            'id, place_id, reservation_date, reservation_time, people, status'
          )
          .eq('user_id', user.id)
          .order('reservation_date', {
            ascending: true,
          })
          .order('reservation_time', {
            ascending: true,
          });

        if (error) {
          console.error(
            'ERRO AO CARREGAR RESERVAS:',
            error
          );

          setErrorMessage(
            'Não foi possível carregar suas reservas.'
          );

          return;
        }

        const reservas = data || [];

        setReservations(reservas);

        const placeIds = [
          ...new Set(
            reservas.map(
              (reservation) =>
                reservation.place_id
            )
          ),
        ];

        if (placeIds.length === 0) {
          setPlaces({});
          return;
        }

        const {
          data: placesData,
          error: placesError,
        } = await supabase
          .from('places')
          .select('id, name, type')
          .in('id', placeIds);

        if (placesError) {
          console.error(
            'ERRO AO CARREGAR ESTABELECIMENTOS:',
            placesError
          );

          setPlaces({});
          return;
        }

        const placesMap: Record<string, Place> =
          {};

        (placesData || []).forEach((place) => {
          placesMap[place.id] = place;
        });

        setPlaces(placesMap);
      } catch (error) {
        console.error(
          'ERRO NAS RESERVAS:',
          error
        );

        setErrorMessage(
          'Ocorreu um erro ao carregar suas reservas.'
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [router]
  );

  useFocusEffect(
    useCallback(() => {
      carregarReservas();
    }, [carregarReservas])
  );

  async function atualizar() {
    setRefreshing(true);
    await carregarReservas(false);
  }

  function formatarData(data: string) {
    const partes = data.split('-');

    if (partes.length !== 3) {
      return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  function formatarHorario(horario: string) {
    return horario.substring(0, 5);
  }

  function abrirEstabelecimento(
    reservation: Reservation
  ) {
    const place = places[reservation.place_id];

    router.push({
      pathname: '/place',
      params: {
        id: reservation.place_id,
        ...(place
          ? {
              name: place.name,
              type: place.type,
            }
          : {}),
      },
    });
  }

  function obterNomeEstabelecimento(
    placeId: string
  ) {
    return (
      places[placeId]?.name ||
      'Estabelecimento'
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
        >
          <Text style={styles.back}>
            Voltar
          </Text>
        </Pressable>

        <Text style={styles.title}>
          Minhas reservas
        </Text>

        <View style={styles.placeholder} />
      </View>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator
            size="large"
            color="#7CFF00"
          />

          <Text style={styles.loadingText}>
            Carregando suas reservas...
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={atualizar}
              tintColor="#7CFF00"
            />
          }
        >
          {errorMessage ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorTitle}>
                Não foi possível carregar
              </Text>

              <Text style={styles.errorText}>
                {errorMessage}
              </Text>

              <Pressable
                style={styles.retryButton}
                onPress={() =>
                  carregarReservas()
                }
              >
                <Text
                  style={styles.retryButtonText}
                >
                  Tentar novamente
                </Text>
              </Pressable>
            </View>
          ) : reservations.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.icon}>
                📅
              </Text>

              <Text style={styles.emptyTitle}>
                Você ainda não tem reservas
              </Text>

              <Text style={styles.description}>
                Quando você fizer uma reserva pelo
                Budd, ela aparecerá aqui.
              </Text>

              <Pressable
                style={styles.button}
                onPress={() =>
                  router.push('/explore')
                }
              >
                <Text style={styles.buttonText}>
                  Explorar estabelecimentos
                </Text>
              </Pressable>
            </View>
          ) : (
            <>
              <Text style={styles.intro}>
                Suas reservas aparecem aqui.
              </Text>

              {reservations.map(
                (reservation) => {
                  const place =
                    places[reservation.place_id];

                  return (
                    <View
                      key={reservation.id}
                      style={styles.card}
                    >
                      <View
                        style={styles.cardHeader}
                      >
                        <View
                          style={styles.placeInfo}
                        >
                          <Text
                            style={styles.placeIcon}
                          >
                            🍽️
                          </Text>

                          <View
                            style={
                              styles.placeTexts
                            }
                          >
                            <Text
                              style={
                                styles.placeName
                              }
                            >
                              {obterNomeEstabelecimento(
                                reservation.place_id
                              )}
                            </Text>

                            {place?.type ? (
                              <Text
                                style={
                                  styles.placeType
                                }
                              >
                                {place.type}
                              </Text>
                            ) : null}
                          </View>
                        </View>

                        <View
                          style={styles.statusBadge}
                        >
                          <Text
                            style={
                              styles.statusText
                            }
                          >
                            {reservation.status}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={styles.separator}
                      />

                      <View
                        style={styles.details}
                      >
                        <View
                          style={styles.detailRow}
                        >
                          <Text
                            style={
                              styles.detailIcon
                            }
                          >
                            📅
                          </Text>

                          <View>
                            <Text
                              style={
                                styles.detailLabel
                              }
                            >
                              Data
                            </Text>

                            <Text
                              style={
                                styles.detailValue
                              }
                            >
                              {formatarData(
                                reservation.reservation_date
                              )}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={styles.detailRow}
                        >
                          <Text
                            style={
                              styles.detailIcon
                            }
                          >
                            🕐
                          </Text>

                          <View>
                            <Text
                              style={
                                styles.detailLabel
                              }
                            >
                              Horário
                            </Text>

                            <Text
                              style={
                                styles.detailValue
                              }
                            >
                              {formatarHorario(
                                reservation.reservation_time
                              )}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={styles.detailRow}
                        >
                          <Text
                            style={
                              styles.detailIcon
                            }
                          >
                            👥
                          </Text>

                          <View>
                            <Text
                              style={
                                styles.detailLabel
                              }
                            >
                              Pessoas
                            </Text>

                            <Text
                              style={
                                styles.detailValue
                              }
                            >
                              {reservation.people}
                              {reservation.people ===
                              1
                                ? ' pessoa'
                                : ' pessoas'}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <Pressable
                        style={styles.placeButton}
                        onPress={() =>
                          abrirEstabelecimento(
                            reservation
                          )
                        }
                      >
                        <Text
                          style={
                            styles.placeButtonText
                          }
                        >
                          Ver estabelecimento
                        </Text>
                      </Pressable>
                    </View>
                  );
                }
              )}
            </>
          )}
        </ScrollView>
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  back: {
    color: '#7CFF00',
    fontSize: 15,
  },

  title: {
    color: '#FFF',
    fontSize: 19,
    fontWeight: 'bold',
  },

  placeholder: {
    width: 40,
  },

  content: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },

  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    color: '#999',
    marginTop: 10,
  },

  intro: {
    color: '#888',
    fontSize: 14,
    marginBottom: 15,
  },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 70,
  },

  icon: {
    fontSize: 48,
    marginBottom: 20,
  },

  emptyTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  description: {
    color: '#999',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 12,
    maxWidth: 320,
  },

  button: {
    backgroundColor: '#7CFF00',
    paddingHorizontal: 18,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 25,
  },

  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },

  card: {
    backgroundColor: '#151515',
    borderRadius: 14,
    padding: 18,
    marginBottom: 15,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  placeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },

  placeIcon: {
    fontSize: 28,
    marginRight: 12,
  },

  placeTexts: {
    flex: 1,
  },

  placeName: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  placeType: {
    color: '#888',
    fontSize: 13,
    marginTop: 4,
  },

  statusBadge: {
    backgroundColor: '#7CFF00',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  statusText: {
    color: '#000',
    fontSize: 11,
    fontWeight: 'bold',
  },

  separator: {
    height: 1,
    backgroundColor: '#292929',
    marginVertical: 16,
  },

  details: {
    gap: 14,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  detailIcon: {
    fontSize: 20,
    width: 35,
  },

  detailLabel: {
    color: '#777',
    fontSize: 11,
    marginBottom: 2,
  },

  detailValue: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },

  placeButton: {
    borderWidth: 1,
    borderColor: '#7CFF00',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 18,
  },

  placeButtonText: {
    color: '#7CFF00',
    fontSize: 14,
    fontWeight: 'bold',
  },

  errorBox: {
    backgroundColor: '#151515',
    borderRadius: 14,
    padding: 20,
    marginTop: 10,
  },

  errorTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  errorText: {
    color: '#999',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },

  retryButton: {
    backgroundColor: '#7CFF00',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 18,
  },

  retryButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});

