import React, { useMemo, useState } from 'react';

import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useRouter } from 'expo-router';

type Categoria =
  | 'Todos'
  | 'Bares'
  | 'Restaurantes'
  | 'Eventos';

type Local = {
  id: string;
  nome: string;
  categoria: Exclude<Categoria, 'Todos'>;
  distancia: string;
  avaliacao: string;
  emoji: string;
  endereco: string;
  descricao: string;
  promocao: string;
};

const locais: Local[] = [
  {
    id: '1',
    nome: 'Budd House',
    categoria: 'Bares',
    distancia: '0,8 km',
    avaliacao: '4.8',
    emoji: '🍸',
    endereco: 'Centro, Florianópolis',
    descricao:
      'Bar com drinks, música e ambiente descontraído para encontrar os amigos.',
    promocao: '2 Drinks pelo preço de 1',
  },
  {
    id: '2',
    nome: 'Budd Kitchen',
    categoria: 'Restaurantes',
    distancia: '1,2 km',
    avaliacao: '4.9',
    emoji: '🍔',
    endereco: 'Centro, Florianópolis',
    descricao:
      'Restaurante com pratos variados, hambúrgueres e opções para jantar.',
    promocao: '20% OFF no jantar',
  },
  {
    id: '3',
    nome: 'Praia Club',
    categoria: 'Eventos',
    distancia: '2,1 km',
    avaliacao: '4.7',
    emoji: '🎵',
    endereco: 'Beira-Mar, Florianópolis',
    descricao:
      'Espaço para shows, festas e eventos durante a semana.',
    promocao: 'Ingresso antecipado com desconto',
  },
  {
    id: '4',
    nome: 'Boteco 21',
    categoria: 'Bares',
    distancia: '2,4 km',
    avaliacao: '4.6',
    emoji: '🍺',
    endereco: 'Trindade, Florianópolis',
    descricao:
      'Boteco descontraído com cervejas, petiscos e música ao vivo.',
    promocao: 'Happy hour até 20h',
  },
];

