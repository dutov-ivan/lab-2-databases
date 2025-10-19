export const units: PhysicalUnit[] = [
  {
    name: "Міліметр",
    abbreviation: "мм",
  },
  {
    name: "Кілограм",
    abbreviation: "кг",
  },
  {
    name: "Метр",
    abbreviation: "м",
  },
  {
    name: "Кілометр",
    abbreviation: "км",
  },
  {
    name: "Пострілів за хвилину",
    abbreviation: "постр/хв",
  },
  {
    name: "Метрів за секунду",
    abbreviation: "м/с",
  },
  {
    name: "Осіб",
    abbreviation: "осіб",
  },
  {
    name: "Тонна",
    abbreviation: "т",
  },
  {
    name: "Кілометрів на годину",
    abbreviation: "км/год",
  },
  {
    name: "Кінська сила",
    abbreviation: "к.с.",
  },
  {
    name: "Літр",
    abbreviation: "л",
  },
  {
    name: "Година",
    abbreviation: "год",
  },
  {
    name: "Хвилина",
    abbreviation: "хв",
  },
  {
    name: "Кубічний метр",
    abbreviation: "м³",
  },
  {
    name: "Метрів за хвилину",
    abbreviation: "м/хв",
  },
  {
    name: "Градус",
    abbreviation: "град",
  },
  {
    name: "Градусів за секунду",
    abbreviation: "град/с",
  },
  {
    name: "Кілоньютон",
    abbreviation: "кН",
  },
  {
    name: "Мегават",
    abbreviation: "МВт",
  },
  {
    name: "Вольт",
    abbreviation: "В",
  },
  {
    name: "Кілогерц",
    abbreviation: "кГц",
  },
  {
    name: "Мегагерц",
    abbreviation: "МГц",
  },
  {
    name: "Гігагерц",
    abbreviation: "ГГц",
  },
  {
    name: "Децибел",
    abbreviation: "дБ",
  },
  {
    name: "Вузол",
    abbreviation: "вузлів",
  },
  {
    name: "Секунда",
    abbreviation: "с",
  },
  {
    name: "Грам",
    abbreviation: "г",
  },
  {
    name: "Джоуль",
    abbreviation: "Дж",
  },
  {
    name: "Доба",
    abbreviation: "діб",
  },
  {
    name: "Літрів за хвилину",
    abbreviation: "л/хв",
  },
  {
    name: "Кубічних метрів на годину",
    abbreviation: "м³/год",
  },
  {
    name: "Кіловат",
    abbreviation: "кВт",
  },
] as const;

export type PhysicalUnit = {
  name: string;
  abbreviation: string;
};
