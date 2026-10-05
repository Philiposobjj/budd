import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { useBudd } from '../context/BuddContext';

export default function CartScreen() {
  const router = useRouter();

  const {
    cart,
    addToCart,
    removeFromCart,
  } = useBudd();

  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0,
  );

  const quantidadeTotal = cart.reduce(
    (sum, item) =>
      sum + item.quantity,
    0,
  );

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
          Meu carrinho
        </Text>

        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
      >
        {cart.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>
              🛒
            </Text>

            <Text style={styles.emptyTitle}>
              Seu carrinho está vazio
            </Text>

            <Text style={styles.description}>
              Quando você escolher comidas ou
              bebidas, seus produtos aparecerão
              aqui.
            </Text>

            <Pressable
              style={styles.primaryButton}
              onPress={() =>
                router.push('/explore')
              }
            >
              <Text
                style={
                  styles.primaryButtonText
                }
              >
                Explorar estabelecimentos
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            <Text style={styles.itemCount}>
              {quantidadeTotal}{' '}
              {quantidadeTotal === 1
                ? 'item'
                : 'itens'}{' '}
              no carrinho
            </Text>

            {cart.map((item) => (
              <View
                key={item.id}
                style={styles.item}
              >
                <View style={styles.itemInfo}>
                  <Text
                    style={styles.itemName}
                  >
                    {item.name}
                  </Text>

                  <Text
                    style={styles.itemDescription}
                  >
                    {item.description}
                  </Text>

                  <Text style={styles.price}>
                    {item.price.toLocaleString(
                      'pt-BR',
                      {
                        style: 'currency',
                        currency: 'BRL',
                      },
                    )}
                  </Text>
                </View>

                <View
                  style={styles.quantity}
                >
                  <Pressable
                    onPress={() =>
                      removeFromCart(
                        item.id,
                      )
                    }
                    style={
                      styles.quantityButtonContainer
                    }
                  >
                    <Text
                      style={
                        styles.quantityButton
                      }
                    >
                      −
                    </Text>
                  </Pressable>

                  <Text
                    style={styles.quantityText}
                  >
                    {item.quantity}
                  </Text>

                  <Pressable
                    onPress={() =>
                      addToCart(item)
                    }
                    style={
                      styles.quantityButtonContainer
                    }
                  >
                    <Text
                      style={
                        styles.quantityButton
                      }
                    >
                      +
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))}

            <View style={styles.totalRow}>
              <Text
                style={styles.totalLabel}
              >
                Total
              </Text>

              <Text style={styles.total}>
                {total.toLocaleString(
                  'pt-BR',
                  {
                    style: 'currency',
                    currency: 'BRL',
                  },
                )}
              </Text>
            </View>

            <Pressable
              style={styles.paymentButton}
              onPress={() =>
                router.push('/checkout')
              }
            >
              <Text
                style={
                  styles.paymentButtonText
                }
              >
                Continuar para pagamento
              </Text>
            </Pressable>

            <Text
              style={styles.description}
            >
              Na próxima etapa você poderá
              confirmar seu pedido.
            </Text>
          </>
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
    fontSize: 20,
    fontWeight: 'bold',
  },

  placeholder: {
    width: 40,
  },

  content: {
    padding: 20,
    paddingBottom: 50,
    flexGrow: 1,
  },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 70,
  },

  emptyIcon: {
    fontSize: 48,
    marginBottom: 20,
  },

  emptyTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  description: {
    color: '#999',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 12,
  },

  primaryButton: {
    backgroundColor: '#7CFF00',
    borderRadius: 10,
    padding: 15,
    marginTop: 25,
  },

  primaryButtonText: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  itemCount: {
    color: '#777',
    fontSize: 13,
    marginBottom: 10,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },

  itemInfo: {
    flex: 1,
    paddingRight: 15,
  },

  itemName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },

  itemDescription: {
    color: '#777',
    fontSize: 12,
    marginTop: 5,
  },

  price: {
    color: '#7CFF00',
    marginTop: 6,
    fontWeight: '600',
  },

  quantity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  quantityButtonContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#7CFF00',
    alignItems: 'center',
    justifyContent: 'center',
  },

  quantityButton: {
    color: '#000',
    fontSize: 22,
    fontWeight: '600',
  },

  quantityText: {
    color: '#FFF',
    fontSize: 16,
    minWidth: 18,
    textAlign: 'center',
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#222',
  },

  totalLabel: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  total: {
    color: '#7CFF00',
    fontSize: 20,
    fontWeight: 'bold',
  },

  paymentButton: {
    backgroundColor: '#7CFF00',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 25,
    alignItems: 'center',
  },

  paymentButtonText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '800',
  },
});