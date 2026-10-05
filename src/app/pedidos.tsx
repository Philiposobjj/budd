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
import { useFocusEffect, useRouter } from 'expo-router';

import { supabase } from '../lib/supabase';

type Order = {
  id: string;
  user_id: string;
  place_id: string;
  total: number;
  status: string;
  created_at: string;
};

type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
};

type Place = {
  id: string;
  name: string;
};

type OrderWithDetails = Order & {
  placeName: string;
  items: OrderItem[];
};

export default function PedidosScreen() {
  const router = useRouter();

  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const carregarPedidos = useCallback(async () => {
    try {
      setError('');

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/login');
        return;
      }

      const { data: ordersData, error: ordersError } =
        await supabase
          .from('orders')
          .select(
            'id, user_id, place_id, total, status, created_at'
          )
          .eq('user_id', user.id)
          .order('created_at', {
            ascending: false,
          });

      if (ordersError) {
        console.error(
          'Erro ao carregar pedidos:',
          ordersError
        );

        setError(
          'Não foi possível carregar seus pedidos.'
        );

        return;
      }

      const pedidos = ordersData ?? [];

      if (pedidos.length === 0) {
        setOrders([]);
        return;
      }

      const placeIds = [
        ...new Set(
          pedidos.map((order) => order.place_id)
        ),
      ];

      const orderIds = pedidos.map(
        (order) => order.id
      );

      const [
        { data: placesData, error: placesError },
        { data: itemsData, error: itemsError },
      ] = await Promise.all([
        supabase
          .from('places')
          .select('id, name')
          .in('id', placeIds),

        supabase
          .from('order_items')
          .select(
            'id, order_id, product_id, product_name, quantity, price'
          )
          .in('order_id', orderIds)
          .order('created_at', {
            ascending: true,
          }),
      ]);

      if (placesError) {
        console.error(
          'Erro ao carregar estabelecimentos:',
          placesError
        );
      }

      if (itemsError) {
        console.error(
          'Erro ao carregar itens:',
          itemsError
        );
      }

      const places = placesData ?? [];
      const items = itemsData ?? [];

      const ordersFormatted: OrderWithDetails[] =
        pedidos.map((order) => {
          const place = places.find(
            (item: Place) =>
              item.id === order.place_id
          );

          const orderItems = items.filter(
            (item: OrderItem) =>
              item.order_id === order.id
          );

          return {
            ...order,
            placeName:
              place?.name ?? 'Estabelecimento',
            items: orderItems,
          };
        });

      setOrders(ordersFormatted);
    } catch (err) {
      console.error(
        'Erro inesperado ao carregar pedidos:',
        err
      );

      setError(
        'Ocorreu um erro ao carregar seus pedidos.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      carregarPedidos();
    }, [carregarPedidos])
  );

  function formatarData(data: string) {
    const date = new Date(data);

    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  function formatarHora(data: string) {
    const date = new Date(data);

    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function formatarPreco(valor: number) {
    return Number(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  function getStatusStyle(status: string) {
    switch (status) {
      case 'Confirmado':
        return styles.statusConfirmed;

      case 'Preparando':
        return styles.statusPreparing;

      case 'Pronto':
        return styles.statusReady;

      case 'Entregue':
        return styles.statusDelivered;

      case 'Cancelado':
        return styles.statusCancelled;

      default:
        return styles.statusPending;
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'Confirmado':
        return '✓';

      case 'Preparando':
        return '🍳';

      case 'Pronto':
        return '✓';

      case 'Entregue':
        return '📦';

      case 'Cancelado':
        return '×';

      default:
        return '⏳';
    }
  }

  async function atualizarPedidos() {
    setRefreshing(true);
    await carregarPedidos();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.back}>
            ‹ Voltar
          </Text>
        </Pressable>

        <Text style={styles.title}>
          Meus pedidos
        </Text>

        <View style={styles.placeholder} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#7CFF00"
          />

          <Text style={styles.loadingText}>
            Carregando seus pedidos...
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={atualizarPedidos}
              tintColor="#7CFF00"
            />
          }
        >
          {error !== '' && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>
                {error}
              </Text>

              <Pressable
                onPress={atualizarPedidos}
                style={styles.tryAgainButton}
              >
                <Text style={styles.tryAgainText}>
                  Tentar novamente
                </Text>
              </Pressable>
            </View>
          )}

          {error === '' &&
            orders.length === 0 && (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIcon}>
                  <Text style={styles.emptyIconText}>
                    🛍️
                  </Text>
                </View>

                <Text style={styles.emptyTitle}>
                  Você ainda não fez nenhum pedido
                </Text>

                <Text style={styles.emptyText}>
                  Seus pedidos realizados pelos
                  estabelecimentos aparecerão aqui.
                </Text>

                <Pressable
                  onPress={() =>
                    router.push('/explore')
                  }
                  style={styles.exploreButton}
                >
                  <Text
                    style={styles.exploreButtonText}
                  >
                    Explorar lugares
                  </Text>
                </Pressable>
              </View>
            )}

          {error === '' &&
            orders.map((order) => (
              <View
                key={order.id}
                style={styles.orderCard}
              >
                <View style={styles.orderHeader}>
                  <View style={styles.placeInfo}>
                    <Text style={styles.placeName}>
                      {order.placeName}
                    </Text>

                    <Text style={styles.date}>
                      {formatarData(
                        order.created_at
                      )}{' '}
                      às{' '}
                      {formatarHora(
                        order.created_at
                      )}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.status,
                      getStatusStyle(
                        order.status
                      ),
                    ]}
                  >
                    <Text
                      style={styles.statusIcon}
                    >
                      {getStatusIcon(
                        order.status
                      )}
                    </Text>

                    <Text
                      style={styles.statusText}
                    >
                      {order.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.items}>
                  {order.items.map((item) => (
                    <View
                      key={item.id}
                      style={styles.item}
                    >
                      <View
                        style={styles.quantity}
                      >
                        <Text
                          style={
                            styles.quantityText
                          }
                        >
                          {item.quantity}x
                        </Text>
                      </View>

                      <View
                        style={styles.itemInfo}
                      >
                        <Text
                          style={
                            styles.itemName
                          }
                          numberOfLines={2}
                        >
                          {item.product_name}
                        </Text>

                        <Text
                          style={
                            styles.itemPrice
                          }
                        >
                          {formatarPreco(
                            Number(item.price)
                          )}
                        </Text>
                      </View>

                      <Text
                        style={
                          styles.itemTotal
                        }
                      >
                        {formatarPreco(
                          Number(item.price) *
                            item.quantity
                        )}
                      </Text>
                    </View>
                  ))}

                  {order.items.length === 0 && (
                    <Text style={styles.noItems}>
                      Itens do pedido não
                      encontrados.
                    </Text>
                  )}
                </View>

                <View style={styles.divider} />

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>
                    Total do pedido
                  </Text>

                  <Text style={styles.totalValue}>
                    {formatarPreco(
                      Number(order.total)
                    )}
                  </Text>
                </View>

                <Text style={styles.orderId}>
                  Pedido #{order.id.slice(0, 8)}
                </Text>
              </View>
            ))}
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
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 80,
  },

  back: {
    color: '#7CFF00',
    fontSize: 15,
    fontWeight: '600',
  },

  title: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '800',
  },

  placeholder: {
    width: 80,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  loadingText: {
    color: '#888',
    fontSize: 14,
    marginTop: 12,
  },

  errorBox: {
    backgroundColor: '#181010',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginTop: 10,
  },

  errorText: {
    color: '#FF7777',
    fontSize: 14,
    textAlign: 'center',
  },

  tryAgainButton: {
    backgroundColor: '#7CFF00',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 16,
  },

  tryAgainText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '700',
  },

  emptyContainer: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 20,
  },

  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  emptyIconText: {
    fontSize: 34,
  },

  emptyTitle: {
    color: '#FFF',
    fontSize: 19,
    fontWeight: '700',
    textAlign: 'center',
  },

  emptyText: {
    color: '#777',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 10,
  },

  exploreButton: {
    backgroundColor: '#7CFF00',
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingVertical: 13,
    marginTop: 22,
  },

  exploreButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '800',
  },

  orderCard: {
    backgroundColor: '#111',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },

  orderHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  placeInfo: {
    flex: 1,
    paddingRight: 10,
  },

  placeName: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '800',
  },

  date: {
    color: '#777',
    fontSize: 12,
    marginTop: 5,
  },

  status: {
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 125,
  },

  statusIcon: {
    fontSize: 11,
    marginRight: 4,
  },

  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },

  statusPending: {
    backgroundColor: '#252015',
  },

  statusConfirmed: {
    backgroundColor: '#16250D',
  },

  statusPreparing: {
    backgroundColor: '#25200D',
  },

  statusReady: {
    backgroundColor: '#10250D',
  },

  statusDelivered: {
    backgroundColor: '#102018',
  },

  statusCancelled: {
    backgroundColor: '#251010',
  },

  divider: {
    height: 1,
    backgroundColor: '#222',
    marginVertical: 14,
  },

  items: {
    gap: 12,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  quantity: {
    width: 38,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  quantityText: {
    color: '#7CFF00',
    fontSize: 12,
    fontWeight: '800',
  },

  itemInfo: {
    flex: 1,
    paddingRight: 8,
  },

  itemName: {
    color: '#DDD',
    fontSize: 13,
    fontWeight: '600',
  },

  itemPrice: {
    color: '#666',
    fontSize: 11,
    marginTop: 3,
  },

  itemTotal: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },

  noItems: {
    color: '#666',
    fontSize: 13,
    textAlign: 'center',
  },

  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  totalLabel: {
    color: '#AAA',
    fontSize: 14,
    fontWeight: '600',
  },

  totalValue: {
    color: '#7CFF00',
    fontSize: 18,
    fontWeight: '800',
  },

  orderId: {
    color: '#555',
    fontSize: 10,
    marginTop: 10,
  },
});