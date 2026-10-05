import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useRouter } from 'expo-router';

import { useBudd } from '../context/BuddContext';

const GREEN = '#76EB3C';

export default function OrderSuccessScreen() {
  const router = useRouter();

  const { clearCart } = useBudd();

  function finalizar() {
    clearCart();
    router.replace('/');
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ÍCONE */}

        <View style={styles.iconOuter}>
          <View style={styles.icon}>
            <Text style={styles.check}>
              ✓
            </Text>
          </View>
        </View>

        {/* TÍTULO */}

        <Text style={styles.eyebrow}>
          TUDO CERTO
        </Text>

        <Text style={styles.title}>
          Pedido confirmado!
        </Text>

        <Text style={styles.description}>
          Seu pedido foi registrado com
          sucesso e já está sendo preparado.
        </Text>

        {/* PEDIDO */}

        <View style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <View>
              <Text style={styles.orderLabel}>
                Pedido
              </Text>

              <Text style={styles.orderNumber}>
                #BUDD-1024
              </Text>
            </View>

            <View style={styles.status}>
              <View style={styles.statusDot} />

              <Text style={styles.statusText}>
                Confirmado
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.step}>
            <View style={styles.stepIcon}>
              <Text>✓</Text>
            </View>

            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>
                Pedido recebido
              </Text>

              <Text style={styles.stepDescription}>
                O estabelecimento recebeu seu pedido.
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepIconInactive}>
              <Text>2</Text>
            </View>

            <View style={styles.stepContent}>
              <Text style={styles.stepTitleInactive}>
                Preparando pedido
              </Text>

              <Text style={styles.stepDescription}>
                Você poderá acompanhar o andamento
                em uma próxima versão.
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepIconInactive}>
              <Text>3</Text>
            </View>

            <View style={styles.stepContent}>
              <Text style={styles.stepTitleInactive}>
                Pedido pronto
              </Text>

              <Text style={styles.stepDescription}>
                Avisaremos quando estiver pronto.
              </Text>
            </View>
          </View>
        </View>

        {/* EXPERIÊNCIA BUDD */}

        <View style={styles.info}>
          <Text style={styles.infoIcon}>
            ✦
          </Text>

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>
              Sua experiência no Budd
            </Text>

            <Text style={styles.infoText}>
              Em futuras versões você poderá
              acompanhar o pedido em tempo real,
              receber notificações e consultar seu
              histórico.
            </Text>
          </View>
        </View>

        {/* BOTÕES */}

        <Pressable
          style={styles.primaryButton}
          onPress={finalizar}
        >
          <Text style={styles.primaryButtonText}>
            Voltar para o início
          </Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.push('/explore')}
        >
          <Text style={styles.secondaryButtonText}>
            Explorar mais lugares
          </Text>
        </Pressable>

        <Text style={styles.footer}>
          Obrigado por usar o Budd.
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

  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 40,
  },

  iconOuter: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: '#101810',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#263326',
    marginBottom: 22,
  },

  icon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },

  check: {
    color: '#000',
    fontSize: 46,
    fontWeight: '900',
    marginTop: -4,
  },

  eyebrow: {
    color: GREEN,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 7,
  },

  title: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
  },

  description: {
    color: '#888',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 320,
  },

  orderCard: {
    width: '100%',
    backgroundColor: '#111',
    borderRadius: 18,
    padding: 17,
    marginTop: 28,
    borderWidth: 1,
    borderColor: '#1D1D1D',
  },

  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  orderLabel: {
    color: '#666',
    fontSize: 11,
  },

  orderNumber: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 3,
  },

  status: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#162016',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: GREEN,
    marginRight: 6,
  },

  statusText: {
    color: GREEN,
    fontSize: 10,
    fontWeight: '800',
  },

  divider: {
    height: 1,
    backgroundColor: '#222',
    marginVertical: 17,
  },

  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 17,
  },

  stepIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },

  stepIconInactive: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },

  stepContent: {
    flex: 1,
    marginLeft: 11,
  },

  stepTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },

  stepTitleInactive: {
    color: '#AAA',
    fontSize: 13,
    fontWeight: '700',
  },

  stepDescription: {
    color: '#666',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 3,
  },

  info: {
    width: '100%',
    backgroundColor: '#101510',
    borderRadius: 16,
    padding: 15,
    marginTop: 15,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#1E2A1E',
  },

  infoIcon: {
    color: GREEN,
    fontSize: 24,
    marginTop: -2,
  },

  infoContent: {
    flex: 1,
    marginLeft: 10,
  },

  infoTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },

  infoText: {
    color: '#777',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 4,
  },

  primaryButton: {
    width: '100%',
    backgroundColor: GREEN,
    borderRadius: 13,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 22,
  },

  primaryButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '900',
  },

  secondaryButton: {
    width: '100%',
    backgroundColor: '#151515',
    borderRadius: 13,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 9,
    borderWidth: 1,
    borderColor: '#242424',
  },

  secondaryButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },

  footer: {
    color: '#444',
    fontSize: 10,
    marginTop: 20,
  },
});