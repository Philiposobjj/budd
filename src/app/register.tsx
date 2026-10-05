
import { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { supabase } from '../lib/supabase';

export default function RegisterScreen() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] =
    useState('');
  const [carregando, setCarregando] = useState(false);

  async function criarConta() {
    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim();

    if (!nomeLimpo || !emailLimpo || !senha || !confirmarSenha) {
      Alert.alert(
        'Atenção',
        'Preencha todos os campos.',
      );
      return;
    }

    if (senha.length < 6) {
      Alert.alert(
        'Atenção',
        'A senha precisa ter pelo menos 6 caracteres.',
      );
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert(
        'Atenção',
        'As senhas não são iguais.',
      );
      return;
    }

    try {
      setCarregando(true);

      console.log(
        'CADASTRO: criando usuário...',
      );

      const {
        data,
        error,
      } = await supabase.auth.signUp({
        email: emailLimpo,
        password: senha,
        options: {
          data: {
            name: nomeLimpo,
          },
        },
      });

      if (error) {
        console.error(
          'CADASTRO: erro:',
          error,
        );

        Alert.alert(
          'Erro no cadastro',
          error.message,
        );

        return;
      }

      console.log(
        'CADASTRO: usuário criado:',
        data.user,
      );

      if (data.session) {
        Alert.alert(
          'Cadastro realizado',
          'Sua conta foi criada com sucesso.',
          [
            {
              text: 'Continuar',
              onPress: () => router.replace('/'),
            },
          ],
        );

        return;
      }

      Alert.alert(
        'Cadastro realizado',
        'Sua conta foi criada. Verifique seu e-mail para confirmar o cadastro e depois faça login.',
        [
          {
            text: 'Ir para login',
            onPress: () => router.replace('/login'),
          },
        ],
      );
    } catch (error) {
      console.error(
        'CADASTRO: erro inesperado:',
        error,
      );

      Alert.alert(
        'Erro',
        'Não foi possível criar a conta.',
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>
          BUDD
        </Text>

        <Text style={styles.title}>
          Criar conta
        </Text>

        <Text style={styles.subtitle}>
          Crie sua conta para aproveitar o Budd.
        </Text>

        <Text style={styles.label}>
          Nome
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Seu nome"
          placeholderTextColor="#666"
          value={nome}
          onChangeText={setNome}
          autoCapitalize="words"
        />

        <Text style={styles.label}>
          E-mail
        </Text>

        <TextInput
          style={styles.input}
          placeholder="seu@email.com"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>
          Senha
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Mínimo de 6 caracteres"
          placeholderTextColor="#666"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          autoCapitalize="none"
        />

        <Text style={styles.label}>
          Confirmar senha
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Digite a senha novamente"
          placeholderTextColor="#666"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry
          autoCapitalize="none"
        />

        <Pressable
          onPress={criarConta}
          disabled={carregando}
          style={[
            styles.registerButton,
            carregando && styles.disabledButton,
          ]}
        >
          <Text style={styles.registerButtonText}>
            {carregando
              ? 'Criando conta...'
              : 'Criar minha conta'}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.replace('/login')}
          style={styles.backButton}
        >
          <Text style={styles.backText}>
            Já tenho uma conta
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  content: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: 'center',
  },

  logo: {
    color: '#7CFF00',
    fontSize: 42,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 5,
    marginBottom: 25,
  },

  title: {
    color: '#FFF',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  subtitle: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 10,
    marginBottom: 28,
  },

  label: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },

  input: {
    height: 50,
    backgroundColor: '#151515',
    borderWidth: 1,
    borderColor: '#292929',
    borderRadius: 10,
    color: '#FFF',
    paddingHorizontal: 15,
    fontSize: 15,
    marginBottom: 15,
  },

  registerButton: {
    height: 52,
    backgroundColor: '#7CFF00',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },

  disabledButton: {
    opacity: 0.5,
  },

  registerButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },

  backButton: {
    alignItems: 'center',
    marginTop: 22,
  },

  backText: {
    color: '#7CFF00',
    fontSize: 14,
  },
});

