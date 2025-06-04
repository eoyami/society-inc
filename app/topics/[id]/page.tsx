import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Society Inc - Detalhes do Tópico',
  description: 'Detalhes do tópico e comentários',
}

export default function TopicDetailPage({ params }: { params: { id: string } }) {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="z-10 max-w-4xl w-full">
        <article className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Título do Tópico</h1>
          <div className="flex gap-4 text-sm text-gray-500 mb-8">
            <span>Por: Autor do Tópico</span>
            <span>Criado em: 01/01/2024</span>
          </div>
          <div className="prose lg:prose-xl mb-8">
            <p>Conteúdo completo do tópico...</p>
          </div>
        </article>

        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Comentários</h2>
          <div className="space-y-6">
            {/* Aqui virão os comentários */}
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Nome do Usuário</span>
                <span className="text-sm text-gray-500">01/01/2024</span>
              </div>
              <p className="text-gray-700">Conteúdo do comentário...</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
} 