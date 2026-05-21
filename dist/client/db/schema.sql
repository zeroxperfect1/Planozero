-- ============================================================
-- PlanoZero MySQL Schema
-- Reemplaza Firebase Firestore
-- Ejecutar en cPanel → phpMyAdmin sobre la base planozer_db
-- ============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- Páginas CMS
CREATE TABLE IF NOT EXISTS `pages` (
  `id`                  VARCHAR(64)  NOT NULL PRIMARY KEY,
  `title`               VARCHAR(255) NOT NULL DEFAULT '',
  `slug`                VARCHAR(255) NOT NULL DEFAULT '',
  `published`           TINYINT(1)   NOT NULL DEFAULT 0,
  `show_in_navigation`  TINYINT(1)   NOT NULL DEFAULT 0,
  `order`               INT          NOT NULL DEFAULT 0,
  `root_json`           LONGTEXT     NOT NULL DEFAULT '{}',
  `created_at`          VARCHAR(64)  NOT NULL DEFAULT '',
  `updated_at`          VARCHAR(64)  NOT NULL DEFAULT '',
  UNIQUE KEY `idx_pages_slug` (`slug`),
  KEY `idx_pages_order` (`order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Posts del blog
CREATE TABLE IF NOT EXISTS `posts` (
  `id`           VARCHAR(64)   NOT NULL PRIMARY KEY,
  `title`        VARCHAR(255)  NOT NULL DEFAULT '',
  `slug`         VARCHAR(255)  NOT NULL DEFAULT '',
  `content`      LONGTEXT      NOT NULL,
  `excerpt`      TEXT          NOT NULL DEFAULT '',
  `category`     VARCHAR(100)  NOT NULL DEFAULT 'General',
  `image`        VARCHAR(1024) NOT NULL DEFAULT '',
  `keywords`     VARCHAR(500)  NOT NULL DEFAULT '',
  `published`    TINYINT(1)    NOT NULL DEFAULT 0,
  `author_id`    VARCHAR(128)  NOT NULL DEFAULT '',
  `author_email` VARCHAR(255)  NOT NULL DEFAULT '',
  `created_at`   VARCHAR(64)   NOT NULL DEFAULT '',
  `updated_at`   VARCHAR(64)   NOT NULL DEFAULT '',
  UNIQUE KEY `idx_posts_slug` (`slug`),
  KEY `idx_posts_published` (`published`),
  KEY `idx_posts_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Menús de navegación
CREATE TABLE IF NOT EXISTS `menus` (
  `id`         VARCHAR(64)  NOT NULL PRIMARY KEY,
  `name`       VARCHAR(255) NOT NULL DEFAULT '',
  `items_json` LONGTEXT     NOT NULL DEFAULT '[]',
  `created_at` VARCHAR(64)  NOT NULL DEFAULT '',
  `updated_at` VARCHAR(64)  NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Solicitudes de contacto
CREATE TABLE IF NOT EXISTS `contacts` (
  `id`         VARCHAR(64)   NOT NULL PRIMARY KEY,
  `name`       VARCHAR(100)  NOT NULL DEFAULT '',
  `company`    VARCHAR(100)  NOT NULL DEFAULT '',
  `position`   VARCHAR(100)  NOT NULL DEFAULT '',
  `email`      VARCHAR(255)  NOT NULL DEFAULT '',
  `phone`      VARCHAR(30)   NOT NULL DEFAULT '',
  `idea`       TEXT          NOT NULL,
  `status`     VARCHAR(50)   NOT NULL DEFAULT 'pending',
  `created_at` VARCHAR(64)   NOT NULL DEFAULT '',
  KEY `idx_contacts_status` (`status`),
  KEY `idx_contacts_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Biblioteca de medios/imágenes
CREATE TABLE IF NOT EXISTS `media` (
  `id`         VARCHAR(64)   NOT NULL PRIMARY KEY,
  `name`       VARCHAR(255)  NOT NULL DEFAULT '',
  `url`        VARCHAR(1024) NOT NULL DEFAULT '',
  `user_id`    VARCHAR(128)  NOT NULL DEFAULT '',
  `created_at` VARCHAR(64)   NOT NULL DEFAULT '',
  KEY `idx_media_user` (`user_id`),
  KEY `idx_media_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Logs del sistema
CREATE TABLE IF NOT EXISTS `logs` (
  `id`         INT           NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `message`    TEXT          NOT NULL,
  `level`      VARCHAR(20)   NOT NULL DEFAULT 'info',
  `uid`        VARCHAR(128)  NOT NULL DEFAULT '',
  `created_at` VARCHAR(64)   NOT NULL DEFAULT '',
  KEY `idx_logs_level` (`level`),
  KEY `idx_logs_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tipos de contenido dinámico
CREATE TABLE IF NOT EXISTS `content_types` (
  `id`          VARCHAR(64)  NOT NULL PRIMARY KEY,
  `name`        VARCHAR(255) NOT NULL DEFAULT '',
  `fields_json` LONGTEXT     NOT NULL DEFAULT '[]',
  `created_at`  VARCHAR(64)  NOT NULL DEFAULT '',
  `updated_at`  VARCHAR(64)  NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contenido dinámico
CREATE TABLE IF NOT EXISTS `dynamic_content` (
  `id`         VARCHAR(64)  NOT NULL PRIMARY KEY,
  `type_id`    VARCHAR(64)  NOT NULL DEFAULT '',
  `data_json`  LONGTEXT     NOT NULL DEFAULT '{}',
  `published`  TINYINT(1)   NOT NULL DEFAULT 0,
  `created_at` VARCHAR(64)  NOT NULL DEFAULT '',
  `updated_at` VARCHAR(64)  NOT NULL DEFAULT '',
  KEY `idx_dc_type` (`type_id`),
  KEY `idx_dc_published` (`published`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