export default function MapaScreen() {
  const router = useRouter();

  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] =
    useState<Categoria>('Todos');

  const [localSelecionado, setLocalSelecionado] =
    useState<Local | null>(null);

  const [acaoSelecionada, setAcaoSelecionada] =
    useState<
      'oferta' | 'reserva' | 'ingresso' | null
    >(null);

  const locaisFiltrados = useMemo(() => {
    const texto = busca.toLowerCase().trim();

    return locais.filter((local) => {
      const categoriaOK =
        categoria === 'Todos' ||
        local.categoria === categoria;

      const buscaOK =
        texto.length === 0 ||
        local.nome.toLowerCase().includes(texto) ||
        local.categoria.toLowerCase().includes(texto) ||
        local.endereco.toLowerCase().includes(texto);

      return categoriaOK && buscaOK;
    });
  }, [busca, categoria]);

  function abrirAssistente() {
    router.push('/assistente');
  }

  function abrirLocal(local: Local) {
    setAcaoSelecionada(null);
    setLocalSelecionado(local);
  }

  function fecharModal() {
    setLocalSelecionado(null);
    setAcaoSelecionada(null);
  }

  function verOferta() {
    if (!localSelecionado) {
      return;
    }

    setAcaoSelecionada('oferta');
  }

  function reservar() {
    if (!localSelecionado) {
      return;
    }

    setAcaoSelecionada('reserva');
  }

  function comprarIngresso() {
    if (!localSelecionado) {
      return;
    }

    setAcaoSelecionada('ingresso');
  }

  function voltarParaLocal() {
    setAcaoSelecionada(null);
  }

  function verDetalhes() {
    if (!localSelecionado) {
      return;
    }

    setLocalSelecionado(null);
    setAcaoSelecionada(null);

    router.push({
      pathname: '/place',
      params: {
        id: localSelecionado.id,
        name: localSelecionado.nome,
        type: localSelecionado.categoria,
        description: localSelecionado.descricao,
        address: localSelecionado.endereco,
      },
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* CABEÇALHO */}

        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>
              budd
            </Text>

            <Text style={styles.subtitle}>
              Encontre lugares perto de você
            </Text>
          </View>

          <Pressable
            style={styles.assistenteButton}
            onPress={abrirAssistente}
          >
            <Text style={styles.assistenteIcon}>
              ✦
            </Text>

            <Text style={styles.assistenteText}>
              Budd
            </Text>
          </Pressable>
        </View>

        {/* BUSCA */}

        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>
            🔎
          </Text>

          <TextInput
            value={busca}
            onChangeText={setBusca}
            placeholder="Buscar lugar, restaurante..."
            placeholderTextColor="#666"
            style={styles.searchInput}
          />
        </View>

        {/* FILTROS */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filters}
        >
          {(
            [
              'Todos',
              'Bares',
              'Restaurantes',
              'Eventos',
            ] as Categoria[]
          ).map((item) => {
            const ativo = categoria === item;

            return (
              <Pressable
                key={item}
                onPress={() => setCategoria(item)}
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
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* MAPA */}

        <View style={styles.map}>
          <View style={styles.water}>
            <Text style={styles.waterText}>
              MAR
            </Text>
          </View>

          <View
            style={[
              styles.road,
              styles.roadHorizontal1,
            ]}
          />

          <View
            style={[
              styles.road,
              styles.roadHorizontal2,
            ]}
          />

          <View
            style={[
              styles.road,
              styles.roadVertical1,
            ]}
          />

          <View
            style={[
              styles.road,
              styles.roadVertical2,
            ]}
          />

          <View style={styles.block1} />
          <View style={styles.block2} />
          <View style={styles.block3} />
          <View style={styles.block4} />

          {/* VOCÊ */}

          <View style={styles.youMarker}>
            <View style={styles.youDot} />
          </View>

          <View style={styles.youLabel}>
            <Text style={styles.youLabelText}>
              Você
            </Text>
          </View>

          {/* MARCADORES */}

          {locais.map((local, index) => {
            const positions = [
              styles.marker1,
              styles.marker2,
              styles.marker3,
              styles.marker4,
            ];

            return (
              <Pressable
                key={local.id}
                style={[
                  styles.marker,
                  positions[index],
                ]}
                onPress={() => abrirLocal(local)}
              >
                <Text style={styles.markerEmoji}>
                  {local.emoji}
                </Text>
              </Pressable>
            );
          })}

          {/* LOCALIZAÇÃO */}

          <Pressable style={styles.locationButton}>
            <Text style={styles.locationIcon}>
              ⌖
            </Text>
          </Pressable>
        </View>

        {/* RESULTADOS */}

        <View style={styles.resultHeader}>
          <View>
            <Text style={styles.resultTitle}>
              Lugares próximos
            </Text>

            <Text style={styles.resultSubtitle}>
              {locaisFiltrados.length} opções encontradas
            </Text>
          </View>

          <Text style={styles.distanceText}>
            Mais próximos
          </Text>
        </View>

        {/* CARDS */}

        {locaisFiltrados.map((local) => (
          <Pressable
            key={local.id}
            style={styles.localCard}
            onPress={() => abrirLocal(local)}
          >
            <View style={styles.localImage}>
              <Text style={styles.localEmoji}>
                {local.emoji}
              </Text>
            </View>

            <View style={styles.localInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.localName}>
                  {local.nome}
                </Text>

                <Text style={styles.rating}>
                  ★ {local.avaliacao}
                </Text>
              </View>

              <Text style={styles.localCategory}>
                {local.categoria}
              </Text>

              <Text style={styles.localAddress}>
                📍 {local.endereco}
              </Text>

              <View style={styles.cardBottom}>
                <Text style={styles.localDistance}>
                  {local.distancia}
                </Text>

                <View style={styles.offerBadge}>
                  <Text style={styles.offerText}>
                    {local.promocao}
                  </Text>
                </View>
              </View>
            </View>
          </Pressable>
        ))}

        {locaisFiltrados.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>
              🔎
            </Text>

            <Text style={styles.emptyTitle}>
              Nenhum lugar encontrado
            </Text>

            <Text style={styles.emptyText}>
              Tente outra busca ou escolha outra
              categoria.
            </Text>
          </View>
        )}

        {/* ASSISTENTE */}

        <Pressable
          style={styles.assistantCard}
          onPress={abrirAssistente}
        >
          <View style={styles.assistantIcon}>
            <Text style={styles.assistantIconText}>
              ✦
            </Text>
          </View>

          <View style={styles.assistantInfo}>
            <Text style={styles.assistantTitle}>
              Não sabe onde ir?
            </Text>

            <Text style={styles.assistantText}>
              Pergunte ao Budd e descubra uma experiência.
            </Text>
          </View>

          <Text style={styles.assistantArrow}>
            ›
          </Text>
        </Pressable>
      </ScrollView>

      {/* MODAL DO LOCAL */}

      <Modal
        visible={localSelecionado !== null}
        transparent
        animationType="slide"
        onRequestClose={fecharModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modal}>
            {localSelecionado && (
              <>
                <View style={styles.modalHandle} />

                {/* TELA PRINCIPAL DO LOCAL */}

                {acaoSelecionada === null && (
                  <>
                    <View style={styles.modalTop}>
                      <View style={styles.modalEmojiBox}>
                        <Text style={styles.modalEmoji}>
                          {localSelecionado.emoji}
                        </Text>
                      </View>

                      <View style={styles.modalTitleArea}>
                        <Text style={styles.modalTitle}>
                          {localSelecionado.nome}
                        </Text>

                        <Text style={styles.modalCategory}>
                          {localSelecionado.categoria}
                        </Text>
                      </View>

                      <Pressable
                        style={styles.closeButton}
                        onPress={fecharModal}
                      >
                        <Text style={styles.closeText}>
                          ×
                        </Text>
                      </Pressable>
                    </View>

                    <View style={styles.modalRatingRow}>
                      <Text style={styles.modalRating}>
                        ★ {localSelecionado.avaliacao}
                      </Text>

                      <Text style={styles.modalDistance}>
                        📍 {localSelecionado.distancia}
                      </Text>
                    </View>

                    <Text style={styles.modalAddress}>
                      {localSelecionado.endereco}
                    </Text>

                    <Text style={styles.modalDescription}>
                      {localSelecionado.descricao}
                    </Text>

                    {/* OFERTA */}

                    <View style={styles.offerBox}>
                      <Text style={styles.offerBoxIcon}>
                        🎁
                      </Text>

                      <View style={styles.offerBoxInfo}>
                        <Text style={styles.offerBoxTitle}>
                          Oferta Budd
                        </Text>

                        <Text style={styles.offerBoxText}>
                          {localSelecionado.promocao}
                        </Text>
                      </View>
                    </View>

                    {/* AÇÕES */}

                    <View style={styles.modalActions}>
                      <Pressable
                        style={styles.secondaryAction}
                        onPress={verDetalhes}
                      >
                        <Text style={styles.secondaryActionIcon}>
                          ℹ
                        </Text>

                        <Text style={styles.secondaryActionText}>
                          Detalhes
                        </Text>
                      </Pressable>

                      <Pressable
                        style={styles.secondaryAction}
                        onPress={verOferta}
                      >
                        <Text style={styles.secondaryActionIcon}>
                          🎁
                        </Text>

                        <Text style={styles.secondaryActionText}>
                          Oferta
                        </Text>
                      </Pressable>
                    </View>

                    <View style={styles.modalActions}>
                      {localSelecionado.categoria ===
                        'Eventos' ? (
                        <Pressable
                          style={styles.reserveButton}
                          onPress={comprarIngresso}
                        >
                          <Text style={styles.reserveButtonText}>
                            Comprar ingresso
                          </Text>
                        </Pressable>
                      ) : (
                        <Pressable
                          style={styles.reserveButton}
                          onPress={reservar}
                        >
                          <Text style={styles.reserveButtonText}>
                            Reservar
                          </Text>
                        </Pressable>
                      )}
                    </View>
                  </>
                )}

                {/* DETALHE DA OFERTA */}

                {acaoSelecionada === 'oferta' && (
                  <View>
                    <View style={styles.actionHeader}>
                      <Pressable
                        style={styles.backActionButton}
                        onPress={voltarParaLocal}
                      >
                        <Text style={styles.backActionText}>
                          ‹
                        </Text>
                      </Pressable>

                      <Text style={styles.actionHeaderTitle}>
                        Oferta Budd
                      </Text>

                      <Pressable
                        style={styles.closeButton}
                        onPress={fecharModal}
                      >
                        <Text style={styles.closeText}>
                          ×
                        </Text>
                      </Pressable>
                    </View>

                    <View style={styles.bigActionIcon}>
                      <Text style={styles.bigActionEmoji}>
                        🎁
                      </Text>
                    </View>

                    <Text style={styles.actionTitle}>
                      {localSelecionado.promocao}
                    </Text>

                    <Text style={styles.actionSubtitle}>
                      Oferta disponível no {localSelecionado.nome}.
                    </Text>

                    <View style={styles.infoBox}>
                      <Text style={styles.infoBoxTitle}>
                        Como funciona
                      </Text>

                      <Text style={styles.infoBoxText}>
                        Apresente a oferta do Budd no estabelecimento
                        para utilizar o benefício.
                      </Text>
                    </View>

                    <Pressable
                      style={styles.reserveButton}
                      onPress={reservar}
                    >
                      <Text style={styles.reserveButtonText}>
                        Usar oferta
                      </Text>
                    </Pressable>
                  </View>
                )}

                {/* RESERVA */}

                {acaoSelecionada === 'reserva' && (
                  <View>
                    <View style={styles.actionHeader}>
                      <Pressable
                        style={styles.backActionButton}
                        onPress={voltarParaLocal}
                      >
                        <Text style={styles.backActionText}>
                          ‹
                        </Text>
                      </Pressable>

                      <Text style={styles.actionHeaderTitle}>
                        Reserva
                      </Text>

                      <Pressable
                        style={styles.closeButton}
                        onPress={fecharModal}
                      >
                        <Text style={styles.closeText}>
                          ×
                        </Text>
                      </Pressable>
                    </View>

                    <View style={styles.bigActionIcon}>
                      <Text style={styles.bigActionEmoji}>
                        📅
                      </Text>
                    </View>

                    <Text style={styles.actionTitle}>
                      Reserva iniciada
                    </Text>

                    <Text style={styles.actionSubtitle}>
                      Você está iniciando uma reserva para:
                    </Text>

                    <View style={styles.reservationPlace}>
                      <Text style={styles.reservationEmoji}>
                        {localSelecionado.emoji}
                      </Text>

                      <View style={styles.reservationInfo}>
                        <Text style={styles.reservationName}>
                          {localSelecionado.nome}
                        </Text>

                        <Text style={styles.reservationAddress}>
                          {localSelecionado.endereco}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.infoBox}>
                      <Text style={styles.infoBoxTitle}>
                        Próximo passo
                      </Text>

                      <Text style={styles.infoBoxText}>
                        Em uma versão completa, aqui o usuário
                        escolheria data, horário e quantidade de
                        pessoas.
                      </Text>
                    </View>

                    <Pressable
                      style={styles.reserveButton}
                      onPress={fecharModal}
                    >
                      <Text style={styles.reserveButtonText}>
                        Continuar
                      </Text>
                    </Pressable>
                  </View>
                )}

                {/* INGRESSO */}

                {acaoSelecionada === 'ingresso' && (
                  <View>
                    <View style={styles.actionHeader}>
                      <Pressable
                        style={styles.backActionButton}
                        onPress={voltarParaLocal}
                      >
                        <Text style={styles.backActionText}>
                          ‹
                        </Text>
                      </Pressable>

                      <Text style={styles.actionHeaderTitle}>
                        Ingressos
                      </Text>

                      <Pressable
                        style={styles.closeButton}
                        onPress={fecharModal}
                      >
                        <Text style={styles.closeText}>
                          ×
                        </Text>
                      </Pressable>
                    </View>

                    <View style={styles.bigActionIcon}>
                      <Text style={styles.bigActionEmoji}>
                        🎟️
                      </Text>
                    </View>

                    <Text style={styles.actionTitle}>
                      {localSelecionado.nome}
                    </Text>

                    <Text style={styles.actionSubtitle}>
                      {localSelecionado.promocao}
                    </Text>

                    <View style={styles.infoBox}>
                      <Text style={styles.infoBoxTitle}>
                        Compra de ingresso
                      </Text>

                      <Text style={styles.infoBoxText}>
                        Em uma versão completa, aqui o usuário
                        poderia escolher o ingresso, quantidade e
                        realizar o pagamento dentro do Budd.
                      </Text>
                    </View>

                    <Pressable
                      style={styles.reserveButton}
                      onPress={fecharModal}
                    >
                      <Text style={styles.reserveButtonText}>
                        Continuar compra
                      </Text>
                    </Pressable>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  content: {
    padding: 20,
    paddingBottom: 45,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  logo: {
    color: '#7CFF00',
    fontSize: 32,
    fontWeight: '900',
  },

  subtitle: {
    color: '#777',
    fontSize: 12,
    marginTop: 3,
  },

  assistenteButton: {
    backgroundColor: '#151515',
    borderWidth: 1,
    borderColor: '#7CFF00',
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  assistenteIcon: {
    color: '#7CFF00',
    fontSize: 16,
  },

  assistenteText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },

  searchBox: {
    height: 50,
    backgroundColor: '#151515',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#252525',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  searchIcon: {
    fontSize: 17,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 14,
  },

  filters: {
    marginTop: 15,
    marginBottom: 16,
  },

  filterButton: {
    backgroundColor: '#151515',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#252525',
    paddingHorizontal: 15,
    paddingVertical: 9,
    marginRight: 8,
  },

  filterButtonActive: {
    backgroundColor: '#7CFF00',
    borderColor: '#7CFF00',
  },

  filterText: {
    color: '#AAA',
    fontSize: 12,
    fontWeight: '700',
  },

  filterTextActive: {
    color: '#000',
  },

  map: {
    height: 330,
    backgroundColor: '#20251E',
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#303530',
  },

  water: {
    position: 'absolute',
    right: -50,
    top: -20,
    width: 150,
    height: 380,
    backgroundColor: '#172D32',
    transform: [
      {
        rotate: '8deg',
      },
    ],
    alignItems: 'center',
    justifyContent: 'center',
  },

  waterText: {
    color: '#45666B',
    fontSize: 12,
    fontWeight: '900',
  },

  road: {
    position: 'absolute',
    backgroundColor: '#4A4D48',
  },

  roadHorizontal1: {
    height: 12,
    width: '100%',
    top: 105,
  },

  roadHorizontal2: {
    height: 9,
    width: '100%',
    top: 220,
  },

  roadVertical1: {
    width: 10,
    height: '100%',
    left: 100,
  },

  roadVertical2: {
    width: 12,
    height: '100%',
    left: 225,
  },

  block1: {
    position: 'absolute',
    width: 70,
    height: 70,
    left: 20,
    top: 25,
    backgroundColor: '#293027',
    borderRadius: 7,
  },

  block2: {
    position: 'absolute',
    width: 80,
    height: 75,
    left: 130,
    top: 25,
    backgroundColor: '#293027',
    borderRadius: 7,
  },

  block3: {
    position: 'absolute',
    width: 75,
    height: 80,
    left: 20,
    top: 145,
    backgroundColor: '#293027',
    borderRadius: 7,
  },

  block4: {
    position: 'absolute',
    width: 80,
    height: 75,
    left: 130,
    top: 145,
    backgroundColor: '#293027',
    borderRadius: 7,
  },

  youMarker: {
    position: 'absolute',
    left: '46%',
    top: '45%',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(124,255,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  youDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#7CFF00',
    borderWidth: 2,
    borderColor: '#000',
  },

  youLabel: {
    position: 'absolute',
    left: '43%',
    top: '57%',
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 7,
  },

  youLabelText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },

  marker: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7CFF00',
    borderWidth: 3,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },

  marker1: {
    left: 50,
    top: 65,
  },

  marker2: {
    left: 150,
    top: 150,
  },

  marker3: {
    right: 35,
    top: 90,
  },

  marker4: {
    left: 70,
    bottom: 25,
  },

  markerEmoji: {
    fontSize: 17,
  },

  locationButton: {
    position: 'absolute',
    right: 15,
    bottom: 15,
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
  },

  locationIcon: {
    color: '#7CFF00',
    fontSize: 25,
  },

  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 24,
    marginBottom: 13,
  },

  resultTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900',
  },

  resultSubtitle: {
    color: '#666',
    fontSize: 11,
    marginTop: 3,
  },

  distanceText: {
    color: '#7CFF00',
    fontSize: 11,
    fontWeight: '700',
  },

  localCard: {
    backgroundColor: '#151515',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#252525',
    padding: 12,
    flexDirection: 'row',
    marginBottom: 10,
  },

  localImage: {
    width: 68,
    height: 68,
    borderRadius: 15,
    backgroundColor: '#252525',
    alignItems: 'center',
    justifyContent: 'center',
  },

  localEmoji: {
    fontSize: 30,
  },

  localInfo: {
    flex: 1,
    marginLeft: 12,
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  localName: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '900',
    flex: 1,
  },

  rating: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },

  localCategory: {
    color: '#7CFF00',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 3,
  },

  localAddress: {
    color: '#777',
    fontSize: 10,
    marginTop: 5,
  },

  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
  },

  localDistance: {
    color: '#AAA',
    fontSize: 10,
    marginRight: 8,
  },

  offerBadge: {
    backgroundColor: '#253018',
    borderRadius: 7,
    paddingHorizontal: 7,
    paddingVertical: 4,
    flex: 1,
  },

  offerText: {
    color: '#7CFF00',
    fontSize: 9,
    fontWeight: '800',
  },

  empty: {
    backgroundColor: '#151515',
    borderRadius: 17,
    padding: 30,
    alignItems: 'center',
  },

  emptyEmoji: {
    fontSize: 30,
  },

  emptyTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 10,
  },

  emptyText: {
    color: '#777',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },

  assistantCard: {
    backgroundColor: '#151515',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#303030',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },

  assistantIcon: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#7CFF00',
    alignItems: 'center',
    justifyContent: 'center',
  },

  assistantIconText: {
    color: '#000',
    fontSize: 23,
    fontWeight: '900',
  },

  assistantInfo: {
    flex: 1,
    marginLeft: 12,
  },

  assistantTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
  },

  assistantText: {
    color: '#777',
    fontSize: 11,
    marginTop: 3,
    lineHeight: 16,
  },

  assistantArrow: {
    color: '#7CFF00',
    fontSize: 28,
    marginLeft: 8,
  },

  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.78)',
    justifyContent: 'flex-end',
  },

  modal: {
    backgroundColor: '#111',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 22,
    borderTopWidth: 1,
    borderColor: '#333',
    maxHeight: '88%',
  },

  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#444',
    alignSelf: 'center',
    marginBottom: 20,
  },

  modalTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  modalEmojiBox: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: '#252525',
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalEmoji: {
    fontSize: 30,
  },

  modalTitleArea: {
    flex: 1,
    marginLeft: 12,
  },

  modalTitle: {
    color: '#FFF',
    fontSize: 21,
    fontWeight: '900',
  },

  modalCategory: {
    color: '#7CFF00',
    fontSize: 12,
    marginTop: 3,
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#252525',
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeText: {
    color: '#FFF',
    fontSize: 24,
  },

  modalRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },

  modalRating: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },

  modalDistance: {
    color: '#999',
    fontSize: 12,
    marginLeft: 15,
  },

  modalAddress: {
    color: '#777',
    fontSize: 12,
    marginTop: 9,
  },

  modalDescription: {
    color: '#AAA',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 14,
  },

  offerBox: {
    backgroundColor: '#1A2115',
    borderRadius: 14,
    padding: 13,
    marginTop: 17,
    flexDirection: 'row',
    alignItems: 'center',
  },

  offerBoxIcon: {
    fontSize: 24,
    marginRight: 10,
  },

  offerBoxInfo: {
    flex: 1,
  },

  offerBoxTitle: {
    color: '#7CFF00',
    fontSize: 11,
    fontWeight: '900',
  },

  offerBoxText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 3,
  },

  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },

  secondaryAction: {
    flex: 1,
    height: 48,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#181818',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },

  secondaryActionIcon: {
    fontSize: 14,
  },

  secondaryActionText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },

  reserveButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 13,
    backgroundColor: '#7CFF00',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },

  reserveButtonText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'center',
  },

  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#252525',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backActionText: {
    color: '#FFF',
    fontSize: 30,
    lineHeight: 32,
  },

  actionHeaderTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '900',
  },

  bigActionIcon: {
    width: 75,
    height: 75,
    borderRadius: 38,
    backgroundColor: '#1A2115',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 25,
  },

  bigActionEmoji: {
    fontSize: 36,
  },

  actionTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 18,
  },

  actionSubtitle: {
    color: '#888',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 8,
  },

  infoBox: {
    backgroundColor: '#181818',
    borderRadius: 14,
    padding: 15,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#292929',
  },

  infoBoxTitle: {
    color: '#7CFF00',
    fontSize: 12,
    fontWeight: '900',
  },

  infoBoxText: {
    color: '#AAA',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 6,
  },

  reservationPlace: {
    backgroundColor: '#181818',
    borderRadius: 15,
    padding: 15,
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#292929',
  },

  reservationEmoji: {
    fontSize: 32,
  },

  reservationInfo: {
    flex: 1,
    marginLeft: 12,
  },

  reservationName: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '900',
  },

  reservationAddress: {
    color: '#777',
    fontSize: 11,
    marginTop: 4,
  },
});