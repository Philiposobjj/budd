
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useState } from 'react';
import { useRouter } from 'expo-router';

import { useBudd } from '../context/BuddContext';
import { supabase } from '../lib/supabase';

const GREEN = '#76EB3C';

type PaymentMethod =
  | 'pix'
  | 'card'
  | 'cash';

export default function Checkout() {
  const router = useRouter();

  const {
    cart,
    clearCart,
  } = useBudd();

  const [loading, setLoading] =
    useState(false);

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('pix');

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0,
  );

  const serviceFee =
    subtotal > 0 ? 2.9 : 0;

  const total =
    subtotal + serviceFee;

  async function confirmarPedido() {
    if (loading) {
      return;
    }

    if (cart.length === 0) {
      Alert.alert(
        'Carrinho vazio',
        'Adicione algum produto antes de finalizar.',
      );

      return;
    }

    try {
      setLoading(true);

      const {
        data: {
          user,
        },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error(
          'Erro ao verificar usuário:',
          userError,
        );

        Alert.alert(
          'Erro',
          'Não foi possível verificar sua sessão.',
        );

        return;
      }

      if (!user) {
        Alert.alert(
          'Sessão expirada',
          'Faça login novamente.',
        );

        router.replace('/login');

        return;
      }

      /*
       * Todos os itens precisam pertencer
       * ao mesmo estabelecimento.
       */
      const placeIds = [
        ...new Set(
          cart.map((item) => item.placeId),
        ),
      ];

      if (placeIds.length !== 1) {
        Alert.alert(
          'Carrinho inválido',
          'Os produtos do pedido precisam ser do mesmo estabelecimento.',
        );

        return;
      }

      const placeId = placeIds[0];

      console.log(
        '===== INICIANDO PEDIDO =====',
      );

      console.log(
        'Usuário:',
        user.id,
      );

      console.log(
        'Estabelecimento:',
        placeId,
      );

      console.log(
        'Forma de pagamento:',
        paymentMethod,
      );

      console.log(
        'Total:',
        total,
      );

      /*
       * Cria o pedido.
       */
      const {
        data: pedido,
        error: pedidoError,
      } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          place_id: placeId,
          total: total,
          status: 'Confirmado',
        })
        .select()
        .single();

      if (pedidoError || !pedido) {
        console.error(
          'ERRO AO CRIAR PEDIDO:',
          pedidoError,
        );

        Alert.alert(
          'Erro',
          pedidoError?.message ||
            'Não foi possível criar o pedido.',
        );

        return;
      }

      /*
       * Monta os itens.
       */
      const itens = cart.map((item) => ({
        order_id: pedido.id,
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      /*
       * Salva os itens.
       */
      const {
        data: itensGravados,
        error: itensError,
      } = await supabase
        .from('order_items')
        .insert(itens)
        .select();

      if (
        itensError ||
        !itensGravados ||
        itensGravados.length === 0
      ) {
        console.error(
          'ERRO AO CRIAR ITENS:',
          itensError,
        );

        const { error: deleteError } =
          await supabase
            .from('orders')
            .delete()
            .eq('id', pedido.id);

        if (deleteError) {
          console.error(
            'Erro ao remover pedido incompleto:',
            deleteError,
          );
        }

        Alert.alert(
          'Erro',
          itensError?.message ||
            'Não foi possível salvar os itens do pedido.',
        );

        return;
      }

      console.log(
        '===== PEDIDO SALVO COM SUCESSO =====',
      );

      clearCart();

      router.replace('/order-success');
    } catch (error) {
      console.error(
        'ERRO INESPERADO AO FINALIZAR PEDIDO:',
        error,
      );

      Alert.alert(
        'Erro',
        'Ocorreu um erro ao finalizar o pedido.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}

      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          disabled={loading}
        >
          <Text style={styles.back}>
            ‹
          </Text>
        </Pressable>

        <Text style={styles.title}>
          Pagamento
        </Text>

        <View style={styles.headerSecure}>
          <Text style={styles.secureIcon}>
            🔒
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* RESUMO */}

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Seu pedido
            </Text>

            <Text style={styles.sectionSubtitle}>
              Confira os itens antes de pagar
            </Text>
          </View>

          <Text style={styles.itemCount}>
            {cart.length}{' '}
            {cart.length === 1
              ? 'produto'
              : 'produtos'}
          </Text>
        </View>

        {cart.map((item) => (
          <View
            key={`${item.placeId}-${item.id}`}
            style={styles.item}
          >
            <View style={styles.itemIcon}>
              <Text style={styles.itemEmoji}>
                🍽️
              </Text>
            </View>

            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>
                {item.name}
              </Text>

              <Text style={styles.itemQuantity}>
                {item.quantity}x
              </Text>
            </View>

            <Text style={styles.itemPrice}>
              R${' '}
              {(item.price * item.quantity)
                .toFixed(2)
                .replace('.', ',')}
            </Text>
          </View>
        ))}

        {/* PAGAMENTO */}

        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>
            Forma de pagamento
          </Text>

          <Text style={styles.sectionSubtitle}>
            Escolha como deseja pagar
          </Text>

          <Pressable
            style={[
              styles.paymentOption,
              paymentMethod === 'pix' &&
                styles.paymentOptionActive,
            ]}
            onPress={() =>
              setPaymentMethod('pix')
            }
          >
            <View style={styles.paymentIcon}>
              <Text>◆</Text>
            </View>

            <View style={styles.paymentInfo}>
              <Text style={styles.paymentName}>
                Pix
              </Text>

              <Text style={styles.paymentDescription}>
                Pagamento instantâneo
              </Text>
            </View>

            <View
              style={[
                styles.radio,
                paymentMethod === 'pix' &&
                  styles.radioActive,
              ]}
            >
              {paymentMethod === 'pix' && (
                <View style={styles.radioDot} />
              )}
            </View>
          </Pressable>

          <Pressable
            style={[
              styles.paymentOption,
              paymentMethod === 'card' &&
                styles.paymentOptionActive,
            ]}
            onPress={() =>
              setPaymentMethod('card')
            }
          >
            <View style={styles.paymentIcon}>
              <Text>💳</Text>
            </View>

            <View style={styles.paymentInfo}>
              <Text style={styles.paymentName}>
                Cartão
              </Text>

              <Text style={styles.paymentDescription}>
                Crédito ou débito
              </Text>
            </View>

            <View
              style={[
                styles.radio,
                paymentMethod === 'card' &&
                  styles.radioActive,
              ]}
            >
              {paymentMethod === 'card' && (
                <View style={styles.radioDot} />
              )}
            </View>
          </Pressable>

          <Pressable
            style={[
              styles.paymentOption,
              paymentMethod === 'cash' &&
                styles.paymentOptionActive,
            ]}
            onPress={() =>
              setPaymentMethod('cash')
            }
          >
            <View style={styles.paymentIcon}>
              <Text>💵</Text>
            </View>

            <View style={styles.paymentInfo}>
              <Text style={styles.paymentName}>
                No local
              </Text>

              <Text style={styles.paymentDescription}>
                Pagar diretamente no estabelecimento
              </Text>
            </View>

            <View
              style={[
                styles.radio,
                paymentMethod === 'cash' &&
                  styles.radioActive,
              ]}
            >
              {paymentMethod === 'cash' && (
                <View style={styles.radioDot} />
              )}
            </View>
          </Pressable>
        </View>

        {/* SEGURANÇA */}

        <View style={styles.securityBox}>
          <Text style={styles.securityIcon}>
            🔒
          </Text>

          <View style={styles.securityInfo}>
            <Text style={styles.securityTitle}>
              Pagamento seguro
            </Text>

            <Text style={styles.securityText}>
              Seus dados são protegidos durante
              todo o processo.
            </Text>
          </View>
        </View>

        {/* VALORES */}

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>
            Resumo dos valores
          </Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Subtotal
            </Text>

            <Text style={styles.summaryValue}>
              R${' '}
              {subtotal
                .toFixed(2)
                .replace('.', ',')}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Taxa de serviço
            </Text>

            <Text style={styles.summaryValue}>
              R${' '}
              {serviceFee
                .toFixed(2)
                .replace('.', ',')}
            </Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              Total
            </Text>

            <Text style={styles.total}>
              R${' '}
              {total
                .toFixed(2)
                .replace('.', ',')}
            </Text>
          </View>
        </View>

        {/* CONFIRMAR */}

        <Pressable
          onPress={confirmarPedido}
          disabled={
            loading ||
            cart.length === 0
          }
          style={[
            styles.button,
            (loading ||
              cart.length === 0) &&
              styles.buttonDisabled,
          ]}
        >
          {loading ? (
            <>
              <ActivityIndicator
                color="#000"
              />

              <Text style={styles.loadingText}>
                Confirmando pedido...
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.buttonText}>
                Confirmar e pedir
              </Text>

              <Text style={styles.buttonPrice}>
                R${' '}
                {total
                  .toFixed(2)
                  .replace('.', ',')}
              </Text>
            </>
          )}
        </Pressable>

        <Text style={styles.footerText}>
          Ao confirmar, seu pedido será enviado
          para o estabelecimento.
        </Text>
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
    height: 95,
    paddingTop: 42,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#181818',
  },

  backButton: {
    width: 50,
  },

  back: {
    color: '#FFF',
    fontSize: 34,
    lineHeight: 34,
  },

  headerSecure: {
    width: 50,
    alignItems: 'flex-end',
  },

  secureIcon: {
    fontSize: 17,
  },

  title: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
  },

  content: {
    padding: 20,
    paddingBottom: 45,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 15,
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

  itemCount: {
    color: GREEN,
    fontSize: 11,
    fontWeight: '700',
  },

  item: {
    backgroundColor: '#111',
    borderRadius: 15,
    padding: 12,
    marginBottom: 9,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1D1D1D',
  },

  itemIcon: {
    width: 48,
    height: 48,
    borderRadius: 13,
    backgroundColor: '#191919',
    alignItems: 'center',
    justifyContent: 'center',
  },

  itemEmoji: {
    fontSize: 22,
  },

  itemInfo: {
    flex: 1,
    marginLeft: 11,
  },

  itemName: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },

  itemQuantity: {
    color: '#777',
    fontSize: 11,
    marginTop: 4,
  },

  itemPrice: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },

  paymentSection: {
    marginTop: 28,
  },

  paymentOption: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 14,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1D1D1D',
  },

  paymentOptionActive: {
    borderColor: GREEN,
    backgroundColor: '#101710',
  },

  paymentIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  paymentInfo: {
    flex: 1,
    marginLeft: 11,
  },

  paymentName: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },

  paymentDescription: {
    color: '#777',
    fontSize: 10,
    marginTop: 4,
  },

  radio: {
    width: 21,
    height: 21,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioActive: {
    borderColor: GREEN,
  },

  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: GREEN,
  },

  securityBox: {
    backgroundColor: '#101510',
    borderRadius: 16,
    padding: 14,
    marginTop: 22,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1D291D',
  },

  securityIcon: {
    fontSize: 20,
  },

  securityInfo: {
    flex: 1,
    marginLeft: 11,
  },

  securityTitle: {
    color: GREEN,
    fontSize: 12,
    fontWeight: '800',
  },

  securityText: {
    color: '#777',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 3,
  },

  summary: {
    marginTop: 28,
    backgroundColor: '#111',
    borderRadius: 17,
    padding: 17,
  },

  summaryTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 15,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 9,
  },

  summaryLabel: {
    color: '#777',
    fontSize: 12,
  },

  summaryValue: {
    color: '#AAA',
    fontSize: 12,
  },

  summaryDivider: {
    height: 1,
    backgroundColor: '#222',
    marginVertical: 15,
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  totalLabel: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
  },

  total: {
    color: GREEN,
    fontSize: 21,
    fontWeight: '900',
  },

  button: {
    backgroundColor: GREEN,
    borderRadius: 14,
    paddingHorizontal: 18,
    minHeight: 58,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  buttonDisabled: {
    opacity: 0.55,
  },

  buttonText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '900',
  },

  buttonPrice: {
    color: '#000',
    fontSize: 15,
    fontWeight: '900',
  },

  loadingText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '800',
    marginLeft: 8,
  },

  footerText: {
    color: '#555',
    fontSize: 10,
    lineHeight: 15,
    textAlign: 'center',
    marginTop: 13,
    paddingHorizontal: 20,
  },
});

