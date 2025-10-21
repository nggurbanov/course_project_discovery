import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Layers, Star } from 'lucide-react';
import { Header } from '../components/Header';

export const GuidePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/" className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Вернуться на главную
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Руководство по использованию
            </h1>
            
            <p className="text-lg text-gray-600 mb-10">
              Узнайте, как эффективно использовать каталог проектов для поиска идеальной темы курсовой работы.
            </p>

            <div className="space-y-10">
              {/* Поиск */}
              <section>
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                    <Search className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                      1. Поиск проектов
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      Используйте строку поиска в верхней части страницы для быстрого поиска проектов 
                      по ключевым словам. Поиск работает по названию, описанию и технологиям.
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                      <li>Введите технологию (например, "React", "Python")</li>
                      <li>Введите область (например, "E-commerce", "Социальные сети")</li>
                      <li>Введите ключевое слово из описания</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Фильтры */}
              <section>
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                    <Filter className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                      2. Использование фильтров
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      Боковая панель содержит множество фильтров для точного подбора проекта:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                      <li><strong>Категория:</strong> выберите направление проекта (веб, мобильные приложения, анализ данных и т.д.)</li>
                      <li><strong>Уровень сложности:</strong> фильтруйте по начальному, среднему или продвинутому уровню</li>
                      <li><strong>Стек технологий:</strong> выберите знакомые вам технологии</li>
                      <li><strong>Область применения:</strong> найдите проект в интересующей вас сфере</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Детали проекта */}
              <section>
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                    <Layers className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                      3. Просмотр деталей проекта
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      Нажмите на любую карточку проекта, чтобы увидеть подробную информацию:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                      <li>Полное описание проекта и его целей</li>
                      <li>Ключевые функции, которые нужно реализовать</li>
                      <li>Рекомендуемый технологический стек</li>
                      <li>Уровень сложности и требуемые навыки</li>
                      <li>Возможные расширения и улучшения</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Советы */}
              <section>
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mr-4">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                      4. Советы по выбору проекта
                    </h2>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                      <li>Выбирайте проект, соответствующий вашему уровню подготовки</li>
                      <li>Учитывайте сроки выполнения курсовой работы</li>
                      <li>Выбирайте технологии, которые вы хотите изучить или улучшить</li>
                      <li>Обращайте внимание на практическую применимость проекта</li>
                      <li>Не бойтесь адаптировать проект под свои идеи</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Дополнительная информация */}
              <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mt-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                  Нужна помощь?
                </h2>
                <p className="text-gray-700">
                  Если у вас возникли вопросы или нужна консультация по выбору проекта, 
                  свяжитесь со мной через <Link to="/about" className="text-blue-600 hover:underline">страницу "О проекте"</Link>.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

