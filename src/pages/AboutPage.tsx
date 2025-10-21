import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Header } from '../components/Header';
import { Button } from '../components/ui/button';

export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/" className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Вернуться на главную
        </Link>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              О проекте
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Добро пожаловать в каталог курсовых проектов! Этот сайт создан для помощи студентам 
                в поиске подходящих тем для курсовых работ и проектов.
              </p>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Здесь собраны проекты по различным направлениям, с детальными описаниями, 
                технологическими стеками и оценками сложности. Используйте фильтры для поиска 
                проекта, который соответствует вашим навыкам и интересам.
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mt-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Связаться со мной
                </h2>
                <p className="text-gray-700 mb-4">
                  Есть вопросы или предложения? Свяжитесь со мной в Telegram!
                </p>
                <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <a 
                    href="https://t.me/gurbanoffn" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center"
                  >
                    Написать в Telegram
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

