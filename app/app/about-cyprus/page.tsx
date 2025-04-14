import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sun, Euro, Shield, Umbrella, ChevronRight } from "lucide-react"

export const metadata: Metadata = {
  title: "О Кипре | Cyprus Elite Estates",
  description:
    "Узнайте о преимуществах инвестиций в недвижимость на Кипре: программа Golden Visa, налоговые льготы, климат и география.",
}

export default function AboutCyprusPage() {
  return (
    <div className="py-8 md:py-12">
      <div className="container">
        <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-6">О Кипре</h1>

        {/* Вводная секция */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-lg mb-4">
                Кипр — третий по величине остров в Средиземном море, расположенный на перекрестке трех континентов:
                Европы, Азии и Африки. Это не только популярное туристическое направление, но и привлекательное место
                для инвестиций в недвижимость.
              </p>
              <p className="text-lg mb-4">
                Благодаря стабильной экономике, выгодной налоговой системе, высокому уровню жизни и прекрасному климату,
                Кипр стал одним из самых привлекательных мест для покупки недвижимости в Европе.
              </p>
              <p className="text-lg">
                Остров предлагает разнообразные возможности для инвесторов: от роскошных вилл с видом на море до
                современных апартаментов в оживленных городских центрах.
              </p>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden">
              <Image src="/placeholder.svg?height=800&width=600" alt="Побережье Кипра" fill className="object-cover" />
            </div>
          </div>
        </section>

        {/* Программа Golden Visa */}
        <section id="golden-visa" className="mb-16 scroll-mt-20">
          <div className="bg-white p-8 rounded-xl border shadow-sm">
            <div className="flex items-center mb-6">
              <div className="rounded-full bg-estate-light-gold/20 p-3 mr-4">
                <Image
                  src="/placeholder.svg?height=50&width=50"
                  alt="Паспорт"
                  width={30}
                  height={30}
                  className="object-contain"
                />
              </div>
              <h2 className="font-playfair text-2xl md:text-3xl font-bold">Программа Golden Visa</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <p className="mb-4">
                  Программа Golden Visa на Кипре — это возможность получить вид на жительство через инвестиции в
                  недвижимость. Это один из самых быстрых и надежных способов получить статус резидента Европейского
                  Союза.
                </p>
                <h3 className="font-playfair text-xl font-bold mb-2">Основные требования:</h3>
                <ul className="list-disc pl-5 mb-4 space-y-1">
                  <li>Покупка недвижимости стоимостью от €300,000</li>
                  <li>Чистая криминальная история</li>
                  <li>Подтверждение источника доходов</li>
                  <li>Медицинская страховка</li>
                </ul>
                <h3 className="font-playfair text-xl font-bold mb-2">Преимущества:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Вид на жительство для всей семьи (включая супруга/супругу и детей до 25 лет)</li>
                  <li>Безвизовый въезд в более чем 170 стран мира</li>
                  <li>Возможность жить, работать и учиться в любой стране ЕС</li>
                  <li>Путь к получению гражданства через 7 лет постоянного проживания</li>
                  <li>Нет требования постоянного проживания на Кипре (достаточно посещать остров раз в два года)</li>
                </ul>
              </div>
              <div className="bg-[#0077B6]/5 p-6 rounded-lg">
                <h3 className="font-playfair text-xl font-bold mb-4 text-center">Процесс получения ВНЖ</h3>
                <div className="space-y-6">
                  <div className="flex">
                    <div className="rounded-full bg-estate-gold text-white w-8 h-8 flex items-center justify-center font-bold shrink-0 mt-1 mr-4">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Выбор и покупка недвижимости</h4>
                      <p className="text-sm text-muted-foreground">
                        Приобретение недвижимости стоимостью от €300,000 (может быть одна или несколько единиц)
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="rounded-full bg-estate-gold text-white w-8 h-8 flex items-center justify-center font-bold shrink-0 mt-1 mr-4">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Подготовка документов</h4>
                      <p className="text-sm text-muted-foreground">
                        Сбор необходимых документов, включая подтверждение дохода, медицинскую страховку и справку о
                        несудимости
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="rounded-full bg-estate-gold text-white w-8 h-8 flex items-center justify-center font-bold shrink-0 mt-1 mr-4">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Подача заявления</h4>
                      <p className="text-sm text-muted-foreground">
                        Подача заявления в Департамент миграции Кипра через уполномоченного представителя
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="rounded-full bg-estate-gold text-white w-8 h-8 flex items-center justify-center font-bold shrink-0 mt-1 mr-4">
                      4
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Биометрия и интервью</h4>
                      <p className="text-sm text-muted-foreground">
                        Посещение Кипра для сдачи биометрических данных и прохождения короткого интервью
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="rounded-full bg-estate-gold text-white w-8 h-8 flex items-center justify-center font-bold shrink-0 mt-1 mr-4">
                      5
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Получение ВНЖ</h4>
                      <p className="text-sm text-muted-foreground">
                        Получение карты вида на жительство (обычно в течение 2-3 месяцев после подачи заявления)
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 text-center">
                  <Link href="/contacts">
                    <Button className="bg-estate-gold hover:bg-estate-gold/90 text-black">
                      Получить консультацию
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Налоговые льготы */}
        <section className="mb-16">
          <div className="bg-white p-8 rounded-xl border shadow-sm">
            <div className="flex items-center mb-6">
              <div className="rounded-full bg-[#0077B6]/20 p-3 mr-4">
                <Euro className="h-6 w-6 text-[#0077B6]" />
              </div>
              <h2 className="font-playfair text-2xl md:text-3xl font-bold">Налоговые льготы</h2>
            </div>

            <p className="mb-6">
              Кипр предлагает одну из самых привлекательных налоговых систем в Европе, что делает его идеальным местом
              для инвестиций в недвижимость и ведения бизнеса.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-[#0077B6]/5 p-6 rounded-lg">
                <h3 className="font-playfair text-xl font-bold mb-3">Налог на недвижимость</h3>
                <p className="text-muted-foreground">
                  0% налог на недвижимость с 2017 года. Ранее существовавший налог на недвижимость был полностью
                  отменен.
                </p>
              </div>
              <div className="bg-[#0077B6]/5 p-6 rounded-lg">
                <h3 className="font-playfair text-xl font-bold mb-3">Корпоративный налог</h3>
                <p className="text-muted-foreground">
                  12.5% - одна из самых низких ставок корпоративного налога в Европейском Союзе.
                </p>
              </div>
              <div className="bg-[#0077B6]/5 p-6 rounded-lg">
                <h3 className="font-playfair text-xl font-bold mb-3">НДС на недвижимость</h3>
                <p className="text-muted-foreground">
                  5% НДС на первую покупку недвижимости для использования в качестве основного места жительства (при
                  соблюдении определенных условий).
                </p>
              </div>
              <div className="bg-[#0077B6]/5 p-6 rounded-lg">
                <h3 className="font-playfair text-xl font-bold mb-3">Налог на прирост капитала</h3>
                <p className="text-muted-foreground">
                  20% налог на прирост капитала при продаже недвижимости, но с многочисленными исключениями и льготами.
                </p>
              </div>
              <div className="bg-[#0077B6]/5 p-6 rounded-lg">
                <h3 className="font-playfair text-xl font-bold mb-3">Налог на доходы физических лиц</h3>
                <p className="text-muted-foreground">
                  Прогрессивная шкала от 0% до 35%, с первыми €19,500 дохода, не облагаемыми налогом.
                </p>
              </div>
              <div className="bg-[#0077B6]/5 p-6 rounded-lg">
                <h3 className="font-playfair text-xl font-bold mb-3">Налог на дивиденды</h3>
                <p className="text-muted-foreground">0% налог на дивиденды для нерезидентов и компаний-нерезидентов.</p>
              </div>
            </div>

            <div className="bg-[#FFA500]/10 p-6 rounded-lg">
              <h3 className="font-playfair text-xl font-bold mb-3 text-center">Статус налогового резидента</h3>
              <p className="mb-4">
                Физическое лицо считается налоговым резидентом Кипра, если оно находится на территории страны более 183
                дней в течение налогового года. С 2017 года также введено правило "60 дней", которое позволяет получить
                статус налогового резидента при соблюдении определенных условий.
              </p>
              <p>
                Налоговые резиденты Кипра получают дополнительные преимущества, включая освобождение от налога на
                доходы, полученные за пределами Кипра, при соблюдении определенных условий.
              </p>
            </div>
          </div>
        </section>

        {/* Климат и география */}
        <section className="mb-16">
          <div className="bg-white p-8 rounded-xl border shadow-sm">
            <div className="flex items-center mb-6">
              <div className="rounded-full bg-[#0077B6]/20 p-3 mr-4">
                <Sun className="h-6 w-6 text-[#0077B6]" />
              </div>
              <h2 className="font-playfair text-2xl md:text-3xl font-bold">Климат и география</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-8">
              <div>
                <p className="mb-4">
                  Кипр славится своим средиземноморским климатом с жарким сухим летом и мягкой дождливой зимой. Остров
                  наслаждается одним из самых благоприятных климатов в Европе с более чем 340 солнечными днями в году.
                </p>
                <h3 className="font-playfair text-xl font-bold mb-2">Климатические особенности:</h3>
                <ul className="list-disc pl-5 mb-4 space-y-1">
                  <li>Лето (июнь-сентябрь): температура 25-35°C, практически без осадков</li>
                  <li>Зима (декабрь-февраль): температура 10-20°C, умеренные осадки</li>
                  <li>Весна и осень: мягкие температуры 15-25°C, идеальное время для активного отдыха</li>
                  <li>Температура воды в море: от 16°C зимой до 27°C летом</li>
                </ul>
                <p>
                  Благодаря своему расположению, на Кипре можно купаться в море с апреля по ноябрь, а в зимние месяцы
                  кататься на лыжах в горах Троодос, что делает остров уникальным местом для круглогодичного проживания
                  и отдыха.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative h-[200px] rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=400&width=300"
                    alt="Пляж на Кипре"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-[200px] rounded-lg overflow-hidden">
                  <Image src="/placeholder.svg?height=400&width=300" alt="Горы Троодос" fill className="object-cover" />
                </div>
                <div className="relative h-[200px] rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=400&width=300"
                    alt="Закат на Кипре"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-[200px] rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=400&width=300"
                    alt="Природа Кипра"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#0077B6]/5 p-6 rounded-lg">
              <h3 className="font-playfair text-xl font-bold mb-4 text-center">Основные регионы Кипра</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-bold mb-2">Лимассол</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Второй по величине город Кипра, известный своей космополитичной атмосферой, развитой инфраструктурой
                    и престижными районами с элитной недвижимостью.
                  </p>
                  <Link href="/properties?region=limassol" className="text-sm text-[#0077B6] hover:underline">
                    Смотреть недвижимость в Лимассоле →
                  </Link>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Пафос</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Исторический город на западном побережье, популярный среди иностранных покупателей недвижимости
                    благодаря своему спокойному образу жизни и живописным видам.
                  </p>
                  <Link href="/properties?region=paphos" className="text-sm text-[#0077B6] hover:underline">
                    Смотреть недвижимость в Пафосе →
                  </Link>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Протарас</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Курортный город на восточном побережье, известный своими кристально чистыми пляжами и развивающимся
                    рынком недвижимости.
                  </p>
                  <Link href="/properties?region=protaras" className="text-sm text-[#0077B6] hover:underline">
                    Смотреть недвижимость в Протарасе →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Качество жизни */}
        <section>
          <div className="bg-white p-8 rounded-xl border shadow-sm">
            <div className="flex items-center mb-6">
              <div className="rounded-full bg-[#0077B6]/20 p-3 mr-4">
                <Umbrella className="h-6 w-6 text-[#0077B6]" />
              </div>
              <h2 className="font-playfair text-2xl md:text-3xl font-bold">Качество жизни</h2>
            </div>

            <p className="mb-6">
              Кипр предлагает высокое качество жизни, сочетая европейские стандарты с расслабленным средиземноморским
              образом жизни. Это безопасное и дружелюбное место для проживания и воспитания детей.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="flex flex-col items-center text-center p-6 rounded-lg border">
                <Shield className="h-12 w-12 text-[#0077B6] mb-4" />
                <h3 className="font-playfair text-lg font-bold mb-2">Безопасность</h3>
                <p className="text-sm text-muted-foreground">
                  Один из самых низких уровней преступности в Европе. Кипр регулярно входит в топ-5 самых безопасных
                  стран мира.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg border">
                <Image
                  src="/placeholder.svg?height=50&width=50"
                  alt="Образование"
                  width={48}
                  height={48}
                  className="mb-4"
                />
                <h3 className="font-playfair text-lg font-bold mb-2">Образование</h3>
                <p className="text-sm text-muted-foreground">
                  Множество международных школ и университетов с обучением на английском языке. Высокий уровень
                  образования по европейским стандартам.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg border">
                <Image
                  src="/placeholder.svg?height=50&width=50"
                  alt="Здравоохранение"
                  width={48}
                  height={48}
                  className="mb-4"
                />
                <h3 className="font-playfair text-lg font-bold mb-2">Здравоохранение</h3>
                <p className="text-sm text-muted-foreground">
                  Современная система здравоохранения с государственными и частными медицинскими учреждениями. С 2019
                  года действует национальная система медицинского страхования.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg border">
                <Image
                  src="/placeholder.svg?height=50&width=50"
                  alt="Инфраструктура"
                  width={48}
                  height={48}
                  className="mb-4"
                />
                <h3 className="font-playfair text-lg font-bold mb-2">Инфраструктура</h3>
                <p className="text-sm text-muted-foreground">
                  Развитая инфраструктура, включая современные дороги, два международных аэропорта, марины для яхт и
                  гольф-поля мирового класса.
                </p>
              </div>
            </div>

            <div className="text-center">
              <Link href="/properties">
                <Button size="lg" className="bg-estate-gold hover:bg-estate-gold/90 text-black">
                  Смотреть объекты недвижимости
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
