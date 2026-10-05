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

const GREEN = '#76EB3C';

type Order = {
  id: string;
  place_id: string;
  total: number;
  status: string;
  created_at: string;
};

type OrderItem = {
  id: string;
  order_id: string;
  product_name: string;
  quantity: number;
  price: number;
};

type Place = {
  id: string;
  name: string;
  type: string;
};

type OrderWithDetails = Order & {
  place: Place | null;
  items: OrderItem[];
};

function formatMoney(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function formatDate(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatTime(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getStatusColor(status: string) {
  const normalized = status.toLowerCase();

  if (normalized.includes('cancel')) {
    return '#FF5555';
  }

  return GREEN;
}

export default function OrdersScreen() {
  const router = useRouter();

  const [orders, setOrders] =
    useState<OrderWithDetails[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState('');

  const carregarPedidos =
    useCallback(async () => {
      try {
        setError('');

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error(
            'ERRO AO VERIFICAR USUÁRIO:',
            userError,
          );

          setError(
            'Não foi possível verificar sua sessão.',
          );

          return;
        }

        if (!user) {
          router.replace('/login');
          return;
        }

        const {
          data: ordersData,
          error: ordersError,
        } = await supabase
          .from('orders')
          .select(
            'id, place_id, total, status, created_at',
          )
          .eq('user_id', user.id)
          .order('created_at', {
            ascending: false,
          });

        if (ordersError) {
          console.error(
            'ERRO AO CARREGAR PEDIDOS:',
            ordersError,
          );

          setError(
            'Não foi possível carregar seus pedidos.',
          );

          return;
        }

        if (!ordersData) {
          setOrders([]);
          return;
        }

        const placeIds = [
          ...new Set(
            ordersData.map(
              (order) => order.place_id,
            ),
          ),
        ];

        let places: Place[] = [];

        if (placeIds.length > 0) {
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
              placesError,
            );
          } else {
            places = placesData || [];
          }
        }

        const orderIds =
          ordersData.map(
            (order) => order.id,
          );

        let orderItems: OrderItem[] = [];

        if (orderIds.length > 0) {
          const {
            data: itemsData,
            error: itemsError,
          } = await supabase
            .from('order_items')
            .select(
              'id, order_id, product_name, quantity, price',
            )
            .in(
              'order_id',
              orderIds,
            );

          if (itemsError) {
            console.error(
              'ERRO AO CARREGAR ITENS:',
              itemsError,
            );
          } else {
            orderItems =
              itemsData || [];
          }
        }

        const pedidosFormatados =
          ordersData.map((order) => {
            const place =
              places.find(
                (item) =>
                  item.id === order.place_id,
              ) || null;

            const items =
              orderItems.filter(
                (item) =>
                  item.order_id === order.id,
              );

            return {
              ...order,
              place,
              items,
            };
          });

        setOrders(pedidosFormatados);
      } catch (error) {
        console.error(
          'ERRO INESPERADO AO CARREGAR PEDIDOS:',
          error,
        );

        setError(
          'Ocorreu um erro ao carregar seus pedidos.',
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    }, [router]);

  useFocusEffect(
    useCallback(() => {
      carregarPedidos();
    }, [carregarPedidos]),
  );

  function atualizar() {
    setRefreshing(true);
    carregarPedidos();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.back}>
            ‹
          </Text>
        </Pressable>

        <Text style={styles.title}>
          Meus pedidos
        </Text>

        <View
          style={styles.headerPlaceholder}
        />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color={GREEN}
          />

          <Text style={styles.loadingText}>
            Carregando pedidos...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorIcon}>
            ⚠️
          </Text>

          <Text style={styles.errorTitle}>
            Ops...
          </Text>

          <Text style={styles.errorText}>
            {error}
          </Text>

          <Pressable
            style={styles.retryButton}
            onPress={() => {
              setLoading(true);
              carregarPedidos();
            }}
          >
            <Text style={styles.retryText}>
              Tentar novamente
            </Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            styles.content
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={atualizar}
              tintColor={GREEN}
            />
          }
        >
          {orders.length === 0 ? (
            <View style={styles.empty}>
              <View
                style={styles.emptyIconBox}
              >
                <Text
                  style={styles.emptyIcon}
                >
                  🛍️
                </Text>
              </View>

              <Text
                style={styles.emptyTitle}
              >
                Você ainda não fez nenhum pedido
              </Text>

              <Text
                style={styles.emptyText}
              >
                Explore os estabelecimentos do
                Budd e faça seu primeiro pedido.
              </Text>

              <Pressable
                style={styles.exploreButton}
                onPress={() =>
                  router.push('/explore')
                }
              >
                <Text
                  style={
                    styles.exploreButtonText
                  }
                >
                  Explorar lugares
                </Text>
              </Pressable>
            </View>
          ) : (
            <>
              <View style={styles.intro}>
                <Text
                  style={styles.sectionTitle}
                >
                  Histórico de pedidos
                </Text>

                <Text
                  style={
                    styles.sectionSubtitle
                  }
                >
                  Acompanhe suas compras pelo Budd
                </Text>
              </View>

              {orders.map((order) => {
                const statusColor =
                  getStatusColor(
                    order.status,
                  );

                return (
                  <View
                    key={order.id}
                    style={styles.orderCard}
                  >
                    <View
                      style={styles.orderHeader}
                    >
                      <View
                        style={styles.orderPlace}
                      >
                        <View
                          style={styles.placeIcon}
                        >
                          <Text
                            style={
                              styles.placeEmoji
                            }
                          >
                            {order.place
                              ?.type ===
                            'Bar'
                              ? '🍸'
                              : order.place
                                    ?.type ===
                                  'Restaurante'
                                ? '🍽️'
                                : '🎟️'}
                          </Text>
                        </View>

                        <View
                          style={
                            styles.placeInfo
                          }
                        >
                          <Text
                            style={
                              styles.placeName
                            }
                          >
                            {order.place
                              ?.name ||
                              'Estabelecimento'}
                          </Text>

                          <Text
                            style={
                              styles.placeType
                            }
                          >
                            {order.place
                              ?.type ||
                              'Pedido Budd'}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={[
                          styles.statusBadge,
                          {
                            borderColor:
                              statusColor,
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.statusDot,
                            {
                              backgroundColor:
                                statusColor,
                            },
                          ]}
                        />

                        <Text
                          style={[
                            styles.statusText,
                            {
                              color:
                                statusColor,
                            },
                          ]}
                        >
                          {order.status ||
                            'Confirmado'}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={styles.dateRow}
                    >
                      <Text
                        style={
                          styles.dateLabel
                        }
                      >
                        Pedido realizado em
                      </Text>

                      <Text
                        style={
                          styles.dateValue
                        }
                      >
                        {formatDate(
                          order.created_at,
                        )}{' '}
                        às{' '}
                        {formatTime(
                          order.created_at,
                        )}
                      </Text>
                    </View>

                    <View
                      style={
                        styles.itemsContainer
                      }
                    >
                      {order.items.length ===
                      0 ? (
                        <Text
                          style={
                            styles.noItems
                          }
                        >
                          Itens do pedido não
                          encontrados.
                        </Text>
                      ) : (
                        order.items.map(
                          (item) => (
                            <View
                              key={item.id}
                              style={
                                styles.itemRow
                              }
                            >
                              <View
                                style={
                                  styles.itemLeft
                                }
                              >
                                <View
                                  style={
                                    styles.quantityBadge
                                  }
                                >
                                  <Text
                                    style={
                                      styles.quantityBadgeText
                                    }
                                  >
                                    {item.quantity}
                                  </Text>
                                </View>

                                <Text
                                  style={
                                    styles.itemName
                                  }
                                  numberOfLines={
                                    1
                                  }
                                >
                                  {
                                    item.product_name
                                  }
                                </Text>
                              </View>

                              <Text
                                style={
                                  styles.itemPrice
                                }
                              >
                                {formatMoney(
                                  Number(
                                    item.price,
                                  ) *
                                    item.quantity,
                                )}
                              </Text>
                            </View>
                          ),
                        )
                      )}
                    </View>

                    <View
                      style={
                        styles.totalDivider
                      }
                    />

                    <View
                      style={styles.totalRow}
                    >
                      <Text
                        style={
                          styles.totalLabel
                        }
                      >
                        Total do pedido
                      </Text>

                      <Text
                        style={
                          styles.totalValue
                        }
                      >
                        {formatMoney(
                          Number(order.total),
                        )}
                      </Text>
                    </View>

                    <View
                      style={styles.actions}
                    >
                      <Pressable
                        style={
                          styles.repeatButton
                        }
                        onPress={() => {
                          if (
                            order.place_id
                          ) {
                            router.push({
                              pathname:
                                '/place',
                              params: {
                                id: order.place_id,
                              },
                            });
                          }
                        }}
                      >
                        <Text
                          style={
                            styles.repeatButtonText
                          }
                        >
                          Ver estabelecimento
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                );
              })}
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
    paddingTop: 48,
    paddingBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#181818',
  },

  backButton: {
    width: 45,
  },

  back: {
    color: '#FFF',
    fontSize: 34,
    lineHeight: 34,
  },

  title: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
  },

  headerPlaceholder: {
    width: 45,
  },

  content: {
    padding: 20,
    paddingBottom: 45,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  loadingText: {
    color: '#777',
    fontSize: 13,
    marginTop: 12,
  },

  errorIcon: {
    fontSize: 38,
  },

  errorTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 12,
  },

  errorText: {
    color: '#777',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 7,
  },

  retryButton: {
    backgroundColor: GREEN,
    borderRadius: 12,
    paddingHorizontal: 22,
    paddingVertical: 13,
    marginTop: 20,
  },

  retryText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '800',
  },

  intro: {
    marginBottom: 16,
  },

  sectionTitle: {
    color: '#FFF',
    fontSize: 19,
    fontWeight: '800',
  },

  sectionSubtitle: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },

  orderCard: {
    backgroundColor: '#111',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1D1D1D',
  },

  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  orderPlace: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },

  placeIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  placeEmoji: {
    fontSize: 22,
  },

  placeInfo: {
    flex: 1,
    marginLeft: 11,
  },

  placeName: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },

  placeType: {
    color: '#777',
    fontSize: 11,
    marginTop: 4,
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },

  statusText: {
    fontSize: 9,
    fontWeight: '800',
  },

  dateRow: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#202020',
  },

  dateLabel: {
    color: '#666',
    fontSize: 10,
  },

  dateValue: {
    color: '#AAA',
    fontSize: 11,
    marginTop: 4,
  },

  itemsContainer: {
    marginTop: 14,
  },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },

  itemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },

  quantityBadge: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: '#1B241A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },

  quantityBadgeText: {
    color: GREEN,
    fontSize: 11,
    fontWeight: '900',
  },

  itemName: {
    color: '#DDD',
    fontSize: 12,
    flex: 1,
  },

  itemPrice: {
    color: '#AAA',
    fontSize: 12,
    fontWeight: '700',
  },

  noItems: {
    color: '#666',
    fontSize: 11,
  },

  totalDivider: {
    height: 1,
    backgroundColor: '#222',
    marginTop: 12,
    marginBottom: 13,
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  totalLabel: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },

  totalValue: {
    color: GREEN,
    fontSize: 17,
    fontWeight: '900',
  },

  actions: {
    marginTop: 14,
  },

  repeatButton: {
    borderWidth: 1,
    borderColor: '#2B2B2B',
    borderRadius: 11,
    paddingVertical: 11,
    alignItems: 'center',
  },

  repeatButtonText: {
    color: GREEN,
    fontSize: 11,
    fontWeight: '800',
  },

  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingVertical: 90,
  },

  emptyIconBox: {
    width: 78,
    height: 78,
    borderRadius: 25,
    backgroundColor: '#121712',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  emptyIcon: {
    fontSize: 36,
  },

  emptyTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },

  emptyText: {
    color: '#777',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 9,
  },

  exploreButton: {
    backgroundColor: GREEN,
    borderRadius: 12,
    paddingHorizontal: 22,
    paddingVertical: 14,
    marginTop: 22,
  },

  exploreButtonText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '900',
  },
});