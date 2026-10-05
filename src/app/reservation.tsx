
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';

import { supabase } from '../lib/supabase';

export default function ReservationScreen() {
  const router = useRouter();

  const params = useLocalSearchParams();

  const placeId =
    typeof params.placeId === 'string'
      ? params.placeId
      : '';

  const placeName =
    typeof params.placeName === 'string'
      ? params.placeName
      : 'Estabelecimento';

  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const [pessoas, setPessoas] = useState(2);
  const [loading, setLoading] = useState(false);
  const [reservaConfirmada, setReservaConfirmada] =
    useState(false);

  const horarios = [
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
    '21:00',
    '21:30',
    '22:00',
  ];

  function criarData(dias: number) {
    const hoje = new Date();

    hoje.setDate(hoje.getDate() + dias);

    const ano = hoje.getFullYear();
    const mes = String(
      hoje.getMonth() + 1
    ).padStart(2, '0');
    const dia = String(
      hoje.getDate()
    ).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;
  }

  const datas = [
    {
      nome: 'Hoje',
      valor: criarData(0),
    },
    {
      nome: 'Amanhã',
      valor: criarData(1),
    },
    {
      nome: 'Depois de amanhã',
      valor: criarData(2),
    },
  ];

  async function confirmarReserva() {
    if (!placeId) {
      Alert.alert(
        'Erro',
        'Estabelecimento não encontrado.'
      );
      return;
    }

    if (!data) {
      Alert.alert(
        'Atenção',
        'Escolha uma data.'
      );
      return;
    }

    if (!horario) {
      Alert.alert(
        'Atenção',
        'Escolha um horário.'
      );
      return;
    }

    setLoading(true);

    try {
      const resultado =
        await supabase.auth.getUser();

      if (resultado.error) {
        Alert.alert(
          'Erro',
          'Não foi possível verificar seu login.'
        );
        return;
      }

      const user = resultado.data.user;

      if (!user) {
        Alert.alert(
          'Sessão expirada',
          'Faça login novamente.'
        );

        router.replace('/login');
        return;
      }

      const resultadoReserva =
        await supabase
          .from('reservations')
          .insert({
            user_id: user.id,
            place_id: placeId,
            reservation_date: data,
            reservation_time: horario,
            people: pessoas,
            status: 'Confirmada',
          });

      if (resultadoReserva.error) {
        console.error(
          resultadoReserva.error
        );

        Alert.alert(
          'Erro',
          resultadoReserva.error.message
        );

        return;
      }

      setReservaConfirmada(true);

      setTimeout(() => {
        router.replace({
          pathname: '/place',
          params: {
            id: placeId,
          },
        });
      }, 1200);
    } catch (error) {
      console.error(error);

      Alert.alert(
        'Erro',
        'Não foi possível realizar a reserva.'
      );
    } finally {
      setLoading(false);
    }
  }

  if (reservaConfirmada) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successIcon}>
          <Text style={styles.successIconText}>
            ✓
          </Text>
        </View>

        <Text style={styles.successTitle}>
          Reserva confirmada!
        </Text>

        <Text style={styles.successText}>
          Sua reserva em {placeName} foi realizada
          com sucesso.
        </Text>

        <Text style={styles.successSubtext}>
          Voltando para o restaurante...
        </Text>
      </View>
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
          Reservar mesa
        </Text>

        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
      >
        <Text style={styles.placeName}>
          {placeName}
        </Text>

        <Text style={styles.subtitle}>
          Escolha a data, horário e quantidade
          de pessoas.
        </Text>

        <Text style={styles.sectionTitle}>
          Data
        </Text>

        <View style={styles.options}>
          {datas.map(function (item) {
            const selecionada =
              data === item.valor;

            return (
              <Pressable
                key={item.valor}
                onPress={function () {
                  setData(item.valor);
                }}
                style={[
                  styles.option,
                  selecionada &&
                    styles.optionSelected,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    selecionada &&
                      styles.optionTextSelected,
                  ]}
                >
                  {item.nome}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>
          Horário
        </Text>

        <View style={styles.options}>
          {horarios.map(function (item) {
            const selecionado =
              horario === item;

            return (
              <Pressable
                key={item}
                onPress={function () {
                  setHorario(item);
                }}
                style={[
                  styles.timeOption,
                  selecionado &&
                    styles.optionSelected,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    selecionado &&
                      styles.optionTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>
          Pessoas
        </Text>

        <View style={styles.people}>
          <Pressable
            onPress={function () {
              if (pessoas > 1) {
                setPessoas(pessoas - 1);
              }
            }}
            style={styles.peopleButton}
          >
            <Text style={styles.peopleButtonText}>
              -
            </Text>
          </Pressable>

          <Text style={styles.peopleNumber}>
            {pessoas}
          </Text>

          <Pressable
            onPress={function () {
              if (pessoas < 20) {
                setPessoas(pessoas + 1);
              }
            }}
            style={styles.peopleButton}
          >
            <Text style={styles.peopleButtonText}>
              +
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={confirmarReserva}
          style={styles.confirmButton}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.confirmText}>
              Confirmar reserva
            </Text>
          )}
        </Pressable>
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
    fontSize: 19,
    fontWeight: 'bold',
  },

  placeholder: {
    width: 40,
  },

  content: {
    padding: 20,
    paddingBottom: 50,
  },

  placeName: {
    color: '#FFF',
    fontSize: 25,
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#888',
    fontSize: 14,
    marginTop: 8,
    lineHeight: 21,
  },

  sectionTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 12,
  },

  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  option: {
    backgroundColor: '#151515',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 13,
  },

  timeOption: {
    backgroundColor: '#151515',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 13,
    minWidth: 75,
    alignItems: 'center',
  },

  optionSelected: {
    backgroundColor: '#7CFF00',
  },

  optionText: {
    color: '#CCC',
    fontSize: 14,
    fontWeight: '600',
  },

  optionTextSelected: {
    color: '#000',
  },

  people: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 25,
  },

  peopleButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#7CFF00',
    alignItems: 'center',
    justifyContent: 'center',
  },

  peopleButtonText: {
    color: '#000',
    fontSize: 25,
    fontWeight: 'bold',
  },

  peopleNumber: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    minWidth: 30,
    textAlign: 'center',
  },

  confirmButton: {
    backgroundColor: '#7CFF00',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 35,
  },

  confirmText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },

  successContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  successIcon: {
    width: 75,
    height: 75,
    borderRadius: 38,
    backgroundColor: '#7CFF00',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },

  successIconText: {
    color: '#000',
    fontSize: 45,
    fontWeight: 'bold',
  },

  successTitle: {
    color: '#FFF',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  successText: {
    color: '#CCC',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 12,
  },

  successSubtext: {
    color: '#7CFF00',
    fontSize: 13,
    marginTop: 25,
  },
});

