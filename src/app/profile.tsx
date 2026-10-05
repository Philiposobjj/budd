import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { supabase } from '../lib/supabase';

type ProfileData = {
  id: string;
  name: string | null;
  cpf: string | null;
  phone: string | null;
  cep: string | null;
  address: string | null;
  number: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  payment_method: string | null;
};

export default function ProfileScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');

  const [profile, setProfile] =
    useState<ProfileData | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('');

  useEffect(() => {
    carregarPerfil();
  }, []);

  async function carregarPerfil() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/login');
        return;
      }

      setEmail(user.email || '');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error(
          'ERRO AO CARREGAR PERFIL:',
          error,
        );

        Alert.alert(
          'Erro',
          'Não foi possível carregar seu perfil.',
        );

        return;
      }

      if (data) {
        setProfile(data);

        setNome(data.name || '');
        setCpf(data.cpf || '');
        setTelefone(data.phone || '');
        setCep(data.cep || '');
        setEndereco(data.address || '');
        setNumero(data.number || '');
        setComplemento(data.complement || '');
        setBairro(data.neighborhood || '');
        setCidade(data.city || '');
        setEstado(data.state || '');
        setFormaPagamento(
          data.payment_method || '',
        );

        setEditing(false);
      } else {
        const nomeUsuario =
          user.user_metadata?.name ||
          user.user_metadata?.full_name ||
          '';

        setNome(nomeUsuario);
        setEditing(true);
      }
    } catch (error) {
      console.error(error);

      Alert.alert(
        'Erro',
        'Não foi possível carregar o perfil.',
      );
    } finally {
      setLoading(false);
    }
  }

  async function salvarPerfil() {
    if (!nome.trim()) {
      Alert.alert(
        'Atenção',
        'Digite seu nome.',
      );
      return;
    }

    setSaving(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/login');
        return;
      }

      const dados = {
        id: user.id,
        name: nome.trim(),
        cpf: cpf.trim(),
        phone: telefone.trim(),
        cep: cep.trim(),
        address: endereco.trim(),
        number: numero.trim(),
        complement: complemento.trim(),
        neighborhood: bairro.trim(),
        city: cidade.trim(),
        state: estado.trim(),
        payment_method:
          formaPagamento.trim(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('profiles')
        .upsert(dados)
        .select()
        .single();

      if (error) {
        console.error(
          'ERRO AO SALVAR PERFIL:',
          error,
        );

        Alert.alert(
          'Erro',
          error.message,
        );

        return;
      }

      setProfile(data);
      setEditing(false);

      Alert.alert(
        'Perfil salvo!',
        'Seus dados foram salvos com sucesso.',
      );
    } catch (error) {
      console.error(error);

      Alert.alert(
        'Erro',
        'Não foi possível salvar seu perfil.',
      );
    } finally {
      setSaving(false);
    }
  }

  function editarPerfil() {
    setEditing(true);
  }

  async function sair() {
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      Alert.alert(
        'Erro',
        'Não foi possível sair da conta.',
      );

      return;
    }

    router.replace('/login');
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#7CFF00"
        />

        <Text style={styles.loadingText}>
          Carregando perfil...
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
          Meu perfil
        </Text>

        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {nome
              ? nome.charAt(0).toUpperCase()
              : 'U'}
          </Text>
        </View>

        <Text style={styles.profileName}>
          {nome || 'Usuário'}
        </Text>

        <Text style={styles.email}>
          {email}
        </Text>

        {!editing && profile ? (
          <View style={styles.infoContainer}>
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>
                Dados pessoais
              </Text>

              <Text style={styles.infoLabel}>
                Nome
              </Text>

              <Text style={styles.infoValue}>
                {profile.name || '-'}
              </Text>

              <Text style={styles.infoLabel}>
                CPF
              </Text>

              <Text style={styles.infoValue}>
                {profile.cpf || '-'}
              </Text>

              <Text style={styles.infoLabel}>
                Telefone
              </Text>

              <Text style={styles.infoValue}>
                {profile.phone || '-'}
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>
                Endereço
              </Text>

              <Text style={styles.infoValue}>
                {profile.address || '-'}
                {profile.number
                  ? `, ${profile.number}`
                  : ''}
              </Text>

              {profile.complement ? (
                <Text style={styles.infoValue}>
                  {profile.complement}
                </Text>
              ) : null}

              <Text style={styles.infoValue}>
                {profile.neighborhood || '-'}
              </Text>

              <Text style={styles.infoValue}>
                {profile.city || '-'}
                {profile.state
                  ? ` - ${profile.state}`
                  : ''}
              </Text>

              <Text style={styles.infoValue}>
                CEP: {profile.cep || '-'}
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>
                Forma de pagamento
              </Text>

              <Text style={styles.infoValue}>
                {profile.payment_method ||
                  'Não cadastrada'}
              </Text>
            </View>

            <Pressable
              style={styles.editButton}
              onPress={editarPerfil}
            >
              <Text style={styles.editButtonText}>
                Editar perfil
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>
              Dados pessoais
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              placeholderTextColor="#777"
              value={nome}
              onChangeText={setNome}
            />

            <TextInput
              style={styles.input}
              placeholder="CPF"
              placeholderTextColor="#777"
              value={cpf}
              onChangeText={setCpf}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Telefone"
              placeholderTextColor="#777"
              value={telefone}
              onChangeText={setTelefone}
              keyboardType="phone-pad"
            />

            <Text style={styles.sectionTitle}>
              Endereço
            </Text>

            <TextInput
              style={styles.input}
              placeholder="CEP"
              placeholderTextColor="#777"
              value={cep}
              onChangeText={setCep}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Rua / endereço"
              placeholderTextColor="#777"
              value={endereco}
              onChangeText={setEndereco}
            />

            <TextInput
              style={styles.input}
              placeholder="Número"
              placeholderTextColor="#777"
              value={numero}
              onChangeText={setNumero}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Complemento"
              placeholderTextColor="#777"
              value={complemento}
              onChangeText={setComplemento}
            />

            <TextInput
              style={styles.input}
              placeholder="Bairro"
              placeholderTextColor="#777"
              value={bairro}
              onChangeText={setBairro}
            />

            <TextInput
              style={styles.input}
              placeholder="Cidade"
              placeholderTextColor="#777"
              value={cidade}
              onChangeText={setCidade}
            />

            <TextInput
              style={styles.input}
              placeholder="Estado"
              placeholderTextColor="#777"
              value={estado}
              onChangeText={setEstado}
              autoCapitalize="characters"
              maxLength={2}
            />

            <Text style={styles.sectionTitle}>
              Forma de pagamento
            </Text>

            <View style={styles.paymentOptions}>
              {[
                'Pix',
                'Cartão',
                'Dinheiro',
              ].map((item) => {
                const selecionado =
                  formaPagamento === item;

                return (
                  <Pressable
                    key={item}
                    onPress={() =>
                      setFormaPagamento(item)
                    }
                    style={[
                      styles.paymentOption,
                      selecionado &&
                        styles.paymentSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.paymentText,
                        selecionado &&
                          styles.paymentTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              style={styles.saveButton}
              onPress={salvarPerfil}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.saveButtonText}>
                  Salvar perfil
                </Text>
              )}
            </Pressable>
          </View>
        )}

        <View style={styles.accountOptions}>
          <Pressable
            style={styles.optionButton}
            onPress={() =>
              router.push('/reservations')
            }
          >
            <Text style={styles.optionText}>
              📅 Minhas reservas
            </Text>
          </Pressable>

          <Pressable
            style={styles.optionButton}
            onPress={() =>
              router.push('/orders')
            }
          >
            <Text style={styles.optionText}>
              📦 Meus pedidos
            </Text>
          </Pressable>

          <Pressable
            style={styles.optionButton}
            onPress={() =>
              router.push('/cart')
            }
          >
            <Text style={styles.optionText}>
              🛒 Meu carrinho
            </Text>
          </Pressable>

          <Pressable
            style={styles.optionButton}
            onPress={() =>
              router.push('/events')
            }
          >
            <Text style={styles.optionText}>
              🎟️ Eventos
            </Text>
          </Pressable>

          <Pressable
            style={styles.logoutButton}
            onPress={sair}
          >
            <Text style={styles.logoutText}>
              Sair da conta
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    color: '#999',
    marginTop: 12,
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

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#7CFF00',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },

  avatarText: {
    color: '#000',
    fontSize: 34,
    fontWeight: 'bold',
  },

  profileName: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 12,
  },

  email: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },

  infoContainer: {
    marginTop: 30,
  },

  infoCard: {
    backgroundColor: '#151515',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
  },

  infoTitle: {
    color: '#7CFF00',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  infoLabel: {
    color: '#777',
    fontSize: 12,
    marginTop: 10,
  },

  infoValue: {
    color: '#FFF',
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },

  editButton: {
    backgroundColor: '#7CFF00',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 5,
  },

  editButtonText: {
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold',
  },

  form: {
    marginTop: 30,
  },

  sectionTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 10,
  },

  input: {
    backgroundColor: '#151515',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 14,
    color: '#FFF',
    fontSize: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#242424',
  },

  paymentOptions: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },

  paymentOption: {
    backgroundColor: '#151515',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: '#242424',
  },

  paymentSelected: {
    backgroundColor: '#7CFF00',
    borderColor: '#7CFF00',
  },

  paymentText: {
    color: '#CCC',
    fontWeight: '600',
  },

  paymentTextSelected: {
    color: '#000',
  },

  saveButton: {
    backgroundColor: '#7CFF00',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 25,
  },

  saveButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },

  accountOptions: {
    marginTop: 35,
  },

  optionButton: {
    backgroundColor: '#151515',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
  },

  optionText: {
    color: '#FFF',
    fontSize: 14,
  },

  logoutButton: {
    backgroundColor: '#151515',
    borderRadius: 10,
    padding: 16,
    marginTop: 10,
    marginBottom: 20,
  },

  logoutText: {
    color: '#FF5555',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});