import React, { useState } from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useRouter } from 'expo-router';

const GREEN = '#7CFF00';

export default function AssistenteScreen() {
  const router = useRouter();

  const [pergunta, setPergunta] = useState('');

  const [resposta, setResposta] = useState(
    'Oi! Eu sou o Budd. Posso ajudar você a encontrar lugares, eventos, restaurantes, bares, promoções e experiências.'
  );

  function responder(textoRecebido?: string) {
    const texto = (
      textoRecebido ?? pergunta
    )
      .trim()
      .toLowerCase();

    if (!texto) {
      return;
    }

    if (
      texto.includes('bar') ||
      texto.includes('drink') ||
      texto.includes('cerveja') ||
      texto.includes('bebida')
    ) {
      setResposta(
        '🍹 Encontrei algumas opções de bares para você. Abra o mapa para visualizar os lugares, conferir avaliações e descobrir promoções disponíveis.'
      );
    } else if (
      texto.includes('restaurante') ||
      texto.includes('comer') ||
      texto.includes('comida') ||
      texto.includes('jantar') ||
      texto.includes('almoço')
    ) {
      setResposta(
        '🍽️ Posso ajudar você a encontrar restaurantes. No Budd você poderá descobrir lugares por categoria, distância, avaliação e promoções.'
      );
    } else if (
      texto.includes('evento') ||
      texto.includes('show') ||
      texto.includes('festa') ||
      texto.includes('balada')
    ) {
      setResposta(
        '🎵 Existem eventos, shows e festas no universo Budd. Você pode usar o mapa para encontrar experiências próximas e consultar os eventos disponíveis.'
      );
    } else if (
      texto.includes('cinema') ||
      texto.includes('teatro') ||
      texto.includes('cultura')
    ) {
      setResposta(
        '🎭 O Budd também pode ajudar você a descobrir cinema, teatro e outras experiências culturais. Essa área pode crescer bastante no aplicativo.'
      );
    } else if (
      texto.includes('promoção') ||
      texto.includes('promocao') ||
      texto.includes('desconto') ||
      texto.includes('oferta')
    ) {
      setResposta(
        '🔥 O Budd pode reunir promoções de bares, restaurantes, eventos e outros estabelecimentos. Assim você descobre uma experiência e ainda pode economizar.'
      );
    } else if (
      texto.includes('mapa') ||
      texto.includes('perto') ||
      texto.includes('próximo') ||
      texto.includes('proximo')
    ) {
      setResposta(
        '📍 Claro! Abra o mapa para visualizar os lugares disponíveis e encontrar bares, restaurantes, eventos e outras experiências próximas.'
      );
    } else if (
      texto.includes('reserva') ||
      texto.includes('reservar')
    ) {
      setResposta(
        '📅 A ideia do Budd é permitir que você encontre um estabelecimento e faça uma reserva diretamente pelo aplicativo.'
      );
    } else if (
      texto.includes('compre') ||
      texto.includes('comprar') ||
      texto.includes('ingresso') ||
      texto.includes('ticket')
    ) {
      setResposta(
        '🎟️ O Budd também pode reunir ingressos para shows, festas, teatro e outras experiências, permitindo que você encontre tudo em um só lugar.'
      );
    } else if (
      texto.includes('cashback') ||
      texto.includes('dinheiro de volta')
    ) {
      setResposta(
        '💚 Uma das possibilidades do Budd é oferecer cashback em compras e experiências realizadas através da plataforma.'
      );
    } else {
      setResposta(
        '🔎 Entendi! Posso ajudar você a descobrir bares, restaurantes, eventos, shows, promoções, reservas, ingressos e experiências. Tente fazer uma pergunta mais específica.'
      );
    }

    setPergunta('');
  }

  function usarSugestao(texto: string) {
    setPergunta(texto);
    responder(texto);
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        {/* CABEÇALHO */}

        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>
              ‹
            </Text>
          </Pressable>

          <View style={styles.headerCenter}>
            <Text style={styles.logo}>
              budd
            </Text>

            <View style={styles.statusRow}>
              <View style={styles.statusDot} />

              <Text style={styles.headerSubtitle}>
                Assistente Budd
              </Text>
            </View>
          </View>

          <View style={styles.headerSpace} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={
            styles.content
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* APRESENTAÇÃO */}

          <View style={styles.welcome}>
            <View style={styles.buddIcon}>
              <Text style={styles.buddIconText}>
                ✦
              </Text>
            </View>

            <Text style={styles.title}>
              Como posso ajudar?
            </Text>

            <Text style={styles.description}>
              Pergunte ao Budd sobre lugares,
              restaurantes, bares, eventos,
              promoções e experiências.
            </Text>
          </View>

          {/* SUGESTÕES */}

          <Text style={styles.sectionTitle}>
            Experimente perguntar
          </Text>

          <View style={styles.suggestions}>
            <Pressable
              style={styles.suggestion}
              onPress={() =>
                usarSugestao(
                  'Quero encontrar um bar',
                )
              }
            >
              <Text
                style={styles.suggestionEmoji}
              >
                🍹
              </Text>

              <Text style={styles.suggestionText}>
                Quero encontrar um bar
              </Text>

              <Text style={styles.suggestionArrow}>
                ›
              </Text>
            </Pressable>

            <Pressable
              style={styles.suggestion}
              onPress={() =>
                usarSugestao(
                  'Quero encontrar um restaurante',
                )
              }
            >
              <Text
                style={styles.suggestionEmoji}
              >
                🍽️
              </Text>

              <Text style={styles.suggestionText}>
                Quero encontrar um restaurante
              </Text>

              <Text style={styles.suggestionArrow}>
                ›
              </Text>
            </Pressable>

            <Pressable
              style={styles.suggestion}
              onPress={() =>
                usarSugestao(
                  'Tem eventos hoje?',
                )
              }
            >
              <Text
                style={styles.suggestionEmoji}
              >
                🎵
              </Text>

              <Text style={styles.suggestionText}>
                Tem eventos hoje?
              </Text>

              <Text style={styles.suggestionArrow}>
                ›
              </Text>
            </Pressable>

            <Pressable
              style={styles.suggestion}
              onPress={() =>
                usarSugestao(
                  'Quero encontrar promoções',
                )
              }
            >
              <Text
                style={styles.suggestionEmoji}
              >
                🔥
              </Text>

              <Text style={styles.suggestionText}>
                Quero encontrar promoções
              </Text>

              <Text style={styles.suggestionArrow}>
                ›
              </Text>
            </Pressable>
          </View>

          {/* RESPOSTA */}

          <View style={styles.responseHeader}>
            <Text style={styles.sectionTitle}>
              Budd
            </Text>

            <View style={styles.onlineBadge}>
              <View style={styles.onlineDot} />

              <Text style={styles.onlineText}>
                Online
              </Text>
            </View>
          </View>

          <View style={styles.responseBox}>
            <View style={styles.responseIcon}>
              <Text style={styles.responseIconText}>
                ✦
              </Text>
            </View>

            <Text style={styles.responseText}>
              {resposta}
            </Text>
          </View>

          {/* MAPA */}

          <Text style={styles.sectionTitle}>
            Descobrir
          </Text>

          <Pressable
            style={styles.mapButton}
            onPress={() => router.push('/mapa')}
          >
            <View style={styles.mapButtonIconBox}>
              <Text style={styles.mapButtonIcon}>
                🗺️
              </Text>
            </View>

            <View style={styles.mapButtonContent}>
              <Text style={styles.mapButtonTitle}>
                Explorar no mapa
              </Text>

              <Text style={styles.mapButtonSubtitle}>
                Veja lugares e experiências
                próximas
              </Text>
            </View>

            <Text style={styles.arrow}>
              ›
            </Text>
          </Pressable>

          {/* IDEIAS */}

          <View style={styles.ideaBox}>
            <Text style={styles.ideaIcon}>
              💡
            </Text>

            <View style={styles.ideaContent}>
              <Text style={styles.ideaTitle}>
                Dica do Budd
              </Text>

              <Text style={styles.ideaText}>
                Experimente perguntar coisas
                como "onde tem um bar?", "quero
                jantar" ou "tem alguma promoção?"
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* CAMPO DE PERGUNTA */}

        <View style={styles.inputArea}>
          <TextInput
            value={pergunta}
            onChangeText={setPergunta}
            placeholder="Pergunte alguma coisa..."
            placeholderTextColor="#666"
            style={styles.input}
            onSubmitEditing={() =>
              responder()
            }
            returnKeyType="send"
            multiline={false}
          />

          <Pressable
            style={styles.sendButton}
            onPress={() => responder()}
          >
            <Text style={styles.sendText}>
              ↑
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  keyboard: {
    flex: 1,
  },

  header: {
    height: 70,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#171717',
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#151515',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backText: {
    color: '#fff',
    fontSize: 32,
    lineHeight: 34,
  },

  headerCenter: {
    alignItems: 'center',
  },

  logo: {
    color: GREEN,
    fontSize: 22,
    fontWeight: '900',
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: GREEN,
    marginRight: 5,
  },

  headerSubtitle: {
    color: '#777',
    fontSize: 11,
  },

  headerSpace: {
    width: 42,
  },

  scroll: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 30,
  },

  welcome: {
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 30,
  },

  buddIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  buddIconText: {
    color: '#000',
    fontSize: 34,
    fontWeight: '900',
  },

  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
  },

  description: {
    color: '#888',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 9,
    maxWidth: 320,
  },

  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },

  suggestions: {
    gap: 9,
    marginBottom: 28,
  },

  suggestion: {
    minHeight: 52,
    backgroundColor: '#151515',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#242424',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  suggestionEmoji: {
    fontSize: 20,
    marginRight: 12,
  },

  suggestionText: {
    color: '#ccc',
    fontSize: 13,
    flex: 1,
  },

  suggestionArrow: {
    color: GREEN,
    fontSize: 23,
  },

  responseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: GREEN,
    marginRight: 5,
  },

  onlineText: {
    color: '#777',
    fontSize: 10,
  },

  responseBox: {
    backgroundColor: '#111',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#272727',
    padding: 16,
    flexDirection: 'row',
    marginBottom: 25,
  },

  responseIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  responseIconText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '900',
  },

  responseText: {
    flex: 1,
    color: '#ccc',
    fontSize: 13,
    lineHeight: 20,
  },

  mapButton: {
    backgroundColor: '#151515',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#252525',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  mapButtonIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#202020',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  mapButtonIcon: {
    fontSize: 25,
  },

  mapButtonContent: {
    flex: 1,
  },

  mapButtonTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },

  mapButtonSubtitle: {
    color: '#777',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },

  arrow: {
    color: GREEN,
    fontSize: 28,
    marginLeft: 8,
  },

  ideaBox: {
    backgroundColor: '#101010',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#202020',
    padding: 15,
    flexDirection: 'row',
    marginBottom: 10,
  },

  ideaIcon: {
    fontSize: 22,
    marginRight: 12,
  },

  ideaContent: {
    flex: 1,
  },

  ideaTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },

  ideaText: {
    color: '#777',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },

  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: '#171717',
  },

  input: {
    flex: 1,
    height: 48,
    backgroundColor: '#151515',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#292929',
    paddingHorizontal: 18,
    color: '#fff',
    fontSize: 13,
  },

  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  sendText: {
    color: '#000',
    fontSize: 25,
    fontWeight: '900',
  },
});