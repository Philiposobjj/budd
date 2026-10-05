
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { supabase } from '../lib/supabase';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [recuperandoSenha, setRecuperandoSenha] =
    useState(false);

  async function entrar() {
    const emailLimpo = email.trim();

    if (!emailLimpo || !senha) {
      Alert.alert(
        'Atenção',
        'Preencha o e-mail e a senha.',
      );
      return;
    }

    if (loading) {
      return;
    }

    setLoading(true);

    console.log(
      'LOGIN: botão pressionado',
    );

    console.log(
      'LOGIN: e-mail:',
      emailLimpo,
    );

    try {
      const {
        data,
        error,
      } = await supabase.auth.signInWithPassword({
        email: emailLimpo,
        password: senha,
      });

      console.log(
        'LOGIN: resposta recebida',
      );

      console.log(
        'LOGIN: data:',
        data,
      );

      console.log(
        'LOGIN: error:',
        error,
      );

      if (error) {
        Alert.alert(
          'Erro no login',
          error.message,
        );

        return;
      }

      console.log(
        'LOGIN REALIZADO COM SUCESSO',
      );

      router.replace('/');
    } catch (error) {
      console.error(
        'LOGIN: erro inesperado:',
        error,
      );

      Alert.alert(
        'Erro',
        'Não foi possível realizar o login.',
      );
    } finally {
      setLoading(false);
    }
  }

  async function esqueciSenha() {
    const emailLimpo = email.trim();

    if (!emailLimpo) {
      Alert.alert(
        'Recuperar senha',
        'Digite seu e-mail primeiro.',
      );

      return;
    }

    if (recuperandoSenha) {
      return;
    }

    setRecuperandoSenha(true);

    try {
      const { error } =
        await supabase.auth.resetPasswordForEmail(
          emailLimpo
        );

      if (error) {
        console.error(
          'RECUPERAÇÃO DE SENHA:',
          error
        );

        Alert.alert(
          'Erro',
          error.message
        );

        return;
      }

      Alert.alert(
        'E-mail enviado',
        'Se esse e-mail estiver cadastrado, você receberá as instruções para criar uma nova senha.'
      );
    } catch (error) {
      console.error(
        'ERRO NA RECUPERAÇÃO:',
        error
      );

      Alert.alert(
        'Erro',
        'Não foi possível solicitar a recuperação da senha.'
      );
    } finally {
      setRecuperandoSenha(false);
    }
  }

  function criarConta() {
    router.push('/register');
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>
          BUDD
        </Text>

        <Text style={styles.title}>
          Bem-vindo ao Budd
        </Text>

        <Text style={styles.subtitle}>
          Entre para aproveitar tudo que o Budd oferece.
        </Text>

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
          editable={!loading}
        />

        <Text style={styles.label}>
          Senha
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Sua senha"
          placeholderTextColor="#666"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          autoCapitalize="none"
          editable={!loading}
        />

        <Pressable
          onPress={esqueciSenha}
          style={styles.forgotButton}
          disabled={recuperandoSenha}
        >
          {recuperandoSenha ? (
            <ActivityIndicator
              size="small"
              color="#7CFF00"
            />
          ) : (
            <Text style={styles.forgotText}>
              Esqueci minha senha
            </Text>
          )}
        </Pressable>

        <Pressable
          onPress={entrar}
          style={[
            styles.loginButton,
            loading &&
              styles.loginButtonDisabled,
          ]}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.loginButtonText}>
              Entrar
            </Text>
          )}
        </Pressable>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />

          <Text style={styles.dividerText}>
            ou
          </Text>

          <View style={styles.divider} />
        </View>

        <Pressable
          onPress={criarConta}
          style={styles.registerButton}
          disabled={loading}
        >
          <Text style={styles.registerButtonText}>
            Criar minha conta
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
    marginBottom: 30,
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
    marginBottom: 35,
  },

  label: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },

  input: {
    height: 52,
    backgroundColor: '#151515',
    borderWidth: 1,
    borderColor: '#292929',
    borderRadius: 10,
    color: '#FFF',
    paddingHorizontal: 15,
    fontSize: 15,
    marginBottom: 18,
  },

  forgotButton: {
    alignSelf: 'flex-end',
    minHeight: 20,
    justifyContent: 'center',
    marginBottom: 20,
  },

  forgotText: {
    color: '#7CFF00',
    fontSize: 13,
  },

  loginButton: {
    height: 52,
    backgroundColor: '#7CFF00',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loginButtonDisabled: {
    opacity: 0.7,
  },

  loginButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#292929',
  },

  dividerText: {
    color: '#666',
    marginHorizontal: 12,
  },

  registerButton: {
    height: 52,
    borderWidth: 1,
    borderColor: '#7CFF00',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  registerButtonText: {
    color: '#7CFF00',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

