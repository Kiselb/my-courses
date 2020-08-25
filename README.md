# Проект my-courses 
## Аннотация
Данное приложение является учебным и разрабатывается в рамках курса Разработчик Node.js образовательной компании [OTUS](https://otus.ru/).

## Требования к проекту
### Функциональные требования
Образовательная платформа с возможностью смотреть и редактировать медиа контент.
Пользователи могут редактировать и смотреть созданные курсы.
Пользователи могут создавать собственные курсы.
Курсы содержат описание и наборы занятий.
Список и описание всех курсов (а также описание занятий) доступно всем пользователям.
Также есть возможность добавлять комментарии к занятию и видеть комментарии других пользователей.
Каждое занятие является веб страницей и содержит описание и видео, а также может хранить дополнительные ссылки, файлы и другие типы ресурсов.
Чтобы у пользователя появился доступ к занятиям несобственного курса, автор курса может добавить пользователя в список разрешеннных аккаунтов.

### Конфигурация и создание HTTPS ExpressJS проекта "my-courses"
Выбор шаблона, шаблонизатора (pug, nunjucks, react, vuexpress...) и рендер основных страниц приложения без функционала
(авторизация, список курсов, страница курса, страница занятия)
* Выбор шаблона, шаблонизатора (например,  https://templated.co/ )
* Конфигурация проекта.
* Оживление шаблонов сайта с данными из MongoDB.

### Авторизация пользователей
Добавление авторизации при доступе к API.
Добавление методов защиты от попыток авторизации.

## API
Актуальная структура API приложения размещена на ресурсе [swagger](https://app.swaggerhub.com/apis/Kiselb/my-courses/1.0.0#/).

## Структура данных
В качестве хранилища используется база данных MongoDB

### Сущности приложения
На данный момент определены следующие сущности приложения:
- **Курс**. Сущность **Курс** описывает курс - совокупность уроков и материалов к урокам. У каждого курса
есть владелец - пользователь приложения My-Courses;
- **Поток**. Сушность поток описывает курс, читаемый студентам в заданный период времени. **Поток** является копией
сущности **Курс**. В системе может существовать несколько потоков одного курса, которые читаются различным наборам
слушателей (студентов). При создании потока указывается курс, описание которого, копируется в соответствующие атрибуты
потока: уроки и связанные с ними (уроками) матералы. С потоком связаны студенты (пользователи), набранные на данный поток;
- **Урок**. Сущность **Урок** используется в описании сущностей **Курс** и **Поток**. В случае сущности **Курс**, урок
определяет базовый урок, который будет использован (копированием) при создани сущности **Поток**. Для сущности **Поток**
урок - это описание фактически проведённого или планируемого урока, с указание даты и времени начала и окончания,
списком материалов и комментариев студентов. Для сущности **Поток** может быть добавлен произвольный урок, непредусмотренный
курсом, на основании которого создан данный поток;
- **Материал**. Сущность **Материал** описывает материалы урока, предназначенные для ознакомления студентами. Материалом может
быть любой медиа-контент: url, audio-, video-записи, файлы pdf и т. п.; Материал может быть связан как уроками курса, так и
с уроками потока. При создании потока, материалы курса соответственно урокам, копируются в список материалов уроков потока.
Добавлять материалы к курсам может только владелец курса;
- **Комментарий**. Сущность **Комментарий** описывает комментарии студентов к проведённым урокам;
- **Пользователи**. Сущность **Пользователь** описывает пользователей приложения. Пользователи могут быть как студентами, так и
владельцами курсов. Только владелец курса может включить другого пользователя в список студентов того или иного потока своего курса.

#### Сущность (коллекция) Курс
    {
        _id
        "Name": string
        "Owner": ObjectId
        "State": enum: ["Pending", "Active", "Retired"]
        "Lessons": [
            {
                _id
                "Theme": string
                "Purpose": string
                "Duration": int
                "Materials": [
                    {
                        _id
                        "Title": string
                        "Type": enum: ["Link", "File", "Video"]
                        "Source": string
                    },
                ]
            },
        ]
    }

#### Сущность (коллекция) Поток
    {
        _id
        "Name": string
        "Owner": ObjectId
        "State": enum: ["Pending", "Active", "Closed"]
        "Start": Date
        "Finish": Date
        "Lessons": [
            {
                _id
                "Theme": string
                "Purpose": string
                "DueDate": Date
                "Materials": [
                    {
                        _id
                        "Title": string
                        "Type": enum: ["Link", "File", "Video"]
                        "Source": string
                    },
                ],
                "Comments": [
                    _id
                    "TimeStamp": Date
                    "UserID": ObjectId
                    "Text": string
                ]
            },
        ]
    }

#### Сущность (коллекция) Пользователь
    {
        _id
        "Name": string
        "email": string
        "Password": string
    }
