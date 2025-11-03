-- Створюємо користувачів з паролями (ПАРОЛІ СЛІД ЗМІНИТИ НА БЕЗПЕЧНІ)

-- Користувач 1: Кадровик (наприклад, майор, що веде облік)
CREATE USER major_petrenko WITH LOGIN PASSWORD 'secure_password_for_personnel';
GRANT personnel_clerk TO major_petrenko;


-- Користувач 2: Логіст (наприклад, капітан, що відповідає за склад)
CREATE USER captain_ivanenko WITH LOGIN PASSWORD 'secure_password_for_logistics';
GRANT logistics_officer TO captain_ivanenko;


-- Користувач 3: Штаб (наприклад, полковник з аналітичного відділу)
CREATE USER colonel_kovalenko WITH LOGIN PASSWORD 'secure_password_for_staff';
GRANT command_staff TO colonel_kovalenko;