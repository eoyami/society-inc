"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapImage from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import { useEffect, useRef } from 'react';

// Criar uma única instância das extensões
const extensions = [
  StarterKit,
  TiptapImage.configure({
    HTMLAttributes: {
      class: 'max-w-full h-auto rounded-lg',
    },
  }),
  Underline,
  Strike,
];

interface TiptapEditorProps {
  content?: string;
  onChange?: (html: string) => void;
}

export default function TiptapEditor({ content = '', onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions,
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] text-gray-900',
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  // Referência para armazenar o histórico
  const historyRef = useRef<string[]>([]);
  const currentIndexRef = useRef<number>(-1);

  // Função para salvar o estado atual no histórico
  const saveToHistory = (html: string) => {
    // Se estamos no meio do histórico, remova os estados futuros
    if (currentIndexRef.current < historyRef.current.length - 1) {
      historyRef.current = historyRef.current.slice(0, currentIndexRef.current + 1);
    }
    
    // Adicione o novo estado
    historyRef.current.push(html);
    currentIndexRef.current = historyRef.current.length - 1;
  };

  // Função para desfazer
  const undo = () => {
    if (currentIndexRef.current > 0) {
      currentIndexRef.current--;
      const previousContent = historyRef.current[currentIndexRef.current];
      editor?.commands.setContent(previousContent);
    }
  };

  // Função para refazer
  const redo = () => {
    if (currentIndexRef.current < historyRef.current.length - 1) {
      currentIndexRef.current++;
      const nextContent = historyRef.current[currentIndexRef.current];
      editor?.commands.setContent(nextContent);
    }
  };

  useEffect(() => {
    if (editor) {
      // Salvar o conteúdo inicial no histórico
      saveToHistory(content);
    }
  }, [editor, content]);

  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  if (!editor) {
    return (
      <div className="animate-pulse bg-gray-200 rounded-lg h-[200px]"></div>
    );
  }

  return (
    <div className="border border-gray-300 rounded-lg shadow-sm overflow-hidden">
      <div className="border-b border-gray-300 bg-gray-200 px-3 py-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded ${
            editor.isActive('bold') ? 'bg-gray-300' : 'hover:bg-gray-300'
          }`}
          title="Negrito"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded ${
            editor.isActive('italic') ? 'bg-gray-300' : 'hover:bg-gray-300'
          }`}
          title="Itálico"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded ${
            editor.isActive('underline') ? 'bg-gray-300' : 'hover:bg-gray-300'
          }`}
          title="Sublinhado"
        >
          <u>U</u>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded ${
            editor.isActive('strike') ? 'bg-gray-300' : 'hover:bg-gray-300'
          }`}
          title="Riscado"
        >
          <s>S</s>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded ${
            editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : 'hover:bg-gray-300'
          }`}
          title="Título (H2)"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded ${
            editor.isActive('bulletList') ? 'bg-gray-300' : 'hover:bg-gray-300'
          }`}
          title="Lista com Marcadores"
        >
          • Lista
        </button>
        <button
          type="button"
          onClick={undo}
          disabled={currentIndexRef.current <= 0}
          className="p-2 rounded hover:bg-gray-300 disabled:opacity-50"
          title="Desfazer"
        >
          ↩️
        </button>
        <button
          type="button"
          onClick={redo}
          disabled={currentIndexRef.current >= historyRef.current.length - 1}
          className="p-2 rounded hover:bg-gray-300 disabled:opacity-50"
          title="Refazer"
        >
          ↪️
        </button>
      </div>
      <EditorContent 
        editor={editor} 
        className="prose max-w-none p-4 bg-white text-gray-900"
        onChange={() => {
          const html = editor.getHTML();
          saveToHistory(html);
        }}
      />
    </div>
  );
} 