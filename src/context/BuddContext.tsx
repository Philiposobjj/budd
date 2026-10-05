
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import type { ReactNode } from 'react';

import { supabase } from '../lib/supabase';

type Post = {
  id: string;
  author: string;
  initial: string;
  text: string;
  time: string;
  imageUrl?: string | null;
};

export type CartItem = {
  id: string;
  placeId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
};

type BuddContextData = {
  posts: Post[];

  addPost: (
    text: string,
    imageUri?: string | null,
  ) => Promise<void>;

  cart: CartItem[];

  addToCart: (item: CartItem) => void;

  removeFromCart: (
    itemId: string,
    placeId?: string,
  ) => void;

  clearCart: () => void;
};

const BuddContext =
  createContext<BuddContextData | undefined>(
    undefined,
  );

function formatTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();

  const difference =
    now.getTime() - date.getTime();

  const minutes = Math.floor(
    difference / 60000,
  );

  if (minutes < 1) {
    return 'Agora';
  }

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} h`;
  }

  const days = Math.floor(hours / 24);

  return `${days} d`;
}

export function BuddProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [posts, setPosts] = useState<Post[]>([]);

  const [cart, setCart] = useState<CartItem[]>([]);

  async function loadPosts() {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', {
        ascending: false,
      });

    if (error) {
      console.error(
        'ERRO AO CARREGAR POSTS:',
        error,
      );

      return;
    }

    if (!data) {
      return;
    }

    const formattedPosts: Post[] = data.map(
      (post) => ({
        id: post.id,
        author: post.author_name,
        initial: post.author_initial,
        text: post.content,
        time: formatTime(post.created_at),
        imageUrl: post.image_url ?? null,
      }),
    );

    setPosts(formattedPosts);
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function addPost(
    text: string,
    imageUri?: string | null,
  ) {
    const textoLimpo = text.trim();

    if (
      textoLimpo.length === 0 &&
      !imageUri
    ) {
      throw new Error(
        'A publicação precisa ter texto ou uma foto.',
      );
    }

    let imageUrl: string | null = null;

    /*
     * Se o usuário escolheu uma foto,
     * fazemos o upload para o Supabase Storage.
     */
    if (imageUri) {
      try {
        const response = await fetch(imageUri);

        const blob = await response.blob();

        const extension =
          imageUri.split('.').pop()?.split('?')[0] ||
          'jpg';

        const fileName =
          `post-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2)}.${extension}`;

        const filePath = fileName;

        const { error: uploadError } =
          await supabase.storage
            .from('post-images')
            .upload(filePath, blob, {
              contentType:
                blob.type || 'image/jpeg',
              upsert: false,
            });

        if (uploadError) {
          console.error(
            'ERRO AO ENVIAR FOTO:',
            uploadError,
          );

          throw new Error(
            `Erro ao enviar a foto: ${uploadError.message}`,
          );
        }

        const {
          data: publicUrlData,
        } = supabase.storage
          .from('post-images')
          .getPublicUrl(filePath);

        imageUrl =
          publicUrlData.publicUrl;
      } catch (error) {
        console.error(
          'ERRO NO UPLOAD DA FOTO:',
          error,
        );

        if (error instanceof Error) {
          throw error;
        }

        throw new Error(
          'Não foi possível enviar a foto.',
        );
      }
    }

    /*
     * Cria a publicação no banco.
     */
    const { data, error } = await supabase
      .from('posts')
      .insert({
        author_name: 'Philip',
        author_initial: 'P',
        content: textoLimpo,
        image_url: imageUrl,
      })
      .select()
      .single();

    if (error) {
      console.error(
        'ERRO DO SUPABASE AO PUBLICAR:',
        error,
      );

      throw new Error(
        `${error.message} | Código: ${error.code}`,
      );
    }

    if (!data) {
      throw new Error(
        'O Supabase não retornou os dados da publicação.',
      );
    }

    const newPost: Post = {
      id: data.id,
      author: data.author_name,
      initial: data.author_initial,
      text: data.content,
      time: 'Agora',
      imageUrl: data.image_url ?? null,
    };

    setPosts((currentPosts) => [
      newPost,
      ...currentPosts,
    ]);
  }

  function addToCart(item: CartItem) {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (cartItem) =>
          cartItem.id === item.id &&
          cartItem.placeId === item.placeId,
      );

      if (existingItem) {
        return currentCart.map((cartItem) =>
          cartItem.id === item.id &&
          cartItem.placeId === item.placeId
            ? {
                ...cartItem,
                quantity:
                  cartItem.quantity + 1,
              }
            : cartItem,
        );
      }

      return [
        ...currentCart,
        {
          ...item,
          quantity: 1,
        },
      ];
    });
  }

  function removeFromCart(
    itemId: string,
    placeId?: string,
  ) {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (cartItem) =>
          cartItem.id === itemId &&
          (!placeId ||
            cartItem.placeId === placeId),
      );

      if (!existingItem) {
        return currentCart;
      }

      if (existingItem.quantity <= 1) {
        return currentCart.filter(
          (cartItem) =>
            !(
              cartItem.id === itemId &&
              (!placeId ||
                cartItem.placeId === placeId)
            ),
        );
      }

      return currentCart.map((cartItem) =>
        cartItem.id === itemId &&
        (!placeId ||
          cartItem.placeId === placeId)
          ? {
              ...cartItem,
              quantity:
                cartItem.quantity - 1,
            }
          : cartItem,
      );
    });
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <BuddContext.Provider
      value={{
        posts,
        addPost,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </BuddContext.Provider>
  );
}

export function useBudd() {
  const context = useContext(BuddContext);

  if (!context) {
    throw new Error(
      'useBudd precisa estar dentro do BuddProvider',
    );
  }

  return context;
}

