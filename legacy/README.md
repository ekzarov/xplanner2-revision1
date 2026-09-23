# XPlanner+ (локальный запуск)

[XPlanner+](https://sourceforge.net/projects/xplanner-plus/) — open-source инструмент планирования для Agile/XP команд.
Это старое Java web-приложение (Struts + Hibernate 3.6 + Spring 3.0, Servlet 2.4).

Здесь развёрнута **последняя версия v1.1a4** (2011-12-03) в Docker.

## Что внутри

- `xplanner-plus.war` — дистрибутив v1.1a4 с SourceForge; внутри пропатчен
  `WEB-INF/classes/xplanner-custom.properties`: БД переключена со встроенной HSQLDB
  на MySQL (`jdbc:mysql://db/xplanner`, диалект XPlannerMySQLDialect).
- `docker-compose.yml` — два контейнера: MySQL 5.7 (`db`) + Tomcat 9 / Java 8 (`xplanner`).

## База данных

**MySQL 5.7** — родная БД XPlanner. Схема создаётся автоматически при первом старте
(liquibase + собственные патчи приложения). Данные — в Docker-томе `xplanner-mysql`.

Раньше использовалась встроенная HSQLDB, но она флаки: ролевой запрос (nested-set по
`role`/`lft`/`rgt`) падает с `SQLGrammarException` из-за конфликтов с зарезервированными
словами HSQLDB 2.x — ломался редактор персон. На MySQL проблема отсутствует.

Почему не Java/Tomcat поновее: Hibernate 3.6 / Spring 3.0 несовместимы с Java 9+,
а Tomcat 10+ перешёл на `jakarta.*` (приложение использует `javax.servlet`).
Поэтому зафиксированы Tomcat 9 + JRE 8. MySQL 5.7 соответствует бандленному
`mysql-connector-java-5.1.13`.

## Запуск

```bash
docker compose up -d
docker compose logs -f xplanner   # дождаться "Server startup"
```

Открыть: **http://localhost:8080/xplanner-plus**

Логин по умолчанию: **sysadmin / admin**

## Остановка

```bash
docker compose down            # остановить (данные в томе сохраняются)
docker compose down -v         # остановить и удалить БД
```
