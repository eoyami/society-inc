import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Society Inc - Tópicos',
  description: 'Lista de tópicos para discussão',
}

export default function TopicsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="z-10 max-w-5xl w-full">
        <h1 className="text-4xl font-bold mb-8">Tópicos</h1>
        <div className="grid grid-cols-1 gap-6">
          {/* Aqui virão os tópicos */}
          <div className="border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Título do Tópico</h2>
            <p className="text-gray-600 mb-4">Descrição do tópico...</p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Autor: Nome do Autor</span>
              <span>Última atualização: 01/01/2024</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 